import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
});

const TRENDING_TOPICS = [
  'How to Write an ATS-Friendly Resume in 2026',
  '10 Resume Mistakes That Get You Rejected Instantly',
  'The Ultimate Guide to Resume Keywords for Job Seekers',
  'How to Tailor Your Resume for Every Job Application',
  'Cover Letter vs Resume: What Recruiters Actually Read First',
  'Top Resume Formats: Chronological, Functional, or Hybrid?',
  'How to Explain Career Gaps on Your Resume',
  'Resume Summary vs Objective: Which One Wins Interviews?',
  'How AI Resume Builders Are Changing the Job Search Game',
  'Interview Tips: How to Talk About Your Resume Confidently',
  'Remote Job Resume Tips: What Hiring Managers Want to See',
  '5 ATS Optimization Tricks Most Candidates Miss',
  'How to Quantify Achievements on Your Resume',
  'The Best Resume Templates for Career Changers',
  'Soft Skills on Your Resume: Which Ones Actually Matter',
  'How to Write a Resume With No Experience',
  'LinkedIn Profile vs Resume: How to Align Both for Maximum Impact',
  'Why Your Resume Keeps Getting Rejected by ATS Software',
  'Job Search Strategies That Actually Work in 2026',
  'How to Follow Up After Submitting Your Resume',
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function POST(request: NextRequest) {
  try {
    // Auth: check CRON_SECRET or admin header
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const topic =
      body.topic ||
      TRENDING_TOPICS[Math.floor(Math.random() * TRENDING_TOPICS.length)];

    const systemPrompt = `You are an expert SEO content writer for Resumly.app, an AI-powered resume builder. Write blog posts that are:
- SEO-optimized with natural keyword usage
- Actionable and helpful for job seekers
- Written in a friendly, professional tone
- Between 1500-2500 words
- Structured with clear H2 and H3 headings using markdown

Always include these internal links naturally within the content:
- [AI Resume Builder](/ai-resume-builder) or [resume builder](/resume-builder) - link when mentioning building or creating resumes
- [ATS Resume Checker](/ats-checker) - link when mentioning ATS scores or resume scanning
- [Cover Letter Builder](/cover-letter-builder) - link when mentioning cover letters

End with a compelling CTA encouraging readers to try Resumly's free resume builder.`;

    const userPrompt = `Write an SEO-optimized blog post about: "${topic}"

Return your response in the following JSON format (no markdown code fences, just raw JSON):
{
  "title": "SEO-optimized title (60-70 characters)",
  "metaDescription": "Compelling meta description (150-160 characters)",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "content": "Full markdown blog post content here"
}`;

    const completion = await openai.chat.completions.create({
      model: 'gemini-2.5-flash',
      temperature: 0.7,
      max_tokens: 8000,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    });

    const raw = completion.choices[0]?.message?.content || '';

    // Parse the JSON response - strip any markdown fences if present
    const jsonStr = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    let parsed: {
      title: string;
      metaDescription: string;
      keywords: string[];
      content: string;
    };

    try {
      parsed = JSON.parse(jsonStr);
    } catch {
      // If JSON parsing fails, construct from raw text
      parsed = {
        title: topic,
        metaDescription: `Learn about ${topic}. Expert tips and strategies from Resumly.app.`,
        keywords: topic.toLowerCase().split(' ').filter((w: string) => w.length > 3),
        content: raw,
      };
    }

    const slug = slugify(parsed.title);

    return NextResponse.json({
      title: parsed.title,
      slug,
      content: parsed.content,
      metaDescription: parsed.metaDescription,
      keywords: parsed.keywords,
    });
  } catch (error) {
    console.error('Blog generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate blog post' },
      { status: 500 }
    );
  }
}
