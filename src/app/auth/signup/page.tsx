import { Metadata } from 'next';
import Link from 'next/link';
import { SignupForm } from './signup-form';

export const metadata: Metadata = {
  title: 'Create Free Account – Resumly',
  description: 'Create a free Resumly account and start building your ATS-friendly resume today.',
  robots: 'noindex',
};

export default function SignupPage() {
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
          <h1 className="text-[28px] font-medium text-neutral-90 tracking-tight">Create your free account</h1>
          <p className="text-neutral-50 mt-2">Build your perfect resume in minutes</p>
        </div>
        <SignupForm />
        <p className="text-center text-sm text-neutral-50 mt-6">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-primary hover:text-primary-dark font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
