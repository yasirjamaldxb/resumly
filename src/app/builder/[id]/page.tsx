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
  { id: 'template', label: 'Template', icon: '🎨' },
  { id: 'personal', label: 'Personal', icon: '👤' },
  { id: 'experience', label: 'Experience', icon: '💼' },
  { id: 'education', label: 'Education', icon: '🎓' },
  { id: 'skills', label: 'Skills', icon: '⚡' },
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
  const previewRef = useRef<HTMLDivElement>(null);
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
    setAtsScore(Math.min(score, 100));
  }, [resumeData]);

  // Auto-save
  const autoSave = useCallback(async (data: ResumeData) => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        await fetch('/api/resume/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...data, userId: user.id }),
        });
      } catch {
        // Silent fail
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
      const el = document.getElementById('resume-preview');
      if (!el) throw new Error('Preview not found');

      const firstName = resumeData.personalDetails.firstName || 'resume';
      const lastName = resumeData.personalDetails.lastName || '';
      const filename = `${firstName}-${lastName}-resume.pdf`.replace(/\s+/g, '-');

      // Server-side PDF generation (text-based, ATS-friendly)
      const response = await fetch('/api/resume/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html: el.outerHTML }),
      });

      if (response.ok && response.headers.get('content-type')?.includes('application/pdf')) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        // Fallback: browser print (also produces text-based PDF)
        printResumeFallback(el);
      }
    } catch {
      // Fallback: browser print
      const el = document.getElementById('resume-preview');
      if (el) printResumeFallback(el);
      else window.print();
    } finally {
      setDownloading(false);
    }
  };

  const printResumeFallback = (el: HTMLElement) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) { window.print(); return; }
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Resume</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            @page { size: A4; margin: 0; }
            body { width: 794px; margin: 0 auto; font-family: Arial, Helvetica, sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            @media print { body { width: 794px; } }
          </style>
        </head>
        <body>${el.outerHTML}</body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => { printWindow.print(); }, 300);
  };

  const currentStep = STEPS[step - 1];

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-10 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-60 font-medium">Loading your resume...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-10 flex flex-col">
      {/* Top bar */}
      <header className="bg-white border-b border-neutral-20 sticky top-0 z-40">
        <div className="max-w-full px-4 h-14 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-xs">R</span>
            </div>
            <span className="font-bold text-neutral-90 hidden sm:block">resumly.app</span>
          </Link>

          {/* Step progress */}
          <div className="flex items-center gap-1 overflow-x-auto">
            {STEPS.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setStep(i + 1)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap',
                  step === i + 1
                    ? 'bg-primary text-white'
                    : step > i + 1
                    ? 'bg-primary-light text-primary-dark'
                    : 'text-neutral-50 hover:bg-neutral-10'
                )}
              >
                <span>{s.icon}</span>
                <span className="hidden sm:inline">{s.label}</span>
                {i < STEPS.length - 1 && (
                  <svg className="w-3 h-3 text-neutral-30 ml-1 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* ATS Score */}
            <div className="hidden sm:flex items-center gap-2 bg-neutral-10 rounded-lg px-3 py-1.5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: atsScore >= 80 ? '#22c55e' : atsScore >= 50 ? '#f59e0b' : '#ef4444' }} />
              <span className="text-xs font-medium text-neutral-70">ATS: {atsScore}%</span>
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

            <Button size="sm" onClick={downloadPDF} loading={downloading} className="gap-1.5">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download PDF
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Form Panel */}
        <div className={cn(
          'w-full lg:w-[420px] flex-shrink-0 overflow-y-auto bg-white border-r border-neutral-20',
          previewVisible ? 'hidden lg:block' : 'block'
        )}>
          <div className="p-6 pb-24">
            {step === 1 && <TemplatePicker data={resumeData} onChange={handleDataChange} />}
            {step === 2 && <PersonalDetailsForm data={resumeData} onChange={handleDataChange} />}
            {step === 3 && <WorkExperienceForm data={resumeData} onChange={handleDataChange} />}
            {step === 4 && <EducationForm data={resumeData} onChange={handleDataChange} />}
            {step === 5 && <SkillsForm data={resumeData} onChange={handleDataChange} />}
          </div>

          {/* Navigation buttons */}
          <div className="fixed bottom-0 left-0 lg:left-0 lg:w-[420px] bg-white border-t border-neutral-20 px-6 py-4 flex justify-between gap-3 z-30">
            <Button
              variant="outline"
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
              className="flex-1"
            >
              ← Back
            </Button>
            {step < STEPS.length ? (
              <Button onClick={() => setStep(step + 1)} className="flex-1">
                Next →
              </Button>
            ) : (
              <Button onClick={downloadPDF} loading={downloading} className="flex-1">
                Download PDF 🎉
              </Button>
            )}
          </div>
        </div>

        {/* Preview Panel */}
        <div className={cn(
          'flex-1 bg-neutral-10 overflow-auto p-6',
          !previewVisible ? 'hidden lg:block' : 'block'
        )}>
          <div className="sticky top-0 z-10 flex justify-end mb-4">
            <button
              onClick={() => setPreviewVisible(!previewVisible)}
              className="lg:hidden bg-white rounded-lg px-3 py-1.5 text-sm font-medium text-neutral-70 shadow border border-neutral-20"
            >
              ← Back to Edit
            </button>
          </div>

          <div
            ref={previewRef}
            className="bg-white shadow-xl mx-auto"
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
