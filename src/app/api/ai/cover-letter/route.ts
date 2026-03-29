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

    const prompt = `Write a highly personalized cover letter for ${yourName || 'the applicant'} applying for the "${jobTitle}" position at ${company}.

Tone: ${toneGuide}

JOB DESCRIPTION (use specific details from this):
${jobDescription || 'No description provided'}

APPLICANT BACKGROUND:
${yourBackground || 'No background provided'}

CRITICAL REQUIREMENTS:
1. PERSONALIZATION IS EVERYTHING — mention ${company} by name multiple times and reference SPECIFIC things from the job description (tools, responsibilities, team structure, company mission). Never write anything that could apply to any company.
2. Write exactly 4 paragraphs:
   - Para 1 (3 sentences): Open with genuine enthusiasm for THIS specific role at THIS company. Reference something specific about ${company} or the role.
   - Para 2 (4-5 sentences): Connect the applicant's strongest relevant experience to the TOP requirements in the job description. Use specific metrics or achievements.
   - Para 3 (3-4 sentences): Address additional requirements from the job description. Show cultural fit and eagerness to contribute to ${company}'s specific goals.
   - Para 4 (2-3 sentences): Confident close requesting an interview. Reference the role title and company name.
3. DO NOT use generic filler like "I am writing to apply", "I believe I would be a great fit", "Thank you for your consideration"
4. DO NOT include address headers, date, "Dear Hiring Manager", or signature lines
5. Include relevant keywords from the job description naturally throughout
6. Total length: 300-450 words
7. Return ONLY the cover letter body text, nothing else`;

    const completion = await openai.chat.completions.create({
      model: 'gemini-2.5-flash',
      messages: [
        {
          role: 'system',
          content: 'You are an expert career coach and professional cover letter writer. Write compelling, personalized cover letters that get interviews.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.75,
      max_tokens: 8000,
    });

    const text = completion.choices[0]?.message?.content || '';
    return NextResponse.json({ text: text.trim() });
  } catch (error) {
    console.error('Cover letter generation error:', error);
    return NextResponse.json({ error: 'AI service unavailable' }, { status: 500 });
  }
}
