'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PersonalDetailsForm } from '@/components/resume/builder/personal-details';
import { WorkExperienceForm } from '@/components/resume/builder/work-experience';
import { EducationForm } from '@/components/resume/builder/education';
import { SkillsForm } from '@/components/resume/builder/skills';
import { TemplatePicker } from '@/components/resume/builder/template-picker';
import { ResumeTemplate } from '@/components/resume/templates';
import { ResumeData, emptyResume } from '@/types/resume';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

const STEPS = [
  { id: 'template', label: 'Template' },
  { id: 'personal', label: 'Personal' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'skills', label: 'Skills & More' },
];

export default function BuilderPage() {
  const params = useParams();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [resumeData, setResumeData] = useState<ResumeData>(emptyResume());
  const [previewVisible, setPreviewVisible] = useState(true);
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [atsScore, setAtsScore] = useState(0);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [showAtsBanner, setShowAtsBanner] = useState(false);
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
      const { downloadResumePDF } = await import('@/components/resume/pdf/generate-pdf');
      await downloadResumePDF(resumeData);
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('PDF generation failed. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

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

  const scoreColor = atsScore >= 80 ? '#22a861' : atsScore >= 50 ? '#f59e0b' : '#ef4444';

  return (
    <div className="min-h-screen bg-[#f7f9fc] flex flex-col">
      {/* Top bar */}
      <header className="bg-white border-b border-neutral-20 sticky top-0 z-40">
        <div className="max-w-full px-3 sm:px-5 h-[56px] flex items-center justify-between gap-2">
          {/* Logo + Back */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">R</span>
              </div>
              <span className="font-semibold text-neutral-90 hidden sm:block text-[15px] tracking-tight">resumly<span className="text-primary">.app</span></span>
            </Link>
            <div className="hidden sm:block w-px h-6 bg-neutral-20" />
            <Link href="/dashboard" className="hidden sm:block text-[13px] text-neutral-50 hover:text-neutral-70 transition-colors">
              Dashboard
            </Link>
          </div>

          {/* Step progress */}
          <div className="flex items-center gap-0.5 overflow-x-auto no-scrollbar">
            {STEPS.map((s, i) => (
              <button
                key={s.id}
                onClick={() => { setStep(i + 1); formPanelRef.current?.scrollTo({ top: 0 }); }}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all whitespace-nowrap',
                  step === i + 1
                    ? 'bg-primary text-white'
                    : step > i + 1
                    ? 'bg-primary/10 text-primary'
                    : 'text-neutral-40 hover:text-neutral-60 hover:bg-neutral-10'
                )}
              >
                <span className={cn(
                  'w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0',
                  step === i + 1 ? 'bg-white/20' : step > i + 1 ? 'bg-primary/20' : 'bg-neutral-20'
                )}>
                  {step > i + 1 ? (
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  ) : (
                    i + 1
                  )}
                </span>
                <span className="hidden sm:inline">{s.label}</span>
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Save status */}
            <div className="hidden sm:flex items-center gap-1.5 text-[12px]">
              {saveStatus === 'saving' && (
                <span className="text-neutral-40 flex items-center gap-1">
                  <div className="w-3 h-3 border-2 border-neutral-30 border-t-transparent rounded-full animate-spin" />
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

            {/* ATS Score */}
            <div className="hidden md:flex items-center gap-2 rounded-lg px-2.5 py-1.5 border border-neutral-20">
              <div className="relative w-6 h-6">
                <svg className="w-6 h-6 -rotate-90" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                  <circle cx="12" cy="12" r="10" fill="none" stroke={scoreColor} strokeWidth="3" strokeDasharray={`${atsScore * 0.628} 100`} strokeLinecap="round" />
                </svg>
              </div>
              <span className="text-[12px] font-semibold" style={{ color: scoreColor }}>ATS {atsScore}%</span>
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

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Form Panel */}
        <div ref={formPanelRef} className={cn(
          'w-full lg:w-[420px] xl:w-[440px] flex-shrink-0 overflow-y-auto bg-white border-r border-neutral-20',
          previewVisible ? 'hidden lg:block' : 'block'
        )}>
          <div className="p-5 sm:p-6 pb-[120px]">
            {step === 1 && <TemplatePicker data={resumeData} onChange={handleDataChange} />}
            {step === 2 && <PersonalDetailsForm data={resumeData} onChange={handleDataChange} />}
            {step === 3 && <WorkExperienceForm data={resumeData} onChange={handleDataChange} />}
            {step === 4 && <EducationForm data={resumeData} onChange={handleDataChange} />}
            {step === 5 && <SkillsForm data={resumeData} onChange={handleDataChange} />}
          </div>

          {/* Navigation buttons — sticky at bottom, scoped to form panel width */}
          <div className="fixed bottom-0 left-0 w-full lg:w-[420px] xl:w-[440px] bg-white border-t border-neutral-20 px-5 sm:px-6 py-3.5 flex justify-between gap-3 z-30">
            <Button
              variant="outline"
              size="sm"
              onClick={() => { setStep(Math.max(1, step - 1)); formPanelRef.current?.scrollTo({ top: 0 }); }}
              disabled={step === 1}
              className="flex-1"
            >
              Back
            </Button>
            {step < STEPS.length ? (
              <Button size="sm" onClick={() => { setStep(step + 1); formPanelRef.current?.scrollTo({ top: 0 }); }} className="flex-1">
                Next: {STEPS[step]?.label || ''}
              </Button>
            ) : (
              <Button size="sm" onClick={downloadPDF} loading={downloading} className="flex-1">
                Download PDF
              </Button>
            )}
          </div>
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
        </div>
      </div>
    </div>
  );
}
