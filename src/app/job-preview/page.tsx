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

  const [status, setStatus] = useState<'loading' | 'ready' | 'error' | 'paste'>('loading');
  const [job, setJob] = useState<ParsedJob | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [showPaste, setShowPaste] = useState(false);
  const [pastedText, setPastedText] = useState('');
  const [pasteLoading, setPasteLoading] = useState(false);

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

  // Sites that block server-side fetching — go straight to paste UI
  const isBlockedSite = /linkedin\.com|indeed\.com|glassdoor\.com|monster\.com|ziprecruiter\.com/i.test(jobUrl);

  // Parse the job
  useEffect(() => {
    if (!jobUrl) return;
    if (isBlockedSite) {
      // Don't waste time trying to fetch — show paste UI immediately
      setStatus('paste');
      return;
    }
    const parse = async () => {
      try {
        const res = await fetch('/api/jobs/parse', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: jobUrl }),
        });
        const data = await res.json();
        if (!res.ok) {
          setErrorMsg(data.message || 'Could not analyze that job listing');
          setStatus('error');
          return;
        }
        setJob(data.job);
        setStatus('ready');
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
  }, [jobUrl, isBlockedSite]);

  const handlePasteSubmit = async () => {
    if (pastedText.trim().length < 50) return;
    setPasteLoading(true);
    setStatus('loading');
    try {
      const res = await fetch('/api/jobs/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: pastedText.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.message || 'Could not analyze the job description');
        setStatus('error');
        setPasteLoading(false);
        return;
      }
      setJob(data.job);
      setStatus('ready');
      setShowPaste(false);
      if (typeof window !== 'undefined' && data.job?.title) {
        localStorage.setItem('resumly_job_context', JSON.stringify({
          title: data.job.title,
          company: data.job.company,
          url: jobUrl,
        }));
      }
    } catch {
      setErrorMsg('Could not analyze the job description');
      setStatus('error');
    }
    setPasteLoading(false);
  };

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
            <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${status === 'loading' ? 'border-2 border-primary bg-primary/10' : status === 'paste' ? 'border-2 border-primary bg-primary/10' : 'bg-green-500'}`}>
              {status === 'loading' || status === 'paste'
                ? <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                : <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              }
            </div>
            <span className={`text-[12px] font-medium whitespace-nowrap ${status === 'loading' || status === 'paste' ? 'text-primary' : 'text-neutral-90'}`}>
              {status === 'loading' ? 'Analyzing job...' : status === 'paste' ? 'Paste job details' : 'Job analyzed'}
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

        {/* Paste — blocked site, show polished paste-first UI */}
        {status === 'paste' && (
          <div>
            <div className="mb-5">
              <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
                </svg>
              </div>
              <h2 className="text-[22px] font-semibold text-neutral-90 text-center mb-1.5">
                Paste the job description
              </h2>
              <p className="text-[14px] text-neutral-50 text-center">
                Copy the full job posting and paste it below — we'll extract the keywords instantly.
              </p>
            </div>

            {/* Step-by-step instructions */}
            <div className="bg-white rounded-xl border border-neutral-15 p-4 mb-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">1</span>
                  <p className="text-[13px] text-neutral-70">Open the job listing in another tab</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">2</span>
                  <p className="text-[13px] text-neutral-70">Select all the text (<span className="font-medium text-neutral-90">Ctrl+A</span>) and copy (<span className="font-medium text-neutral-90">Ctrl+C</span>)</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[11px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">3</span>
                  <p className="text-[13px] text-neutral-70">Paste it below and hit <span className="font-medium text-neutral-90">Analyze</span></p>
                </div>
              </div>
            </div>

            <textarea
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Paste the full job description here...&#10;&#10;e.g. &quot;About the role: We're looking for a Senior Product Manager to lead our growth team...&quot;"
              className="w-full h-48 px-4 py-3 text-[14px] bg-white border border-neutral-20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary placeholder:text-neutral-35 text-neutral-90 resize-none mb-3"
              autoFocus
            />
            <button
              onClick={handlePasteSubmit}
              disabled={pasteLoading || pastedText.trim().length < 50}
              className="w-full flex items-center justify-center gap-2 bg-primary text-white rounded-xl px-6 py-4 text-[15px] font-semibold hover:bg-primary-dark transition-colors shadow-md disabled:opacity-50 mb-3"
            >
              {pasteLoading
                ? <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              }
              {pasteLoading ? 'Analyzing...' : 'Analyze job description'}
            </button>
            {pastedText.length > 0 && pastedText.trim().length < 50 && (
              <p className="text-[12px] text-neutral-40 text-center">Paste at least 50 characters to continue</p>
            )}
          </div>
        )}

        {/* Error — show paste fallback */}
        {status === 'error' && (
          <div>
            {!showPaste ? (
              <>
                <div className="text-center mb-6">
                  <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <svg className="w-7 h-7 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    </svg>
                  </div>
                  <h2 className="text-[22px] font-semibold text-neutral-90 mb-2">That site blocked us</h2>
                  <p className="text-[14px] text-neutral-50">Sites like LinkedIn require login to view job details.</p>
                </div>
                <button
                  onClick={() => setShowPaste(true)}
                  className="w-full flex items-center justify-center gap-2.5 bg-primary text-white rounded-xl px-6 py-4 text-[15px] font-semibold hover:bg-primary-dark transition-colors shadow-md mb-3"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
                  </svg>
                  Paste the job description instead
                </button>
                <button
                  onClick={handleGoogleSignup}
                  disabled={authLoading}
                  className="w-full flex items-center justify-center gap-3 bg-white border border-neutral-20 text-neutral-70 rounded-xl px-6 py-3.5 text-[14px] font-medium hover:bg-neutral-5 transition-colors mb-3"
                >
                  {authLoading
                    ? <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    : null
                  }
                  {authLoading ? 'Redirecting...' : 'Skip — build resume without job context'}
                </button>
              </>
            ) : (
              <>
                <div className="mb-4">
                  <h2 className="text-[20px] font-semibold text-neutral-90 mb-1">Paste the job description</h2>
                  <p className="text-[13px] text-neutral-50">Copy the full job posting from the website and paste it below. We'll extract the keywords and requirements.</p>
                </div>
                <textarea
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder="Paste the full job description here...&#10;&#10;e.g. &quot;About the role: We're looking for a Senior Product Manager to lead our growth team...&quot;"
                  className="w-full h-48 px-4 py-3 text-[14px] bg-white border border-neutral-20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary placeholder:text-neutral-35 text-neutral-90 resize-none mb-3"
                  autoFocus
                />
                <button
                  onClick={handlePasteSubmit}
                  disabled={pasteLoading || pastedText.trim().length < 50}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-white rounded-xl px-6 py-4 text-[15px] font-semibold hover:bg-primary-dark transition-colors shadow-md disabled:opacity-50 mb-3"
                >
                  {pasteLoading
                    ? <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                  }
                  {pasteLoading ? 'Analyzing...' : 'Analyze job description'}
                </button>
                <button
                  onClick={() => { setShowPaste(false); setStatus('error'); }}
                  className="w-full text-center text-[13px] text-neutral-40 hover:text-neutral-60 transition-colors py-2"
                >
                  Go back
                </button>
              </>
            )}
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
