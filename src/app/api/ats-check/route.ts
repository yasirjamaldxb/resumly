import { NextRequest, NextResponse } from 'next/server';

// Dynamic import for pdf-parse to avoid build issues
async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const pdfParse = require('pdf-parse');
  const data = await pdfParse(buffer);
  return data.text;
}

// --- Scoring Engine ---

interface CheckResult {
  name: string;
  category: string;
  passed: boolean;
  score: number;
  maxScore: number;
  message: string;
  fix?: string;
}

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
const PHONE_REGEX = /(\+?\d{1,3}[-.\s]?)?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}/;
const LINKEDIN_REGEX = /linkedin\.com\/in\/[a-zA-Z0-9_-]+/i;
const URL_REGEX = /https?:\/\/[^\s]+/;
const DATE_REGEX = /(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*[\s.,]*\d{4}|(?:19|20)\d{2}\s*[-–—to]+\s*(?:(?:19|20)\d{2}|present|current|now|ongoing)/gi;

const ACTION_VERBS = [
  'achieved', 'administered', 'analyzed', 'built', 'collaborated', 'conducted',
  'created', 'delivered', 'designed', 'developed', 'directed', 'enhanced',
  'established', 'executed', 'generated', 'grew', 'implemented', 'improved',
  'increased', 'initiated', 'launched', 'led', 'managed', 'mentored',
  'negotiated', 'optimized', 'organized', 'oversaw', 'planned', 'produced',
  'reduced', 'resolved', 'restructured', 'revised', 'spearheaded', 'streamlined',
  'supervised', 'trained', 'transformed', 'coordinated', 'facilitated',
  'pioneered', 'revamped', 'secured', 'strengthened', 'accelerated',
];

const STANDARD_SECTIONS = [
  { names: ['summary', 'professional summary', 'objective', 'profile', 'about', 'career objective', 'career summary'], label: 'Summary/Objective' },
  { names: ['experience', 'work experience', 'employment', 'professional experience', 'work history', 'employment history'], label: 'Work Experience' },
  { names: ['education', 'academic', 'academic background', 'qualifications'], label: 'Education' },
  { names: ['skills', 'technical skills', 'core competencies', 'competencies', 'key skills', 'areas of expertise', 'proficiencies'], label: 'Skills' },
];

const MEASURABLE_REGEX = /\d+%|\$[\d,]+|\d+\+?\s*(?:years?|months?|projects?|clients?|team|members?|people|employees?|users?|customers?|million|billion|k\b)/gi;

function analyzeResume(text: string): { checks: CheckResult[]; totalScore: number; maxScore: number; sections: string[] } {
  const checks: CheckResult[] = [];
  const textLower = text.toLowerCase();
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  // --- 1. CONTACT INFORMATION (20 points) ---

  const hasEmail = EMAIL_REGEX.test(text);
  checks.push({
    name: 'Email Address',
    category: 'Contact Information',
    passed: hasEmail,
    score: hasEmail ? 5 : 0,
    maxScore: 5,
    message: hasEmail ? 'Email address found' : 'No email address detected',
    fix: hasEmail ? undefined : 'Add your professional email address at the top of your resume. Use a professional email (firstname.lastname@gmail.com), not a casual one.',
  });

  const hasPhone = PHONE_REGEX.test(text);
  checks.push({
    name: 'Phone Number',
    category: 'Contact Information',
    passed: hasPhone,
    score: hasPhone ? 5 : 0,
    maxScore: 5,
    message: hasPhone ? 'Phone number found' : 'No phone number detected',
    fix: hasPhone ? undefined : 'Add your phone number in the contact section. Use a consistent format like +1 (555) 123-4567.',
  });

  const hasLinkedIn = LINKEDIN_REGEX.test(text);
  checks.push({
    name: 'LinkedIn Profile',
    category: 'Contact Information',
    passed: hasLinkedIn,
    score: hasLinkedIn ? 5 : 0,
    maxScore: 5,
    message: hasLinkedIn ? 'LinkedIn profile URL found' : 'No LinkedIn profile detected',
    fix: hasLinkedIn ? undefined : 'Add your LinkedIn profile URL. Most recruiters check LinkedIn — include linkedin.com/in/yourname.',
  });

  // Check for location/city
  const locationPatterns = /(?:city|location|address|based in)|(?:[A-Z][a-z]+,\s*[A-Z]{2}\b)|(?:[A-Z][a-z]+,\s*[A-Z][a-z]+)/;
  const hasLocation = locationPatterns.test(text);
  checks.push({
    name: 'Location',
    category: 'Contact Information',
    passed: hasLocation,
    score: hasLocation ? 5 : 0,
    maxScore: 5,
    message: hasLocation ? 'Location information found' : 'No location/city detected',
    fix: hasLocation ? undefined : 'Add your city and state/country (e.g., "New York, NY" or "London, UK"). Many ATS systems filter by location.',
  });

  // --- 2. SECTIONS (25 points) ---

  const foundSections: string[] = [];
  for (const section of STANDARD_SECTIONS) {
    const found = section.names.some(name => {
      const regex = new RegExp(`(?:^|\\n)\\s*${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*(?:\\n|:|$)`, 'im');
      return regex.test(text);
    });
    if (found) foundSections.push(section.label);

    const sectionScore = section.label === 'Work Experience' ? 8 :
      section.label === 'Education' ? 7 :
        section.label === 'Skills' ? 5 :
          5;

    checks.push({
      name: `${section.label} Section`,
      category: 'Resume Sections',
      passed: found,
      score: found ? sectionScore : 0,
      maxScore: sectionScore,
      message: found ? `${section.label} section found` : `No ${section.label} section detected`,
      fix: found ? undefined : `Add a clearly labeled "${section.label}" section. Use standard heading names — ATS software looks for these exact keywords.`,
    });
  }

  // --- 3. CONTENT QUALITY (30 points) ---

  // Word count check
  const wordCount = text.split(/\s+/).filter(w => w.length > 1).length;
  const goodLength = wordCount >= 200 && wordCount <= 1200;
  checks.push({
    name: 'Resume Length',
    category: 'Content Quality',
    passed: goodLength,
    score: goodLength ? 5 : (wordCount >= 100 ? 2 : 0),
    maxScore: 5,
    message: wordCount < 200
      ? `Too short (${wordCount} words). Aim for 300-800 words.`
      : wordCount > 1200
        ? `Very long (${wordCount} words). Consider trimming to 1-2 pages.`
        : `Good length (${wordCount} words)`,
    fix: wordCount < 200
      ? 'Your resume is too short. Add more detail to your work experience with bullet points describing your achievements and responsibilities.'
      : wordCount > 1200
        ? 'Your resume is too long. Focus on the most relevant experience and keep it to 1-2 pages. Remove outdated or less relevant positions.'
        : undefined,
  });

  // Action verbs
  const foundVerbs = ACTION_VERBS.filter(verb => {
    const regex = new RegExp(`\\b${verb}\\b`, 'i');
    return regex.test(text);
  });
  const goodVerbs = foundVerbs.length >= 5;
  checks.push({
    name: 'Action Verbs',
    category: 'Content Quality',
    passed: goodVerbs,
    score: goodVerbs ? 5 : (foundVerbs.length >= 2 ? 2 : 0),
    maxScore: 5,
    message: goodVerbs
      ? `Strong action verbs used (${foundVerbs.length} found: ${foundVerbs.slice(0, 5).join(', ')})`
      : `Weak action verb usage (only ${foundVerbs.length} found)`,
    fix: goodVerbs ? undefined : `Start bullet points with strong action verbs like: ${ACTION_VERBS.slice(0, 8).join(', ')}. These help ATS parse your achievements and make your resume more compelling.`,
  });

  // Measurable achievements
  const measurables = text.match(MEASURABLE_REGEX) || [];
  const goodMeasurables = measurables.length >= 3;
  checks.push({
    name: 'Measurable Achievements',
    category: 'Content Quality',
    passed: goodMeasurables,
    score: goodMeasurables ? 5 : (measurables.length >= 1 ? 2 : 0),
    maxScore: 5,
    message: goodMeasurables
      ? `${measurables.length} measurable achievements found`
      : `Only ${measurables.length} measurable achievement(s) found`,
    fix: goodMeasurables ? undefined : 'Add numbers and metrics to your achievements. Instead of "Improved sales", write "Increased sales by 35% in Q3 2024". Quantified results are 40% more likely to get callbacks.',
  });

  // Bullet points usage
  const bulletLines = lines.filter(l => /^[•\-–—*▪►➤✓☐]/.test(l) || /^\d+[.)]\s/.test(l));
  const goodBullets = bulletLines.length >= 5;
  checks.push({
    name: 'Bullet Points',
    category: 'Content Quality',
    passed: goodBullets,
    score: goodBullets ? 5 : (bulletLines.length >= 2 ? 2 : 0),
    maxScore: 5,
    message: goodBullets
      ? `Good use of bullet points (${bulletLines.length} found)`
      : `Not enough bullet points (${bulletLines.length} found)`,
    fix: goodBullets ? undefined : 'Use bullet points to list your achievements and responsibilities under each role. 3-5 bullets per position is ideal. ATS systems parse bullet points more reliably than paragraphs.',
  });

  // Dates/timeline
  const dateMatches = text.match(DATE_REGEX) || [];
  const hasDates = dateMatches.length >= 2;
  checks.push({
    name: 'Employment Dates',
    category: 'Content Quality',
    passed: hasDates,
    score: hasDates ? 5 : (dateMatches.length >= 1 ? 2 : 0),
    maxScore: 5,
    message: hasDates
      ? `Date ranges found (${dateMatches.length} dates detected)`
      : 'Few or no employment dates detected',
    fix: hasDates ? undefined : 'Add start and end dates for each position (e.g., "January 2020 - Present"). Missing dates are a red flag for both ATS systems and recruiters.',
  });

  // Summary length
  const hasSummary = foundSections.includes('Summary/Objective');
  const summaryGood = hasSummary && wordCount > 50;
  checks.push({
    name: 'Professional Summary Quality',
    category: 'Content Quality',
    passed: summaryGood,
    score: summaryGood ? 5 : 0,
    maxScore: 5,
    message: summaryGood
      ? 'Professional summary section looks good'
      : 'Missing or weak professional summary',
    fix: summaryGood ? undefined : 'Write a 2-4 sentence professional summary at the top highlighting your years of experience, key skills, and what you bring to the role. This is the first thing recruiters read.',
  });

  // --- 4. FORMATTING (15 points) ---

  // Check for common formatting issues
  const hasSpecialChars = /[^\x00-\x7F\u00C0-\u024F\u2018-\u201D\u2013\u2014\u2022\u2026•–—''""…]/.test(text);
  checks.push({
    name: 'Clean Text Encoding',
    category: 'Formatting',
    passed: !hasSpecialChars,
    score: !hasSpecialChars ? 5 : 0,
    maxScore: 5,
    message: !hasSpecialChars
      ? 'Text encoding is clean — ATS can read all characters'
      : 'Special characters detected that may cause ATS parsing errors',
    fix: hasSpecialChars ? 'Remove special characters, fancy symbols, or emojis. Stick to standard characters. ATS systems often misread special characters, turning your resume into garbled text.' : undefined,
  });

  // Check for headers/footers that might confuse ATS
  const hasHeaderFooter = /page\s*\d+\s*of\s*\d+/i.test(text) || /^\d+$/m.test(text);
  checks.push({
    name: 'No Confusing Headers/Footers',
    category: 'Formatting',
    passed: !hasHeaderFooter,
    score: !hasHeaderFooter ? 5 : 2,
    maxScore: 5,
    message: !hasHeaderFooter
      ? 'No problematic headers or footers detected'
      : 'Page numbers or headers/footers detected — these can confuse ATS',
    fix: hasHeaderFooter ? 'Remove page numbers and headers/footers. ATS systems sometimes read these as part of your content, inserting random numbers into your experience section.' : undefined,
  });

  // Text-based PDF check (if we got text, it's readable)
  const isTextBased = wordCount > 20;
  checks.push({
    name: 'Text-Based PDF',
    category: 'Formatting',
    passed: isTextBased,
    score: isTextBased ? 5 : 0,
    maxScore: 5,
    message: isTextBased
      ? 'PDF contains real text — ATS can read it'
      : 'Very little text extracted — this may be an image-based PDF',
    fix: isTextBased ? undefined : 'Your PDF appears to be image-based (scanned or screenshot). ATS systems CANNOT read image-based PDFs. Rebuild your resume using Resumly to get a text-based PDF that every ATS can parse.',
  });

  // --- 5. KEYWORD OPTIMIZATION (10 points) ---

  // Skills density
  const skillsSection = foundSections.includes('Skills');
  const commonSkills = text.match(/\b(?:python|java|javascript|typescript|react|angular|vue|node|sql|excel|powerpoint|word|photoshop|figma|agile|scrum|project management|data analysis|machine learning|communication|leadership|teamwork|problem.solving|microsoft office|google analytics|salesforce|hubspot|tableau|aws|azure|gcp|docker|kubernetes|git|html|css|seo|marketing|sales|customer service|accounting|financial|budgeting|forecasting)\b/gi) || [];
  const uniqueSkills = [...new Set(commonSkills.map(s => s.toLowerCase()))];
  const goodSkills = uniqueSkills.length >= 5;
  checks.push({
    name: 'Skills Keywords',
    category: 'Keyword Optimization',
    passed: goodSkills,
    score: goodSkills ? 5 : (uniqueSkills.length >= 2 ? 2 : 0),
    maxScore: 5,
    message: goodSkills
      ? `Strong keyword presence (${uniqueSkills.length} industry keywords found)`
      : `Limited keywords (${uniqueSkills.length} found)`,
    fix: goodSkills ? undefined : 'Add more industry-specific keywords and technical skills. Copy relevant keywords from the job description you\'re targeting. ATS systems rank resumes by keyword match percentage.',
  });

  // Avoid first-person pronouns (I, me, my)
  const firstPersonCount = (text.match(/\b(?:I|me|my|mine|myself)\b/g) || []).length;
  const noFirstPerson = firstPersonCount <= 2;
  checks.push({
    name: 'Professional Tone',
    category: 'Keyword Optimization',
    passed: noFirstPerson,
    score: noFirstPerson ? 5 : 0,
    maxScore: 5,
    message: noFirstPerson
      ? 'Professional tone — minimal first-person pronouns'
      : `${firstPersonCount} first-person pronouns found (I, me, my)`,
    fix: noFirstPerson ? undefined : 'Remove first-person pronouns (I, me, my). Instead of "I managed a team", write "Managed a team of 12". This is standard resume convention and reads more professionally.',
  });

  // Calculate totals
  const totalScore = checks.reduce((sum, c) => sum + c.score, 0);
  const maxScore = checks.reduce((sum, c) => sum + c.maxScore, 0);

  return { checks, totalScore, maxScore, sections: foundSections };
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('resume') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Only PDF files are supported' }, { status: 400 });
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Maximum 10MB.' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let text: string;
    try {
      text = await extractTextFromPDF(buffer);
    } catch {
      return NextResponse.json({
        error: 'Could not read PDF. It may be password-protected or corrupted.',
      }, { status: 400 });
    }

    const { checks, totalScore, maxScore, sections } = analyzeResume(text);
    const percentage = Math.round((totalScore / maxScore) * 100);

    // Group checks by category
    const categories: Record<string, { checks: CheckResult[]; score: number; maxScore: number }> = {};
    for (const check of checks) {
      if (!categories[check.category]) {
        categories[check.category] = { checks: [], score: 0, maxScore: 0 };
      }
      categories[check.category].checks.push(check);
      categories[check.category].score += check.score;
      categories[check.category].maxScore += check.maxScore;
    }

    // Generate top suggestions (failed checks, ordered by impact)
    const suggestions = checks
      .filter(c => !c.passed && c.fix)
      .sort((a, b) => b.maxScore - a.maxScore)
      .map(c => ({ title: c.name, category: c.category, fix: c.fix! }));

    // Rating
    const rating = percentage >= 90 ? 'Excellent' :
      percentage >= 75 ? 'Good' :
        percentage >= 50 ? 'Needs Improvement' :
          'Poor';

    return NextResponse.json({
      score: percentage,
      rating,
      totalScore,
      maxScore,
      categories,
      suggestions,
      sections,
      wordCount: text.split(/\s+/).filter(w => w.length > 1).length,
    });
  } catch (error) {
    console.error('ATS check error:', error);
    return NextResponse.json({ error: 'Failed to analyze resume. Please try again.' }, { status: 500 });
  }
}
