import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUserUsage } from '@/lib/usage';
import { logAiUsage } from '@/lib/ai-usage';
import { callGemini } from '@/lib/gemini';

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

    const usage = await getUserUsage(supabase, user.id);
    if (usage.tier !== 'pro') {
      return NextResponse.json({
        error: 'pro_required',
        message: 'Interview prep is a Pro-only feature. Upgrade to access personalized interview talking points and questions.',
        tier: usage.tier,
      }, { status: 403 });
    }

    const body = await req.json();
    const { jobData, resumeData } = body;

    if (!jobData || !resumeData) {
      return NextResponse.json({ error: 'jobData and resumeData are required' }, { status: 400 });
    }

    const prompt = `You are an expert interview coach. Analyze the overlap between this candidate's resume and the target job to prepare them for an interview.

TARGET JOB:
Title: ${jobData.title || 'N/A'}
Company: ${jobData.company || 'N/A'}
Description: ${jobData.description || 'N/A'}
Requirements: ${(jobData.requirements || []).join(', ')}
Skills needed: ${(jobData.skills || []).join(', ')}

CANDIDATE RESUME:
Name: ${resumeData.personalDetails?.firstName} ${resumeData.personalDetails?.lastName}
Title: ${resumeData.personalDetails?.jobTitle}
Summary: ${resumeData.personalDetails?.summary}
Experience: ${JSON.stringify(resumeData.workExperience?.slice(0, 5)?.map((w: { position: string; company: string; bullets: string[] }) => ({ position: w.position, company: w.company, bullets: w.bullets })))}
Skills: ${resumeData.skills?.map((s: { name: string }) => s.name).join(', ')}

Return ONLY valid JSON (no markdown, no code blocks) with these fields:
{
  "talkingPoints": [
    "5 specific talking points that highlight where the candidate's experience directly aligns with the job requirements. Each should be a concrete, ready-to-use statement the candidate can say in the interview."
  ],
  "questions": [
    {
      "question": "A likely interview question based on this specific role and company",
      "suggestedAnswer": "A suggested answer that weaves in the candidate's actual experience from their resume"
    }
  ],
  "salaryInsight": "A brief salary negotiation insight for this specific role, including factors that strengthen the candidate's negotiating position based on their background"
}

Rules:
- Generate exactly 5 talking points
- Generate exactly 3 questions with suggested answers
- Base everything on the ACTUAL overlap between the resume and job — do not fabricate experience
- Talking points should be specific and actionable, not generic advice
- Questions should be realistic for this role and company
- Suggested answers should reference the candidate's real experience and skills
- The salary insight should consider the role level, required skills, and candidate's experience`;

    const completion = await callGemini('interview-prep', {
      messages: [
        { role: 'system', content: 'You are an expert interview coach. Return only valid JSON.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.4,
      max_tokens: 4000,
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0]?.message?.content || '';
    const jsonStr = content.replace(/```json\s*\n?/g, '').replace(/```\s*$/g, '').trim();
    const result = JSON.parse(jsonStr);

    await logAiUsage(supabase, user.id, 'interview-prep', completion, { jobTitle: jobData.title });

    return NextResponse.json({
      success: true,
      talkingPoints: result.talkingPoints,
      questions: result.questions,
      salaryInsight: result.salaryInsight,
    });
  } catch (error) {
    console.error('AI interview prep error:', error);
    return NextResponse.json({ error: 'Interview prep generation failed' }, { status: 500 });
  }
}
