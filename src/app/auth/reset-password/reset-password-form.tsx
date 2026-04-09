'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);

  // On mount: if we arrived here with a ?code=... (old email links) or #access_token=...
  // (legacy hash flow), exchange it for a session before allowing the form submit.
  useEffect(() => {
    const supabase = createClient();

    async function establishSession() {
      // 1. PKCE: code in query string
      const code = searchParams.get('code');
      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) {
          setError('This reset link has expired or is invalid. Please request a new one.');
          return;
        }
        setSessionReady(true);
        return;
      }

      // 2. Legacy hash flow: #access_token=...&refresh_token=...
      if (typeof window !== 'undefined' && window.location.hash) {
        const hash = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hash.get('access_token');
        const refreshToken = hash.get('refresh_token');
        if (accessToken && refreshToken) {
          const { error: setErr } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (setErr) {
            setError('This reset link has expired or is invalid. Please request a new one.');
            return;
          }
          setSessionReady(true);
          return;
        }
      }

      // 3. Already signed in (e.g. came through /auth/callback)
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setSessionReady(true);
        return;
      }

      setError('This reset link has expired or is invalid. Please request a new one.');
    }

    establishSession();
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!sessionReady) {
      setError('This reset link has expired or is invalid. Please request a new one.');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password });

      if (error) {
        setError(error.message);
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center">
        <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-[18px] font-semibold text-neutral-90 mb-2">Password updated!</h3>
        <p className="text-neutral-50 text-[14px] leading-relaxed">
          Your password has been successfully reset. Redirecting to your dashboard...
        </p>
        <div className="mt-4">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="New password"
        type="password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <Input
        label="Confirm password"
        type="password"
        placeholder="••••••••"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          {error}
          {!sessionReady && (
            <div className="mt-2">
              <a href="/auth/forgot-password" className="text-red-800 font-semibold underline">
                Request a new reset link
              </a>
            </div>
          )}
        </div>
      )}
      <Button type="submit" size="lg" loading={loading} disabled={!sessionReady} className="w-full">
        Update Password
      </Button>
    </form>
  );
}
