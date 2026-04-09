import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUserUsage } from '@/lib/usage';
import { logAiUsage } from '@/lib/ai-usage';
import { callGemini } from '@/lib/gemini';

export async function POST(req: NextRequest) {
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
        message: 'Application bundle download is a Pro-only feature. Upgrade to access your complete application package.',
        tier: usage.tier,
      }, { status: 403 });
    }

    const body = await req.json();
    const { applicationId } = body;

    if (!applicationId) {
      return NextResponse.json({ error: 'applicationId is required' }, { status: 400 });
    }

    // Fetch the application with all related data
    const { data: application, error: appError } = await supabase
      .from('applications')
      .select(`
        id, status, created_at,
        job:jobs(id, title, company, location, salary, url, description, requirements, skills),
        resume:resumes(id, title, resume_data),
        cover_letter:cover_letters(id, content, tone)
      `)
      .eq('id', applicationId)
      .eq('user_id', user.id)
      .single();

    if (appError || !application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    const jobRaw = application.job as unknown;
    const job = (Array.isArray(jobRaw) ? jobRaw[0] : jobRaw) as Record<string, unknown> | null;
    const resumeRaw = application.resume as unknown;
    const resume = (Array.isArray(resumeRaw) ? resumeRaw[0] : resumeRaw) as Record<string, unknown> | null;
    const clRaw = application.cover_letter as unknown;
    const coverLetter = (Array.isArray(clRaw) ? clRaw[0] : clRaw) as Record<string, unknown> | null;

    if (!job || !resume) {
      return NextResponse.json({
        error: 'incomplete_application',
        message: 'This application is missing a job or resume. Complete the application before downloading the bundle.',
      }, { status: 400 });
    }

    const resumeData = resume.resume_data as Record<string, unknown> | null;
    const jobTitle = (job.title as string) || 'Unknown Role';
    const company = (job.company as string) || 'Unknown Company';

    // Generate interview prep inline using Gemini
    let interviewPrep: {
      talkingPoints: string[];
      questions: { question: string; suggestedAnswer: string }[];
      salaryInsight: string;
    } | null = null;

    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && resumeData) {
      try {
        const prompt = `You are an expert interview coach. Analyze the overlap between this candidate's resume and the target job to prepare them for an interview.

TARGET JOB:
Title: ${jobTitle}
Company: ${company}
Description: ${(job.description as string) || 'N/A'}
Requirements: ${(Array.isArray(job.requirements) ? (job.requirements as string[]).join(', ') : 'N/A')}
Skills needed: ${(Array.isArray(job.skills) ? (job.skills as string[]).join(', ') : 'N/A')}

CANDIDATE RESUME:
Name: ${(resumeData.personalDetails as Record<string, unknown>)?.firstName || ''} ${(resumeData.personalDetails as Record<string, unknown>)?.lastName || ''}
Title: ${(resumeData.personalDetails as Record<string, unknown>)?.jobTitle || ''}
Summary: ${(resumeData.personalDetails as Record<string, unknown>)?.summary || ''}
Experience: ${JSON.stringify((resumeData.workExperience as Record<string, unknown>[])?.slice(0, 5)?.map((w) => ({ position: w.position, company: w.company, bullets: w.bullets })))}
Skills: ${(resumeData.skills as { name: string }[])?.map((s) => s.name).join(', ') || ''}

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

        const completion = await callGemini('bundle-interview-prep', {
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
        interviewPrep = JSON.parse(jsonStr);

        await logAiUsage(supabase, user.id, 'bundle-interview-prep', completion, {
          jobTitle,
          applicationId,
        });
      } catch (aiError) {
        console.error('Interview prep generation failed for bundle:', aiError);
        // Continue without interview prep — the bundle is still useful with resume + cover letter
      }
    }

    return NextResponse.json({
      success: true,
      resumeId: resume.id as string,
      coverLetterContent: (coverLetter?.content as string) || null,
      coverLetterTone: (coverLetter?.tone as string) || null,
      interviewPrep,
      jobTitle,
      company,
      jobLocation: (job.location as string) || null,
      jobUrl: (job.url as string) || null,
    });
  } catch (error) {
    console.error('Bundle download error:', error);
    return NextResponse.json({ error: 'Failed to generate application bundle' }, { status: 500 });
  }
}
