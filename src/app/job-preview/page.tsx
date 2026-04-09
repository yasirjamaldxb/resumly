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

const loadingSteps = [
  { label: 'Connecting to job listing', icon: '🔗', delay: 0 },
  { label: 'Extracting job title and company', icon: '🏢', delay: 1500 },
  { label: 'Identifying required skills', icon: '🎯', delay: 3500 },
  { label: 'Mapping ATS keywords', icon: '🔑', delay: 5500 },
  { label: 'Preparing your tailored application', icon: '✨', delay: 7500 },
];

function JobPreviewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const jobUrl = searchParams.get('url') || '';
  const jobText = searchParams.get('text') || '';

  const [status, setStatus] = useState<'loading' | 'ready' | 'error' | 'paste'>('loading');
  const [job, setJob] = useState<ParsedJob | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [showPaste, setShowPaste] = useState(false);
  const [pastedText, setPastedText] = useState('');
  const [pasteLoading, setPasteLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  // If text was passed from homepage, parse it directly
  useEffect(() => {
    if (!jobText || jobUrl) return;
    const parseText = async () => {
      try {
        const res = await fetch('/api/jobs/parse', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: jobText }),
        });
        const data = await res.json();
        if (!res.ok) {
          setErrorMsg(data.message || 'Could not analyze the job description');
          setStatus('paste');
          setPastedText(jobText);
          return;
        }

        // Check if user is logged in
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user && data.job) {
          // Logged in: save job and go to funnel
          try {
            const saveRes = await fetch('/api/jobs/save', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...data.job, url: '', raw_text: jobText.slice(0, 2000) }),
            });
            const saveResult = await saveRes.json();
            if (saveResult.id) {
              router.replace(`/funnel/${saveResult.id}`);
              return;
            }
          } catch { /* fall through */ }
        }

        setJob(data.job);
        setStatus('ready');
        if (typeof window !== 'undefined' && data.job?.title) {
          localStorage.setItem('resumly_job_context', JSON.stringify({
            title: data.job.title,
            company: data.job.company,
            url: '',
            keywords: data.job.keywords || [],
            skills: data.job.skills || [],
          }));
        }
      } catch {
        setErrorMsg('Could not analyze the job description. Try again.');
        setStatus('paste');
        setPastedText(jobText);
      }
    };
    parseText();
  }, [jobText, jobUrl, router]);

  // Animated loading steps
  useEffect(() => {
    if (status !== 'loading') return;
    const timers = loadingSteps.map((step, i) =>
      setTimeout(() => setActiveStep(i), step.delay)
    );
    return () => timers.forEach(clearTimeout);
  }, [status]);

  // Check auth first, then either redirect (logged in) or parse for preview (not logged in)
  useEffect(() => {
    if (!jobUrl) { if (!jobText) router.replace('/'); return; }
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setIsLoggedIn(true);
        try {
          const res = await fetch('/api/jobs/parse', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: jobUrl }),
          });
          const data = await res.json();
          if (res.ok && data.job) {
            const saveRes = await fetch('/api/jobs/save', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...data.job, url: jobUrl, raw_text: data.job.description }),
            });
            const saveResult = await saveRes.json();
            if (saveResult.id) {
              router.replace(`/funnel/${saveResult.id}`);
              return;
            }
          }
          if (!res.ok && data.message) {
            setErrorMsg(data.message);
            setStatus('paste');
            setAuthChecked(true);
            return;
          }
        } catch { /* fall through */ }
        setStatus('paste');
        setAuthChecked(true);
        return;
      }
      setAuthChecked(true);
    };
    checkAuth();
  }, [jobUrl, router]);

  // Parse the job for non-logged-in users only (after auth check completes)
  // Includes automatic retry: if first attempt fails with a network/server error, retry once
  useEffect(() => {
    if (!jobUrl || !authChecked || isLoggedIn) return;
    const parse = async (attempt = 0) => {
      try {
        const res = await fetch('/api/jobs/parse', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: jobUrl }),
        });
        const data = await res.json();
        if (!res.ok) {
          // These are definitive errors, don't retry
          if (data.error === 'login_wall' || data.error === 'search_page' || data.error === 'not_job_page') {
            setErrorMsg(data.message || 'Could not analyze that job listing');
            setStatus('paste');
            return;
          }
          // For parse_failed or server errors, retry once
          if (attempt === 0 && (data.error === 'parse_failed' || res.status >= 500)) {
            console.log('[job-preview] First parse attempt failed, retrying...');
            await new Promise(r => setTimeout(r, 1500));
            return parse(1);
          }
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
            keywords: data.job.keywords || [],
            skills: data.job.skills || [],
          }));
        }
      } catch {
        // Network error: retry once before giving up
        if (attempt === 0) {
          console.log('[job-preview] Network error, retrying...');
          await new Promise(r => setTimeout(r, 1500));
          return parse(1);
        }
        setErrorMsg('Could not connect to job analyzer. Check the URL and try again.');
        setStatus('error');
      }
    };
    parse();
  }, [jobUrl, authChecked, isLoggedIn]);

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
        setStatus('paste');
        setPasteLoading(false);
        return;
      }

      if (isLoggedIn && data.job) {
        try {
          const saveRes = await fetch('/api/jobs/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...data.job, url: jobUrl || '', raw_text: pastedText.trim().slice(0, 2000) }),
          });
          const saveResult = await saveRes.json();
          if (saveResult.id) {
            router.replace(`/funnel/${saveResult.id}`);
            return;
          }
        } catch { /* fall through to normal flow */ }
      }

      setJob(data.job);
      setStatus('ready');
      setShowPaste(false);
      if (typeof window !== 'undefined' && data.job?.title) {
        localStorage.setItem('resumly_job_context', JSON.stringify({
          title: data.job.title,
          company: data.job.company,
          url: jobUrl,
          keywords: data.job.keywords || [],
          skills: data.job.skills || [],
        }));
      }
    } catch {
      setErrorMsg('Could not analyze the job description');
      setStatus('paste');
    }
    setPasteLoading(false);
  };

  const handleGoogleSignup = async () => {
    setAuthLoading(true);
    const supabase = createClient();
    const origin = window.location.origin;
    if (job) {
      localStorage.setItem('resumly_pending_job', JSON.stringify({
        ...job,
        url: jobUrl,
        raw_text: job.title ? `${job.title} at ${job.company}` : '',
      }));
    }
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${origin}/auth/callback?next=/dashboard&job=${encodeURIComponent(jobUrl)}`,
      },
    });
  };

  const allKeywords = [...new Set([...(job?.keywords || []), ...(job?.skills || [])])].filter(Boolean);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[#f0f4ff] via-[#f6f8ff] to-white">
      {/* Decorative blobs (matching homepage) */}
      <div className="absolute top-[-120px] right-[-80px] w-[400px] h-[400px] bg-primary/[0.07] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-[-60px] left-[-100px] w-[350px] h-[350px] bg-blue-400/[0.06] rounded-full blur-[90px] pointer-events-none" />
      <div className="absolute bottom-[-100px] left-[50%] w-[300px] h-[300px] bg-cyan-400/[0.05] rounded-full blur-[80px] pointer-events-none" />

      {/* Dot grid (matching homepage) */}
      <div
        className="absolute inset-0 opacity-[0.3] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #94a3b8 0.5px, transparent 0.5px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Header */}
      <header className="relative bg-white/70 backdrop-blur-md border-b border-neutral-10/60 px-5 py-3.5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">R</span>
          </div>
          <span className="font-semibold text-[15px] text-neutral-90 tracking-tight">resumly<span className="text-primary">.app</span></span>
        </Link>
        <Link
          href={`/auth/login?redirectTo=${encodeURIComponent(`/job-preview?${jobUrl ? `url=${encodeURIComponent(jobUrl)}` : `text=${encodeURIComponent(jobText)}`}`)}`}
          className="text-[13px] text-neutral-50 hover:text-neutral-90 transition-colors"
        >
          Sign in
        </Link>
      </header>

      <div className="relative w-full px-5 py-5 sm:py-8">

        {/* Progress steps */}
        <div className="max-w-[500px] mx-auto">
        <div className="flex items-center gap-2 mb-5 sm:mb-8">
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
            <div className="w-5 h-5 rounded-full border-2 border-neutral-20 bg-white/60 flex items-center justify-center">
              <span className="text-[10px] font-bold text-neutral-40">2</span>
            </div>
            <span className="text-[12px] font-medium text-neutral-40 whitespace-nowrap">Build resume</span>
          </div>
          <div className="flex-1 h-px bg-neutral-15" />
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <div className="w-5 h-5 rounded-full border-2 border-neutral-20 bg-white/60 flex items-center justify-center">
              <span className="text-[10px] text-neutral-40">3</span>
            </div>
            <span className="text-[12px] text-neutral-40 whitespace-nowrap">Apply &amp; get hired</span>
          </div>
        </div>
        </div>

        {/* Loading */}
        {status === 'loading' && (
          <div className="max-w-[500px] mx-auto py-8 sm:py-12">
            {/* Animated spinner with gradient ring */}
            <div className="relative w-20 h-20 mx-auto mb-8">
              <div className="w-20 h-20 rounded-full border-[3px] border-primary/10" />
              <div className="absolute inset-0 w-20 h-20 rounded-full border-[3px] border-transparent border-t-primary border-r-primary/50 animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Headline */}
            <div className="text-center mb-8">
              <h2 className="text-[22px] sm:text-[26px] font-bold text-neutral-90 tracking-tight mb-2">
                {isLoggedIn ? 'Setting up your application...' : 'Analyzing this job for you...'}
              </h2>
              <p className="text-[14px] text-neutral-50 max-w-[380px] mx-auto">
                {isLoggedIn
                  ? 'We\'re preparing everything so you can apply in minutes.'
                  : 'Hang tight. We\'re reading the listing so you don\'t have to.'
                }
              </p>
            </div>

            {/* Animated step-by-step progress */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-neutral-10/60 p-5 shadow-lg shadow-neutral-900/[0.04] mb-6">
              <div className="space-y-3">
                {loadingSteps.map((step, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-3 transition-all duration-500 ${
                      i <= activeStep ? 'opacity-100' : 'opacity-30'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
                      i < activeStep
                        ? 'bg-green-500'
                        : i === activeStep
                          ? 'bg-primary/10 border border-primary/30'
                          : 'bg-neutral-10'
                    }`}>
                      {i < activeStep ? (
                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      ) : i === activeStep ? (
                        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                      ) : (
                        <span className="text-[11px] text-neutral-40">{step.icon}</span>
                      )}
                    </div>
                    <span className={`text-[13px] transition-colors duration-500 ${
                      i < activeStep
                        ? 'text-green-600 font-medium'
                        : i === activeStep
                          ? 'text-neutral-90 font-medium'
                          : 'text-neutral-40'
                    }`}>
                      {step.label}
                      {i < activeStep && (
                        <span className="text-green-500 ml-1.5 text-[11px]">Done</span>
                      )}
                      {i === activeStep && (
                        <span className="text-primary ml-1.5 text-[11px] animate-pulse">In progress...</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* What you'll get */}
            <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-neutral-10/60 p-4">
              <p className="text-[11px] text-neutral-40 font-medium uppercase tracking-wider mb-3">What you&apos;ll get in seconds</p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: '📄', label: 'Tailored Resume' },
                  { icon: '✉️', label: 'Cover Letter' },
                  { icon: '✅', label: 'ATS Check' },
                ].map((item) => (
                  <div key={item.label} className="text-center">
                    <span className="text-[18px] block mb-1">{item.icon}</span>
                    <span className="text-[11px] text-neutral-60 font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Paste state */}
        {status === 'paste' && (
          <div className="max-w-[500px] mx-auto">
            <div className="mb-3 sm:mb-5">
              <div className="hidden sm:flex w-14 h-14 bg-gradient-to-br from-primary/10 to-blue-400/10 rounded-2xl items-center justify-center mx-auto mb-4 border border-primary/10">
                <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
                </svg>
              </div>
              <h2 className="text-[20px] sm:text-[22px] font-semibold text-neutral-90 text-center mb-1">
                Paste the job description
              </h2>
              {errorMsg ? (
                <p className="text-[13px] sm:text-[14px] text-amber-600 text-center bg-amber-50/80 backdrop-blur-sm border border-amber-200 rounded-lg px-3 py-2 mt-2">
                  {errorMsg}
                </p>
              ) : (
                <p className="text-[13px] sm:text-[14px] text-neutral-50 text-center">
                  Copy the full job posting and paste it below. We&apos;ll extract the keywords instantly.
                </p>
              )}
            </div>

            {/* Step-by-step instructions */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-neutral-10/60 p-3 sm:p-4 mb-3 sm:mb-4 shadow-sm">
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 sm:flex-col sm:gap-y-3 sm:gap-x-0">
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[11px] font-bold flex items-center justify-center flex-shrink-0">1</span>
                  <p className="text-[12px] sm:text-[13px] text-neutral-70">Open the job listing</p>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[11px] font-bold flex items-center justify-center flex-shrink-0">2</span>
                  <p className="text-[12px] sm:text-[13px] text-neutral-70">Copy all text (<span className="font-medium text-neutral-90">Ctrl+C</span>)</p>
                </div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[11px] font-bold flex items-center justify-center flex-shrink-0">3</span>
                  <p className="text-[12px] sm:text-[13px] text-neutral-70">Paste below &amp; hit <span className="font-medium text-neutral-90">Analyze</span></p>
                </div>
              </div>
            </div>

            <textarea
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Paste the full job description here...&#10;&#10;e.g. &quot;About the role: We're looking for a Senior Product Manager to lead our growth team...&quot;"
              className="w-full h-48 px-4 py-3 text-[14px] bg-white/90 backdrop-blur-sm border border-neutral-20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary placeholder:text-neutral-35 text-neutral-90 resize-none mb-3 shadow-sm"
              autoFocus
            />
            <button
              onClick={handlePasteSubmit}
              disabled={pasteLoading || pastedText.trim().length < 50}
              className="w-full flex items-center justify-center gap-2 bg-primary text-white rounded-xl px-6 py-4 text-[15px] font-semibold hover:bg-primary-dark transition-colors shadow-md shadow-primary/10 disabled:opacity-50 mb-3"
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

        {/* Error state */}
        {status === 'error' && (
          <div className="max-w-[500px] mx-auto">
            {!showPaste ? (
              <>
                <div className="text-center mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-orange-200/50">
                    <svg className="w-7 h-7 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    </svg>
                  </div>
                  <h2 className="text-[22px] font-semibold text-neutral-90 mb-2">That site blocked us</h2>
                  <p className="text-[14px] text-neutral-50">Sites like LinkedIn require login to view job details.</p>
                </div>
                <button
                  onClick={() => setShowPaste(true)}
                  className="w-full flex items-center justify-center gap-2.5 bg-primary text-white rounded-xl px-6 py-4 text-[15px] font-semibold hover:bg-primary-dark transition-colors shadow-md shadow-primary/10 mb-3"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
                  </svg>
                  Paste the job description instead
                </button>
                <button
                  onClick={handleGoogleSignup}
                  disabled={authLoading}
                  className="w-full flex items-center justify-center gap-3 bg-white/80 backdrop-blur-sm border border-neutral-20 text-neutral-70 rounded-xl px-6 py-3.5 text-[14px] font-medium hover:bg-white transition-colors mb-3"
                >
                  {authLoading
                    ? <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    : null
                  }
                  {authLoading ? 'Redirecting...' : 'Skip, build resume without job context'}
                </button>
              </>
            ) : (
              <>
                <div className="mb-4">
                  <h2 className="text-[20px] font-semibold text-neutral-90 mb-1">Paste the job description</h2>
                  <p className="text-[13px] text-neutral-50">Copy the full job posting from the website and paste it below. We&apos;ll extract the keywords and requirements.</p>
                </div>
                <textarea
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder="Paste the full job description here...&#10;&#10;e.g. &quot;About the role: We're looking for a Senior Product Manager to lead our growth team...&quot;"
                  className="w-full h-48 px-4 py-3 text-[14px] bg-white/90 backdrop-blur-sm border border-neutral-20 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary placeholder:text-neutral-35 text-neutral-90 resize-none mb-3 shadow-sm"
                  autoFocus
                />
                <button
                  onClick={handlePasteSubmit}
                  disabled={pasteLoading || pastedText.trim().length < 50}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-white rounded-xl px-6 py-4 text-[15px] font-semibold hover:bg-primary-dark transition-colors shadow-md shadow-primary/10 disabled:opacity-50 mb-3"
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

        {/* Ready state */}
        {status === 'ready' && job && (
          <div className="max-w-[500px] mx-auto">

            {/* ── Premium analysis result card ── */}
            <div className="bg-white rounded-2xl shadow-xl shadow-neutral-900/[0.08] border border-neutral-100 overflow-hidden">

              {/* Card header — gradient bar */}
              <div className="bg-gradient-to-r from-neutral-90 to-neutral-80 px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-[11px] font-medium uppercase tracking-wider">Analysis complete</p>
                  <p className="text-white text-[14px] font-semibold mt-0.5 leading-tight">
                    {job.title}{job.company ? <span className="text-white/50 font-normal"> · {job.company}</span> : ''}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </div>
              </div>

              {/* Card body */}
              <div className="p-6">

                {/* Readiness checklist */}
                <div className="space-y-3.5 mb-6">
                  {[
                    { label: 'ATS Keywords', value: `${allKeywords.length} identified`, detail: allKeywords.join(', ') },
                    { label: 'Professional Summary', value: 'Ready to generate', detail: null },
                    { label: 'Bullet Points', value: 'Ready to generate', detail: null },
                    { label: 'ATS Format', value: 'Text-based PDF', detail: null },
                  ].map(({ label, value, detail }, i) => (
                    <div key={i} className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5 min-w-0">
                        <div className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13px] font-medium text-neutral-90">{label}</p>
                          {detail && <p className="text-[11px] text-neutral-40 mt-0.5 truncate">{detail}</p>}
                        </div>
                      </div>
                      <span className="text-[11px] text-green-700 bg-green-50 px-2 py-0.5 rounded-full font-medium flex-shrink-0 mt-0.5">{value}</span>
                    </div>
                  ))}
                </div>

                {/* Separator */}
                <div className="border-t border-neutral-100 mb-5" />

                {/* CTA inside card */}
                <button
                  onClick={handleGoogleSignup}
                  disabled={authLoading}
                  className="w-full flex items-center justify-center gap-3 bg-primary text-white rounded-xl px-6 py-3.5 text-[14px] font-semibold hover:bg-primary-dark transition-all shadow-md shadow-primary/15 disabled:opacity-70 mb-2.5"
                >
                  {authLoading
                    ? <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    : <GoogleIcon />
                  }
                  {authLoading ? 'Redirecting...' : 'Build my resume for this role'}
                </button>

                <Link
                  href={`/auth/signup?job=${encodeURIComponent(jobUrl)}`}
                  className="w-full flex items-center justify-center gap-2 border border-neutral-20 text-neutral-70 rounded-xl px-6 py-3 text-[13px] font-medium hover:bg-neutral-10 hover:border-neutral-30 transition-all"
                >
                  <svg className="w-4 h-4 text-neutral-40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                  Sign up with email
                </Link>
              </div>
            </div>

            {/* Below card — social proof */}
            <div className="mt-5 flex items-center justify-center gap-2">
              <div className="flex items-center gap-0.5">
                {[1,2,3,4,5].map(s => (
                  <svg key={s} className="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-[11px] text-neutral-40">
                <span className="italic">&ldquo;Got 3 interview callbacks in the first week.&rdquo;</span> — Sarah K.
              </p>
            </div>

            <div className="mt-3 flex items-center justify-center gap-4 text-[10px] text-neutral-35 font-medium">
              <span>No credit card</span>
              <span className="text-neutral-20">·</span>
              <span>ATS-optimized</span>
              <span className="text-neutral-20">·</span>
              <span>Ready in 5 min</span>
              <span className="text-neutral-20">·</span>
              <span>12,000+ resumes built</span>
            </div>

            <p className="text-center text-[12px] text-neutral-40 mt-4">
              Already have an account?{' '}
              <Link href={`/auth/login?job=${encodeURIComponent(jobUrl)}`} className="text-primary hover:text-primary-dark font-medium">
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
      <div className="min-h-screen bg-gradient-to-b from-[#f0f4ff] via-[#f6f8ff] to-white flex items-center justify-center">
        <div className="w-10 h-10 border-[3px] border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <JobPreviewContent />
    </Suspense>
  );
}
