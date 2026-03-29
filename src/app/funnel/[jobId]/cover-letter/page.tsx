'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';

export default function CoverLetterPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = params.jobId as string;
  const resumeId = searchParams.get('resumeId');

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState('');
  const [tone, setTone] = useState<'professional' | 'formal' | 'enthusiastic'>('professional');
  const [jobData, setJobData] = useState<Record<string, unknown> | null>(null);
  const [resumeData, setResumeData] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  // Load job + resume data
  useEffect(() => {
    async function loadData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { router.push('/auth/login'); return; }

        const { data: job } = await supabase
          .from('jobs')
          .select('*')
          .eq('id', jobId)
          .single();
        setJobData(job);

        if (resumeId) {
          const { data: resume } = await supabase
            .from('resumes')
            .select('resume_data')
            .eq('id', resumeId)
            .single();
          setResumeData(resume?.resume_data as Record<string, unknown> || null);
        }
      } catch {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [jobId, resumeId, router, supabase]);

  // Auto-generate on load
  useEffect(() => {
    if (!loading && jobData && !content) {
      handleGenerate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, jobData]);

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    try {
      const pd = resumeData?.personalDetails as Record<string, string> | undefined;
      const skills = resumeData?.skills as Array<{ name: string }> | undefined;
      const experience = resumeData?.workExperience as Array<{ position: string; company: string; bullets: string[] }> | undefined;

      const background = [
        pd?.jobTitle ? `Current role: ${pd.jobTitle}` : '',
        skills?.length ? `Key skills: ${skills.slice(0, 8).map(s => s.name).join(', ')}` : '',
        experience?.length ? `Recent experience: ${experience[0]?.position} at ${experience[0]?.company}` : '',
      ].filter(Boolean).join('. ');

      const res = await fetch('/api/ai/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          yourName: pd ? `${pd.firstName || ''} ${pd.lastName || ''}`.trim() : '',
          jobTitle: jobData?.title || '',
          company: jobData?.company || '',
          jobDescription: jobData?.description || '',
          yourBackground: background,
          tone,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Generation failed');
      setContent(result.text);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate cover letter');
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error: insertError } = await supabase
        .from('cover_letters')
        .insert({
          user_id: user.id,
          job_id: jobId,
          resume_id: resumeId || null,
          content,
          tone,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Link cover letter to application
      if (data) {
        await supabase
          .from('applications')
          .update({ cover_letter_id: data.id, status: 'ready' })
          .eq('job_id', jobId)
          .eq('user_id', user.id);
      }

      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f9fc] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      {/* Header */}
      <header className="bg-white border-b border-neutral-20 sticky top-0 z-40">
        <div className="max-w-[900px] mx-auto px-4 sm:px-6 h-[64px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="font-semibold text-neutral-90 tracking-tight text-[17px]">resumly<span className="text-primary">.app</span></span>
          </Link>
          <Link href="/dashboard" className="text-[14px] text-neutral-50 hover:text-neutral-70 font-medium">
            Skip to Dashboard →
          </Link>
        </div>
      </header>

      <main className="max-w-[900px] mx-auto px-4 sm:px-6 py-8">
        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-[14px] mb-4">
            {error}
            <button onClick={() => setError(null)} className="ml-2 text-red-500 font-medium">Dismiss</button>
          </div>
        )}

        {!saved ? (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Editor side */}
            <div className="bg-white rounded-2xl border border-neutral-20 p-6">
              <h1 className="text-[22px] font-medium text-neutral-90 tracking-tight mb-1">Cover Letter</h1>
              <p className="text-neutral-50 text-[14px] mb-4">
                {jobData?.title ? <>For {String(jobData.title)}</> : null}
                {jobData?.company ? <> at {String(jobData.company)}</> : null}
              </p>

              {/* Tone selector */}
              <div className="flex gap-2 mb-4">
                {(['professional', 'formal', 'enthusiastic'] as const).map(t => (
                  <button
                    key={t}
                    onClick={() => setTone(t)}
                    className={`px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all ${
                      tone === t
                        ? 'bg-primary text-white'
                        : 'bg-neutral-5 text-neutral-60 hover:bg-neutral-10'
                    }`}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
                <button
                  onClick={handleGenerate}
                  disabled={generating}
                  className="ml-auto px-3 py-1.5 rounded-lg text-[13px] font-medium bg-purple-50 text-purple-600 hover:bg-purple-100 transition-colors disabled:opacity-50 flex items-center gap-1"
                >
                  {generating ? (
                    <><div className="animate-spin w-3 h-3 border-2 border-purple-500 border-t-transparent rounded-full" /> Generating...</>
                  ) : (
                    <><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg> Regenerate</>
                  )}
                </button>
              </div>

              {/* Textarea */}
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder={generating ? 'Generating your cover letter...' : 'Your cover letter will appear here...'}
                className="w-full h-[400px] border border-neutral-20 rounded-xl p-4 text-[14px] text-neutral-80 leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />

              <button
                onClick={handleSave}
                disabled={saving || !content.trim()}
                className="mt-4 w-full bg-primary text-white py-3 rounded-xl font-medium text-[15px] hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <><div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> Saving...</>
                ) : 'Save & Go to Dashboard'}
              </button>
            </div>

            {/* Preview side */}
            <div className="bg-white rounded-2xl border border-neutral-20 p-6 hidden lg:block">
              <div className="text-[13px] font-semibold text-neutral-50 mb-4">PREVIEW</div>
              <div className="prose prose-sm max-w-none text-neutral-70 leading-relaxed whitespace-pre-wrap text-[14px]">
                {content || (generating ? 'Generating...' : 'Your cover letter preview will appear here.')}
              </div>
            </div>
          </div>
        ) : (
          /* Saved confirmation */
          <div className="bg-white rounded-2xl border border-neutral-20 p-6 sm:p-8 text-center max-w-lg mx-auto">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h1 className="text-[24px] font-medium text-neutral-90 tracking-tight mb-2">
              Application package ready!
            </h1>
            <p className="text-neutral-50 text-[15px] mb-6">
              Your resume and cover letter are saved. Head to the dashboard to download and apply.
            </p>
            <Link
              href="/dashboard"
              className="bg-primary text-white py-3 px-8 rounded-xl font-medium text-[15px] hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
            >
              Go to Dashboard
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
