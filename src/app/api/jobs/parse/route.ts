import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'AI not configured' }, { status: 503 });
  }

  try {
    const body = await req.json();
    const { url, text } = body;

    // Accept either a URL to fetch or raw job description text
    let pageText = '';

    if (text && typeof text === 'string' && text.trim().length > 50) {
      // Raw text pasted by user — use directly
      pageText = text.trim().slice(0, 8000);
    } else if (url && typeof url === 'string') {
      // Fetch the job page HTML
      try {
        const res = await fetch(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'identity',
            'Cache-Control': 'no-cache',
          },
          redirect: 'follow',
          signal: AbortSignal.timeout(15000),
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
          .slice(0, 8000);
      } catch {
        return NextResponse.json({ error: 'fetch_failed', message: 'Could not fetch that page. Paste the job description instead.' }, { status: 422 });
      }

      if (pageText.length < 100) {
        return NextResponse.json({ error: 'insufficient_content', message: 'The page returned too little content — it may require login. Paste the job description instead.' }, { status: 422 });
      }

      // Detect login walls — if the text is mostly about signing in, reject it
      const lower = pageText.toLowerCase();
      const loginSignals = ['sign in', 'log in', 'create an account', 'join now'].filter(s => lower.includes(s));
      if (loginSignals.length >= 2 && pageText.length < 2000) {
        return NextResponse.json({ error: 'login_wall', message: 'This site requires login to see job details. Paste the job description instead.' }, { status: 422 });
      }
    } else {
      return NextResponse.json({ error: 'URL or job description text is required' }, { status: 400 });
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
