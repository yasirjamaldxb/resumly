import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, jobTitle, position, company, description, experience } = body;

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'AI not configured' }, { status: 503 });
    }

    let prompt = '';
    let responseParser: (content: string) => object;

    if (type === 'summary') {
      prompt = `Write a compelling 3-sentence professional summary for a ${jobTitle} resume.
      Make it ATS-friendly, results-oriented, and focused on value.
      Do not use first-person pronouns. Return only the summary text, no quotes or extra formatting.`;
      responseParser = (content) => ({ text: content.trim() });
    } else if (type === 'bullets') {
      prompt = `Generate 4 strong resume bullet points for a ${position} at ${company}.
      ${description ? `Context: ${description}` : ''}
      Rules:
      - Start each bullet with a strong action verb
      - Include quantifiable results where possible (%, $, numbers)
      - Be specific and ATS-friendly
      - No bullet symbols, just the text
      Return as JSON array: ["bullet1", "bullet2", "bullet3", "bullet4"]`;
      responseParser = (content) => {
        const match = content.match(/\[[\s\S]*\]/);
        if (match) return { bullets: JSON.parse(match[0]) };
        const lines = content.split('\n').filter((l) => l.trim().length > 10);
        return { bullets: lines.slice(0, 4) };
      };
    } else if (type === 'skills') {
      prompt = `List 8 in-demand technical and soft skills for a ${jobTitle} job application in 2025.
      Include a mix of technical skills, tools, and soft skills that recruiters look for.
      Return as JSON array of strings: ["skill1", "skill2", ...]`;
      responseParser = (content) => {
        const match = content.match(/\[[\s\S]*\]/);
        if (match) return { skills: JSON.parse(match[0]) };
        const lines = content.split('\n').filter((l) => l.trim().length > 1);
        return { skills: lines.slice(0, 8).map((l) => l.replace(/^[-*•]\s*/, '').trim()) };
      };
    } else {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert resume writer and career coach. Create professional, ATS-optimized resume content.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const content = completion.choices[0]?.message?.content || '';
    return NextResponse.json(responseParser(content));
  } catch (error) {
    console.error('AI suggestion error:', error);
    return NextResponse.json({ error: 'AI service unavailable' }, { status: 500 });
  }
}
