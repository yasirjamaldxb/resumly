import { Metadata } from 'next';
import Link from 'next/link';
import { SignupForm } from './signup-form';

export const metadata: Metadata = {
  title: 'Create an Account – Resumly',
  description: 'Create a Resumly account and start building your ATS-friendly resume today.',
  robots: 'noindex',
};

export default function SignupPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left panel - product preview */}
      <div className="hidden lg:flex lg:w-[480px] xl:w-[540px] bg-primary relative flex-col justify-between p-12 overflow-hidden flex-shrink-0">
        <div className="relative z-10">
          <Link href="/" className="inline-flex items-center gap-3 mb-12">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">R</span>
            </div>
            <span className="text-lg font-semibold text-white tracking-tight">resumly<span className="text-white/50">.app</span></span>
          </Link>
          <h2 className="text-[30px] leading-[1.25] font-medium text-white tracking-tight mb-3">Build your resume.<br />Land the interview.</h2>
          <p className="text-white/50 text-[15px] mb-8">ATS-optimized, ready in minutes.</p>

          {/* Mini resume card mockup */}
          <div className="bg-white rounded-xl shadow-2xl p-5 mb-5 relative">
            {/* ATS badge */}
            <div className="absolute -top-3 -right-3 bg-green-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              ATS 100%
            </div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">AS</div>
              <div>
                <div className="text-[13px] font-bold text-neutral-90">Alex Smith</div>
                <div className="text-[11px] text-primary font-medium">Senior Marketing Manager</div>
              </div>
            </div>
            <div className="space-y-1.5 mb-3">
              <div className="h-1.5 bg-neutral-10 rounded w-full" />
              <div className="h-1.5 bg-neutral-10 rounded w-5/6" />
              <div className="h-1.5 bg-neutral-10 rounded w-4/5" />
            </div>
            <div className="text-[10px] font-semibold text-neutral-50 uppercase tracking-wide mb-1.5">Skills</div>
            <div className="flex flex-wrap gap-1">
              {['SEO', 'Google Ads', 'HubSpot', 'Data Analysis', 'Leadership'].map(s => (
                <span key={s} className="bg-primary/10 text-primary text-[10px] font-medium px-2 py-0.5 rounded">{s}</span>
              ))}
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-3">
            {[
              { n: '1', label: 'Pick a template', sub: '10 ATS-friendly designs' },
              { n: '2', label: 'Fill in your details', sub: 'AI helps you write' },
              { n: '3', label: 'Download as PDF', sub: 'Real text, not an image' },
            ].map(({ n, label, sub }) => (
              <div key={n} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-white/10 text-white text-[12px] font-bold flex items-center justify-center flex-shrink-0">{n}</div>
                <div>
                  <div className="text-white text-[13px] font-medium">{label}</div>
                  <div className="text-white/40 text-[12px]">{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10 text-white/30 text-[12px]">No credit card required</div>
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
            <h1 className="text-[28px] font-medium text-neutral-90 tracking-tight">Create your account</h1>
            <p className="text-neutral-50 mt-1.5 text-[15px]">Build your perfect resume in minutes</p>
          </div>
          <SignupForm />
          <p className="text-center text-[14px] text-neutral-50 mt-8">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-primary hover:text-primary-dark font-semibold">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
