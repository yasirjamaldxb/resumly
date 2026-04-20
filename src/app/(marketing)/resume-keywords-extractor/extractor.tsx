'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

// Curated skill/tool vocabulary we look for in the JD. Kept broad so it works
// across industries. Weighted: hard skills > tools > soft skills.
const HARD_SKILLS = [
  // Programming
  'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'Scala', 'R', 'MATLAB', 'SQL', 'NoSQL',
  // Web
  'React', 'Next.js', 'Vue', 'Angular', 'Svelte', 'Node.js', 'Express', 'Django', 'Flask', 'Rails', 'Spring', 'Laravel', '.NET', 'HTML', 'CSS', 'Tailwind', 'Sass',
  // Data / AI
  'TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 'Scikit-learn', 'Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision', 'Data Analysis', 'Data Visualization', 'Statistics', 'Hadoop', 'Spark', 'Kafka',
  // Cloud / DevOps
  'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins', 'GitLab', 'GitHub Actions', 'CI/CD', 'Linux', 'Bash', 'Ansible', 'CircleCI',
  // Databases
  'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'DynamoDB', 'Snowflake', 'BigQuery', 'Oracle',
  // Design
  'Figma', 'Sketch', 'Adobe XD', 'Photoshop', 'Illustrator', 'InDesign', 'After Effects', 'Premiere', 'Canva',
  // Business / Marketing
  'Salesforce', 'HubSpot', 'Google Analytics', 'Google Ads', 'Facebook Ads', 'SEO', 'SEM', 'Content Marketing', 'Email Marketing', 'Social Media', 'A/B Testing', 'Copywriting',
  // Finance / Accounting
  'Excel', 'QuickBooks', 'SAP', 'Oracle Financials', 'NetSuite', 'GAAP', 'IFRS', 'Financial Modeling', 'Budgeting', 'Forecasting', 'Variance Analysis',
  // PM / Ops
  'Agile', 'Scrum', 'Kanban', 'Jira', 'Asana', 'Trello', 'Monday.com', 'PMP', 'Six Sigma', 'Lean', 'Waterfall',
  // Healthcare
  'EHR', 'EMR', 'HIPAA', 'CPR', 'BLS', 'ACLS', 'Vital Signs', 'Patient Care', 'Medical Records', 'Medication Administration',
  // Trades
  'OSHA', 'Forklift', 'CDL', 'Welding', 'Blueprint Reading', 'NEC Code',
  // Sales
  'Cold Calling', 'Prospecting', 'Lead Generation', 'CRM', 'Negotiation', 'Account Management',
  // HR
  'Workday', 'ADP', 'BambooHR', 'Recruiting', 'Onboarding', 'Benefits Administration',
];

const SOFT_SKILLS = [
  'Communication', 'Leadership', 'Teamwork', 'Problem Solving', 'Critical Thinking', 'Time Management',
  'Adaptability', 'Creativity', 'Collaboration', 'Attention to Detail', 'Organization', 'Customer Service',
  'Public Speaking', 'Conflict Resolution', 'Decision Making', 'Emotional Intelligence', 'Initiative',
  'Multitasking', 'Negotiation', 'Presentation', 'Mentoring', 'Active Listening', 'Strategic Thinking',
];

const STOPWORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'of', 'to', 'in', 'on', 'at', 'for', 'with', 'by', 'from',
  'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
  'will', 'would', 'should', 'could', 'may', 'might', 'can', 'this', 'that', 'these', 'those',
  'we', 'our', 'you', 'your', 'they', 'their', 'them', 'it', 'its', 'as', 'if', 'than', 'then',
  'so', 'not', 'no', 'yes', 'also', 'just', 'more', 'most', 'such', 'any', 'all', 'some', 'each',
  'role', 'team', 'work', 'job', 'company', 'position', 'candidate', 'experience', 'years',
  'required', 'preferred', 'must', 'ability', 'strong', 'excellent', 'good', 'great',
]);

type Match = { term: string; count: number; category: 'hard' | 'soft' | 'other' };

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function extractKeywords(text: string): Match[] {
  if (!text.trim()) return [];
  const lower = text.toLowerCase();

  const matches: Match[] = [];

  const seen = new Set<string>();
  for (const term of HARD_SKILLS) {
    const pattern = new RegExp(`\\b${escapeRegex(term.toLowerCase())}\\b`, 'g');
    const found = lower.match(pattern);
    if (found) {
      matches.push({ term, count: found.length, category: 'hard' });
      seen.add(term.toLowerCase());
    }
  }
  for (const term of SOFT_SKILLS) {
    const pattern = new RegExp(`\\b${escapeRegex(term.toLowerCase())}\\b`, 'g');
    const found = lower.match(pattern);
    if (found) {
      matches.push({ term, count: found.length, category: 'soft' });
      seen.add(term.toLowerCase());
    }
  }

  // Frequency-based capitalized phrases / unknown nouns (captures "Kubernetes",
  // "HubSpot", role-specific jargon we didn't hardcode).
  const words = text.match(/\b[A-Z][a-zA-Z0-9+.#-]{2,}\b/g) || [];
  const counts = new Map<string, number>();
  for (const w of words) {
    if (STOPWORDS.has(w.toLowerCase())) continue;
    if (seen.has(w.toLowerCase())) continue;
    counts.set(w, (counts.get(w) || 0) + 1);
  }
  for (const [term, count] of counts.entries()) {
    if (count >= 2) {
      matches.push({ term, count, category: 'other' });
    }
  }

  return matches.sort((a, b) => b.count - a.count);
}

export default function KeywordExtractor() {
  const [text, setText] = useState('');
  const [results, setResults] = useState<Match[] | null>(null);

  const handleExtract = () => {
    setResults(extractKeywords(text));
  };

  const hard = results?.filter((m) => m.category === 'hard') || [];
  const soft = results?.filter((m) => m.category === 'soft') || [];
  const other = results?.filter((m) => m.category === 'other').slice(0, 15) || [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-2">
          Paste the job description
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste the full job description here…"
          className="w-full h-80 p-4 border border-gray-300 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
        <Button
          onClick={handleExtract}
          disabled={!text.trim()}
          size="lg"
          className="w-full mt-3"
        >
          Extract Keywords →
        </Button>
      </div>
      <div>
        {results === null ? (
          <div className="h-full min-h-80 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center">
            <div className="text-5xl mb-3">🎯</div>
            <p className="text-gray-500 text-sm max-w-xs">
              Your top ATS keywords will appear here. We&apos;ll rank them by how often the employer repeats them.
            </p>
          </div>
        ) : results.length === 0 ? (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-sm text-amber-800">
            We didn&apos;t find strong keyword signals. Try pasting the full job description, including requirements and responsibilities.
          </div>
        ) : (
          <div className="space-y-5">
            {hard.length > 0 && (
              <div>
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-600 rounded-full" /> Hard skills &amp; tools
                </h3>
                <div className="flex flex-wrap gap-2">
                  {hard.map((m) => (
                    <span key={m.term} className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-800 border border-blue-200 rounded-lg px-2.5 py-1 font-medium">
                      {m.term}
                      <span className="text-blue-500 text-[10px]">×{m.count}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
            {soft.length > 0 && (
              <div>
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-600 rounded-full" /> Soft skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {soft.map((m) => (
                    <span key={m.term} className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-800 border border-green-200 rounded-lg px-2.5 py-1 font-medium">
                      {m.term}
                      <span className="text-green-600 text-[10px]">×{m.count}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
            {other.length > 0 && (
              <div>
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-gray-500 rounded-full" /> Other repeated terms
                </h3>
                <div className="flex flex-wrap gap-2">
                  {other.map((m) => (
                    <span key={m.term} className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-700 border border-gray-200 rounded-lg px-2.5 py-1 font-medium">
                      {m.term}
                      <span className="text-gray-500 text-[10px]">×{m.count}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-900">
              <p className="font-semibold mb-1">💡 Next step</p>
              <p>Include the top 10-15 terms naturally throughout your resume — summary, experience bullets, and skills section. Don&apos;t keyword-stuff.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
