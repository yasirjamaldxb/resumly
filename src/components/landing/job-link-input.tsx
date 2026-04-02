'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

function looksLikeUrl(text: string): boolean {
  const trimmed = text.trim();
  return /^https?:\/\//i.test(trimmed) || /^(www\.)?[a-z0-9-]+\.[a-z]{2,}/i.test(trimmed);
}

export function JobLinkInput() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) {
      router.push('/builder/new');
      return;
    }
    setLoading(true);

    if (looksLikeUrl(trimmed)) {
      // URL mode: go to job preview for parsing
      const url = trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;
      router.push(`/job-preview?url=${encodeURIComponent(url)}`);
    } else {
      // Text mode: send directly to job preview with text param
      const encoded = encodeURIComponent(trimmed);
      router.push(`/job-preview?text=${encoded}`);
    }
  };

  const charCount = input.trim().length;
  const isText = input.trim().length > 0 && !looksLikeUrl(input);
  const textTooShort = isText && charCount < 50;

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit}>
        <div className="relative group">
          {/* Soft glow on hover/focus */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-blue-400/20 to-cyan-400/20 rounded-[20px] blur-lg opacity-0 group-hover:opacity-60 group-focus-within:opacity-80 transition-opacity duration-500" />

          {/* Input container */}
          <div className="relative bg-white border border-neutral-20 rounded-2xl shadow-lg shadow-neutral-900/[0.04] focus-within:border-primary/40 focus-within:shadow-xl focus-within:shadow-primary/[0.06] transition-all duration-300 overflow-hidden">
            <div className="flex items-start pl-4 pr-2 py-2 gap-2">
              {/* Icon */}
              <div className="pt-3 flex-shrink-0">
                {isText ? (
                  <svg className="w-5 h-5 text-primary/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-neutral-30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                )}
              </div>

              {/* Smart input: textarea that grows */}
              <textarea
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  if (e.target.value.includes('\n') || e.target.value.length > 80) {
                    setIsExpanded(true);
                  }
                }}
                onFocus={() => {
                  if (input.length > 80) setIsExpanded(true);
                }}
                onPaste={(e) => {
                  // Auto-expand if pasting long text
                  const pasted = e.clipboardData.getData('text');
                  if (pasted.length > 80 || pasted.includes('\n')) {
                    setIsExpanded(true);
                  }
                }}
                placeholder="Paste a job link or job description"
                rows={isExpanded ? 4 : 1}
                className={`flex-1 py-3 text-[16px] bg-transparent focus:outline-none placeholder:text-neutral-30 text-neutral-90 min-w-0 resize-none ${isExpanded ? 'leading-relaxed' : 'leading-normal overflow-hidden whitespace-nowrap'}`}
                style={!isExpanded ? { height: '48px' } : undefined}
              />

              {/* Submit button */}
              <div className="pt-1 flex-shrink-0">
                <button
                  type="submit"
                  disabled={loading || textTooShort}
                  className="px-6 py-3 bg-primary text-white text-[14px] font-semibold rounded-xl hover:bg-primary-dark transition-all disabled:opacity-50 whitespace-nowrap flex items-center gap-2 flex-shrink-0"
                >
                  {loading ? (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  )}
                  {isText ? 'Analyze' : 'Tailor my resume'}
                </button>
              </div>
            </div>

            {/* Helper text when typing job description */}
            {isText && (
              <div className="px-4 pb-2.5 -mt-1">
                <p className={`text-[11px] ${textTooShort ? 'text-neutral-40' : 'text-green-600'}`}>
                  {textTooShort
                    ? `Paste at least 50 characters (${charCount}/50)`
                    : `${charCount} characters pasted. Ready to analyze.`
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
