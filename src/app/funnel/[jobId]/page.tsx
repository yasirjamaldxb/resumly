'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';
import { TEMPLATE_LIST, emptyResume, type ResumeData } from '@/types/resume';
import { TemplatePreview } from '@/components/resume/template-preview';

// ══════════════════════════════════════════════
// Types
// ══════════════════════════════════════════════

type FunnelStep = 'profile' | 'source' | 'template' | 'optimize' | 'done';

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

interface UserProfile {
  job_level: string | null;
  industry: string | null;
  years_experience: number | null;
  target_role: string | null;
  preferred_location: string | null;
  onboarding_complete: boolean;
}

// ══════════════════════════════════════════════
// Main Funnel Component
// ══════════════════════════════════════════════

export default function FunnelPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.jobId as string;

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // State
  const [step, setStep] = useState<FunnelStep>('profile');
  const [loading, setLoading] = useState(true);
  const [jobData, setJobData] = useState<JobData | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [resumeData, setResumeData] = useState<ResumeData>(emptyResume());
  const [selectedTemplate, setSelectedTemplate] = useState('ats-pro');
  const [optimizing, setOptimizing] = useState(false);
  const [optimization, setOptimization] = useState<Record<string, unknown> | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedResumeId, setSavedResumeId] = useState<string | null>(null);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [generatingResume, setGeneratingResume] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    job_level: '',
    industry: '',
    years_experience: '',
    target_role: '',
  });

  // ── Load job + profile data ──
  useEffect(() => {
    async function loadData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/auth/login');
          return;
        }

        // Load job
        const { data: job } = await supabase
          .from('jobs')
          .select('*')
          .eq('id', jobId)
          .single();

        if (!job) {
          router.push('/dashboard');
          return;
        }
        setJobData(job);

        // Load profile
        const { data: prof } = await supabase
          .from('profiles')
          .select('job_level, industry, years_experience, target_role, preferred_location, onboarding_complete')
          .eq('id', user.id)
          .single();

        setProfile(prof);

        // Skip profile step if already completed
        if (prof?.onboarding_complete) {
          setStep('source');
        }
      } catch {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [jobId, router, supabase]);

  // ── Profile submit ──
  const handleProfileSubmit = async () => {
    setLoading(true);
    try {
      await fetch('/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...profileForm,
          years_experience: profileForm.years_experience ? parseInt(profileForm.years_experience) : null,
          onboarding_complete: true,
        }),
      });
      setProfile(prev => ({
        ...prev!,
        onboarding_complete: true,
        job_level: profileForm.job_level,
        industry: profileForm.industry,
        years_experience: profileForm.years_experience ? parseInt(profileForm.years_experience) : null,
        target_role: profileForm.target_role,
      }));
      setStep('source');
    } catch {
      setError('Failed to save profile');
    } finally {
      setLoading(false);
    }
  };

  // ── Upload resume file ──
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
      setResumeData(prev => ({
        ...prev,
        personalDetails: { ...prev.personalDetails, ...parsed.personalDetails },
        workExperience: parsed.workExperience?.length ? parsed.workExperience : prev.workExperience,
        education: parsed.education?.length ? parsed.education : prev.education,
        skills: parsed.skills?.length ? parsed.skills : prev.skills,
        certifications: parsed.certifications || prev.certifications,
        languages: parsed.languages || prev.languages,
        projects: parsed.projects || prev.projects,
      }));
      setStep('template');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse resume');
    } finally {
      setUploadingResume(false);
    }
  };

  // ── Generate resume with AI ──
  const handleAIGenerate = async () => {
    setGeneratingResume(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/generate-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobData, profile }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Generation failed');

      setResumeData(prev => ({
        ...prev,
        personalDetails: { ...prev.personalDetails, ...result.data.personalDetails },
        workExperience: result.data.workExperience || [],
        education: result.data.education || [],
        skills: result.data.skills || [],
      }));
      setStep('template');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate resume');
    } finally {
      setGeneratingResume(false);
    }
  };

  // ── Skip to template with empty resume ──
  const handleStartFromScratch = () => {
    setStep('template');
  };

  // ── Template selection → optimize ──
  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    setResumeData(prev => ({ ...prev, templateId }));
  };

  const handleTemplateConfirm = () => {
    setStep('optimize');
  };

  // ── AI Optimize ──
  const handleOptimize = useCallback(async () => {
    setOptimizing(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeData, jobData }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Optimization failed');

      const opt = result.optimization;
      setOptimization(opt);

      // Apply optimizations to resume
      setResumeData(prev => {
        const updated = { ...prev };
        if (opt.summary) {
          updated.personalDetails = { ...updated.personalDetails, summary: opt.summary };
        }
        if (opt.jobTitle) {
          updated.personalDetails = { ...updated.personalDetails, jobTitle: opt.jobTitle };
        }
        if (opt.skills?.length) {
          updated.skills = opt.skills.map((name: string) => ({
            id: crypto.randomUUID(),
            name,
            level: 'intermediate' as const,
          }));
        }
        if (opt.bulletImprovements?.length) {
          const exp = [...updated.workExperience];
          for (const improvement of opt.bulletImprovements) {
            const entry = exp[improvement.experienceIndex];
            if (entry && entry.bullets[improvement.bulletIndex] !== undefined) {
              entry.bullets[improvement.bulletIndex] = improvement.improved;
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
  }, [resumeData, jobData]);

  // ── Save resume + create application ──
  const handleSaveAndFinish = async () => {
    setSaving(true);
    setError(null);
    try {
      // Save resume
      const saveRes = await fetch('/api/resume/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...resumeData,
          templateId: selectedTemplate,
          jobId: jobId,
          title: jobData?.title ? `Resume for ${jobData.title}` : 'My Resume',
        }),
      });
      const saveResult = await saveRes.json();
      if (!saveRes.ok) throw new Error(saveResult.error || 'Save failed');

      setSavedResumeId(saveResult.id);

      // Create application
      await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          job_id: jobId,
          resume_id: saveResult.id,
          status: 'draft',
        }),
      });

      setStep('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  // ── Calculate ATS score ──
  const atsScore = (() => {
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
    return Math.min(score, 100);
  })();

  // ══════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════

  if (loading && !jobData) {
    return (
      <div className="min-h-screen bg-[#f7f9fc] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const steps: FunnelStep[] = ['profile', 'source', 'template', 'optimize', 'done'];
  const currentIdx = steps.indexOf(step);

  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      {/* Header */}
      <header className="bg-white border-b border-neutral-20 sticky top-0 z-40">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 h-[64px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="font-semibold text-neutral-90 tracking-tight text-[17px]">resumly<span className="text-primary">.app</span></span>
          </Link>
          {jobData?.title && (
            <div className="text-[13px] text-neutral-50 hidden sm:block">
              Applying for <span className="font-medium text-neutral-70">{jobData.title}</span>
              {jobData.company && <span> at {jobData.company}</span>}
            </div>
          )}
        </div>
      </header>

      {/* Progress bar */}
      {step !== 'done' && (
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 pt-6 pb-2">
          <div className="flex items-center gap-2">
            {['Profile', 'Resume Source', 'Template', 'Optimize'].map((label, i) => (
              <div key={label} className="flex-1">
                <div className={`h-1.5 rounded-full transition-colors ${
                  i <= currentIdx - (profile?.onboarding_complete ? 1 : 0)
                    ? 'bg-primary'
                    : 'bg-neutral-20'
                }`} />
                <div className={`text-[11px] mt-1 ${i <= currentIdx ? 'text-primary font-medium' : 'text-neutral-40'}`}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 mt-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-[14px]">
            {error}
            <button onClick={() => setError(null)} className="ml-2 text-red-500 hover:text-red-700 font-medium">Dismiss</button>
          </div>
        </div>
      )}

      <main className="max-w-[800px] mx-auto px-4 sm:px-6 py-8">
        {/* ─── STEP: PROFILE ─── */}
        {step === 'profile' && !profile?.onboarding_complete && (
          <div className="bg-white rounded-2xl border border-neutral-20 p-6 sm:p-8">
            <h1 className="text-[24px] sm:text-[28px] font-medium text-neutral-90 tracking-tight mb-2">
              Tell us about yourself
            </h1>
            <p className="text-neutral-50 text-[15px] mb-8">
              This helps us create the perfect resume for your career level.
            </p>

            <div className="space-y-5">
              <div>
                <label className="block text-[14px] font-medium text-neutral-70 mb-2">Career Level</label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {['student', 'entry', 'mid', 'senior', 'executive'].map(level => (
                    <button
                      key={level}
                      onClick={() => setProfileForm(p => ({ ...p, job_level: level }))}
                      className={`px-3 py-2.5 rounded-xl border text-[14px] font-medium transition-all ${
                        profileForm.job_level === level
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-neutral-20 text-neutral-60 hover:border-neutral-30'
                      }`}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[14px] font-medium text-neutral-70 mb-2">Industry</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['tech', 'finance', 'healthcare', 'marketing', 'education', 'engineering', 'design', 'other'].map(ind => (
                    <button
                      key={ind}
                      onClick={() => setProfileForm(p => ({ ...p, industry: ind }))}
                      className={`px-3 py-2.5 rounded-xl border text-[14px] font-medium transition-all ${
                        profileForm.industry === ind
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-neutral-20 text-neutral-60 hover:border-neutral-30'
                      }`}
                    >
                      {ind.charAt(0).toUpperCase() + ind.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[14px] font-medium text-neutral-70 mb-2">Years of Experience</label>
                <div className="grid grid-cols-5 gap-2">
                  {['0-1', '1-3', '3-5', '5-10', '10+'].map(yr => (
                    <button
                      key={yr}
                      onClick={() => setProfileForm(p => ({ ...p, years_experience: yr.replace('+', '') }))}
                      className={`px-3 py-2.5 rounded-xl border text-[14px] font-medium transition-all ${
                        profileForm.years_experience === yr.replace('+', '')
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-neutral-20 text-neutral-60 hover:border-neutral-30'
                      }`}
                    >
                      {yr}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleProfileSubmit}
              disabled={!profileForm.job_level || !profileForm.industry}
              className="mt-8 w-full bg-primary text-white py-3 rounded-xl font-medium text-[15px] hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        )}

        {/* ─── STEP: SOURCE ─── */}
        {step === 'source' && (
          <div className="bg-white rounded-2xl border border-neutral-20 p-6 sm:p-8">
            <h1 className="text-[24px] sm:text-[28px] font-medium text-neutral-90 tracking-tight mb-2">
              How do you want to create your resume?
            </h1>
            <p className="text-neutral-50 text-[15px] mb-8">
              Upload an existing resume or let AI create one from the job description.
            </p>

            <div className="grid gap-3">
              {/* Upload CV */}
              <label className={`flex items-center gap-4 p-4 rounded-xl border-2 border-dashed cursor-pointer transition-all hover:border-primary hover:bg-primary/[0.02] ${uploadingResume ? 'opacity-60 pointer-events-none' : 'border-neutral-20'}`}>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-[15px] text-neutral-90">Upload Resume</div>
                  <div className="text-[13px] text-neutral-50">PDF or DOCX — AI extracts all your details</div>
                </div>
                {uploadingResume && <div className="animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full" />}
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileUpload(file);
                  }}
                />
              </label>

              {/* LinkedIn PDF */}
              <button
                onClick={() => {
                  window.open('https://www.linkedin.com/in/', '_blank');
                  // Show instructions
                  setError('Download your LinkedIn profile as PDF (More → Save to PDF), then use "Upload Resume" above.');
                }}
                className="flex items-center gap-4 p-4 rounded-xl border-2 border-neutral-20 text-left transition-all hover:border-primary hover:bg-primary/[0.02]"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-[15px] text-neutral-90">Import from LinkedIn</div>
                  <div className="text-[13px] text-neutral-50">Download your profile PDF, then upload it</div>
                </div>
              </button>

              {/* Create with AI */}
              <button
                onClick={handleAIGenerate}
                disabled={generatingResume}
                className="flex items-center gap-4 p-4 rounded-xl border-2 border-neutral-20 text-left transition-all hover:border-primary hover:bg-primary/[0.02] disabled:opacity-60"
              >
                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" /></svg>
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-[15px] text-neutral-90">Create with AI</div>
                  <div className="text-[13px] text-neutral-50">AI generates a complete resume from the job description</div>
                </div>
                {generatingResume && <div className="animate-spin w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full" />}
              </button>

              {/* Start from scratch */}
              <button
                onClick={handleStartFromScratch}
                className="flex items-center gap-4 p-4 rounded-xl border-2 border-neutral-20 text-left transition-all hover:border-primary hover:bg-primary/[0.02]"
              >
                <div className="w-12 h-12 bg-neutral-10 rounded-xl flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-neutral-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" /></svg>
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-[15px] text-neutral-90">Start from Scratch</div>
                  <div className="text-[13px] text-neutral-50">Empty resume — fill everything manually in the editor</div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* ─── STEP: TEMPLATE ─── */}
        {step === 'template' && (
          <div className="bg-white rounded-2xl border border-neutral-20 p-6 sm:p-8">
            <h1 className="text-[24px] sm:text-[28px] font-medium text-neutral-90 tracking-tight mb-2">
              Pick an ATS-friendly design
            </h1>
            <p className="text-neutral-50 text-[15px] mb-6">
              All templates are optimized for Applicant Tracking Systems.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {TEMPLATE_LIST.map(template => (
                <button
                  key={template.id}
                  onClick={() => handleTemplateSelect(template.id)}
                  className={`relative rounded-xl border-2 p-1 transition-all ${
                    selectedTemplate === template.id
                      ? 'border-primary ring-2 ring-primary/20'
                      : 'border-neutral-20 hover:border-neutral-30'
                  }`}
                >
                  <div className="aspect-[3/4] bg-neutral-5 rounded-lg overflow-hidden">
                    <TemplatePreview
                      templateId={template.id}
                      color={resumeData.colorScheme || '#2563eb'}
                    />
                  </div>
                  <div className="mt-1.5 px-1 pb-1">
                    <div className="text-[12px] font-semibold text-neutral-80 truncate">{template.name}</div>
                    <div className="text-[10px] text-green-600 font-medium">ATS {template.atsScore}%</div>
                  </div>
                  {selectedTemplate === template.id && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                  )}
                  {template.popular && (
                    <div className="absolute top-2 left-2 bg-orange-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                      Popular
                    </div>
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={handleTemplateConfirm}
              className="mt-6 w-full bg-primary text-white py-3 rounded-xl font-medium text-[15px] hover:bg-primary/90 transition-colors"
            >
              Continue with {TEMPLATE_LIST.find(t => t.id === selectedTemplate)?.name || 'template'}
            </button>
          </div>
        )}

        {/* ─── STEP: OPTIMIZE ─── */}
        {step === 'optimize' && (
          <div className="bg-white rounded-2xl border border-neutral-20 p-6 sm:p-8">
            <h1 className="text-[24px] sm:text-[28px] font-medium text-neutral-90 tracking-tight mb-2">
              Optimize for this job
            </h1>
            <p className="text-neutral-50 text-[15px] mb-6">
              AI tailors your resume to match the job requirements.
            </p>

            {/* Job match preview */}
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-neutral-5 rounded-xl p-4">
                <div className="text-[13px] font-semibold text-neutral-60 mb-2">Your Resume</div>
                <div className="text-[15px] font-medium text-neutral-90">{resumeData.personalDetails.jobTitle || 'No title set'}</div>
                <div className="text-[13px] text-neutral-50 mt-1">{resumeData.skills.slice(0, 5).map(s => s.name).join(', ')}</div>
                <div className="mt-2 text-[12px] text-neutral-40">
                  {resumeData.workExperience.length} experience{resumeData.workExperience.length !== 1 ? 's' : ''} · {resumeData.skills.length} skills
                </div>
              </div>
              <div className="bg-primary/5 rounded-xl p-4">
                <div className="text-[13px] font-semibold text-primary/70 mb-2">Target Job</div>
                <div className="text-[15px] font-medium text-neutral-90">{jobData?.title}</div>
                <div className="text-[13px] text-neutral-50 mt-1">{jobData?.skills?.slice(0, 5).join(', ')}</div>
                <div className="mt-2 text-[12px] text-neutral-40">
                  {jobData?.company || 'Company'} · {jobData?.location || 'Location'}
                </div>
              </div>
            </div>

            {/* Optimization result */}
            {optimization && (
              <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span className="font-semibold text-green-800 text-[15px]">
                    Resume optimized — {(optimization.matchScore as number) || 85}% match
                  </span>
                </div>
                <ul className="space-y-1">
                  {(optimization.changes as string[] || []).map((change: string, i: number) => (
                    <li key={i} className="text-[13px] text-green-700 flex items-start gap-1.5">
                      <span className="text-green-500 mt-0.5">•</span> {change}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex gap-3">
              {!optimization && (
                <button
                  onClick={handleOptimize}
                  disabled={optimizing}
                  className="flex-1 bg-primary text-white py-3 rounded-xl font-medium text-[15px] hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {optimizing ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                      Optimizing...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>
                      Optimize with AI
                    </>
                  )}
                </button>
              )}
              <button
                onClick={handleSaveAndFinish}
                disabled={saving}
                className={`${optimization ? 'flex-1' : ''} bg-primary text-white py-3 px-6 rounded-xl font-medium text-[15px] hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2`}
              >
                {saving ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    Saving...
                  </>
                ) : optimization ? 'Save & Continue' : 'Keep as-is'}
              </button>
            </div>
          </div>
        )}

        {/* ─── STEP: DONE ─── */}
        {step === 'done' && (
          <div className="bg-white rounded-2xl border border-neutral-20 p-6 sm:p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h1 className="text-[24px] sm:text-[28px] font-medium text-neutral-90 tracking-tight mb-2">
              Your resume is ready!
            </h1>
            <p className="text-neutral-50 text-[15px] mb-2">
              {jobData?.title && <>Tailored for <span className="font-medium text-neutral-70">{jobData.title}</span></>}
              {jobData?.company && <> at {jobData.company}</>}
            </p>

            {/* ATS Score */}
            <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-2 mb-6">
              <div className={`w-3 h-3 rounded-full ${atsScore >= 80 ? 'bg-green-500' : atsScore >= 50 ? 'bg-orange-500' : 'bg-red-500'}`} />
              <span className="text-[14px] font-semibold text-green-800">ATS Score: {atsScore}%</span>
              {optimization?.matchScore ? (
                <span className="text-[12px] text-green-600">· {Number(optimization.matchScore)}% keyword match</span>
              ) : null}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
              {/* Cover Letter CTA */}
              <Link
                href={`/funnel/${jobId}/cover-letter${savedResumeId ? `?resumeId=${savedResumeId}` : ''}`}
                className="bg-primary text-white py-3 px-6 rounded-xl font-medium text-[15px] hover:bg-primary/90 transition-colors inline-flex items-center justify-center gap-2"
              >
                Next: Cover Letter
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </Link>

              {/* Download PDF */}
              {savedResumeId && (
                <button
                  onClick={async () => {
                    const res = await fetch('/api/resume/generate-pdf', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(resumeData),
                    });
                    if (res.ok) {
                      const blob = await res.blob();
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `${resumeData.personalDetails.firstName || 'Resume'}_${resumeData.personalDetails.lastName || ''}.pdf`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }
                  }}
                  className="border border-neutral-20 text-neutral-70 py-3 px-6 rounded-xl font-medium text-[15px] hover:bg-neutral-5 transition-colors inline-flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  Download PDF
                </button>
              )}

              {/* Edit manually */}
              {savedResumeId && (
                <Link
                  href={`/builder/${savedResumeId}`}
                  className="border border-neutral-20 text-neutral-50 py-3 px-6 rounded-xl font-medium text-[15px] hover:bg-neutral-5 transition-colors inline-flex items-center justify-center gap-2"
                >
                  Edit manually
                </Link>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-neutral-10">
              <Link href="/dashboard" className="text-[14px] text-primary hover:underline font-medium">
                Go to Dashboard →
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
