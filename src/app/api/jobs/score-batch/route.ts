import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  computeJobMatchScore,
  type ScannedJob,
  type ScoredJob,
  type UserMatchProfile,
} from '@/lib/career-scanner';

// ══════════════════════════════════════════════════════════════
// POST /api/jobs/score-batch
// Score an array of scanned jobs against the user's profile
// ══════════════════════════════════════════════════════════════

export async function POST(req: NextRequest) {
  try {
    // ── Auth ──
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // ── Parse body ──
    const body = await req.json();
    const inputJobs: ScannedJob[] = body?.jobs;

    if (!Array.isArray(inputJobs) || inputJobs.length === 0) {
      return NextResponse.json(
        { error: 'Missing or empty jobs array' },
        { status: 400 },
      );
    }

    // Cap at 50 jobs to prevent abuse
    const jobs = inputJobs.slice(0, 50);

    // ── Load user profile ──
    const { data: profile } = await supabase
      .from('profiles')
      .select('target_role, job_level, industry, years_experience, career_context, location')
      .eq('id', user.id)
      .single();

    // ── Load most recent resume for skills and job titles ──
    const { data: latestResume } = await supabase
      .from('resumes')
      .select('resume_data')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    // Extract skills from resume data
    const resumeData = latestResume?.resume_data as Record<string, unknown> | null;
    const resumeSkills = extractSkillsFromResume(resumeData);
    const recentJobTitles = extractJobTitlesFromResume(resumeData);

    // Build match profile
    const matchProfile: UserMatchProfile = {
      target_role: profile?.target_role || undefined,
      job_level: profile?.job_level || undefined,
      industry: profile?.industry || undefined,
      years_experience: profile?.years_experience || undefined,
      career_context: profile?.career_context || undefined,
      preferred_location: profile?.location || undefined,
    };

    // ── Score each job ──
    const scoredJobs: ScoredJob[] = jobs.map((job) => {
      const { score, reasons } = computeJobMatchScore(
        job,
        matchProfile,
        resumeSkills,
        recentJobTitles,
      );
      return {
        title: job.title,
        url: job.url,
        location: job.location,
        department: job.department,
        matchScore: score,
        matchReasons: reasons,
      };
    });

    // Sort by score descending
    scoredJobs.sort((a, b) => b.matchScore - a.matchScore);

    return NextResponse.json({ scoredJobs });
  } catch (err) {
    console.error('[score-batch] Unexpected error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

// ══════════════════════════════════════════════════════════════
// Helpers: extract data from resume JSON
// ══════════════════════════════════════════════════════════════

function extractSkillsFromResume(resumeData: Record<string, unknown> | null): string[] {
  if (!resumeData) return [];

  const skills: string[] = [];

  // Common resume data shapes: skills array, technicalSkills, etc.
  const skillsSources = [
    resumeData.skills,
    resumeData.technicalSkills,
    resumeData.coreSkills,
  ];

  for (const source of skillsSources) {
    if (Array.isArray(source)) {
      for (const item of source) {
        if (typeof item === 'string') {
          skills.push(item);
        } else if (typeof item === 'object' && item !== null) {
          // { name: 'React', ... } or { skill: 'React' }
          const obj = item as Record<string, unknown>;
          const name = obj.name || obj.skill || obj.title || obj.label;
          if (typeof name === 'string') skills.push(name);

          // { category: 'Frontend', skills: ['React', 'Vue'] }
          if (Array.isArray(obj.skills)) {
            for (const s of obj.skills) {
              if (typeof s === 'string') skills.push(s);
            }
          }
          if (Array.isArray(obj.items)) {
            for (const s of obj.items) {
              if (typeof s === 'string') skills.push(s);
            }
          }
        }
      }
    }
  }

  return Array.from(new Set(skills));
}

function extractJobTitlesFromResume(resumeData: Record<string, unknown> | null): string[] {
  if (!resumeData) return [];

  const titles: string[] = [];

  const workSources = [
    resumeData.workExperience,
    resumeData.experience,
    resumeData.work,
    resumeData.employment,
  ];

  for (const source of workSources) {
    if (Array.isArray(source)) {
      for (const item of source) {
        if (typeof item === 'object' && item !== null) {
          const obj = item as Record<string, unknown>;
          const title = obj.title || obj.jobTitle || obj.position || obj.role;
          if (typeof title === 'string' && title.length > 0) {
            titles.push(title);
          }
        }
      }
    }
  }

  return titles;
}
