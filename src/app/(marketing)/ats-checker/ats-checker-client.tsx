'use client';

import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';

interface CheckResult {
  name: string;
  category: string;
  passed: boolean;
  score: number;
  maxScore: number;
  message: string;
  fix?: string;
}

interface CategoryResult {
  checks: CheckResult[];
  score: number;
  maxScore: number;
}

interface ATSResult {
  score: number;
  rating: string;
  totalScore: number;
  maxScore: number;
  categories: Record<string, CategoryResult>;
  suggestions: { title: string; category: string; fix: string }[];
  sections: string[];
  wordCount: number;
}

export function ATSCheckerClient() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ATSResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [emailUnlocked, setEmailUnlocked] = useState(false);
  const [email, setEmail] = useState('');
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const emailRef = useRef<HTMLDivElement>(null);

  const handleUnlockReport = async () => {
    if (!email.trim()) {
      setEmailError('Please enter your email');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email');
      return;
    }
    setEmailLoading(true);
    setEmailError('');
    try {
      const res = await fetch('/api/ats-check/collect-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          score: result?.score,
          rating: result?.rating,
          suggestions: result?.suggestions,
          categories: result?.categories,
          wordCount: result?.wordCount,
          sections: result?.sections,
        }),
      });
      const data = await res.json();
      if (data.emailSent) {
        console.log('ATS report email sent successfully');
      } else if (data.emailError) {
        console.warn('Email not sent:', data.emailError);
      }
      // Always unlock even if API fails — don't block the user
      setEmailUnlocked(true);
    } catch {
      // Still unlock on error
      setEmailUnlocked(true);
    } finally {
      setEmailLoading(false);
    }
  };

  const handleFile = useCallback((f: File) => {
    if (f.type !== 'application/pdf') {
      setError('Please upload a PDF file.');
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setError('File is too large. Maximum 10MB.');
      return;
    }
    setFile(f);
    setError(null);
    setResult(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, [handleFile]);

  const extractTextFromPDF = async (pdfFile: File): Promise<string> => {
    const pdfjsLib = await import('pdfjs-dist');
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

    const arrayBuffer = await pdfFile.arrayBuffer();
    const doc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    const textParts: string[] = [];
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const content = await page.getTextContent();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pageText = content.items.map((item: any) => item.str || '').join(' ');
      textParts.push(pageText);
    }
    return textParts.join('\n');
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Step 1: Extract text from PDF in the browser
      let text: string;
      try {
        text = await extractTextFromPDF(file);
      } catch {
        setError('Could not read this PDF. It may be image-based, password-protected, or corrupted. Try a different file.');
        setLoading(false);
        return;
      }

      if (text.trim().length < 10) {
        setError('No readable text found in this PDF. It may be an image-based PDF (scanned document). Try rebuilding your resume with Resumly for a text-based PDF.');
        setLoading(false);
        return;
      }

      // Step 2: Send text to API for scoring
      const res = await fetch('/api/ats-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        return;
      }

      setResult(data);
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch {
      setError('Something went wrong. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const scoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const scoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const scoreRingColor = (score: number) => {
    if (score >= 80) return 'stroke-green-500';
    if (score >= 50) return 'stroke-yellow-500';
    return 'stroke-red-500';
  };

  return (
    <>
      {/* Hero + Upload Section */}
      <section className="bg-neutral-10 py-16">
        <div className="max-w-[800px] mx-auto px-6">
          <div className="text-center mb-10">
            <h1 className="text-[34px] sm:text-[40px] font-medium text-neutral-90 leading-tight tracking-tight mb-3">
              Is your resume <span className="text-primary">ATS-ready?</span>
            </h1>
            <p className="text-[15px] text-neutral-60 max-w-[500px] mx-auto">
              Upload your resume and get an instant ATS compatibility score with actionable suggestions to improve it.
            </p>
          </div>

          {/* Upload area */}
          {!result && (
            <div className="max-w-[560px] mx-auto">
              <div
                className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer ${
                  dragOver
                    ? 'border-primary bg-primary/5'
                    : file
                      ? 'border-green-400 bg-green-50'
                      : 'border-neutral-30 bg-white hover:border-primary hover:bg-primary/5'
                }`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFile(f);
                  }}
                />

                {file ? (
                  <>
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-green-100 flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-[14px] font-semibold text-neutral-90 mb-1">{file.name}</p>
                    <p className="text-[12px] text-neutral-50">{(file.size / 1024).toFixed(0)} KB</p>
                  </>
                ) : (
                  <>
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                      <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                      </svg>
                    </div>
                    <p className="text-[14px] font-semibold text-neutral-90 mb-1">
                      Drop your resume here or <span className="text-primary">browse</span>
                    </p>
                    <p className="text-[12px] text-neutral-50">PDF files only, up to 10MB</p>
                  </>
                )}
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-[13px] text-red-700">
                  {error}
                </div>
              )}

              <div className="mt-5 flex gap-3 justify-center">
                <button
                  onClick={handleAnalyze}
                  disabled={!file || loading}
                  className={`px-6 py-2.5 rounded-lg text-[14px] font-semibold text-white transition-all ${
                    !file || loading
                      ? 'bg-neutral-30 cursor-not-allowed'
                      : 'bg-primary hover:bg-primary-dark shadow-md hover:shadow-lg'
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Analyzing...
                    </span>
                  ) : (
                    'Check ATS Score'
                  )}
                </button>
                {file && !loading && (
                  <button
                    onClick={(e) => { e.stopPropagation(); handleReset(); }}
                    className="px-4 py-2.5 rounded-lg text-[14px] font-medium text-neutral-60 hover:text-neutral-90 border border-neutral-20 hover:border-neutral-30 transition-all"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Trust signals */}
              <div className="mt-8 flex items-center justify-center gap-6 text-[12px] text-neutral-50">
                <span className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  Data never stored
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  100% free
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                  Instant results
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Results Section */}
      {result && (
        <section ref={resultRef} className="py-12 bg-white">
          <div className="max-w-[900px] mx-auto px-6">
            {/* Score overview */}
            <div className="bg-neutral-10 rounded-2xl p-8 mb-8">
              <div className="flex flex-col sm:flex-row items-center gap-8">
                {/* Circular score */}
                <div className="relative w-[140px] h-[140px] flex-shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="52" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                    <circle
                      cx="60" cy="60" r="52" fill="none"
                      className={scoreRingColor(result.score)}
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${(result.score / 100) * 327} 327`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-[36px] font-bold ${scoreColor(result.score)}`}>{result.score}</span>
                    <span className="text-[12px] text-neutral-50 -mt-1">out of 100</span>
                  </div>
                </div>

                <div className="flex-1 text-center sm:text-left">
                  <div className="flex items-center gap-3 justify-center sm:justify-start mb-2">
                    <h2 className="text-[22px] font-semibold text-neutral-90">Your ATS Score</h2>
                    <span className={`px-2.5 py-0.5 rounded-full text-[12px] font-bold text-white ${scoreBg(result.score)}`}>
                      {result.rating}
                    </span>
                  </div>
                  <p className="text-[14px] text-neutral-60 mb-4">
                    {result.score >= 90
                      ? 'Excellent! Your resume is highly ATS-compatible. Minor improvements possible below.'
                      : result.score >= 75
                        ? 'Good job! Your resume passes most ATS checks. Fix the issues below to boost your score.'
                        : result.score >= 50
                          ? 'Your resume needs work. Several issues may cause ATS rejection. Review the suggestions below.'
                          : 'Your resume has critical issues that will likely cause ATS rejection. Address the problems below.'}
                  </p>
                  <div className="flex items-center gap-4 text-[13px] text-neutral-50">
                    <span>{result.wordCount} words</span>
                    <span>{result.sections.length}/4 sections found</span>
                    <span>{result.suggestions.length} issue{result.suggestions.length !== 1 ? 's' : ''} to fix</span>
                  </div>
                </div>
              </div>

              {/* Category bars */}
              <div className="mt-8 grid sm:grid-cols-2 gap-4">
                {Object.entries(result.categories).map(([name, cat]) => {
                  const pct = Math.round((cat.score / cat.maxScore) * 100);
                  return (
                    <div key={name}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[13px] font-medium text-neutral-80">{name}</span>
                        <span className={`text-[13px] font-semibold ${scoreColor(pct)}`}>{pct}%</span>
                      </div>
                      <div className="h-2 bg-neutral-20 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all ${scoreBg(pct)}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Email gate or full report */}
            {!emailUnlocked ? (
              <>
                {/* Teaser: show first 2 issues blurred */}
                {result.suggestions.length > 0 && (
                  <div className="mb-6 relative">
                    <h3 className="text-[18px] font-semibold text-neutral-90 mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.962-.833-2.732 0L4.072 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      {result.suggestions.length} issue{result.suggestions.length !== 1 ? 's' : ''} found. Here&apos;s how to fix them
                    </h3>
                    {/* Show first suggestion clearly */}
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-3">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0 text-[12px] font-bold mt-0.5">1</div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-[14px] font-semibold text-red-800">{result.suggestions[0]?.title}</h4>
                            <span className="text-[11px] px-2 py-0.5 bg-red-100 text-red-600 rounded-full font-medium">{result.suggestions[0]?.category}</span>
                          </div>
                          <p className="text-[13px] text-red-700 leading-relaxed">{result.suggestions[0]?.fix}</p>
                        </div>
                      </div>
                    </div>
                    {/* Blurred remaining suggestions */}
                    {result.suggestions.length > 1 && (
                      <div className="relative">
                        <div className="space-y-3 blur-[6px] pointer-events-none select-none" aria-hidden="true">
                          {result.suggestions.slice(1, 4).map((s, i) => (
                            <div key={i} className="bg-red-50 border border-red-200 rounded-xl p-4">
                              <div className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0 text-[12px] font-bold mt-0.5">{i + 2}</div>
                                <div>
                                  <h4 className="text-[14px] font-semibold text-red-800">{s.title}</h4>
                                  <p className="text-[13px] text-red-700">{s.fix}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-white/90" />
                      </div>
                    )}
                  </div>
                )}

                {/* Email capture card */}
                <div ref={emailRef} className="bg-gradient-to-br from-primary/5 to-blue-50 border-2 border-primary/20 rounded-2xl p-8 mb-8 text-center">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                    <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                    </svg>
                  </div>
                  <h3 className="text-[20px] font-semibold text-neutral-90 mb-2">
                    Unlock your full ATS report
                  </h3>
                  <p className="text-[14px] text-neutral-60 mb-6 max-w-[400px] mx-auto">
                    Get your complete analysis with all {result.suggestions.length} fix suggestions and detailed breakdown. We&apos;ll also email you the full report so you can reference it later.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-3 max-w-[440px] mx-auto">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
                      onKeyDown={(e) => e.key === 'Enter' && handleUnlockReport()}
                      placeholder="Enter your email"
                      className="flex-1 px-4 py-2.5 rounded-lg border border-neutral-20 text-[14px] text-neutral-90 placeholder:text-neutral-40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                    />
                    <button
                      onClick={handleUnlockReport}
                      disabled={emailLoading}
                      className="px-6 py-2.5 rounded-lg text-[14px] font-semibold text-white bg-primary hover:bg-primary-dark transition-all shadow-md disabled:opacity-50 whitespace-nowrap"
                    >
                      {emailLoading ? 'Unlocking...' : 'Get full report'}
                    </button>
                  </div>
                  {emailError && <p className="text-[12px] text-red-500 mt-2">{emailError}</p>}

                  <div className="mt-4 flex items-center justify-center gap-4 text-[11px] text-neutral-50">
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                      No spam, ever
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Instant access
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Unsubscribe anytime
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* UNLOCKED: Full suggestions */}
                {result.suggestions.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-[18px] font-semibold text-neutral-90 mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.962-.833-2.732 0L4.072 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      Issues to fix ({result.suggestions.length})
                    </h3>
                    <div className="space-y-3">
                      {result.suggestions.map((s, i) => (
                        <div key={i} className="bg-red-50 border border-red-200 rounded-xl p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0 text-[12px] font-bold mt-0.5">
                              {i + 1}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-[14px] font-semibold text-red-800">{s.title}</h4>
                                <span className="text-[11px] px-2 py-0.5 bg-red-100 text-red-600 rounded-full font-medium">{s.category}</span>
                              </div>
                              <p className="text-[13px] text-red-700 leading-relaxed">{s.fix}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* UNLOCKED: Detailed checks */}
                <div className="mb-8">
                  <h3 className="text-[18px] font-semibold text-neutral-90 mb-4">Detailed Analysis</h3>
                  {Object.entries(result.categories).map(([catName, cat]) => (
                    <div key={catName} className="mb-5">
                      <h4 className="text-[14px] font-semibold text-neutral-70 mb-2 uppercase tracking-wide">{catName}</h4>
                      <div className="bg-neutral-10 rounded-xl overflow-hidden divide-y divide-neutral-20">
                        {cat.checks.map((check, i) => (
                          <div key={i} className="flex items-center gap-3 px-4 py-3">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${check.passed ? 'bg-green-100' : 'bg-red-100'}`}>
                              {check.passed ? (
                                <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              ) : (
                                <svg className="w-3 h-3 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <span className="text-[13px] font-medium text-neutral-80">{check.name}</span>
                              <span className="text-[12px] text-neutral-50 ml-2">{check.message}</span>
                            </div>
                            <span className={`text-[12px] font-semibold ${check.passed ? 'text-green-600' : 'text-red-500'}`}>
                              {check.score}/{check.maxScore}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <button
                onClick={handleReset}
                className="px-6 py-2.5 rounded-lg text-[14px] font-semibold text-primary border border-primary hover:bg-primary/5 transition-all"
              >
                Check another resume
              </button>
              <Link
                href="/builder/new"
                className="px-6 py-2.5 rounded-lg text-[14px] font-semibold text-white bg-primary hover:bg-primary-dark transition-all shadow-md"
              >
                Build an ATS-optimized resume
              </Link>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
