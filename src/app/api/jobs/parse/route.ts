import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'AI not configured' }, { status: 503 });
  }

  try {
    const { url } = await req.json();
    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Fetch the job page
    let pageText = '';
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        signal: AbortSignal.timeout(10000),
      });
      const html = await res.text();
      // Strip HTML tags, scripts, styles to get text content
      pageText = html
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&#\d+;/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 8000); // Limit to ~8k chars for the AI prompt
    } catch {
      return NextResponse.json({ error: 'Could not fetch the job page. Try pasting the job description text instead.' }, { status: 422 });
    }

    if (pageText.length < 100) {
      return NextResponse.json({ error: 'Could not extract enough content from that URL. The page may require login.' }, { status: 422 });
    }

    // Use Gemini to extract structured job data
    const openai = new OpenAI({
      apiKey,
      baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
    });

    const completion = await openai.chat.completions.create({
      model: 'gemini-2.0-flash',
      messages: [
        {
          role: 'system',
          content: `You are a job listing parser. Extract structured data from job page content. Return ONLY valid JSON with this exact structure:
{
  "title": "Job Title",
  "company": "Company Name",
  "location": "City, State or Remote",
  "description": "Brief 2-3 sentence summary of the role",
  "requirements": ["requirement 1", "requirement 2", ...],
  "skills": ["skill 1", "skill 2", ...],
  "keywords": ["keyword 1", "keyword 2", ...],
  "experience": "e.g. 3-5 years",
  "salary": "salary range if mentioned, or null"
}
Extract 5-10 requirements, 8-12 skills (mix of technical and soft), and 10-15 ATS keywords that a resume should include. If a field cannot be determined, use null.`,
        },
        {
          role: 'user',
          content: `Parse this job listing content and extract structured data:\n\n${pageText}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 1500,
    });

    const content = completion.choices[0]?.message?.content || '';

    // Parse the JSON response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Failed to parse job data' }, { status: 500 });
    }

    const jobData = JSON.parse(jsonMatch[0]);
    return NextResponse.json({ job: jobData, source: url });
  } catch (error) {
    console.error('Job parse error:', error);
    return NextResponse.json({ error: 'Failed to parse job listing' }, { status: 500 });
  }
}
