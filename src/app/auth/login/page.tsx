import { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { LoginForm } from './login-form';

export const metadata: Metadata = {
  title: 'Sign In – Resumly',
  description: 'Sign in to your Resumly account to access your resumes.',
  robots: 'noindex',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-neutral-10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">R</span>
            </div>
            <span className="text-2xl font-bold text-neutral-90">
              resumly<span className="text-primary">.app</span>
            </span>
          </Link>
          <h1 className="text-[28px] font-medium text-neutral-90 tracking-tight">Welcome back</h1>
          <p className="text-neutral-50 mt-2">Sign in to access your resumes</p>
        </div>
        <Suspense fallback={<div className="bg-white rounded-2xl border border-neutral-20 p-8 h-72 animate-pulse" />}>
          <LoginForm />
        </Suspense>
        <p className="text-center text-sm text-neutral-50 mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/auth/signup" className="text-primary hover:text-primary-dark font-medium">
            Create one free
          </Link>
        </p>
      </div>
    </div>
  );
}
