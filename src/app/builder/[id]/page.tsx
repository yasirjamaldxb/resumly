'use client';

import { useState, useEffect, useCallback, useRef, useMemo, Suspense } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PersonalDetailsForm } from '@/components/resume/builder/personal-details';
import { WorkExperienceForm } from '@/components/resume/builder/work-experience';
import { EducationForm } from '@/components/resume/builder/education';
import { SkillsForm } from '@/components/resume/builder/skills';
import { AdditionalSections } from '@/components/resume/builder/additional-sections';
import { TemplatePicker } from '@/components/resume/builder/template-picker';
import { ResumeTemplate } from '@/components/resume/templates';
import { ResumeData, emptyResume } from '@/types/resume';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

interface ParsedJobData {
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

const STEPS = [
  { id: 'personal', label: 'Personal Details' },
  { id: 'experience', label: 'Professional Experience' },
  { id: 'education', label: 'Education' },
  { id: 'skills', label: 'Skills & More' },
  { id: 'additional', label: 'Additional Sections' },
];

function getScoreHints(data: ResumeData): { hint: string; weight: number }[] {
  const hints: { hint: string; weight: number }[] = [];
  const p = data.personalDetails;
  if (!p.jobTitle) hints.push({ hint: '+10% Add job title', weight: 10 });
  if (!p.firstName || !p.lastName) hints.push({ hint: '+10% Add your name', weight: 10 });
  if (!p.email) hints.push({ hint: '+10% Add email address', weight: 10 });
  if (!p.phone) hints.push({ hint: '+5% Add phone number', weight: 5 });
  if (!p.location) hints.push({ hint: '+5% Add location', weight: 5 });
  if (!p.summary || p.summary.length <= 50) hints.push({ hint: '+15% Add profile summary', weight: 15 });
  if (data.workExperience.length === 0) hints.push({ hint: '+20% Add employment history', weight: 20 });
  if (data.education.length === 0) hints.push({ hint: '+10% Add education', weight: 10 });
  if (data.skills.length < 5) hints.push({ hint: '+15% Add skills', weight: 15 });
  if (!data.languages || data.languages.length === 0) hints.push({ hint: '+3% Add languages', weight: 3 });
  return hints;
}

function getStepHint(stepIndex: number, data: ResumeData): string | null {
  const hints = getScoreHints(data);
  if (hints.length === 0) return null;

  const stepId = STEPS[stepIndex]?.id;
  // Return the most relevant hint for the current step
  const stepHintMap: Record<string, string[]> = {
    personal: ['+10% Add job title', '+10% Add your name', '+10% Add email address', '+5% Add phone number', '+5% Add location', '+15% Add profile summary'],
    experience: ['+20% Add employment history'],
    education: ['+10% Add education'],
    skills: ['+15% Add skills'],
    additional: ['+3% Add languages'],
  };

  const relevantPhrases = stepHintMap[stepId || ''] || [];
  const match = hints.find((h) => relevantPhrases.includes(h.hint));
  if (match) return match.hint;

  // Fallback: return the highest-weight hint
  return hints.sort((a, b) => b.weight - a.weight)[0]?.hint || null;
}

export default function BuilderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f7f9fc] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-[3px] border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-50 font-medium text-[15px]">Loading your resume...</p>
        </div>
      </div>
    }>
      <BuilderPageInner />
    </Suspense>
  );
}

function BuilderPageInner() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(0); // 0-indexed now (0-3)
  const [activeTab, setActiveTab] = useState<'edit' | 'customize'>('edit');
  const [resumeData, setResumeData] = useState<ResumeData>(emptyResume());
  const [previewVisible, setPreviewVisible] = useState(true);
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [atsScore, setAtsScore] = useState(0);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [showAtsBanner, setShowAtsBanner] = useState(false);
  const [jobData, setJobData] = useState<ParsedJobData | null>(null);
  const [jobLoading, setJobLoading] = useState(false);
  const [jobError, setJobError] = useState<string | null>(null);
  const [jobPanelOpen, setJobPanelOpen] = useState(true);
  const [showGetStarted, setShowGetStarted] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const prevAtsScore = useRef(0);
  const previewRef = useRef<HTMLDivElement>(null);
  const formPanelRef = useRef<HTMLDivElement>(null);
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load saved resume data from Supabase
  useEffect(() => {
    const loadResume = async () => {
      const resumeId = params.id as string;
      if (!resumeId || resumeId === 'new') {
        setLoading(false);
        return;
      }
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setLoading(false); return; }
        const { data: resume } = await supabase
          .from('resumes')
          .select('*')
          .eq('id', resumeId)
          .eq('user_id', user.id)
          .single();
        if (resume?.resume_data) {
          const saved = resume.resume_data as ResumeData;
          setResumeData({ ...saved, id: resume.id });
        }
      } catch {
        // If loading fails, start with empty resume
      } finally {
        setLoading(false);
      }
    };
    loadResume();
  }, [params.id]);

  // Show "Let's get started" modal for new resumes
  useEffect(() => {
    const resumeId = params.id as string;
    if (resumeId === 'new' && !loading) {
      setShowGetStarted(true);
    }
  }, [params.id, loading]);

  // Parse job URL from query param (with localStorage fallback for blocked sites)
  useEffect(() => {
    const jobUrl = searchParams.get('job');
    if (!jobUrl) return;

    // Check if job context was already parsed (saved by job-preview page)
    try {
      const stored = localStorage.getItem('resumly_job_context');
      if (stored) {
        const ctx = JSON.parse(stored);
        if (ctx?.url === jobUrl && ctx?.title) {
          // We already have parsed data from job-preview — use it directly
          setJobData({
            title: ctx.title,
            company: ctx.company || null,
            location: null,
            description: null,
            requirements: [],
            skills: ctx.skills || [],
            keywords: ctx.keywords || [],
            experience: null,
            salary: null,
          });
          if (ctx.title) {
            setResumeData(prev => {
              if (!prev.personalDetails.jobTitle) {
                return { ...prev, personalDetails: { ...prev.personalDetails, jobTitle: ctx.title } };
              }
              return prev;
            });
          }
          return;
        }
      }
    } catch {}

    // Blocked sites — don't try to re-fetch
    const isBlocked = /linkedin\.com|indeed\.com|glassdoor\.com|monster\.com|ziprecruiter\.com/i.test(jobUrl);
    if (isBlocked) return;

    const parseJob = async () => {
      setJobLoading(true);
      setJobError(null);
      try {
        const res = await fetch('/api/jobs/parse', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: jobUrl }),
        });
        const data = await res.json();
        if (!res.ok) {
          setJobError(data.error || 'Failed to parse job listing');
          return;
        }
        setJobData(data.job);
        // Pre-fill job title if empty
        setResumeData(prev => {
          if (!prev.personalDetails.jobTitle && data.job?.title) {
            return {
              ...prev,
              personalDetails: { ...prev.personalDetails, jobTitle: data.job.title },
            };
          }
          return prev;
        });
      } catch {
        setJobError('Failed to connect to job parser');
      } finally {
        setJobLoading(false);
      }
    };
    parseJob();
  }, [searchParams]);

  // Auto-calculate ATS score
  useEffect(() => {
    const p = resumeData.personalDetails;
    let score = 0;
    if (p.firstName && p.lastName) score += 10;
    if (p.email) score += 10;
    if (p.phone) score += 5;
    if (p.jobTitle) score += 10;
    if (p.location) score += 5;
    if (p.summary && p.summary.length > 50) score += 15;
    if (resumeData.workExperience.length > 0) score += 20;
    if (resumeData.education.length > 0) score += 10;
    if (resumeData.skills.length >= 5) score += 15;
    const newScore = Math.min(score, 100);
    if (newScore === 100 && prevAtsScore.current < 100) setShowAtsBanner(true);
    prevAtsScore.current = newScore;
    setAtsScore(newScore);
  }, [resumeData]);

  // Auto-save with status indicator
  const autoSave = useCallback(async (data: ResumeData) => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    setSaveStatus('saving');
    saveTimeout.current = setTimeout(async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const res = await fetch('/api/resume/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...data, userId: user.id }),
        });
        if (res.ok) {
          const json = await res.json();
          if (json.id && !data.id) {
            // New resume saved — update URL without reload
            window.history.replaceState(null, '', `/builder/${json.id}`);
            data.id = json.id;
          }
          setSaveStatus('saved');
          setTimeout(() => setSaveStatus('idle'), 2000);
        }
      } catch {
        setSaveStatus('idle');
      }
    }, 1500);
  }, []);

  const handleDataChange = (data: ResumeData) => {
    setResumeData(data);
    autoSave(data);
  };

  const downloadPDF = async () => {
    setDownloading(true);
    try {
      const firstName = resumeData.personalDetails.firstName || 'resume';
      const lastName = resumeData.personalDetails.lastName || '';
      const filename = [firstName, lastName].filter(Boolean).join('_') + '_resume.pdf';

      // Server-side: send resumeData → server renders SAME React template
      // with renderToStaticMarkup → Puppeteer generates real-text PDF
      const res = await fetch('/api/resume/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeData }),
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        // Track PDF download for email drip campaign
        fetch('/api/email/track-action', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'downloaded_pdf' }),
        }).catch(() => {});
        return;
      }

      // Server failed — log the error and retry once
      const errBody = await res.json().catch(() => ({ error: 'Unknown error' }));
      console.error('Server PDF error:', errBody);

      // One retry — cold starts on Lambda can cause first attempt to timeout
      console.log('Retrying PDF generation...');
      const retryRes = await fetch('/api/resume/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeData }),
      });

      if (retryRes.ok) {
        const blob = await retryRes.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        return;
      }

      // Both attempts failed — show error
      const retryErr = await retryRes.json().catch(() => ({ error: 'Unknown error' }));
      console.error('Retry also failed:', retryErr);
      alert('PDF generation is temporarily unavailable. Please try again in a moment.');
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('PDF generation failed. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const scoreColor = atsScore >= 80 ? '#22a861' : atsScore >= 50 ? '#f59e0b' : '#ef4444';
  const currentHint = useMemo(() => getStepHint(step, resumeData), [step, resumeData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f9fc] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-[3px] border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-50 font-medium text-[15px]">Loading your resume...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f9fc] flex flex-col">
      {/* Minimal top bar — no site header */}
      <header className="bg-white border-b border-neutral-20 sticky top-0 z-40">
        <div className="max-w-full px-3 sm:px-5 h-[52px] flex items-center justify-between gap-2">
          {/* Logo only */}
          <Link href="/dashboard" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">R</span>
            </div>
            <span className="font-semibold text-neutral-90 text-[15px] tracking-tight">resumly<span className="text-primary">.app</span></span>
          </Link>

          {/* Right actions */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* ATS Score badge */}
            <div className="hidden sm:flex items-center gap-1.5">
              <span
                className="text-[12px] font-bold px-2 py-0.5 rounded"
                style={{ backgroundColor: scoreColor, color: '#fff' }}
              >
                ATS {atsScore}%
              </span>
            </div>

            <button
              onClick={() => setPreviewVisible(!previewVisible)}
              className="p-2 text-neutral-50 hover:bg-neutral-10 rounded-lg lg:hidden"
              aria-label="Toggle preview"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>

            <Button size="sm" onClick={downloadPDF} loading={downloading} className="gap-1.5 text-[13px]">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span className="hidden sm:inline">Download PDF</span>
            </Button>
          </div>
        </div>
      </header>

      {/* 100% ATS completion modal */}
      {showAtsBanner && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAtsBanner(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-[480px] w-full p-8 relative" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowAtsBanner(false)} className="absolute top-4 right-4 text-neutral-30 hover:text-neutral-60 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <div className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 text-[12px] font-bold px-3 py-1 rounded-full mb-3">
                ATS Score: 100%
              </div>
              <h2 className="text-[22px] font-semibold text-neutral-90 tracking-tight mb-2">Your resume is ready!</h2>
              <p className="text-neutral-50 text-[14px]">You&apos;ve completed all sections. Download your resume or take the next step.</p>
            </div>
            <div className="space-y-3">
              <Button size="lg" className="w-full gap-2" onClick={() => { setShowAtsBanner(false); downloadPDF(); }}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Download PDF
              </Button>
              <Link href="/cover-letter-builder" className="flex items-center justify-center gap-2 w-full rounded-lg border border-neutral-20 bg-white hover:bg-neutral-10 transition-colors px-4 py-2.5 text-[14px] font-semibold text-neutral-70">
                <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                Create a matching cover letter
              </Link>
              <Link href="/ats-checker" className="flex items-center justify-center gap-2 w-full rounded-lg border border-neutral-20 bg-white hover:bg-neutral-10 transition-colors px-4 py-2.5 text-[14px] font-semibold text-neutral-70">
                <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                Check ATS score against a job posting
              </Link>
              <button onClick={() => setShowAtsBanner(false)} className="w-full text-[13px] text-neutral-40 hover:text-neutral-60 py-1 transition-colors">
                Continue editing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* "Let's get started" modal — Step 2 of funnel */}
      {showGetStarted && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-[480px] w-full p-7 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowGetStarted(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-10 text-neutral-40 hover:text-neutral-60 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            <div className="text-center mb-6">
              <h2 className="text-[22px] font-bold text-neutral-90 tracking-tight mb-1.5">Let&apos;s get started</h2>
              <p className="text-[14px] text-neutral-50">How do you want to create your resume?</p>
            </div>

            {/* Job context — if we have it */}
            {jobData?.title && (
              <div className="flex items-center gap-2.5 bg-primary/5 border border-primary/15 rounded-xl px-4 py-3 mb-5">
                <svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <p className="text-[13px] text-neutral-70">
                  Tailoring for{' '}
                  <span className="font-semibold text-neutral-90">{jobData.title}</span>
                  {jobData.company ? <span className="text-neutral-50"> at {jobData.company}</span> : ''}
                </p>
              </div>
            )}

            <div className="space-y-2.5">
              {/* Create new resume */}
              <button
                onClick={() => setShowGetStarted(false)}
                className="w-full flex items-center gap-4 bg-neutral-5 hover:bg-primary/5 border border-neutral-15 hover:border-primary/20 rounded-xl px-5 py-4 transition-all group"
              >
                <div className="w-10 h-10 bg-white rounded-lg border border-neutral-15 flex items-center justify-center flex-shrink-0 group-hover:border-primary/30">
                  <svg className="w-5 h-5 text-neutral-60 group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </div>
                <div className="text-left flex-1">
                  <span className="text-[15px] font-semibold text-neutral-90 block">Create new resume</span>
                  <span className="text-[12px] text-neutral-50">Start from scratch, step by step</span>
                </div>
                <svg className="w-4 h-4 text-neutral-30 group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </button>

              {/* Upload resume */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingResume}
                className="w-full flex items-center gap-4 bg-neutral-5 hover:bg-primary/5 border border-neutral-15 hover:border-primary/20 rounded-xl px-5 py-4 transition-all group disabled:opacity-60"
              >
                <div className="w-10 h-10 bg-white rounded-lg border border-neutral-15 flex items-center justify-center flex-shrink-0 group-hover:border-primary/30">
                  {uploadingResume ? (
                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg className="w-5 h-5 text-neutral-60 group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                  )}
                </div>
                <div className="text-left flex-1">
                  <span className="text-[15px] font-semibold text-neutral-90 block">{uploadingResume ? 'Parsing your resume...' : 'Upload resume'}</span>
                  <span className="text-[12px] text-neutral-50">{uploadingResume ? 'Extracting your details' : 'Import from PDF or Word document'}</span>
                </div>
                {!uploadingResume && <svg className="w-4 h-4 text-neutral-30 group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setUploadingResume(true);
                  try {
                    const formData = new FormData();
                    formData.append('file', file);
                    const res = await fetch('/api/resume/parse-upload', { method: 'POST', body: formData });
                    const json = await res.json();
                    if (res.ok && json.data) {
                      const d = json.data;
                      setResumeData(prev => ({
                        ...prev,
                        personalDetails: {
                          ...prev.personalDetails,
                          firstName: d.personalDetails.firstName || prev.personalDetails.firstName,
                          lastName: d.personalDetails.lastName || prev.personalDetails.lastName,
                          jobTitle: d.personalDetails.jobTitle || prev.personalDetails.jobTitle,
                          email: d.personalDetails.email || prev.personalDetails.email,
                          phone: d.personalDetails.phone || prev.personalDetails.phone,
                          location: d.personalDetails.location || prev.personalDetails.location,
                          linkedIn: d.personalDetails.linkedIn || prev.personalDetails.linkedIn,
                          website: d.personalDetails.website || prev.personalDetails.website,
                          summary: d.personalDetails.summary || prev.personalDetails.summary,
                        },
                        workExperience: d.workExperience?.length ? d.workExperience : prev.workExperience,
                        education: d.education?.length ? d.education : prev.education,
                        skills: d.skills?.length ? d.skills : prev.skills,
                      }));
                      setShowGetStarted(false);
                    } else {
                      alert(json.error || 'Could not parse the resume file');
                    }
                  } catch {
                    alert('Failed to upload resume. Please try again.');
                  } finally {
                    setUploadingResume(false);
                    e.target.value = '';
                  }
                }}
              />

              {/* Create with LinkedIn profile */}
              <button
                onClick={() => setShowGetStarted(false)}
                className="w-full flex items-center gap-4 bg-neutral-5 hover:bg-primary/5 border border-neutral-15 hover:border-primary/20 rounded-xl px-5 py-4 transition-all group"
              >
                <div className="w-10 h-10 bg-white rounded-lg border border-neutral-15 flex items-center justify-center flex-shrink-0 group-hover:border-primary/30">
                  <svg className="w-5 h-5 text-neutral-60 group-hover:text-[#0077B5] transition-colors" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </div>
                <div className="text-left flex-1">
                  <span className="text-[15px] font-semibold text-neutral-90 block">Create with LinkedIn profile</span>
                  <span className="text-[12px] text-neutral-50">Import your work history automatically</span>
                </div>
                <svg className="w-4 h-4 text-neutral-30 group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </button>

              {/* Create from example */}
              <button
                onClick={() => { setShowGetStarted(false); router.push('/resume-examples'); }}
                className="w-full flex items-center gap-4 bg-neutral-5 hover:bg-primary/5 border border-neutral-15 hover:border-primary/20 rounded-xl px-5 py-4 transition-all group"
              >
                <div className="w-10 h-10 bg-white rounded-lg border border-neutral-15 flex items-center justify-center flex-shrink-0 group-hover:border-primary/30">
                  <svg className="w-5 h-5 text-neutral-60 group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                <div className="text-left flex-1">
                  <span className="text-[15px] font-semibold text-neutral-90 block">Create from example</span>
                  <span className="text-[12px] text-neutral-50">Browse resume examples for your industry</span>
                </div>
                <svg className="w-4 h-4 text-neutral-30 group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Form Panel — flex column: header + scrollable content + fixed bottom nav */}
        <div className={cn(
          'w-full lg:w-[55%] xl:w-[57%] flex-shrink-0 flex flex-col bg-white border-r border-neutral-20',
          previewVisible ? 'hidden lg:block lg:flex' : 'flex'
        )}>
          {/* Scrollable area */}
          <div ref={formPanelRef} className="flex-1 overflow-y-auto">
          {/* Edit / Customize Tabs */}
          <div className="sticky top-0 z-20 bg-white border-b border-neutral-20">
            <div className="flex justify-center pt-3 pb-0">
              <div className="flex gap-0 bg-neutral-10 rounded-full p-[3px]">
                <button
                  onClick={() => setActiveTab('edit')}
                  className={cn(
                    'px-5 py-[7px] rounded-full text-[13px] font-semibold transition-all',
                    activeTab === 'edit'
                      ? 'bg-white text-neutral-90 shadow-sm'
                      : 'text-neutral-50 hover:text-neutral-70'
                  )}
                >
                  Edit
                </button>
                <button
                  onClick={() => setActiveTab('customize')}
                  className={cn(
                    'px-5 py-[7px] rounded-full text-[13px] font-semibold transition-all',
                    activeTab === 'customize'
                      ? 'bg-white text-neutral-90 shadow-sm'
                      : 'text-neutral-50 hover:text-neutral-70'
                  )}
                >
                  Customize
                </button>
              </div>
            </div>

            {/* Resume Score Bar — resume.io style horizontal bar */}
            {activeTab === 'edit' && (
              <div className="px-5 pt-3 pb-3">
                <div className="flex items-center gap-3">
                  {/* Percentage badge */}
                  <span
                    className="flex-shrink-0 text-[12px] font-bold text-white px-2 py-0.5 rounded"
                    style={{ backgroundColor: scoreColor }}
                  >
                    {atsScore}%
                  </span>
                  {/* Label + progress bar + hint */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <span className="text-[12px] font-medium text-neutral-60 whitespace-nowrap">Your resume score</span>
                      <div className="flex-1 h-[4px] bg-neutral-15 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500 ease-out"
                          style={{ width: `${atsScore}%`, backgroundColor: scoreColor }}
                        />
                      </div>
                      {currentHint && (
                        <span className="text-[11px] font-medium text-primary whitespace-nowrap flex-shrink-0">{currentHint}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Collapsed job indicator */}
          {activeTab === 'edit' && jobData && !jobPanelOpen && !jobLoading && (
            <div className="px-5 pt-2 sm:px-6">
              <button
                onClick={() => setJobPanelOpen(true)}
                className="flex items-center gap-2 text-[12px] text-primary hover:text-primary-dark font-medium transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Tailoring for: {jobData.title} at {jobData.company} — Show keywords
              </button>
            </div>
          )}

          {/* Job context banner */}
          {activeTab === 'edit' && (jobLoading || jobError || (jobData && jobPanelOpen)) && (
            <div className="px-5 pt-3 sm:px-6">
              {jobLoading && (
                <div className="flex items-center gap-3 bg-primary/5 border border-primary/15 rounded-lg px-4 py-3">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin flex-shrink-0" />
                  <span className="text-[13px] text-neutral-60">Analyzing job listing...</span>
                </div>
              )}
              {jobError && (
                <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                  <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span className="text-[13px] text-red-700">{jobError}</span>
                </div>
              )}
              {jobData && jobPanelOpen && !jobLoading && (
                <div className="bg-primary/5 border border-primary/15 rounded-lg p-4">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-[13px] font-semibold text-neutral-90">Tailoring for: {jobData.title}</span>
                    </div>
                    <button
                      onClick={() => setJobPanelOpen(false)}
                      className="text-neutral-40 hover:text-neutral-60 transition-colors flex-shrink-0"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                  </div>
                  {jobData.company && (
                    <p className="text-[12px] text-neutral-60 mb-2">
                      {jobData.company}{jobData.location ? ` — ${jobData.location}` : ''}
                    </p>
                  )}
                  {jobData.keywords && jobData.keywords.length > 0 && (
                    <div>
                      <p className="text-[11px] font-medium text-neutral-50 mb-1.5">Include these keywords in your resume:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {jobData.keywords.slice(0, 12).map((keyword, i) => (
                          <span key={i} className="px-2 py-0.5 bg-white border border-primary/20 rounded text-[10px] text-primary font-medium">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {jobData.skills && jobData.skills.length > 0 && (
                    <div className="mt-2">
                      <p className="text-[11px] font-medium text-neutral-50 mb-1.5">Key skills to highlight:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {jobData.skills.slice(0, 8).map((skill, i) => (
                          <span key={i} className="px-2 py-0.5 bg-white border border-neutral-20 rounded text-[10px] text-neutral-70 font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Form content */}
          <div className="px-5 pt-5 pb-32 sm:px-6 sm:pt-6 sm:pb-32">
            {activeTab === 'customize' ? (
              <TemplatePicker data={resumeData} onChange={handleDataChange} />
            ) : (
              <>
                {step === 0 && <PersonalDetailsForm data={resumeData} onChange={handleDataChange} />}
                {step === 1 && <WorkExperienceForm data={resumeData} onChange={handleDataChange} />}
                {step === 2 && <EducationForm data={resumeData} onChange={handleDataChange} />}
                {step === 3 && <SkillsForm data={resumeData} onChange={handleDataChange} />}
                {step === 4 && <AdditionalSections data={resumeData} onChange={handleDataChange} />}
              </>
            )}
          </div>

          </div>{/* end scrollable area */}

          {/* Bottom navigation bar — OUTSIDE scroll area, always visible */}
          {activeTab === 'edit' && (
            <div className="flex-shrink-0 bg-white border-t border-neutral-20 px-5 sm:px-6 py-3 z-30">
              <div className="flex items-center justify-between gap-3">
                {/* Back button — text style with border */}
                <button
                  onClick={() => { setStep(Math.max(0, step - 1)); formPanelRef.current?.scrollTo({ top: 0 }); }}
                  disabled={step === 0}
                  className={cn(
                    'flex-shrink-0 text-[13px] font-semibold px-4 py-2 rounded-lg border transition-colors',
                    step === 0
                      ? 'text-neutral-30 border-neutral-15 cursor-not-allowed'
                      : 'text-primary border-primary/30 hover:bg-primary/5'
                  )}
                >
                  Back
                </button>

                {/* Step dot indicators */}
                <div className="flex items-center gap-2">
                  {STEPS.map((s, i) => (
                    <button
                      key={s.id}
                      onClick={() => { setStep(i); formPanelRef.current?.scrollTo({ top: 0 }); }}
                      className="group p-1"
                      aria-label={`Go to ${s.label}`}
                    >
                      <div
                        className={cn(
                          'w-2 h-2 rounded-full transition-all',
                          i === step
                            ? 'bg-primary scale-125'
                            : i < step
                            ? 'bg-primary/40'
                            : 'bg-neutral-20 group-hover:bg-neutral-30'
                        )}
                      />
                    </button>
                  ))}
                </div>

                {/* Next / Download button + Saved indicator */}
                <div className="flex items-center gap-2.5 flex-shrink-0">
                  {/* Saved status */}
                  <div className="hidden sm:flex items-center gap-1 text-[12px]">
                    {saveStatus === 'saving' && (
                      <span className="text-neutral-40 flex items-center gap-1">
                        <div className="w-3 h-3 border-[1.5px] border-neutral-30 border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </span>
                    )}
                    {saveStatus === 'saved' && (
                      <span className="text-green-600 flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        Saved
                      </span>
                    )}
                  </div>

                  {step < STEPS.length - 1 ? (
                    <Button
                      size="sm"
                      onClick={() => { setStep(step + 1); formPanelRef.current?.scrollTo({ top: 0 }); }}
                      className="gap-1 px-5"
                    >
                      Next: {STEPS[step + 1]?.label}
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                    </Button>
                  ) : (
                    <Button size="sm" onClick={downloadPDF} loading={downloading} className="gap-1.5 px-5">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download PDF
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Preview Panel */}
        <div className={cn(
          'flex-1 bg-[#f0f2f5] overflow-auto p-4 sm:p-6',
          !previewVisible ? 'hidden lg:block' : 'block'
        )}>
          <div className="sticky top-0 z-10 flex justify-end mb-3">
            <button
              onClick={() => setPreviewVisible(!previewVisible)}
              className="lg:hidden bg-white rounded-lg px-3 py-1.5 text-[13px] font-medium text-neutral-70 shadow-sm border border-neutral-20"
            >
              Back to Edit
            </button>
          </div>

          <div
            ref={previewRef}
            className="bg-white shadow-lg mx-auto rounded-sm"
            style={{ width: '794px', maxWidth: '100%', transformOrigin: 'top center' }}
            id="resume-preview"
          >
            <ResumeTemplate data={resumeData} />
          </div>

          {/* Page count dark pill — bottom right */}
          <div className="flex justify-end mt-4 pr-2">
            <div className="inline-flex items-center gap-1.5 bg-neutral-90 text-white text-[12px] font-medium px-3 py-1.5 rounded-full shadow-lg">
              <button className="hover:text-neutral-30 transition-colors" aria-label="Previous page">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <span>1 / 1</span>
              <button className="hover:text-neutral-30 transition-colors" aria-label="Next page">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
