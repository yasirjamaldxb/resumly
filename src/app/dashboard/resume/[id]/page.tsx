'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';
import { ResumeTemplate } from '@/components/resume/templates';
import { ResumeData } from '@/types/resume';

export default function ResumeViewPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const autoDownload = searchParams.get('download') === 'true';

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: resume } = await supabase
        .from('resumes')
        .select('id, title, template_id, color_scheme, resume_data, updated_at')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (resume) {
        const rd = resume.resume_data as ResumeData;
        setResumeData({ ...rd, id: resume.id });
        setTitle(resume.title || 'My Resume');
      }
      setLoading(false);
    }
    load();
  }, [id, supabase]);

  useEffect(() => {
    if (resumeData && autoDownload) {
      handleDownload();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeData, autoDownload]);

  const handleDownload = async () => {
    if (!resumeData || downloading) return;
    setDownloading(true);
    try {
      const firstName = resumeData.personalDetails?.firstName || 'resume';
      const lastName = resumeData.personalDetails?.lastName || '';
      const filename = [firstName, lastName].filter(Boolean).join('_') + '_resume.pdf';

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
        fetch('/api/email/track-action', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'downloaded_pdf' }),
        }).catch(() => {});
      } else {
        alert('PDF generation failed. Please try again.');
      }
    } catch {
      alert('PDF generation failed. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f9fc] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!resumeData) {
    return (
      <div className="min-h-screen bg-[#f7f9fc] flex items-center justify-center">
        <div className="text-center">
          <p className="text-neutral-50 mb-4">Resume not found</p>
          <Link href="/dashboard" className="text-primary hover:underline font-medium">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      <header className="bg-white border-b border-neutral-20 sticky top-0 z-40">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 h-[64px] flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-[14px] text-neutral-50 hover:text-neutral-70 font-medium">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href={`/builder/${id}`}
              className="px-3 py-1.5 rounded-lg text-[13px] font-medium bg-neutral-5 text-neutral-60 hover:bg-neutral-10 transition-colors flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              Edit
            </Link>
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="px-3 py-1.5 rounded-lg text-[13px] font-medium bg-primary text-white hover:bg-primary/90 transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              {downloading ? (
                <div className="w-3.5 h-3.5 border-[1.5px] border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              )}
              {downloading ? 'Generating...' : 'Download PDF'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[900px] mx-auto px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-[22px] font-medium text-neutral-90 tracking-tight">{title}</h1>
          {resumeData.personalDetails?.jobTitle && (
            <p className="text-neutral-50 text-[14px] mt-1">{resumeData.personalDetails.jobTitle}</p>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-neutral-20 p-4 sm:p-6 overflow-hidden">
          <div className="flex justify-center">
            <div style={{ transform: 'scale(0.75)', transformOrigin: 'top center' }}>
              <ResumeTemplate data={resumeData} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
