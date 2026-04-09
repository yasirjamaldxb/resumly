'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function CTAInput() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    setLoading(true);
    const looksLikeUrl = /^https?:\/\//i.test(trimmed) || /^(www\.)?[a-z0-9-]+\.[a-z]{2,}/i.test(trimmed);
    if (looksLikeUrl) {
      const url = trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;
      router.push(`/job-preview?url=${encodeURIComponent(url)}`);
    } else {
      router.push(`/job-preview?text=${encodeURIComponent(trimmed)}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-xl p-1.5 border border-white/20">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste a job link here..."
        className="flex-1 px-4 py-3 bg-transparent text-white text-[14px] placeholder:text-white/50 focus:outline-none min-w-0"
      />
      <button
        type="submit"
        disabled={loading || !input.trim()}
        className="px-6 py-3 bg-white text-primary text-[14px] font-semibold rounded-lg hover:bg-neutral-10 transition-all disabled:opacity-50 whitespace-nowrap flex-shrink-0"
      >
        {loading ? 'Going...' : 'Tailor my resume'}
      </button>
    </form>
  );
}
