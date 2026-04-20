'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { track } from '@/lib/analytics-client';

interface ExtensionPayload {
  jsonLd: {
    title?: string;
    company?: string;
    location?: string;
    description?: string;
    employmentType?: string;
    salary?: string;
  } | null;
  meta: Record<string, string>;
  text: string;
  url: string;
  pageTitle: string;
}

export default function ImportPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'parsing' | 'saving' | 'login' | 'error'>('loading');
  const [jobTitle, setJobTitle] = useState('');
  const [jobCompany, setJobCompany] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function processImport() {
      // Read data from URL hash
      const hash = window.location.hash;
      if (!hash || !hash.includes('data=')) {
        setErrorMsg('No job data received. Make sure you\'re using the Resumly browser extension.');
        setStatus('error');
        return;
      }

      const encoded = hash.split('data=')[1];
      if (!encoded) {
        setErrorMsg('Invalid data. Try importing again.');
        setStatus('error');
        return;
      }

      let payload: ExtensionPayload;
      try {
        const jsonStr = decodeURIComponent(escape(atob(encoded)));
        payload = JSON.parse(jsonStr);
      } catch {
        setErrorMsg('Could not decode the imported data. Try importing again.');
        setStatus('error');
        return;
      }

      // Fire analytics — extension drove a job-import, with source hostname
      try {
        const host = new URL(payload.url || 'https://unknown').hostname.replace(/^www\./, '');
        track('cta_click', { source: 'chrome_extension', action: 'import_started', host });
      } catch {
        track('cta_click', { source: 'chrome_extension', action: 'import_started' });
      }

      // Show what we're importing
      const title = payload.jsonLd?.title || payload.meta?.['og:title'] || payload.pageTitle || '';
      const company = payload.jsonLd?.company || payload.meta?.['og:site_name'] || '';
      setJobTitle(title.replace(/\s*[-|–—]\s*(LinkedIn|Indeed|Glassdoor|Monster|ZipRecruiter|Careers).*$/i, '').trim());
      setJobCompany(company);

      // Check auth
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        // Store data for after login
        localStorage.setItem('resumly_import_data', JSON.stringify(payload));
        setStatus('login');
        return;
      }

      // Parse the job data
      setStatus('parsing');

      try {
        // Determine what to send to parse API
        let parseBody: Record<string, string>;

        if (payload.jsonLd?.title) {
          // We have structured data — send as text with structured format
          const parts = [
            payload.jsonLd.title,
            payload.jsonLd.company ? `Company: ${payload.jsonLd.company}` : '',
            payload.jsonLd.location ? `Location: ${payload.jsonLd.location}` : '',
            payload.jsonLd.description || '',
            payload.text.slice(0, 5000),
          ].filter(Boolean);
          parseBody = { text: parts.join('\n\n') };
        } else {
          // Send full page text
          parseBody = { text: payload.text.slice(0, 10000) };
        }

        const parseRes = await fetch('/api/jobs/parse', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(parseBody),
        });
        const parseData = await parseRes.json();

        if (!parseRes.ok || !parseData.job) {
          setErrorMsg(parseData.message || 'Could not extract job details from the imported page.');
          setStatus('error');
          return;
        }

        // Save job
        setStatus('saving');
        const saveRes = await fetch('/api/jobs/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...parseData.job,
            url: payload.url,
            raw_text: payload.text.slice(0, 2000),
          }),
        });
        const saveResult = await saveRes.json();

        if (saveResult.id) {
          router.replace(`/funnel/${saveResult.id}`);
        } else {
          setErrorMsg('Could not save the job. Please try again.');
          setStatus('error');
        }
      } catch {
        setErrorMsg('Something went wrong. Please try again.');
        setStatus('error');
      }
    }

    processImport();
  }, [router]);

  const handleLogin = async () => {
    const supabase = createClient();
    const origin = window.location.origin;
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${origin}/auth/callback?next=/import${window.location.hash}`,
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#f7f9fc]">
      <header className="bg-white border-b border-neutral-10 px-5 py-3.5 flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs">R</span>
          </div>
          <span className="font-semibold text-[15px] text-neutral-90 tracking-tight">resumly<span className="text-primary">.app</span></span>
        </Link>
      </header>

      <div className="max-w-[440px] mx-auto px-5 py-10 sm:py-16">
        {/* Loading / Parsing / Saving */}
        {(status === 'loading' || status === 'parsing' || status === 'saving') && (
          <div className="text-center">
            <div className="relative w-16 h-16 mx-auto mb-5">
              <div className="w-16 h-16 border-[3px] border-primary/20 rounded-full" />
              <div className="absolute inset-0 w-16 h-16 border-[3px] border-primary border-t-transparent rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <h2 className="text-[20px] font-semibold text-neutral-90 mb-2">
              {status === 'loading' ? 'Importing job data...' : status === 'parsing' ? 'Analyzing job listing...' : 'Saving to your account...'}
            </h2>
            {jobTitle && (
              <p className="text-[14px] text-neutral-50">
                {jobTitle}{jobCompany ? ` at ${jobCompany}` : ''}
              </p>
            )}
          </div>
        )}

        {/* Login required */}
        {status === 'login' && (
          <div className="text-center">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <svg className="w-7 h-7 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>

            {jobTitle && (
              <div className="bg-white rounded-xl border border-neutral-15 p-4 mb-5 text-left">
                <div className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full mb-2 uppercase tracking-wide">
                  <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  Imported
                </div>
                <p className="text-[15px] font-semibold text-neutral-90">{jobTitle}</p>
                {jobCompany && <p className="text-[13px] text-neutral-50 mt-0.5">{jobCompany}</p>}
              </div>
            )}

            <h2 className="text-[20px] font-semibold text-neutral-90 mb-2">Sign in to continue</h2>
            <p className="text-[14px] text-neutral-50 mb-5">Create your tailored resume for this role</p>

            <button
              onClick={handleLogin}
              className="w-full flex items-center justify-center gap-3 bg-primary text-white rounded-xl px-6 py-4 text-[15px] font-semibold hover:bg-primary-dark transition-colors shadow-md mb-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#fff" fillOpacity={0.8} />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#fff" fillOpacity={0.7} />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#fff" fillOpacity={0.6} />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#fff" fillOpacity={0.9} />
              </svg>
              Continue with Google
            </button>
          </div>
        )}

        {/* Error */}
        {status === 'error' && (
          <div className="text-center">
            <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <svg className="w-7 h-7 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            </div>
            <h2 className="text-[20px] font-semibold text-neutral-90 mb-2">Import failed</h2>
            <p className="text-[14px] text-neutral-50 mb-5">{errorMsg}</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-3 bg-primary text-white rounded-xl text-[14px] font-semibold hover:bg-primary-dark transition-colors"
            >
              Go to Resumly
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
