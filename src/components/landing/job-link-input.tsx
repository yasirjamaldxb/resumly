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
      router.push('/dashboard');
      return;
    }
    setLoading(true);

    if (looksLikeUrl(trimmed)) {
      const url = trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;
      router.push(`/job-preview?url=${encodeURIComponent(url)}`);
    } else {
      const encoded = encodeURIComponent(trimmed);
      router.push(`/job-preview?text=${encoded}`);
    }
  };

  const charCount = input.trim().length;
  const isText = input.trim().length > 0 && !looksLikeUrl(input);
  const textTooShort = isText && charCount < 50;

  return (
    <div className="w-full">
      {/* Flowing gradient border keyframes */}
      <style jsx>{`
        @keyframes gradientFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .gradient-border {
          position: relative;
        }
        .gradient-border::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 16px;
          padding: 2px;
          background: linear-gradient(
            90deg,
            #e2e8f0,
            #bfdbfe,
            #93c5fd,
            #60a5fa,
            #93c5fd,
            #bfdbfe,
            #e2e8f0
          );
          background-size: 300% 100%;
          animation: gradientFlow 3s ease infinite;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          z-index: 0;
        }
      `}</style>

      <form onSubmit={handleSubmit}>
        <div className="relative group">
          {/* Soft glow behind the card */}
          <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-200/20 via-blue-300/25 to-blue-200/20 rounded-[22px] blur-xl opacity-50 group-hover:opacity-75 group-focus-within:opacity-90 transition-opacity duration-500" />

          {/* Animated gradient border wrapper */}
          <div className="gradient-border relative bg-white rounded-2xl shadow-[0_2px_16px_-2px_rgba(147,197,253,0.3),0_6px_32px_-6px_rgba(0,0,0,0.06)] group-hover:shadow-[0_4px_24px_-2px_rgba(147,197,253,0.4),0_8px_40px_-6px_rgba(0,0,0,0.08)] focus-within:shadow-[0_4px_28px_-2px_rgba(147,197,253,0.45),0_8px_40px_-6px_rgba(0,0,0,0.08)] transition-shadow duration-300">
            {/* Inner content */}
            <div className="relative z-10 rounded-2xl overflow-hidden">
              <div className={`flex ${isExpanded ? 'items-end' : 'items-center'} pl-4 pr-2 py-2 gap-2`}>
                {/* Icon */}
                <div className={`flex-shrink-0 ${isExpanded ? 'pb-1.5' : ''}`}>
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
                    const pasted = e.clipboardData.getData('text');
                    if (pasted.length > 80 || pasted.includes('\n')) {
                      setIsExpanded(true);
                    }
                  }}
                  placeholder="Paste a job link or full job description (min 50 characters)"
                  rows={isExpanded ? 4 : 1}
                  className={`flex-1 py-3 text-[16px] bg-transparent focus:outline-none placeholder:text-neutral-30 text-neutral-90 min-w-0 resize-none ${isExpanded ? 'leading-relaxed' : 'leading-normal overflow-hidden whitespace-nowrap'}`}
                  style={!isExpanded ? { height: '48px' } : undefined}
                />

                {/* Submit button - vertically centered */}
                <div className={`flex-shrink-0 ${isExpanded ? 'pb-0.5' : ''}`}>
                  <button
                    type="submit"
                    disabled={loading || textTooShort}
                    className="px-6 py-3 bg-primary text-white text-[14px] font-semibold rounded-xl hover:bg-primary-dark transition-all disabled:opacity-50 whitespace-nowrap flex items-center gap-2"
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
        </div>
      </form>
    </div>
  );
}
