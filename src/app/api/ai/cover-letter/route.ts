import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@/lib/supabase/server';
import { getUserUsage, canUseOptimization } from '@/lib/usage';
import { logAiUsage } from '@/lib/ai-usage';
import { buildUserContext, type UserProfile } from '@/lib/user-context';

interface ExperienceEntry {
  position: string;
  company: string;
  duration: string;
  bullets: string[];
}

interface ResumePayload {
  jobTitle?: string;
  summary?: string;
  skills?: string[];
  experience?: ExperienceEntry[];
  education?: { degree: string; institution: string }[];
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'AI not configured' }, { status: 503 });
  }

  try {
    // Auth + usage check
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

    const openai = new OpenAI({
      apiKey,
      baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
    });

    const body = await req.json();
    const {
      yourName,
      jobTitle,
      company,
      jobDescription,
      tone,
      resumeData,
      jobRequirements,
      jobSkills,
      jobKeywords,
      // Legacy field — fallback if no resumeData
      yourBackground,
      userProfile,
    } = body;

    if (!jobTitle || !company) {
      return NextResponse.json({ error: 'Job title and company are required' }, { status: 400 });
    }

    if (!resumeData && !yourBackground) {
      return NextResponse.json({ error: 'Please upload your CV first so we can write a cover letter based on your real experience.' }, { status: 400 });
    }

    const toneGuide = tone === 'formal'
      ? 'Formal and polished. Use sophisticated vocabulary, structured sentences, and a composed professional voice.'
      : tone === 'enthusiastic'
        ? 'Warm and energetic. Show genuine excitement without being over-the-top. Let passion for the work come through naturally.'
        : 'Confident and conversational. Sound like a smart professional talking to a peer, not stiff, not casual.';

    // Build rich candidate profile from resume data
    const rd = resumeData as ResumePayload | undefined;
    let candidateProfile = '';

    if (rd) {
      const parts: string[] = [];

      if (rd.jobTitle) parts.push(`CURRENT TITLE: ${rd.jobTitle}`);
      if (rd.summary) parts.push(`PROFESSIONAL SUMMARY:\n${rd.summary}`);

      if (rd.experience?.length) {
        parts.push('WORK HISTORY (most recent first):');
        for (const exp of rd.experience.slice(0, 3)) {
          parts.push(`• ${exp.position} at ${exp.company} (${exp.duration})`);
          if (exp.bullets?.length) {
            for (const b of exp.bullets.slice(0, 3)) {
              parts.push(`  - ${b}`);
            }
          }
        }
      }

      if (rd.skills?.length) {
        parts.push(`KEY SKILLS: ${rd.skills.join(', ')}`);
      }

      if (rd.education?.length) {
        parts.push(`EDUCATION: ${rd.education.map(e => `${e.degree}, ${e.institution}`).join('; ')}`);
      }

      candidateProfile = parts.join('\n');
    } else if (yourBackground) {
      candidateProfile = yourBackground;
    }

    // Build job requirements context
    let jobContext = '';
    if (jobRequirements?.length) {
      jobContext += `\nKEY REQUIREMENTS FROM JOB POSTING:\n${(jobRequirements as string[]).map((r: string) => `• ${r}`).join('\n')}`;
    }
    if (jobSkills?.length) {
      jobContext += `\nREQUIRED SKILLS: ${(jobSkills as string[]).join(', ')}`;
    }
    if (jobKeywords?.length) {
      jobContext += `\nIMPORTANT KEYWORDS: ${(jobKeywords as string[]).join(', ')}`;
    }

    const systemPrompt = `You are an elite career strategist who has written cover letters for executives at Google, McKinsey, and Goldman Sachs. Your cover letters have a 70%+ interview rate because they feel like they were written by the candidate themselves — specific, authentic, and impossible to ignore.

Your writing style:
- Every sentence earns its place. No filler, no fluff, no generic statements.
- You never start with "I am writing to apply" or "I was excited to see". You open with something that makes the reader lean in.
- You treat the cover letter like a pitch — what's the ONE story that makes this candidate impossible to pass on?
- You weave job-specific keywords naturally into compelling narratives, never as keyword-stuffed lists.
- You sound human. A real person wrote this, not a template generator.`;

    const candidateContext = buildUserContext(userProfile as UserProfile | undefined);

    const prompt = `Write a cover letter for ${yourName || 'the candidate'} applying for "${jobTitle}" at ${company}.

TONE: ${toneGuide}
${candidateContext}
═══ THE CANDIDATE ═══
${candidateProfile || 'No detailed background provided.'}

═══ THE JOB ═══
${jobDescription || 'No description provided.'}
${jobContext}

═══ YOUR TASK ═══
Cross-reference the candidate's ACTUAL experience with the job's SPECIFIC requirements. Find the 2-3 strongest overlaps — these become the backbone of the letter.

CANDIDATE CONTACT INFO (use in the header):
Name: ${yourName || 'N/A'}
Email: ${body.yourEmail || 'N/A'}
Phone: ${body.yourPhone || 'N/A'}
Location: ${body.yourLocation || 'N/A'}

STRUCTURE:

HEADER (first 3-4 lines):
Start with the candidate's full name, email, phone number, and location on separate lines. Then add a blank line, today's date, and "Dear Hiring Manager," as the salutation.

PARAGRAPH 1 — THE HOOK (2-3 sentences):
Open with something specific about ${company} or the role that connects to the candidate's experience. Not "I'm excited about this opportunity" — instead, lead with a concrete insight or connection. Example: "Building [product] at [previous company] taught me that [insight relevant to ${company}'s work]."

PARAGRAPH 2 — THE PROOF (4-5 sentences):
This is the core. Pick 2-3 specific achievements from the candidate's resume that directly map to the job's top requirements. Only use numbers, project names, and outcomes that actually appear in the candidate's resume — NEVER invent metrics or statistics. If their resume has no numbers, describe the impact qualitatively instead. Every sentence should make the reader think "this person has already done what we need."

PARAGRAPH 3 — THE CLOSE (2 sentences):
Confident, forward-looking. Reference something specific about the team or role. End with a clear call to action.

SIGN-OFF:
End with "Sincerely," followed by the candidate's full name on the next line.

HARD RULES:
- The header MUST include the candidate's real name, email, and phone — these are critical for a professional cover letter
- NEVER use: "I believe", "I am confident", "I would be a great fit", "Thank you for your consideration"
- NEVER fabricate experience — only reference what's in the candidate's actual resume
- DO reference ${company} by name at least twice
- DO use keywords from the job posting naturally (not forced)
- DO sound like a real person, not a template
- Body paragraphs should be 200-300 words total. Every word must earn its place.
- Return the COMPLETE cover letter with header, body, and sign-off`;

    const completion = await openai.chat.completions.create({
      model: 'gemini-2.5-flash',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    const text = completion.choices[0]?.message?.content || '';

    // Keep the full cover letter with header and sign-off intact
    const cleaned = text.trim();

    // Increment usage counter + log cost
    await Promise.all([
      supabase.from('profiles').update({ ai_optimizations_used: (usage.optimizationsUsed || 0) + 1 }).eq('id', user.id),
      logAiUsage(supabase, user.id, 'cover-letter', completion, { jobTitle, company }),
    ]);

    return NextResponse.json({ text: cleaned });
  } catch (error) {
    console.error('Cover letter generation error:', error);
    return NextResponse.json({ error: 'AI service unavailable' }, { status: 500 });
  }
}
