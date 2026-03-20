import { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { ResetPasswordForm } from './reset-password-form';

export const metadata: Metadata = {
  title: 'Set New Password – Resumly',
  description: 'Set a new password for your Resumly account.',
  robots: 'noindex',
};

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left panel - branding */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[540px] bg-primary relative flex-col justify-between p-12 overflow-hidden flex-shrink-0">
        <div className="absolute inset-0 opacity-[0.07]">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full border-[40px] border-white" />
          <div className="absolute bottom-10 -left-10 w-60 h-60 rounded-full border-[30px] border-white" />
        </div>
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3 mb-16">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <span className="text-xl font-semibold text-white tracking-tight">resumly<span className="text-white/70">.app</span></span>
          </Link>
          <h2 className="text-[36px] leading-[1.2] font-medium text-white tracking-tight mb-5">Almost there!</h2>
          <p className="text-white/70 text-[17px] leading-relaxed max-w-[360px]">Choose a strong password to secure your account.</p>
        </div>
        <div className="relative z-10 space-y-4">
          {['Use at least 8 characters', 'Mix letters and numbers', 'Include special characters'].map((text) => (
            <div key={text} className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">&#10003;</span>
              </div>
              <span className="text-white/80 text-[15px]">{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 bg-white flex items-center justify-center p-6 sm:p-8">
        <div className="w-full max-w-[420px]">
          <div className="text-center mb-8 lg:hidden">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
                <span className="text-white font-bold">R</span>
              </div>
              <span className="text-xl font-semibold text-neutral-90 tracking-tight">resumly<span className="text-primary">.app</span></span>
            </Link>
          </div>
          <div className="mb-8">
            <h1 className="text-[28px] font-medium text-neutral-90 tracking-tight">Set new password</h1>
            <p className="text-neutral-50 mt-1.5 text-[15px]">Enter your new password below</p>
          </div>
          <Suspense fallback={<div className="rounded-xl h-48 animate-pulse bg-neutral-10" />}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
