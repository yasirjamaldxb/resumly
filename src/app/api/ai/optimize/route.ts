import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'AI not configured' }, { status: 503 });
  }

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { resumeData, jobData } = body;

    if (!resumeData || !jobData) {
      return NextResponse.json({ error: 'resumeData and jobData are required' }, { status: 400 });
    }

    const openai = new OpenAI({
      apiKey,
      baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
    });

    const prompt = `You are an expert resume optimizer. Optimize this resume to match the target job description.

TARGET JOB:
Title: ${jobData.title || 'N/A'}
Company: ${jobData.company || 'N/A'}
Description: ${jobData.description || 'N/A'}
Requirements: ${(jobData.requirements || []).join(', ')}
Skills needed: ${(jobData.skills || []).join(', ')}
Keywords: ${(jobData.keywords || []).join(', ')}

CURRENT RESUME:
Name: ${resumeData.personalDetails?.firstName} ${resumeData.personalDetails?.lastName}
Title: ${resumeData.personalDetails?.jobTitle}
Summary: ${resumeData.personalDetails?.summary}
Experience: ${JSON.stringify(resumeData.workExperience?.slice(0, 5)?.map((w: { position: string; company: string; bullets: string[] }) => ({ position: w.position, company: w.company, bullets: w.bullets })))}
Skills: ${resumeData.skills?.map((s: { name: string }) => s.name).join(', ')}

Return ONLY valid JSON (no markdown, no code blocks) with these fields:
{
  "summary": "Optimized 3-sentence professional summary targeting this specific job",
  "jobTitle": "Optimized job title matching the target role",
  "skills": ["skill1", "skill2", ...up to 15 most relevant skills for this job],
  "bulletImprovements": [
    {
      "experienceIndex": 0,
      "bulletIndex": 0,
      "original": "original bullet text",
      "improved": "improved bullet with relevant keywords and metrics"
    }
  ],
  "matchScore": 85,
  "changes": ["Brief description of each change made"]
}

Rules:
- NEVER fabricate experience, companies, or roles
- Reword existing bullets to include relevant keywords from the job
- Add metrics and quantifiable results where the original suggests impact
- Reorder skills to prioritize job-relevant ones first
- Match the job title to what the role is asking for (if similar enough)
- Keep the same tone and voice as the original
- matchScore = estimated ATS keyword match percentage (0-100)`;

    const completion = await openai.chat.completions.create({
      model: 'gemini-2.0-flash',
      messages: [
        { role: 'system', content: 'You are a resume optimization expert. Return only valid JSON.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 3000,
    });

    const content = completion.choices[0]?.message?.content || '';
    const jsonStr = content.replace(/```json\s*\n?/g, '').replace(/```\s*$/g, '').trim();
    const result = JSON.parse(jsonStr);

    // Increment usage counter
    await supabase
      .from('profiles')
      .update({ ai_optimizations_used: (body.currentOptimizations || 0) + 1 })
      .eq('id', user.id);

    return NextResponse.json({ success: true, optimization: result });
  } catch (error) {
    console.error('AI optimize error:', error);
    return NextResponse.json({ error: 'AI optimization failed' }, { status: 500 });
  }
}
