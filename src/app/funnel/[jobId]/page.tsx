'use client';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';
import { TEMPLATE_LIST, emptyResume, type ResumeData } from '@/types/resume';
import { ResumeTemplate } from '@/components/resume/templates';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { UpgradeModal } from '@/components/upgrade-modal';
import { RoleSelector } from '@/components/role-selector';
import { type RoleDefinition } from '@/lib/roles';
import { buildUserContext, getSuggestedSkillsForRole, type UserProfile } from '@/lib/user-context';

// ─── Error Boundary ─────────────────────────────────

class FunnelErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[FunnelPage] Crash:', error, info.componentStack);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#f7f9fc] flex flex-col items-center justify-center px-5 text-center">
          <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mb-5">
            <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h1 className="text-[22px] font-bold text-neutral-90 mb-2">Something went wrong</h1>
          <p className="text-[14px] text-neutral-50 mb-6 max-w-sm">
            We hit an unexpected error loading your resume data. This usually fixes itself on retry.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-5 py-2.5 bg-primary text-white text-[13px] font-semibold rounded-lg hover:bg-primary/90 transition-colors"
            >
              Try again
            </button>
            <a
              href="/dashboard"
              className="px-5 py-2.5 bg-white border border-neutral-20 text-neutral-60 text-[13px] font-semibold rounded-lg hover:bg-neutral-5 transition-colors"
            >
              Go to dashboard
            </a>
          </div>
          {this.state.error && (
            <details className="mt-6 text-left max-w-md">
              <summary className="text-[11px] text-neutral-30 cursor-pointer">Error details</summary>
              <pre className="mt-2 text-[10px] text-red-400 bg-red-50 p-3 rounded-lg overflow-auto max-h-40">
                {this.state.error.message}
              </pre>
            </details>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── Safe data normalizer ────────────────────────────
// Ensures all arrays and nested objects are never null/undefined
// regardless of what Supabase JSONB returns
function safeResumeData(data: ResumeData): ResumeData {
  return {
    ...data,
    skills: Array.isArray(data.skills) ? data.skills : [],
    workExperience: Array.isArray(data.workExperience)
      ? data.workExperience.map(w => ({ ...w, bullets: Array.isArray(w.bullets) ? w.bullets : [] }))
      : [],
    education: Array.isArray(data.education) ? data.education : [],
    certifications: Array.isArray(data.certifications) ? data.certifications : [],
    languages: Array.isArray(data.languages) ? data.languages : [],
    projects: Array.isArray(data.projects) ? data.projects : [],
    customSections: Array.isArray(data.customSections) ? data.customSections : [],
    personalDetails: {
      ...(data.personalDetails || {}),
      firstName: data.personalDetails?.firstName ?? '',
      lastName: data.personalDetails?.lastName ?? '',
      email: data.personalDetails?.email ?? '',
      phone: data.personalDetails?.phone ?? '',
      location: data.personalDetails?.location ?? '',
      jobTitle: data.personalDetails?.jobTitle ?? '',
      summary: data.personalDetails?.summary ?? '',
      linkedIn: data.personalDetails?.linkedIn ?? '',
      website: data.personalDetails?.website ?? '',
      photo: data.personalDetails?.photo ?? '',
    },
  };
}

// ─── Types ───────────────────────────────────────────

type FunnelStep = 'analyze' | 'resume' | 'cover-letter';

interface MatchAnalysis {
  score: number;
  matched: string[];
  missing: string[];
  strongPoints: string[];
}

interface JobData {
  id: string;
  title: string | null;
  company: string | null;
  location: string | null;
  description: string | null;
  requirements: string[];
  skills: string[];
  keywords: string[];
  experience: string | null;
  salary: string | null;
}

// ─── Animated Loader ─────────────────────────────────

const LOADER_MSGS: Record<string, string[]> = {
  init: ['Setting up your workspace...'],
  upload: ['Reading your document...', 'Extracting work experience...', 'Identifying skills & education...', 'Building your profile...'],
  generate: ['Analyzing the job requirements...', 'Crafting your experience section...', 'Writing a compelling summary...', 'Polishing final details...'],
  optimize: ['Cross-referencing with job requirements...', 'Enhancing bullet points...', 'Boosting ATS keyword match...'],
};

function AnimatedLoader({ type, subtitle }: { type: string; subtitle?: string }) {
  const messages = LOADER_MSGS[type] || ['Processing...'];
  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(true);
  useEffect(() => {
    if (messages.length <= 1) return;
    const timer = setInterval(() => {
      setFade(false);
      setTimeout(() => { setIdx(i => (i + 1) % messages.length); setFade(true); }, 200);
    }, 2800);
    return () => clearInterval(timer);
  }, [messages.length]);
  return (
    <div className="min-h-screen bg-[#f7f9fc] flex flex-col items-center justify-center px-5">
      <div className="relative w-10 h-10 mb-5">
        <div className="w-10 h-10 border-[2.5px] border-primary/15 rounded-full" />
        <div className="absolute inset-0 w-10 h-10 border-[2.5px] border-primary border-t-transparent rounded-full animate-spin" />
      </div>
      <p className={`text-[14px] font-medium text-neutral-60 transition-opacity duration-200 text-center ${fade ? 'opacity-100' : 'opacity-0'}`}>
        {messages[idx]}
      </p>
      {subtitle && <p className="text-[12px] text-neutral-40 mt-1.5 text-center">{subtitle}</p>}
    </div>
  );
}

// ─── Paper Preview ───────────────────────────────────

function PaperPreview({ data, templateId, scale = 0.5, className = '' }: {
  data: ResumeData; templateId: string; scale?: number; className?: string;
}) {
  const pct = `${(100 / scale).toFixed(2)}%`;
  return (
    <div className={`relative bg-white overflow-hidden ${className}`} style={{ aspectRatio: '8.5/11' }}>
      <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: pct, height: pct, pointerEvents: 'none' }}>
        <ResumeTemplate data={{ ...data, templateId }} scale={1} />
      </div>
    </div>
  );
}

// ─── Match Analysis ─────────────────────────────────

function computeMatch(resumeData: ResumeData, jobData: JobData | null): MatchAnalysis {
  if (!jobData) return { score: 0, matched: [], missing: [], strongPoints: [] };

  // Helper to coerce any value to a safe lowercase string
  const safeLower = (v: unknown): string => (typeof v === 'string' ? v.toLowerCase() : '');

  // Build resume text corpus for matching (guard against null arrays & undefined fields from DB)
  const skills = (resumeData.skills || []).filter(s => s && typeof s.name === 'string');
  const experience = (resumeData.workExperience || []).filter(Boolean);
  const education = (resumeData.education || []).filter(Boolean);
  const resumeText = [
    resumeData.personalDetails?.summary || '',
    resumeData.personalDetails?.jobTitle || '',
    ...skills.map(s => s.name || ''),
    ...experience.flatMap(w => [w.position || '', w.company || '', ...((w.bullets || []).filter((b): b is string => typeof b === 'string'))]),
    ...education.map(e => `${e.degree || ''} ${e.institution || ''} ${e.field || ''}`),
  ].join(' ').toLowerCase();

  // Combine all job keywords — filter to strings only
  const allJobTerms = [
    ...(jobData.skills || []),
    ...(jobData.keywords || []),
  ].filter((t): t is string => typeof t === 'string' && t.length > 0);

  // Deduplicate case-insensitively
  const seen = new Set<string>();
  const uniqueTerms = allJobTerms.filter(t => {
    const lower = t.toLowerCase();
    if (seen.has(lower)) return false;
    seen.add(lower);
    return true;
  });

  const matched: string[] = [];
  const missing: string[] = [];

  for (const term of uniqueTerms) {
    const lower = term.toLowerCase();
    // Check for whole word or substring match
    if (resumeText.includes(lower) || resumeText.includes(lower.replace(/[-/]/g, ' '))) {
      matched.push(term);
    } else {
      // Check for partial match (e.g. "JavaScript" matches "JS" context)
      const words = lower.split(/[\s/,-]+/);
      const partialMatch = words.length > 1 && words.some(w => w.length > 2 && resumeText.includes(w));
      if (partialMatch) {
        matched.push(term);
      } else {
        missing.push(term);
      }
    }
  }

  // Identify strong points from requirements
  const strongPoints: string[] = [];
  const reqs = (jobData.requirements || []).filter((r): r is string => typeof r === 'string' && r.length > 0);
  const resumeSkillNames = skills.map(s => safeLower(s.name)).filter(Boolean);

  if (experience.length >= 3) strongPoints.push(`${experience.length} relevant roles`);
  if (education.length > 0) strongPoints.push('Education matches');

  // Check experience-level requirements
  for (const req of reqs.slice(0, 5)) {
    const reqLower = req.toLowerCase();
    const hasMatch = experience.some(w =>
      (w.bullets || []).some(b => {
        const bLower = safeLower(b);
        if (!bLower) return false;
        const reqWords = reqLower.split(/\s+/).filter(w => w.length > 3);
        return reqWords.filter(rw => bLower.includes(rw)).length >= 2;
      })
    ) || resumeSkillNames.some(s => reqLower.includes(s));
    if (hasMatch) strongPoints.push(req.length > 50 ? req.slice(0, 48) + '...' : req);
  }

  const total = uniqueTerms.length || 1;
  const score = Math.round((matched.length / total) * 100);

  return { score: Math.min(score, 100), matched, missing: missing.slice(0, 8), strongPoints: strongPoints.slice(0, 4) };
}

function MatchScoreRing({ score, size = 56, strokeWidth = 4 }: { score: number; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * radius;
  const offset = circ - (score / 100) * circ;
  const color = score >= 75 ? 'text-green-500' : score >= 50 ? 'text-amber-500' : 'text-red-400';
  const bgColor = score >= 75 ? 'text-green-100' : score >= 50 ? 'text-amber-100' : 'text-red-100';

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth={strokeWidth} className={`stroke-current ${bgColor}`} />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth={strokeWidth} strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset} className={`stroke-current ${color} transition-all duration-700`} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-[13px] font-bold ${color.replace('text-', 'text-')}`}>{score}%</span>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────

export default function FunnelPageWrapper() {
  return (
    <FunnelErrorBoundary>
      <FunnelPage />
    </FunnelErrorBoundary>
  );
}

function FunnelPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.jobId as string;

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Core state
  const [step, setStep] = useState<FunnelStep>('analyze');
  const [cvUploaded, setCvUploaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [jobData, setJobData] = useState<JobData | null>(null);
  const [resumeData, setResumeData] = useState<ResumeData>(emptyResume());
  const [selectedTemplate, setSelectedTemplate] = useState('ats-pro');
  const [error, setError] = useState<string | null>(null);
  const [hasExistingResume, setHasExistingResume] = useState(false);

  // Process flags
  const [uploadingResume, setUploadingResume] = useState(false);

  const [optimizing, setOptimizing] = useState(false);
  const [optimization, setOptimization] = useState<Record<string, unknown> | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedResumeId, setSavedResumeId] = useState<string | null>(null);

  // Cover letter
  const [coverLetterContent, setCoverLetterContent] = useState('');
  const [coverLetterTone, setCoverLetterTone] = useState<'professional' | 'formal' | 'enthusiastic'>('professional');
  const [generatingCoverLetter, setGeneratingCoverLetter] = useState(false);
  const [finished, setFinished] = useState(false);

  // User profile / onboarding
  const [userProfile, setUserProfile] = useState<UserProfile>({});
  const [selectedRole, setSelectedRole] = useState<RoleDefinition | undefined>();
  const [profileLoaded, setProfileLoaded] = useState(false);

  // Skill gap analysis
  const [confirmedSkills, setConfirmedSkills] = useState<string[]>([]);
  const [rejectedSkills, setRejectedSkills] = useState<string[]>([]);

  // UI
  const [linkedinTip, setLinkedinTip] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [upgradeMessage, setUpgradeMessage] = useState('');

  // Match analysis — recomputes whenever resume or job data changes
  const matchAnalysis = useMemo(() => computeMatch(resumeData, jobData), [resumeData, jobData]);

  // ─── Load data ─────────────────────────────────────
  useEffect(() => {
    async function loadData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { router.push('/auth/login'); return; }

        const metaName = user.user_metadata?.name?.trim() || user.user_metadata?.full_name?.trim() || '';
        const nameParts = metaName.split(' ');
        if (metaName || user.email) {
          setResumeData(prev => ({
            ...prev,
            personalDetails: {
              ...prev.personalDetails,
              firstName: prev.personalDetails.firstName || nameParts[0] || '',
              lastName: prev.personalDetails.lastName || nameParts.slice(1).join(' ') || '',
              email: prev.personalDetails.email || user.email || '',
            },
          }));
        }

        // Load user profile for AI personalization
        const { data: profile } = await supabase
          .from('profiles')
          .select('target_role, job_level, industry, years_experience, career_context, onboarding_complete')
          .eq('id', user.id)
          .single();

        if (profile) {
          setUserProfile({
            target_role: profile.target_role || '',
            job_level: profile.job_level || '',
            industry: profile.industry || '',
            years_experience: profile.years_experience || undefined,
            career_context: profile.career_context || '',
          });
          setProfileLoaded(true);
        } else {
          setProfileLoaded(true);
        }

        const { data: job } = await supabase.from('jobs').select('*').eq('id', jobId).single();
        if (!job) { router.push('/dashboard'); return; }
        setJobData(job);

        // Check for existing resume
        const { data: existingResumes } = await supabase
          .from('resumes')
          .select('id, resume_data, template_id')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false })
          .limit(1);

        if (existingResumes && existingResumes.length > 0 && existingResumes[0].resume_data) {
          const saved = existingResumes[0].resume_data as ResumeData;
          // Normalize all arrays and nested objects from DB JSONB
          const safeResume = safeResumeData(saved);
          setResumeData(prev => ({
            ...safeResume,
            personalDetails: {
              ...safeResume.personalDetails,
              firstName: safeResume.personalDetails.firstName || prev.personalDetails.firstName,
              lastName: safeResume.personalDetails.lastName || prev.personalDetails.lastName,
              email: safeResume.personalDetails.email || prev.personalDetails.email,
            },
          }));
          if (existingResumes[0].template_id) setSelectedTemplate(existingResumes[0].template_id);
          setHasExistingResume(true);
          setCvUploaded(true);
          // Returning user — stay on analyze step but with CV data loaded
        }
      } catch {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [jobId, router, supabase]);

  // Auto-optimize resume when entering resume step
  useEffect(() => {
    if (step === 'resume' && !optimization && !optimizing && jobData && resumeData.personalDetails.firstName) {
      handleOptimize();
    }
  }, [step, jobData, resumeData.personalDetails.firstName]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-generate cover letter on that step
  useEffect(() => {
    if (step === 'cover-letter' && !coverLetterContent && !generatingCoverLetter && jobData && resumeData.personalDetails.firstName) {
      handleGenerateCoverLetter();
    }
  }, [step]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Handlers ──────────────────────────────────────

  const handleFileUpload = async (file: File) => {
    setUploadingResume(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/resume/parse-upload', { method: 'POST', body: formData });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Upload failed');
      const parsed = result.data;
      const mergedPD = { ...parsed.personalDetails };
      for (const key of Object.keys(mergedPD) as Array<keyof typeof mergedPD>) {
        if (!mergedPD[key] || (typeof mergedPD[key] === 'string' && !(mergedPD[key] as string).trim())) delete mergedPD[key];
      }
      setResumeData(prev => safeResumeData({
        ...prev,
        personalDetails: { ...prev.personalDetails, ...mergedPD },
        workExperience: parsed.workExperience?.length ? parsed.workExperience : prev.workExperience,
        education: parsed.education?.length ? parsed.education : prev.education,
        skills: parsed.skills?.length ? parsed.skills : prev.skills,
        certifications: parsed.certifications || prev.certifications,
        languages: parsed.languages || prev.languages,
        projects: parsed.projects || prev.projects,
      }));
      // Stay on analyze step, but now show the expanded sections
      setCvUploaded(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse resume');
    } finally {
      setUploadingResume(false);
    }
  };

  const handleOptimize = useCallback(async () => {
    setOptimizing(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeData, jobData, userProfile, rejectedSkills }),
      });
      const result = await res.json();
      if (!res.ok) {
        if (result.error === 'limit_reached') {
          setUpgradeMessage(result.message);
          setShowUpgrade(true);
          setOptimizing(false);
          return;
        }
        throw new Error(result.error || 'Optimization failed');
      }
      const opt = result.optimization;
      setOptimization(opt);
      setResumeData(prev => {
        const updated = safeResumeData({ ...prev });
        if (opt.summary) updated.personalDetails = { ...updated.personalDetails, summary: opt.summary };
        if (opt.jobTitle) updated.personalDetails = { ...updated.personalDetails, jobTitle: opt.jobTitle };
        if (opt.skills?.length) {
          updated.skills = opt.skills.map((name: string) => ({ id: crypto.randomUUID(), name, level: 'intermediate' as const }));
        }
        if (opt.bulletImprovements?.length) {
          const exp = [...updated.workExperience];
          for (const imp of opt.bulletImprovements) {
            const entry = exp[imp.experienceIndex];
            if (entry && Array.isArray(entry.bullets) && entry.bullets[imp.bulletIndex] !== undefined) {
              entry.bullets[imp.bulletIndex] = imp.improved;
            }
          }
          updated.workExperience = exp;
        }
        return updated;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Optimization failed');
    } finally {
      setOptimizing(false);
    }
  }, [resumeData, jobData, userProfile, rejectedSkills]);

  // Save resume & go to cover letter
  const handleSaveAndContinue = async () => {
    setSaving(true);
    setError(null);
    try {
      const saveRes = await fetch('/api/resume/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...resumeData, templateId: selectedTemplate, jobId, title: jobData?.title ? `Resume for ${jobData.title}` : 'My Resume' }),
      });
      const saveResult = await saveRes.json();
      if (!saveRes.ok) throw new Error(saveResult.error || 'Save failed');
      setSavedResumeId(saveResult.id);

      const { data: { user } } = await supabase.auth.getUser();
      await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_id: jobId, resume_id: saveResult.id, status: 'draft' }),
      });
      if (user) await supabase.from('profiles').update({ onboarding_complete: true }).eq('id', user.id);

      setStep('cover-letter');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateCoverLetter = useCallback(async () => {
    setGeneratingCoverLetter(true);
    setError(null);
    try {
      const pd = resumeData.personalDetails;
      const res = await fetch('/api/ai/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          yourName: `${pd.firstName || ''} ${pd.lastName || ''}`.trim(),
          yourEmail: pd.email || '',
          yourPhone: pd.phone || '',
          yourLocation: pd.location || '',
          jobTitle: jobData?.title || '', company: jobData?.company || '',
          jobDescription: jobData?.description || '', tone: coverLetterTone,
          resumeData: {
            jobTitle: pd.jobTitle, summary: pd.summary,
            skills: resumeData.skills?.map(s => s.name) || [],
            experience: resumeData.workExperience?.map(w => ({
              position: w.position, company: w.company,
              duration: `${w.startDate} - ${w.endDate || 'Present'}`,
              bullets: w.bullets?.slice(0, 3) || [],
            })) || [],
            education: resumeData.education?.map(e => ({ degree: e.degree, institution: e.institution })) || [],
          },
          jobRequirements: jobData?.requirements || [],
          jobSkills: jobData?.skills || [],
          jobKeywords: jobData?.keywords || [],
          userProfile,
        }),
      });
      const result = await res.json();
      if (!res.ok) {
        if (result.error === 'limit_reached') {
          setUpgradeMessage(result.message);
          setShowUpgrade(true);
          setGeneratingCoverLetter(false);
          return;
        }
        throw new Error(result.error || 'Generation failed');
      }
      setCoverLetterContent(result.text);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate cover letter');
    } finally {
      setGeneratingCoverLetter(false);
    }
  }, [resumeData, jobData, coverLetterTone]);

  const handleFinish = async () => {
    setSaving(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (coverLetterContent.trim() && user && savedResumeId) {
        const { data: clData } = await supabase
          .from('cover_letters')
          .insert({ user_id: user.id, job_id: jobId, resume_id: savedResumeId, content: coverLetterContent, tone: coverLetterTone })
          .select().single();
        if (clData) {
          await supabase.from('applications').update({ cover_letter_id: clData.id, status: 'ready' }).eq('job_id', jobId).eq('user_id', user.id);
        }
      }
      setFinished(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  // ═══════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════

  if (loading && !jobData) return <AnimatedLoader type="init" />;
  if (uploadingResume) return <AnimatedLoader type="upload" subtitle="This usually takes 5-10 seconds" />;

  const inputCls = 'w-full px-3 py-2 rounded-lg border border-neutral-20 bg-white text-[13px] text-neutral-90 placeholder:text-neutral-30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all';

  const stepProgress = (
    <div className="flex items-center gap-3 justify-center mb-6">
      {['Analyze & Match', 'Optimized Resume', 'Cover Letter'].map((label, i) => {
        const stepMap: FunnelStep[] = ['analyze', 'resume', 'cover-letter'];
        const isCurrent = step === stepMap[i];
        const isCompleted = stepMap.indexOf(step) > i;
        return (
          <div key={label} className="flex items-center gap-3">
            {i > 0 && <div className={`w-8 sm:w-12 h-px ${isCompleted ? 'bg-primary' : 'bg-neutral-20'}`} />}
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${
                isCompleted ? 'bg-primary text-white' : isCurrent ? 'bg-primary/10 text-primary ring-2 ring-primary/20' : 'bg-neutral-10 text-neutral-40'
              }`}>
                {isCompleted ? (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                ) : i + 1}
              </div>
              <span className={`text-[12px] font-medium hidden sm:inline ${isCurrent ? 'text-neutral-90' : isCompleted ? 'text-primary' : 'text-neutral-40'}`}>{label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      {/* Header */}
      <header className="bg-white border-b border-neutral-20 sticky top-0 z-40">
        <div className="max-w-full px-3 sm:px-5 h-[52px] flex items-center justify-between gap-2">
          <Link href="/dashboard" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">R</span>
            </div>
            <span className="font-semibold text-neutral-90 text-[15px] tracking-tight">resumly<span className="text-primary">.app</span></span>
          </Link>
          {jobData?.title && (
            <div className="hidden sm:flex items-center gap-2 text-[12px] bg-primary/5 border border-primary/15 px-3 py-1.5 rounded-lg">
              <svg className="w-3.5 h-3.5 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-neutral-60 font-medium truncate max-w-[240px]">{jobData.title}</span>
              {jobData.company && <span className="text-neutral-40">at {jobData.company}</span>}
            </div>
          )}
        </div>
      </header>

      {/* Error */}
      {error && (
        <div className="max-w-[1280px] mx-auto px-6 sm:px-10 mt-4">
          <div className="bg-red-50 text-red-600 px-4 py-2.5 rounded-lg text-[12px] flex items-center justify-between">
            <span className="flex items-center gap-2">
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01" /></svg>
              {error}
            </span>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 ml-3"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
          </div>
        </div>
      )}

      {/* ═════════════════════════════════════════════
          STEP 1: ANALYZE — Upload + Details + Skill Check (one page)
      ═════════════════════════════════════════════ */}
      {step === 'analyze' && (() => {
        const pd = resumeData.personalDetails;
        const missingFields: string[] = [];
        if (!pd.firstName?.trim()) missingFields.push('firstName');
        if (!pd.lastName?.trim()) missingFields.push('lastName');
        if (!pd.email?.trim()) missingFields.push('email');
        if (!pd.phone?.trim()) missingFields.push('phone');
        if (!pd.location?.trim()) missingFields.push('location');
        const hasNoExperience = (resumeData.workExperience || []).length === 0;
        const totalExtracted = [pd.firstName, pd.lastName, pd.email, pd.phone, pd.jobTitle].filter(Boolean).length;

        // Skill gap analysis
        const userSkillNames = (resumeData.skills || []).map(s => s.name.toLowerCase());
        const allJobTerms = [...(jobData?.skills || []), ...(jobData?.keywords || [])];
        const seen = new Set<string>();
        const uniqueJobSkills = allJobTerms.filter(t => { const lower = t.toLowerCase(); if (seen.has(lower)) return false; seen.add(lower); return true; });
        const matchedJobSkills = uniqueJobSkills.filter(skill => { const lower = skill.toLowerCase(); return userSkillNames.some(us => us.includes(lower) || lower.includes(us)); });
        const missingSkills = uniqueJobSkills.filter(skill => { const lower = skill.toLowerCase(); return !userSkillNames.some(us => us.includes(lower) || lower.includes(us)); });
        const unansweredSkills = missingSkills.filter(s => !confirmedSkills.map(c => c.toLowerCase()).includes(s.toLowerCase()) && !rejectedSkills.map(r => r.toLowerCase()).includes(s.toLowerCase()));

        const hasProfileData = !!(userProfile.target_role && userProfile.job_level);
        const canProceed = cvUploaded && pd.firstName?.trim() && pd.lastName?.trim();

        return (
        <main className="max-w-[580px] mx-auto px-5 sm:px-8 py-8 sm:py-12">
          {stepProgress}

          {/* ── SECTION 1: Upload ── */}
          {!cvUploaded ? (
            <>
              <div className="text-center mb-8">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                </div>
                <h1 className="text-[24px] sm:text-[28px] font-bold text-neutral-90 tracking-tight leading-tight">
                  {jobData?.title
                    ? <>Let&apos;s optimize you for <span className="text-primary">{jobData.title}</span></>
                    : 'Let\u2019s optimize your resume'}
                </h1>
                <p className="text-neutral-40 text-[14px] mt-2 leading-relaxed max-w-[420px] mx-auto">
                  Upload your CV and we&apos;ll analyze it against the job requirements to maximize your interview chances.
                </p>
              </div>

              <label className="group flex flex-col items-center gap-3 p-8 rounded-xl cursor-pointer bg-white border-2 border-dashed border-neutral-20 hover:border-primary/40 hover:bg-primary/[0.02] transition-all">
                <div className="w-12 h-12 bg-primary/8 rounded-xl flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-[15px] text-neutral-90">Drop your CV here or click to browse</p>
                  <p className="text-[13px] text-neutral-40 mt-1">PDF or DOCX</p>
                </div>
                <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f); }} />
              </label>

              <button onClick={() => setLinkedinTip(!linkedinTip)} className="group flex items-center gap-4 p-4 rounded-xl bg-white border border-neutral-20 hover:border-blue-200 hover:shadow-sm transition-all w-full text-left mt-3">
                <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-[13px] text-neutral-70">No CV? Export from LinkedIn</div>
                  <div className="text-[12px] text-neutral-40 mt-0.5">Profile &rarr; More &rarr; Save to PDF</div>
                </div>
                <svg className={`w-4 h-4 text-neutral-20 transition-transform shrink-0 ${linkedinTip ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>

              {linkedinTip && (
                <div className="bg-blue-50/60 px-5 py-4 rounded-xl text-[13px] text-blue-700 space-y-2 mt-2">
                  <p><strong>1.</strong> Go to your LinkedIn profile</p>
                  <p><strong>2.</strong> Click <strong>More</strong> &rarr; <strong>Save to PDF</strong></p>
                  <p><strong>3.</strong> Upload the downloaded PDF:</p>
                  <label className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg text-[13px] font-semibold cursor-pointer hover:bg-blue-700 transition-colors mt-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                    Upload LinkedIn PDF
                    <input type="file" accept=".pdf" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f); }} />
                  </label>
                </div>
              )}
            </>
          ) : (
            <>
              {/* ── CV UPLOADED — Show analysis ── */}
              <div className="text-center mb-6">
                <h1 className="text-[22px] font-semibold text-neutral-90 tracking-tight">
                  {jobData?.title
                    ? <>Analyzing your fit for <span className="text-primary">{jobData.title}</span></>
                    : 'Analyzing your profile'}
                </h1>
                <p className="text-[13px] text-neutral-40 mt-1.5">Confirm your details below, then we&apos;ll build your optimized resume.</p>
              </div>

              {/* What we extracted */}
              {totalExtracted > 0 && (
                <div className="bg-green-50/50 rounded-xl border border-green-100 p-4 mb-5">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                    <p className="text-[12px] font-semibold text-green-700">Extracted from your CV</p>
                  </div>
                  <div className="flex flex-wrap gap-2 text-[11px]">
                    {pd.firstName && <span className="bg-white border border-green-200 text-green-700 px-2 py-0.5 rounded">{pd.firstName} {pd.lastName}</span>}
                    {pd.jobTitle && <span className="bg-white border border-green-200 text-green-700 px-2 py-0.5 rounded">{pd.jobTitle}</span>}
                    {pd.email && <span className="bg-white border border-green-200 text-green-700 px-2 py-0.5 rounded">{pd.email}</span>}
                    {(resumeData.workExperience || []).length > 0 && <span className="bg-white border border-green-200 text-green-700 px-2 py-0.5 rounded">{resumeData.workExperience.length} jobs</span>}
                    {(resumeData.skills || []).length > 0 && <span className="bg-white border border-green-200 text-green-700 px-2 py-0.5 rounded">{resumeData.skills.length} skills</span>}
                    {(resumeData.education || []).length > 0 && <span className="bg-white border border-green-200 text-green-700 px-2 py-0.5 rounded">{resumeData.education.length} education</span>}
                  </div>
                </div>
              )}

              {/* Missing personal details */}
              {missingFields.length > 0 && (
                <div className="mb-5">
                  <p className="text-[12px] font-semibold text-neutral-50 mb-2 flex items-center gap-1.5">
                    <span className="w-4 h-4 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-[9px] font-bold">!</span>
                    Fill in missing details
                  </p>
                  <div className="grid grid-cols-2 gap-2.5">
                    {missingFields.includes('firstName') && <input placeholder="First name *" value={pd.firstName} onChange={(e) => setResumeData(prev => ({ ...prev, personalDetails: { ...prev.personalDetails, firstName: e.target.value } }))} className={inputCls} />}
                    {missingFields.includes('lastName') && <input placeholder="Last name *" value={pd.lastName} onChange={(e) => setResumeData(prev => ({ ...prev, personalDetails: { ...prev.personalDetails, lastName: e.target.value } }))} className={inputCls} />}
                    {missingFields.includes('email') && <input type="email" placeholder="Email *" value={pd.email} onChange={(e) => setResumeData(prev => ({ ...prev, personalDetails: { ...prev.personalDetails, email: e.target.value } }))} className={inputCls} />}
                    {missingFields.includes('phone') && <input placeholder="Phone" value={pd.phone} onChange={(e) => setResumeData(prev => ({ ...prev, personalDetails: { ...prev.personalDetails, phone: e.target.value } }))} className={inputCls} />}
                    {missingFields.includes('location') && <input placeholder="City, Country" value={pd.location} onChange={(e) => setResumeData(prev => ({ ...prev, personalDetails: { ...prev.personalDetails, location: e.target.value } }))} className="col-span-2 w-full px-3 py-2 rounded-lg border border-neutral-20 bg-white text-[13px] text-neutral-90 placeholder:text-neutral-30 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />}
                  </div>
                </div>
              )}

              {/* No experience warning */}
              {hasNoExperience && (
                <div className="bg-red-50/50 rounded-xl border border-red-100 p-3.5 mb-5">
                  <p className="text-[12px] font-semibold text-red-700 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" /></svg>
                    No work experience detected. <button onClick={() => setCvUploaded(false)} className="underline hover:text-red-800">Re-upload</button>
                  </p>
                </div>
              )}

              {/* ── Career context (only for first-time users) ── */}
              {!hasProfileData && (
                <div className="mb-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex-1 h-px bg-neutral-15" />
                    <span className="text-[10px] font-semibold text-neutral-30 uppercase tracking-wider">Quick profile</span>
                    <div className="flex-1 h-px bg-neutral-15" />
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[12px] font-medium text-neutral-50 mb-1">Target role</label>
                      <RoleSelector value={userProfile.target_role || ''} onChange={(title, role) => { setUserProfile(prev => ({ ...prev, target_role: title })); setSelectedRole(role); }} />
                    </div>
                    <div>
                      <label className="block text-[12px] font-medium text-neutral-50 mb-1">Level</label>
                      <div className="grid grid-cols-5 gap-1.5">
                        {(['student', 'entry', 'mid', 'senior', 'executive'] as const).map((level) => (
                          <button key={level} onClick={() => setUserProfile(prev => ({ ...prev, job_level: level }))} className={cn('py-1.5 rounded-lg text-[11px] font-medium border transition-all capitalize', userProfile.job_level === level ? 'border-primary bg-primary/10 text-primary' : 'border-neutral-20 text-neutral-50 hover:border-neutral-30')}>{level}</button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-[12px] font-medium text-neutral-50 mb-1">Industry</label>
                      <select value={userProfile.industry || ''} onChange={(e) => setUserProfile(prev => ({ ...prev, industry: e.target.value }))} className="w-full py-2 px-3 border border-neutral-20 rounded-lg text-[13px] text-neutral-90 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
                        <option value="">Select</option>
                        {['Technology', 'Finance & Banking', 'Healthcare', 'Marketing & Advertising', 'Education', 'Engineering', 'Consulting', 'Retail & E-commerce', 'Media & Entertainment', 'Real Estate', 'Government', 'Non-Profit', 'Manufacturing', 'Legal', 'Energy', 'Hospitality', 'Transportation', 'Telecommunications', 'Other'].map(ind => (<option key={ind} value={ind.toLowerCase()}>{ind}</option>))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Skill gap analysis ── */}
              {uniqueJobSkills.length > 0 && (
                <div className="mb-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex-1 h-px bg-neutral-15" />
                    <span className="text-[10px] font-semibold text-neutral-30 uppercase tracking-wider">Skill match: {matchedJobSkills.length + confirmedSkills.length}/{uniqueJobSkills.length}</span>
                    <div className="flex-1 h-px bg-neutral-15" />
                  </div>

                  {/* Matched skills */}
                  {matchedJobSkills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {matchedJobSkills.slice(0, 12).map((s, i) => (
                        <span key={i} className="text-[11px] bg-green-50 border border-green-200 text-green-700 px-2 py-0.5 rounded flex items-center gap-1">
                          <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                          {s}
                        </span>
                      ))}
                      {confirmedSkills.map((s, i) => (
                        <span key={`c-${i}`} className="text-[11px] bg-green-50 border border-green-200 text-green-700 px-2 py-0.5 rounded flex items-center gap-1">
                          <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                          {s}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Missing skills — compact Yes/No */}
                  {unansweredSkills.length > 0 && (
                    <div className="space-y-1.5">
                      {unansweredSkills.map((skill) => (
                        <div key={skill} className="flex items-center justify-between bg-white rounded-lg border border-neutral-20 px-3.5 py-2.5">
                          <span className="text-[13px] font-medium text-neutral-70">{skill}</span>
                          <div className="flex items-center gap-1.5">
                            <button onClick={() => { setConfirmedSkills(prev => [...prev, skill]); setResumeData(prev => ({ ...prev, skills: [...(prev.skills || []), { id: crypto.randomUUID(), name: skill, level: 'intermediate' as const }] })); }} className="px-3 py-1 rounded-md text-[11px] font-semibold bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 transition-colors">Yes</button>
                            <button onClick={() => setRejectedSkills(prev => [...prev, skill])} className="px-3 py-1 rounded-md text-[11px] font-semibold bg-neutral-50/50 text-neutral-40 hover:bg-neutral-100 border border-neutral-20 transition-colors">No</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Rejected reassurance */}
                  {rejectedSkills.length > 0 && unansweredSkills.length === 0 && (
                    <p className="text-[11px] text-blue-600 mt-2 leading-relaxed">
                      No worries about missing skills. AI will emphasize your transferable experience and strengths instead.
                    </p>
                  )}
                </div>
              )}

              {/* ── CTA ── */}
              <Button
                size="lg"
                className="w-full"
                disabled={!canProceed}
                onClick={async () => {
                  // Save profile if first-timer
                  if (!hasProfileData) {
                    const { data: { user } } = await supabase.auth.getUser();
                    if (user) {
                      await supabase.from('profiles').update({
                        target_role: userProfile.target_role,
                        job_level: userProfile.job_level,
                        industry: userProfile.industry,
                        career_context: userProfile.career_context,
                      }).eq('id', user.id);
                    }
                  }
                  setStep('resume');
                }}
              >
                Build my optimized resume
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </Button>
              <button onClick={() => setCvUploaded(false)} className="w-full mt-2.5 text-center text-[12px] text-neutral-30 hover:text-neutral-50 transition-colors">
                Upload a different CV
              </button>
            </>
          )}
        </main>
        );
      })()}

      {/* ═════════════════════════════════════════════
          STEP 4: RESUME — Preview + Optimize
      ═════════════════════════════════════════════ */}
      {step === 'resume' && (
        <main className="max-w-[1280px] mx-auto px-6 sm:px-10 py-6 sm:py-8">
          {stepProgress}

          <div className="flex gap-6">
            {/* Left Panel — Templates + Match */}
            <div className="w-[340px] lg:w-[380px] shrink-0 hidden md:block">
              <div className="sticky top-[68px] space-y-4">

                {/* Template Picker — bigger thumbnails, 3 columns */}
                <div className="bg-white rounded-xl border border-neutral-20 shadow-sm p-5">
                  <p className="text-[11px] font-semibold text-neutral-40 uppercase tracking-wider mb-3">Choose template</p>
                  <div className="grid grid-cols-3 gap-2.5">
                    {TEMPLATE_LIST.map(t => {
                      const isSelected = selectedTemplate === t.id;
                      return (
                        <button
                          key={t.id}
                          onClick={() => { setSelectedTemplate(t.id); setResumeData(prev => ({ ...prev, templateId: t.id })); }}
                          className={cn(
                            'relative rounded-lg overflow-hidden transition-all',
                            isSelected ? 'ring-2 ring-primary ring-offset-2' : 'ring-1 ring-neutral-20 hover:ring-primary/30'
                          )}
                          title={t.name}
                        >
                          <PaperPreview data={resumeData} templateId={t.id} scale={0.12} className="!shadow-none" />
                          {isSelected && (
                            <div className="absolute top-1.5 right-1.5">
                              <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center shadow-sm">
                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                              </div>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Job Match — auto-optimizing */}
                <div className="bg-white rounded-xl border border-neutral-20 shadow-sm p-5">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-[11px] font-semibold text-neutral-40 uppercase tracking-wider">Job match</p>
                    {optimization && (
                      <button onClick={handleOptimize} className="text-[11px] text-primary hover:text-primary-dark font-medium flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                        Re-optimize
                      </button>
                    )}
                  </div>

                  {/* Optimizing state */}
                  {optimizing ? (
                    <div className="py-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="relative w-10 h-10 shrink-0">
                          <div className="w-10 h-10 border-[2.5px] border-primary/15 rounded-full" />
                          <div className="absolute inset-0 w-10 h-10 border-[2.5px] border-primary border-t-transparent rounded-full animate-spin" />
                        </div>
                        <div>
                          <p className="text-[13px] font-semibold text-neutral-90">Optimizing your resume...</p>
                          <p className="text-[11px] text-neutral-40">Tailoring keywords and bullet points</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Score */}
                      <div className="flex items-center gap-4 mb-4">
                        <MatchScoreRing score={matchAnalysis.score} />
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold text-neutral-90">
                            {matchAnalysis.score >= 75 ? 'Strong match' : matchAnalysis.score >= 50 ? 'Good potential' : 'Needs improvement'}
                          </p>
                          <p className="text-[11px] text-neutral-40 mt-0.5">
                            {matchAnalysis.matched.length} of {matchAnalysis.matched.length + matchAnalysis.missing.length} keywords matched
                          </p>
                        </div>
                      </div>

                      {/* Changes made by AI */}
                      {optimization && (optimization.changes as string[] || []).length > 0 && (
                        <div className="bg-green-50/50 rounded-lg p-3 mb-3">
                          <p className="text-[10px] font-semibold text-green-700 uppercase tracking-wider mb-1.5">AI improvements</p>
                          <ul className="space-y-1">
                            {(optimization.changes as string[]).slice(0, 4).map((c: string, i: number) => (
                              <li key={i} className="text-[11px] text-green-600 flex items-start gap-1.5">
                                <svg className="w-3 h-3 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                                {c}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Matched keywords */}
                      {matchAnalysis.matched.length > 0 && (
                        <div className="mb-3">
                          <p className="text-[10px] font-semibold text-green-600 uppercase tracking-wider mb-1.5">Matched keywords</p>
                          <div className="flex flex-wrap gap-1">
                            {matchAnalysis.matched.slice(0, 10).map((s, i) => (
                              <span key={i} className="text-[10px] font-medium bg-green-50 text-green-700 px-2 py-0.5 rounded">{s}</span>
                            ))}
                            {matchAnalysis.matched.length > 10 && <span className="text-[10px] text-neutral-30 self-center">+{matchAnalysis.matched.length - 10}</span>}
                          </div>
                        </div>
                      )}

                      {/* Missing keywords */}
                      {matchAnalysis.missing.length > 0 && (
                        <div>
                          <p className="text-[10px] font-semibold text-amber-600 uppercase tracking-wider mb-1.5">Missing</p>
                          <div className="flex flex-wrap gap-1">
                            {matchAnalysis.missing.map((s, i) => (
                              <span key={i} className="text-[10px] font-medium bg-amber-50 text-amber-700 px-2 py-0.5 rounded">{s}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Continue CTA */}
                <Button
                  onClick={handleSaveAndContinue}
                  disabled={saving || optimizing}
                  loading={saving}
                  size="lg"
                  className="w-full"
                >
                  Continue to cover letter
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </Button>

                {!hasExistingResume && (
                  <button onClick={() => setStep('analyze')} className="w-full text-[12px] text-neutral-40 hover:text-neutral-60 transition-colors py-1 text-center">
                    &larr; Upload a different resume
                  </button>
                )}
              </div>
            </div>

            {/* Right Panel — Large Resume Preview */}
            <div className="flex-1 min-w-0 flex flex-col items-center">
              <div className="w-full max-w-[640px]">
                <PaperPreview data={resumeData} templateId={selectedTemplate} scale={0.78} className="shadow-[0_2px_8px_rgba(0,0,0,0.06),0_12px_40px_rgba(0,0,0,0.08)] rounded-sm" />
                <div className="flex items-center justify-between mt-4 px-1">
                  {savedResumeId && (
                    <Link href={`/builder/${savedResumeId}`} className="text-[12px] text-neutral-40 hover:text-primary transition-colors flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      Edit in full editor
                    </Link>
                  )}
                </div>
              </div>

              {/* Mobile controls */}
              <div className="md:hidden w-full mt-6 space-y-3">
                <div className="bg-white rounded-xl border border-neutral-20 p-4">
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                    {TEMPLATE_LIST.map(t => (
                      <button key={t.id} onClick={() => { setSelectedTemplate(t.id); setResumeData(prev => ({ ...prev, templateId: t.id })); }} className={cn('shrink-0 w-[64px] rounded-md overflow-hidden', selectedTemplate === t.id ? 'ring-2 ring-primary ring-offset-1' : 'ring-1 ring-neutral-20')}>
                        <PaperPreview data={resumeData} templateId={t.id} scale={0.08} className="!shadow-none" />
                      </button>
                    ))}
                  </div>
                </div>
                {/* Mobile match score */}
                {optimizing ? (
                  <div className="bg-white rounded-xl border border-neutral-20 p-4 flex items-center gap-3">
                    <div className="relative w-8 h-8 shrink-0">
                      <div className="w-8 h-8 border-2 border-primary/15 rounded-full" />
                      <div className="absolute inset-0 w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                    <p className="text-[12px] text-primary font-medium">Optimizing for this role...</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl border border-neutral-20 p-4 flex items-center gap-3">
                    <MatchScoreRing score={matchAnalysis.score} size={40} strokeWidth={3} />
                    <div className="flex-1">
                      <p className="text-[12px] font-semibold text-neutral-70">{matchAnalysis.matched.length} of {matchAnalysis.matched.length + matchAnalysis.missing.length} keywords matched</p>
                      {matchAnalysis.missing.length > 0 && <p className="text-[10px] text-amber-500">{matchAnalysis.missing.length} missing</p>}
                    </div>
                  </div>
                )}
                <Button onClick={handleSaveAndContinue} disabled={saving || optimizing} loading={saving} size="lg" className="w-full">
                  Continue to cover letter
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </Button>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ═════════════════════════════════════════════
          STEP 2: COVER LETTER
      ═════════════════════════════════════════════ */}
      {step === 'cover-letter' && !finished && (
        <main className="max-w-[1280px] mx-auto px-6 sm:px-10 py-6 sm:py-8">
          {stepProgress}

          <div className="flex gap-8">
            {/* Left — Cover Letter Editor */}
            <div className="flex-1 min-w-0">
              <div className="bg-white rounded-xl border border-neutral-20 shadow-sm overflow-hidden">
                {/* Toolbar */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-15">
                  <div className="flex items-center gap-2">
                    <p className="text-[14px] font-semibold text-neutral-90">Cover Letter</p>
                    {coverLetterContent && !generatingCoverLetter && (
                      <span className="text-[11px] text-neutral-30 font-medium">{coverLetterContent.split(/\s+/).length} words</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    {(['professional', 'formal', 'enthusiastic'] as const).map(t => (
                      <button
                        key={t}
                        onClick={() => setCoverLetterTone(t)}
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${
                          coverLetterTone === t ? 'bg-primary text-white' : 'bg-neutral-10 text-neutral-40 hover:bg-neutral-10'
                        }`}
                      >
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </button>
                    ))}
                    <button
                      onClick={handleGenerateCoverLetter}
                      disabled={generatingCoverLetter}
                      className="ml-2 px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors disabled:opacity-50 flex items-center gap-1.5"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                      {generatingCoverLetter ? 'Writing...' : 'Regenerate'}
                    </button>
                  </div>
                </div>

                {/* Editor */}
                {generatingCoverLetter ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="relative w-8 h-8 mb-4">
                      <div className="w-8 h-8 border-2 border-primary/15 rounded-full" />
                      <div className="absolute inset-0 w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                    <p className="text-[13px] text-neutral-50">Writing a personalized cover letter...</p>
                    <p className="text-[11px] text-neutral-40 mt-1">Matching your experience to the job requirements</p>
                  </div>
                ) : (
                  <textarea
                    value={coverLetterContent}
                    onChange={e => setCoverLetterContent(e.target.value)}
                    placeholder="Your cover letter will appear here..."
                    className="w-full min-h-[480px] px-8 py-6 text-[14px] text-neutral-70 leading-[1.8] resize-none focus:outline-none placeholder:text-neutral-30"
                    style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                  />
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between mt-5">
                <button onClick={() => setStep('resume')} className="text-[13px] text-neutral-40 hover:text-neutral-60 transition-colors flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" /></svg>
                  Back to resume
                </button>
                <div className="flex items-center gap-3">
                  <Link href="/dashboard" className="text-[13px] text-neutral-40 hover:text-neutral-60 transition-colors font-medium">
                    Skip
                  </Link>
                  <Button
                    onClick={handleFinish}
                    disabled={saving || !coverLetterContent.trim()}
                    loading={saving}
                    size="lg"
                  >
                    Save &amp; finish
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </Button>
                </div>
              </div>
            </div>

            {/* Right — Context Panel */}
            <div className="w-[320px] lg:w-[340px] shrink-0 hidden md:block">
              <div className="sticky top-[68px] space-y-4">
                {/* Job Context */}
                {jobData && (
                  <div className="bg-white rounded-xl border border-neutral-20 shadow-sm p-5">
                    <p className="text-[11px] font-semibold text-neutral-40 uppercase tracking-wider mb-3">Writing for</p>
                    <p className="text-[15px] font-semibold text-neutral-90">{jobData.title}</p>
                    <p className="text-[13px] text-neutral-40 mt-0.5">{jobData.company}{jobData.location ? ` · ${jobData.location}` : ''}</p>
                    {jobData.skills?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {jobData.skills.slice(0, 6).map((s, i) => (
                          <span key={i} className="text-[10px] font-medium bg-primary/8 text-primary px-2 py-0.5 rounded-md">{s}</span>
                        ))}
                        {jobData.skills.length > 6 && <span className="text-[10px] text-neutral-30 self-center">+{jobData.skills.length - 6}</span>}
                      </div>
                    )}
                  </div>
                )}

                {/* Resume Match Summary */}
                <div className="bg-white rounded-xl border border-neutral-20 shadow-sm p-5">
                  <p className="text-[11px] font-semibold text-neutral-40 uppercase tracking-wider mb-3">Resume match</p>
                  <div className="flex items-center gap-3 mb-3">
                    <MatchScoreRing score={matchAnalysis.score} size={44} strokeWidth={3} />
                    <div>
                      <p className="text-[12px] font-semibold text-neutral-70">{matchAnalysis.matched.length} keywords matched</p>
                      {matchAnalysis.missing.length > 0 && (
                        <p className="text-[11px] text-amber-500">{matchAnalysis.missing.length} missing</p>
                      )}
                    </div>
                  </div>
                  <PaperPreview data={resumeData} templateId={selectedTemplate} scale={0.36} className="shadow-[0_1px_3px_rgba(0,0,0,0.06)] rounded-sm" />
                </div>

                {/* Key Requirements to Address */}
                {jobData?.requirements && jobData.requirements.length > 0 && (
                  <div className="bg-white rounded-xl border border-neutral-20 shadow-sm p-5">
                    <p className="text-[11px] font-semibold text-neutral-40 uppercase tracking-wider mb-3">Key requirements</p>
                    <ul className="space-y-2">
                      {jobData.requirements.slice(0, 5).map((req, i) => {
                        const reqLower = req.toLowerCase();
                        const isAddressed = coverLetterContent.toLowerCase().split(/\s+/).some(word =>
                          reqLower.split(/\s+/).filter(w => w.length > 3).some(rw => word.includes(rw))
                        );
                        return (
                          <li key={i} className="flex items-start gap-2">
                            <div className={`w-4 h-4 mt-0.5 rounded-full flex items-center justify-center shrink-0 ${
                              isAddressed ? 'bg-green-50' : 'bg-neutral-10'
                            }`}>
                              {isAddressed ? (
                                <svg className="w-2.5 h-2.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                              ) : (
                                <div className="w-1.5 h-1.5 rounded-full bg-neutral-30" />
                              )}
                            </div>
                            <span className={`text-[11px] leading-relaxed ${isAddressed ? 'text-neutral-60' : 'text-neutral-40'}`}>
                              {req.length > 65 ? req.slice(0, 63) + '...' : req}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}

                {/* Tips */}
                <div className="bg-amber-50/50 rounded-xl border border-amber-100/50 p-5">
                  <p className="text-[11px] font-semibold text-amber-600 uppercase tracking-wider mb-2">Tips</p>
                  <ul className="space-y-1.5 text-[12px] text-amber-700 leading-relaxed">
                    <li>&middot; Keep it under 300 words</li>
                    <li>&middot; Reference specific skills from the job posting</li>
                    <li>&middot; Use concrete achievements, not generic statements</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ═════════════════════════════════════════════
          SUCCESS
      ═════════════════════════════════════════════ */}
      {finished && (
        <main className="max-w-[520px] mx-auto px-5 sm:px-8 text-center py-16 sm:py-24">
          <div className="w-16 h-16 bg-green-50 rounded-xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h1 className="text-[26px] font-bold text-neutral-90 tracking-tight mb-2">
            Ready to apply
          </h1>
          <p className="text-neutral-40 text-[15px] mb-10 leading-relaxed">
            {jobData?.title && jobData?.company
              ? `Your tailored resume and cover letter for ${jobData.title} at ${jobData.company} are saved and ready.`
              : 'Your resume and cover letter are saved and ready to download.'}
          </p>
          <Button size="lg" asChild>
            <Link href="/dashboard">
              Go to dashboard
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </Link>
          </Button>
        </main>
      )}

      <UpgradeModal
        open={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        currentTier="free"
        feature={upgradeMessage}
      />
    </div>
  );
}
