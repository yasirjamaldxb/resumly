import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  const openai = new OpenAI({
    apiKey: apiKey || 'placeholder',
    baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
  });

  try {
    if (!apiKey) {
      return NextResponse.json({ error: 'AI not configured' }, { status: 503 });
    }

    const body = await req.json();
    const { yourName, jobTitle, company, jobDescription, yourBackground, tone } = body;

    if (!jobTitle || !company) {
      return NextResponse.json({ error: 'Job title and company are required' }, { status: 400 });
    }

    const toneGuide = tone === 'formal' ? 'formal and professional' : tone === 'enthusiastic' ? 'enthusiastic and energetic' : 'friendly yet professional';

    const prompt = `Write a compelling cover letter for ${yourName || 'the applicant'} applying for the ${jobTitle} position at ${company}.

Tone: ${toneGuide}
${jobDescription ? `Job Description: ${jobDescription}` : ''}
${yourBackground ? `Applicant Background: ${yourBackground}` : ''}

Requirements:
- 3-4 paragraphs
- Opening: Hook with enthusiasm for the specific role and company
- Middle: Connect 2-3 specific achievements/skills to the job requirements
- Closing: Strong call to action requesting an interview
- No generic filler phrases like "I am writing to apply"
- ATS-friendly, keyword-rich based on job description
- Do NOT include any address headers, date, or signature lines
- Return only the cover letter body text`;

    const completion = await openai.chat.completions.create({
      model: 'gemini-2.0-flash',
      messages: [
        {
          role: 'system',
          content: 'You are an expert career coach and professional cover letter writer. Write compelling, personalized cover letters that get interviews.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.75,
      max_tokens: 800,
    });

    const text = completion.choices[0]?.message?.content || '';
    return NextResponse.json({ text: text.trim() });
  } catch (error) {
    console.error('Cover letter generation error:', error);
    return NextResponse.json({ error: 'AI service unavailable' }, { status: 500 });
  }
}
