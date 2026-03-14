import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-b from-blue-50 via-white to-white overflow-hidden pt-16 pb-24">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100 rounded-full opacity-30 blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-100 rounded-full opacity-20 blur-3xl -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-1.5 text-sm font-medium text-blue-700 mb-8">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            AI-Powered • ATS-Optimized • Free Forever
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-tight tracking-tight mb-6">
            The resume builder
            <br />
            <span className="text-blue-600">that gets you hired</span>
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Create a job-winning, ATS-friendly resume in minutes. Our AI suggests the perfect words,
            expert templates ensure you stand out, and real-time feedback boosts your score.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="xl" asChild>
              <Link href="/resume-builder">
                Build My Free Resume →
              </Link>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <Link href="/resume-examples">
                See Resume Examples
              </Link>
            </Button>
          </div>

          {/* Trust signals */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              No credit card required
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Download PDF instantly
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              99% ATS pass rate
            </div>
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Trusted by 100,000+ job seekers
            </div>
          </div>
        </div>

        {/* Hero visual - Resume mockup */}
        <div className="mt-16 relative max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            {/* Browser chrome */}
            <div className="bg-gray-100 border-b border-gray-200 px-4 py-3 flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 bg-white rounded-lg px-3 py-1 text-xs text-gray-500 text-center">
                resumly.app/builder
              </div>
            </div>

            {/* App mockup */}
            <div className="flex h-[420px]">
              {/* Form panel */}
              <div className="w-80 border-r border-gray-200 p-4 bg-white space-y-3 overflow-hidden">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 bg-blue-600 rounded" />
                  <div className="h-3 bg-gray-200 rounded w-24" />
                </div>
                {/* Form fields mockup */}
                {[
                  { label: 'First Name', width: 'w-20' },
                  { label: 'Job Title', width: 'w-32' },
                  { label: 'Email', width: 'w-36' },
                ].map((field) => (
                  <div key={field.label} className="space-y-1">
                    <div className="h-2.5 bg-gray-200 rounded w-16" />
                    <div className={`h-8 bg-gray-50 border border-gray-200 rounded-lg flex items-center px-3`}>
                      <div className={`h-2 bg-gray-300 rounded ${field.width}`} />
                    </div>
                  </div>
                ))}
                <div className="pt-2">
                  <div className="h-2.5 bg-gray-200 rounded w-24 mb-1.5" />
                  <div className="h-20 bg-gray-50 border border-gray-200 rounded-lg p-2 space-y-1">
                    <div className="h-2 bg-gray-200 rounded w-full" />
                    <div className="h-2 bg-gray-200 rounded w-4/5" />
                    <div className="h-2 bg-gray-200 rounded w-full" />
                  </div>
                </div>
                {/* AI button */}
                <div className="flex gap-2">
                  <div className="flex-1 h-9 bg-blue-600 rounded-lg flex items-center justify-center gap-1.5">
                    <div className="w-3 h-3 bg-white rounded-full opacity-80" />
                    <div className="h-2 bg-white rounded w-16 opacity-80" />
                  </div>
                </div>
              </div>

              {/* Preview panel */}
              <div className="flex-1 bg-gray-50 p-4 flex items-center justify-center">
                <div className="bg-white shadow-lg rounded w-52 h-72 p-3">
                  {/* Fake resume */}
                  <div className="border-b-2 border-blue-600 pb-2 mb-2">
                    <div className="h-4 bg-gray-800 rounded w-3/4 mb-1" />
                    <div className="h-2.5 bg-blue-600 rounded w-1/2 mb-1" />
                    <div className="flex gap-2">
                      <div className="h-2 bg-gray-300 rounded w-16" />
                      <div className="h-2 bg-gray-300 rounded w-16" />
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="h-2 bg-blue-600 rounded w-20 mb-1.5" />
                    <div className="space-y-1">
                      <div className="h-1.5 bg-gray-200 rounded w-full" />
                      <div className="h-1.5 bg-gray-200 rounded w-5/6" />
                      <div className="h-1.5 bg-gray-200 rounded w-4/5" />
                    </div>
                  </div>
                  <div>
                    <div className="h-2 bg-blue-600 rounded w-20 mb-1.5" />
                    <div className="flex flex-wrap gap-1">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-3 bg-gray-100 border border-gray-200 rounded px-1" style={{ width: `${30 + i * 8}px` }} />
                      ))}
                    </div>
                  </div>

                  {/* ATS badge */}
                  <div className="mt-3 bg-green-50 border border-green-200 rounded p-1.5 flex items-center gap-1.5">
                    <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0" />
                    <div className="h-2 bg-green-300 rounded w-16" />
                    <div className="h-2 bg-green-600 rounded w-8 ml-auto" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
