'use client';

import { useState } from 'react';
import Link from 'next/link';

const TONES = [
  { value: 'professional', label: 'Professional' },
  { value: 'formal', label: 'Formal' },
  { value: 'enthusiastic', label: 'Enthusiastic' },
];

export function CoverLetterClient() {
  const [form, setForm] = useState({
    yourName: '',
    jobTitle: '',
    company: '',
    yourBackground: '',
    jobDescription: '',
    tone: 'professional',
  });
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  const generate = async () => {
    if (!form.jobTitle || !form.company) {
      setError('Job title and company are required.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/ai/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (json.error) {
        setError(json.error === 'AI not configured' ? 'AI is not yet available. Please try again later.' : json.error);
      } else {
        setGeneratedLetter(json.text);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(generatedLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadAsTxt = () => {
    const blob = new Blob([generatedLetter], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cover-letter-${form.company.toLowerCase().replace(/\s+/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* Hero */}
      <section className="bg-neutral-10 py-14">
        <div className="max-w-[760px] mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-3 py-1 text-[13px] font-semibold mb-5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            AI-Powered
          </div>
          <h1 className="text-[38px] sm:text-[52px] font-bold text-neutral-90 tracking-tight leading-[1.1] mb-4">
            Free AI Cover Letter Builder
          </h1>
          <p className="text-[17px] text-neutral-50 max-w-[520px] mx-auto leading-relaxed">
            Fill in your details and get a tailored, ATS-friendly cover letter in seconds. No templates — genuinely personalized.
          </p>
        </div>
      </section>

      {/* Builder */}
      <section className="py-12 bg-white">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-8">

            {/* Form */}
            <div className="space-y-5">
              <h2 className="text-[18px] font-semibold text-neutral-90 tracking-tight">Your details</h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-neutral-70">Your Name</label>
                  <input
                    className="w-full rounded-lg border border-neutral-30 px-3 py-2.5 text-[14px] text-neutral-90 placeholder:text-neutral-40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                    placeholder="John Smith"
                    value={form.yourName}
                    onChange={(e) => update('yourName', e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-neutral-70">Job Title <span className="text-red-500">*</span></label>
                  <input
                    className="w-full rounded-lg border border-neutral-30 px-3 py-2.5 text-[14px] text-neutral-90 placeholder:text-neutral-40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                    placeholder="Senior Software Engineer"
                    value={form.jobTitle}
                    onChange={(e) => update('jobTitle', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-neutral-70">Company Name <span className="text-red-500">*</span></label>
                <input
                  className="w-full rounded-lg border border-neutral-30 px-3 py-2.5 text-[14px] text-neutral-90 placeholder:text-neutral-40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                  placeholder="Google"
                  value={form.company}
                  onChange={(e) => update('company', e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-neutral-70">Your Background / Key Achievements</label>
                <textarea
                  className="w-full rounded-lg border border-neutral-30 px-3 py-2.5 text-[14px] text-neutral-90 placeholder:text-neutral-40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
                  rows={4}
                  placeholder="5 years of full-stack development, led a team of 4, built a platform serving 1M users, AWS certified..."
                  value={form.yourBackground}
                  onChange={(e) => update('yourBackground', e.target.value)}
                />
                <p className="text-[12px] text-neutral-40">The more specific you are, the better the result.</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-neutral-70">Job Description <span className="text-neutral-40 font-normal">(optional but recommended)</span></label>
                <textarea
                  className="w-full rounded-lg border border-neutral-30 px-3 py-2.5 text-[14px] text-neutral-90 placeholder:text-neutral-40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
                  rows={4}
                  placeholder="Paste the job description here to generate a highly targeted cover letter..."
                  value={form.jobDescription}
                  onChange={(e) => update('jobDescription', e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[13px] font-medium text-neutral-70">Tone</label>
                <div className="flex gap-2">
                  {TONES.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => update('tone', t.value)}
                      className={`flex-1 py-2 rounded-lg text-[13px] font-medium border transition-all ${
                        form.tone === t.value
                          ? 'border-primary bg-primary text-white'
                          : 'border-neutral-20 text-neutral-60 hover:border-primary hover:text-primary bg-white'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <p className="text-[13px] text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
              )}

              <button
                onClick={generate}
                disabled={loading}
                className={`w-full py-3 rounded-lg text-[14px] font-semibold text-white flex items-center justify-center gap-2 transition-all shadow-md ${
                  loading ? 'bg-neutral-30 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark hover:shadow-lg'
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Writing your cover letter...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Generate Cover Letter
                  </>
                )}
              </button>
            </div>

            {/* Output */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-[18px] font-semibold text-neutral-90 tracking-tight">Your cover letter</h2>
                {generatedLetter && (
                  <div className="flex gap-3">
                    <button
                      onClick={copyToClipboard}
                      className="flex items-center gap-1.5 text-[13px] font-medium text-neutral-50 hover:text-primary transition-colors"
                    >
                      {copied ? (
                        <>
                          <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-green-600">Copied!</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Copy
                        </>
                      )}
                    </button>
                    <button
                      onClick={downloadAsTxt}
                      className="flex items-center gap-1.5 text-[13px] font-medium text-neutral-50 hover:text-primary transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download .txt
                    </button>
                  </div>
                )}
              </div>

              {generatedLetter ? (
                <div>
                  <textarea
                    value={generatedLetter}
                    onChange={(e) => setGeneratedLetter(e.target.value)}
                    className="w-full min-h-[460px] rounded-xl border border-neutral-20 p-5 text-[14px] text-neutral-70 leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                  />
                  <p className="text-[12px] text-neutral-40 mt-2">You can edit the letter directly above before copying or downloading.</p>
                </div>
              ) : (
                <div className="min-h-[460px] rounded-xl border-2 border-dashed border-neutral-20 bg-neutral-10 flex flex-col items-center justify-center text-center p-8">
                  <div className="w-14 h-14 bg-neutral-20 rounded-xl flex items-center justify-center mb-4">
                    <svg className="w-7 h-7 text-neutral-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-[14px] font-medium text-neutral-60 mb-1">Your cover letter will appear here</p>
                  <p className="text-[13px] text-neutral-40">Fill in your details and click Generate</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Tips */}
      <section className="py-12 bg-neutral-10">
        <div className="max-w-[1100px] mx-auto px-6">
          <h2 className="text-[22px] font-semibold text-neutral-90 tracking-tight mb-6">Tips for a better cover letter</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                ),
                title: 'Be specific',
                desc: 'Add your actual achievements and numbers for a personalized, credible result.'
              },
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                ),
                title: 'Paste the job description',
                desc: 'AI will match your letter to the exact keywords and requirements recruiters look for.'
              },
              {
                icon: (
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                ),
                title: 'Always review & edit',
                desc: 'Add personal touches — a specific anecdote or a detail about the company — before sending.'
              },
            ].map((tip) => (
              <div key={tip.title} className="bg-white rounded-xl border border-neutral-20 p-5">
                <div className="w-9 h-9 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-3">
                  {tip.icon}
                </div>
                <p className="text-[14px] font-semibold text-neutral-90 mb-1">{tip.title}</p>
                <p className="text-[13px] text-neutral-50 leading-relaxed">{tip.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-white border-t border-neutral-20">
        <div className="max-w-[600px] mx-auto px-6 text-center">
          <h2 className="text-[22px] font-semibold text-neutral-90 tracking-tight mb-2">Need a resume to go with it?</h2>
          <p className="text-[14px] text-neutral-50 mb-6">Build a matching ATS-friendly resume in under 10 minutes — free, no account required.</p>
          <Link
            href="/builder/new"
            className="inline-flex items-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-xl hover:bg-primary-dark transition-colors shadow-md text-[14px]"
          >
            Build My Resume for Free
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>
    </>
  );
}
