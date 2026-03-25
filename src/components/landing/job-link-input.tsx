'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function JobLinkInput() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      // No URL entered — go straight to builder
      router.push('/builder/new');
      return;
    }
    setLoading(true);
    // Send to job preview page first (shows value before asking for login)
    const encoded = encodeURIComponent(url.trim());
    router.push(`/job-preview?url=${encoded}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2.5 w-full max-w-[480px]">
      <div className="relative flex-1">
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-neutral-40"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
          />
        </svg>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste a job link from LinkedIn, Indeed..."
          className="w-full pl-10 pr-4 py-3 text-[14px] bg-white border border-neutral-20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary placeholder:text-neutral-40 text-neutral-90 shadow-sm"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="px-6 py-3 bg-primary text-white text-[14px] font-semibold rounded-lg hover:bg-primary-dark transition-colors shadow-sm disabled:opacity-50 whitespace-nowrap flex items-center justify-center gap-2"
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
    </form>
  );
}
