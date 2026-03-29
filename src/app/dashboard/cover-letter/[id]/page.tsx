'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';

interface CoverLetterData {
  id: string;
  content: string;
  tone: string;
  created_at: string;
  job: { title: string; company: string } | null;
}

export default function CoverLetterViewPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const autoDownload = searchParams.get('download') === 'true';

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [data, setData] = useState<CoverLetterData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: cl } = await supabase
        .from('cover_letters')
        .select('id, content, tone, created_at, job:jobs(title, company)')
        .eq('id', id)
        .eq('user_id', user.id)
        .single();

      if (cl) {
        const jobArr = cl.job as unknown as { title: string; company: string }[] | null;
        const job = Array.isArray(jobArr) ? jobArr[0] : jobArr;
        setData({ ...cl, job } as CoverLetterData);
      }
      setLoading(false);
    }
    load();
  }, [id, supabase]);

  useEffect(() => {
    if (data && autoDownload) {
      handleDownload();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, autoDownload]);

  const handleDownload = () => {
    if (!data) return;
    const title = data.job?.title ? `Cover Letter - ${data.job.title} at ${data.job.company}` : 'Cover Letter';
    const blob = new Blob([data.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/[^a-zA-Z0-9 -]/g, '')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    if (!data) return;
    navigator.clipboard.writeText(data.content);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f9fc] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-[#f7f9fc] flex items-center justify-center">
        <div className="text-center">
          <p className="text-neutral-50 mb-4">Cover letter not found</p>
          <Link href="/dashboard" className="text-primary hover:underline font-medium">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      <header className="bg-white border-b border-neutral-20 sticky top-0 z-40">
        <div className="max-w-[800px] mx-auto px-4 sm:px-6 h-[64px] flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 text-[14px] text-neutral-50 hover:text-neutral-70 font-medium">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg text-[13px] font-medium bg-neutral-5 text-neutral-60 hover:bg-neutral-10 transition-colors flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
              Copy
            </button>
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-lg text-[13px] font-medium bg-primary text-white hover:bg-primary/90 transition-colors flex items-center gap-1.5"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Download
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[800px] mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white rounded-2xl border border-neutral-20 p-6 sm:p-10">
          <div className="mb-6 pb-6 border-b border-neutral-10">
            <h1 className="text-[22px] font-medium text-neutral-90 tracking-tight mb-1">Cover Letter</h1>
            {data.job && (
              <p className="text-neutral-50 text-[14px]">
                For {data.job.title} at {data.job.company}
              </p>
            )}
            <div className="flex items-center gap-3 mt-2">
              <span className="text-[12px] text-neutral-40">
                {new Date(data.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
              <span className="text-[12px] bg-neutral-5 text-neutral-50 px-2 py-0.5 rounded-md font-medium">
                {data.tone.charAt(0).toUpperCase() + data.tone.slice(1)}
              </span>
            </div>
          </div>

          <div className="prose prose-sm max-w-none text-neutral-70 leading-relaxed whitespace-pre-wrap text-[15px]">
            {data.content}
          </div>
        </div>
      </main>
    </div>
  );
}
