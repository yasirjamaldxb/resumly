'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

interface ParsedJob {
  title: string | null;
  company: string | null;
  location: string | null;
  keywords: string[];
  skills: string[];
}

function GoogleIcon() {
  return (
    <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

function JobPreviewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const jobUrl = searchParams.get('url') || '';

  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [job, setJob] = useState<ParsedJob | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // If already logged in, skip straight to builder
  useEffect(() => {
    if (!jobUrl) { router.replace('/builder/new'); return; }
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        router.replace(`/builder/new?job=${encodeURIComponent(jobUrl)}`);
      }
    };
    checkAuth();
  }, [jobUrl, router]);

  // Parse the job
  useEffect(() => {
    if (!jobUrl) return;
    const parse = async () => {
      try {
        const res = await fetch('/api/jobs/parse', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: jobUrl }),
        });
        const data = await res.json();
        if (!res.ok) {
          setErrorMsg(data.error || 'Could not analyze that job listing');
          setStatus('error');
          return;
        }
        setJob(data.job);
        setStatus('ready');
        // Store for login page contextual copy
        if (typeof window !== 'undefined' && data.job?.title) {
          localStorage.setItem('resumly_job_context', JSON.stringify({
            title: data.job.title,
            company: data.job.company,
            url: jobUrl,
          }));
        }
      } catch {
        setErrorMsg('Could not connect to job analyzer. Check the URL and try again.');
        setStatus('error');
      }
    };
    parse();
  }, [jobUrl]);

  const handleGoogleSignup = async () => {
    setAuthLoading(true);
    const supabase = createClient();
    const origin = window.location.origin;
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${origin}/auth/callback?next=/builder/new&job=${encodeURIComponent(jobUrl)}`,
      },
    });
  };

  const allKeywords = [...(job?.keywords || []), ...(job?.skills || [])].filter(Boolean);
  const visibleKeywords = allKeywords.slice(0, 7);
  const hiddenCount = Math.max(0, allKeywords.length - 7);

  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      {/* Header */}
      <header className="bg-white border-b border-neutral-10 px-5 py-3.5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">R</span>
          </div>
          <span className="font-semibold text-[15px] text-neutral-90 tracking-tight">resumly<span className="text-primary">.app</span></span>
        </Link>
        <Link href="/auth/login" className="text-[13px] text-neutral-50 hover:text-neutral-90 transition-colors">
          Sign in
        </Link>
      </header>

      <div className="max-w-[540px] mx-auto px-5 py-10 sm:py-14">

        {/* Progress steps */}
        <div className="flex items-center gap-2 mb-10">
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${status === 'loading' ? 'border-2 border-primary bg-primary/10' : 'bg-green-500'}`}>
              {status === 'loading'
                ? <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                : <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              }
            </div>
            <span className={`text-[12px] font-medium whitespace-nowrap ${status === 'loading' ? 'text-primary' : 'text-neutral-90'}`}>
              {status === 'loading' ? 'Analyzing job...' : 'Job analyzed'}
            </span>
          </div>
          <div className="flex-1 h-px bg-neutral-15" />
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <div className="w-5 h-5 rounded-full border-2 border-primary bg-primary/10 flex items-center justify-center">
              <span className="text-[10px] font-bold text-primary">2</span>
            </div>
            <span className="text-[12px] font-medium text-neutral-50 whitespace-nowrap">Build resume</span>
          </div>
          <div className="flex-1 h-px bg-neutral-15" />
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <div className="w-5 h-5 rounded-full border-2 border-neutral-20 flex items-center justify-center">
              <span className="text-[10px] text-neutral-40">3</span>
            </div>
            <span className="text-[12px] text-neutral-40 whitespace-nowrap">Get the job</span>
          </div>
        </div>

        {/* Loading */}
        {status === 'loading' && (
          <div className="text-center py-16">
            <div className="relative w-16 h-16 mx-auto mb-5">
              <div className="w-16 h-16 border-[3px] border-primary/20 rounded-full" />
              <div className="absolute inset-0 w-16 h-16 border-[3px] border-primary border-t-transparent rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <p className="text-[17px] font-semibold text-neutral-90 mb-1.5">Reading the job listing...</p>
            <p className="text-[14px] text-neutral-50">Our AI is extracting keywords and requirements</p>
          </div>
        )}

        {/* Error */}
        {status === 'error' && (
          <div>
            <div className="text-center mb-8">
              <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
              </div>
              <h2 className="text-[22px] font-semibold text-neutral-90 mb-2">Couldn't read that URL</h2>
              <p className="text-[14px] text-neutral-50 mb-1">{errorMsg}</p>
              <p className="text-[13px] text-neutral-40">Some sites block automated access. You can still paste the job description inside the builder.</p>
            </div>
            <button
              onClick={handleGoogleSignup}
              disabled={authLoading}
              className="w-full flex items-center justify-center gap-3 bg-primary text-white rounded-xl px-6 py-4 text-[15px] font-semibold hover:bg-primary-dark transition-colors shadow-md disabled:opacity-70 mb-3"
            >
              {authLoading
                ? <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                : <GoogleIcon />
              }
              {authLoading ? 'Redirecting...' : 'Continue to resume builder — free'}
            </button>
            <p className="text-center text-[13px] text-neutral-40">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-primary hover:text-primary-dark font-medium">Sign in</Link>
            </p>
          </div>
        )}

        {/* Ready — the magic moment */}
        {status === 'ready' && job && (
          <div>
            {/* Job header */}
            <div className="mb-7">
              <div className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-[11px] font-bold px-2.5 py-1 rounded-full mb-3 uppercase tracking-wide">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                Analyzed
              </div>
              <h1 className="text-[26px] sm:text-[30px] font-semibold text-neutral-90 tracking-tight leading-tight mb-1.5">
                {job.title || 'This Role'}
              </h1>
              {job.company && (
                <p className="text-[15px] text-neutral-60">
                  {job.company}{job.location ? <span className="text-neutral-40"> · {job.location}</span> : ''}
                </p>
              )}
            </div>

            {/* Keywords card */}
            <div className="bg-white rounded-2xl border border-neutral-15 p-5 mb-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[14px] font-semibold text-neutral-90">
                  {allKeywords.length} keywords found
                </span>
                <span className="text-[11px] text-primary bg-primary/8 px-2.5 py-1 rounded-full font-semibold">
                  ATS Keywords
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {visibleKeywords.map((kw, i) => (
                  <span key={i} className="px-2.5 py-1 bg-primary/8 text-primary rounded-lg text-[12px] font-medium border border-primary/15">
                    {kw}
                  </span>
                ))}
                {hiddenCount > 0 && (
                  <span className="px-2.5 py-1 bg-neutral-10 text-neutral-40 rounded-lg text-[12px] font-medium">
                    +{hiddenCount} more
                  </span>
                )}
              </div>
              <p className="text-[12px] text-neutral-40 mt-3 pt-3 border-t border-neutral-10">
                We'll suggest where to include these in your resume to pass ATS filters.
              </p>
            </div>

            {/* Value prop */}
            <div className="flex items-start gap-3 bg-primary/5 border border-primary/15 rounded-xl p-4 mb-6">
              <svg className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              <p className="text-[13px] text-primary">
                <span className="font-semibold">Your resume will be tailored for this exact role.</span> We'll pre-fill keywords, suggest bullet points, and highlight the skills that matter for this position.
              </p>
            </div>

            {/* CTA */}
            <button
              onClick={handleGoogleSignup}
              disabled={authLoading}
              className="w-full flex items-center justify-center gap-3 bg-primary text-white rounded-xl px-6 py-4 text-[15px] font-semibold hover:bg-primary-dark transition-all shadow-md hover:shadow-lg disabled:opacity-70 mb-3"
            >
              {authLoading
                ? <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                : <GoogleIcon />
              }
              {authLoading ? 'Redirecting to Google...' : 'Get my tailored resume — it\'s free'}
            </button>
            <p className="text-center text-[13px] text-neutral-40">
              Already have an account?{' '}
              <Link
                href={`/auth/login?job=${encodeURIComponent(jobUrl)}&redirectTo=/builder/new`}
                className="text-primary hover:text-primary-dark font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function JobPreviewPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f7f9fc] flex items-center justify-center">
        <div className="w-10 h-10 border-[3px] border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <JobPreviewContent />
    </Suspense>
  );
}
