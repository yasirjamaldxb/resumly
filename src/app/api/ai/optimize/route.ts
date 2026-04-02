import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@/lib/supabase/server';
import { getUserUsage, canUseOptimization } from '@/lib/usage';
import { logAiUsage } from '@/lib/ai-usage';
import { buildUserContext, type UserProfile } from '@/lib/user-context';

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
    if (!canUseOptimization(usage)) {
      return NextResponse.json({
        error: 'limit_reached',
        message: `You've used your free application. Upgrade to create unlimited optimized resumes and cover letters.`,
        tier: usage.tier,
      }, { status: 403 });
    }

    const body = await req.json();
    const { resumeData, jobData, userProfile, rejectedSkills } = body;

    if (!resumeData || !jobData) {
      return NextResponse.json({ error: 'resumeData and jobData are required' }, { status: 400 });
    }

    const openai = new OpenAI({
      apiKey,
      baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
    });

    // Collect all job keywords/skills the resume must contain
    const allJobKeywords = [
      ...(jobData.skills || []),
      ...(jobData.keywords || []),
    ];
    const uniqueKeywords = [...new Set(allJobKeywords.map((k: string) => k.toLowerCase()))];
    const keywordList = allJobKeywords.filter((k: string, i: number) =>
      allJobKeywords.findIndex((j: string) => j.toLowerCase() === k.toLowerCase()) === i
    );

    const candidateContext = buildUserContext(userProfile as UserProfile | undefined);

    const prompt = `You are an expert resume optimizer. Optimize this resume to achieve a 100% keyword match with the target job description.
${candidateContext}

TARGET JOB:
Title: ${jobData.title || 'N/A'}
Company: ${jobData.company || 'N/A'}
Description: ${jobData.description || 'N/A'}
Requirements: ${(jobData.requirements || []).join(', ')}
Skills needed: ${(jobData.skills || []).join(', ')}
Keywords: ${(jobData.keywords || []).join(', ')}

REQUIRED KEYWORDS THAT MUST ALL APPEAR IN THE RESUME:
${keywordList.join(', ')}

CURRENT RESUME:
Name: ${resumeData.personalDetails?.firstName} ${resumeData.personalDetails?.lastName}
Title: ${resumeData.personalDetails?.jobTitle}
Summary: ${resumeData.personalDetails?.summary}
Experience: ${JSON.stringify(resumeData.workExperience?.slice(0, 5)?.map((w: { position: string; company: string; bullets: string[] }) => ({ position: w.position, company: w.company, bullets: w.bullets })))}
Skills: ${resumeData.skills?.map((s: { name: string }) => s.name).join(', ')}

Return ONLY valid JSON (no markdown, no code blocks) with these fields:
{
  "summary": "Optimized 3-sentence professional summary targeting this specific job, weaving in key job terms naturally",
  "jobTitle": "Optimized job title matching the target role",
  "skills": ["skill1", "skill2", ...ALL skills - keep existing relevant ones AND add EVERY missing job keyword/skill],
  "bulletImprovements": [
    {
      "experienceIndex": 0,
      "bulletIndex": 0,
      "original": "original bullet text",
      "improved": "improved bullet with relevant keywords and metrics"
    }
  ],
  "changes": ["Brief description of each change made"]
}

Rules:
- CRITICAL: Every single keyword from REQUIRED KEYWORDS must appear somewhere in the optimized resume — in skills, summary, or bullet improvements. Missing even one keyword hurts the ATS match score.
- ONLY add skills that the candidate's resume already lists OR that the candidate explicitly confirmed they have. NEVER guess or assume skills based on job title or role — the user has already been asked about missing skills.
- Weave keywords naturally into bullet point improvements where relevant.
- NEVER fabricate experience, companies, roles, metrics, or numbers. If the original bullet has no numbers, rewrite it to be stronger but do NOT invent percentages, dollar amounts, or team sizes. Only include metrics that already exist in the original resume.
- Reword existing bullets to include relevant keywords from the job — make them more impactful and specific, but keep the facts truthful to what the candidate wrote.
- Reorder skills to prioritize job-relevant ones first
- Match the job title to what the role is asking for (if similar enough)
- Keep the same tone and voice as the original
${(rejectedSkills as string[] || []).length > 0 ? `
SKILLS THE CANDIDATE CONFIRMED THEY DO NOT HAVE: ${(rejectedSkills as string[]).join(', ')}
- Do NOT add these skills to the skills list or claim the candidate has them
- Instead, COMPENSATE creatively: emphasize transferable skills, highlight adjacent experience, and show strong learning ability
- Frame existing experience to demonstrate readiness to pick up these tools/skills quickly
- In bullet improvements, emphasize outcomes and impact that show the candidate can deliver results regardless of specific tools
- In the summary, position the candidate's existing strengths as complementary to these requirements` : ''}`;

    const completion = await openai.chat.completions.create({
      model: 'gemini-2.5-flash',
      messages: [
        { role: 'system', content: 'You are a resume optimization expert. Return only valid JSON.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 16000,
    });

    const content = completion.choices[0]?.message?.content || '';
    const jsonStr = content.replace(/```json\s*\n?/g, '').replace(/```\s*$/g, '').trim();
    const result = JSON.parse(jsonStr);

    // Increment usage counter + log cost
    await Promise.all([
      supabase.from('profiles').update({ ai_optimizations_used: (usage.optimizationsUsed || 0) + 1 }).eq('id', user.id),
      logAiUsage(supabase, user.id, 'optimize', completion, { jobTitle: jobData.title }),
    ]);

    return NextResponse.json({ success: true, optimization: result });
  } catch (error) {
    console.error('AI optimize error:', error);
    return NextResponse.json({ error: 'AI optimization failed' }, { status: 500 });
  }
}
