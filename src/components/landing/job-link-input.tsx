'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function JobLinkInput() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (!url.trim()) {
      router.push('/builder/new');
      return;
    }
    const encoded = encodeURIComponent(url.trim());
    router.push(`/job-preview?url=${encoded}`);
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit}>
        <div className="relative group">
          {/* Soft glow on hover/focus */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-blue-400/20 to-cyan-400/20 rounded-[20px] blur-lg opacity-0 group-hover:opacity-60 group-focus-within:opacity-80 transition-opacity duration-500" />

          {/* Input pill */}
          <div className="relative flex items-center bg-white border border-neutral-20 rounded-2xl pl-4 pr-2 py-2 gap-2 shadow-lg shadow-neutral-900/[0.04] focus-within:border-primary/40 focus-within:shadow-xl focus-within:shadow-primary/[0.06] transition-all duration-300">
            <svg className="w-5 h-5 text-neutral-30 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="linkedin.com/jobs/view/... or any job URL"
              className="flex-1 py-3 text-[16px] bg-transparent focus:outline-none placeholder:text-neutral-30 text-neutral-90 min-w-0"
            />
            <button
              type="submit"
              disabled={loading}
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
              Tailor my resume
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
