'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const [jobContext, setJobContext] = useState<{ title: string; company: string | null } | null>(null);

  const redirectTo = searchParams.get('redirectTo') || '/dashboard';
  const jobParam = searchParams.get('job'); // job URL passed via query param

  // Read job context from localStorage (set by job-preview page)
  useEffect(() => {
    try {
      const stored = localStorage.getItem('resumly_job_context');
      if (stored) {
        const ctx = JSON.parse(stored);
        if (ctx?.title) setJobContext(ctx);
      }
    } catch {}
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Preserve job param through email login
      const finalRedirect = jobParam
        ? `${redirectTo}?job=${encodeURIComponent(jobParam)}`
        : redirectTo;
      router.push(finalRedirect);
      router.refresh();
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    const supabase = createClient();
    const origin = window.location.origin;
    // Pass job URL and redirect destination through the OAuth callback
    let callbackUrl = `${origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`;
    if (jobParam) callbackUrl += `&job=${encodeURIComponent(jobParam)}`;
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: callbackUrl },
    });
  };

  return (
    <div>
      {/* Contextual job banner — shown when coming from job-preview */}
      {jobContext && (
        <div className="flex items-center gap-2.5 bg-primary/5 border border-primary/15 rounded-xl px-4 py-3 mb-6">
          <svg className="w-4 h-4 text-primary flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <p className="text-[13px] text-neutral-70">
            Creating your tailored resume for{' '}
            <span className="font-semibold text-neutral-90">{jobContext.title}</span>
            {jobContext.company ? <span className="text-neutral-50"> at {jobContext.company}</span> : ''}
          </p>
        </div>
      )}
      <Button
        variant="outline"
        size="lg"
        className="w-full gap-3 mb-6"
        onClick={handleGoogle}
        loading={googleLoading}
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        Continue with Google
      </Button>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-neutral-20" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-3 text-neutral-40">or</span>
        </div>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <Input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div>
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="flex justify-end mt-1.5">
            <a href="/auth/forgot-password" className="text-[13px] text-primary hover:text-primary-dark font-medium transition-colors">
              Forgot password?
            </a>
          </div>
        </div>
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
            {error}
          </div>
        )}
        <Button type="submit" size="lg" loading={loading} className="w-full">
          Sign In
        </Button>
      </form>
    </div>
  );
}
