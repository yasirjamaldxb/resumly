import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function HeroSection() {
  return (
    <section className="relative bg-neutral-10 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6 pt-12 pb-16">
        <div className="grid lg:grid-cols-2 gap-8 items-center min-h-[460px]">
          {/* Left content */}
          <div className="max-w-[480px]">
            <h1 className="text-[40px] lg:text-[48px] font-medium text-neutral-90 leading-[1.05] tracking-[-0.02em] mb-5">
              This resume
              <br />
              builder gets you
              <br />
              <span className="text-primary">an interview</span>
            </h1>

            <p className="text-[16px] text-neutral-60 mb-7 leading-relaxed max-w-[400px]">
              Only 2% of resumes win. Yours will be one of them.
            </p>

            <div className="flex flex-wrap gap-3 mb-8">
              <Button size="lg" asChild>
                <Link href="/resume-builder">Create my resume</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/resume-templates">Browse templates</Link>
              </Button>
            </div>

            {/* Trust signals */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-[13px]">
                <svg className="w-4.5 h-4.5 text-green-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-neutral-60"><strong className="text-neutral-90">ATS-optimized</strong> templates that pass screening software</span>
              </div>
              <div className="flex items-center gap-2 text-[13px]">
                <svg className="w-4.5 h-4.5 text-green-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-neutral-60"><strong className="text-neutral-90">Text-based PDF</strong> downloads — not images, real text</span>
              </div>
              <div className="flex items-center gap-2 text-[13px]">
                <svg className="w-4.5 h-4.5 text-green-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-neutral-60"><strong className="text-neutral-90">100% free</strong> — no hidden fees, no credit card required</span>
              </div>
            </div>
          </div>

          {/* Right side - Rich floating UI mockup */}
          <div className="relative hidden lg:block h-[460px]">
            {/* Main resume document */}
            <div className="absolute top-6 left-12 w-[300px] bg-white rounded-lg shadow-lg border border-neutral-20 p-4 z-10">
              <div className="mb-3">
                <div className="text-primary text-[16px] font-semibold mb-0.5">Alice Hart</div>
                <div className="text-neutral-50 text-[12px]">Math Teacher</div>
              </div>
              <div className="mb-3">
                <div className="text-[10px] text-neutral-40 mb-1.5 leading-relaxed">
                  <span className="text-neutral-70">Enthusiastic math teacher with over 8 years experience in a nurturing and encouraging learning environment.</span>
                </div>
              </div>
              <div className="mb-2">
                <div className="text-primary text-[11px] font-semibold mb-1.5">Employment History</div>
                <div className="text-[10px] text-neutral-50 leading-relaxed">
                  Tuscaloosa County High School at University of Alabama
                </div>
                <div className="text-[9px] text-neutral-40 mt-0.5">September 2017 — Present</div>
                <ul className="mt-1.5 space-y-0.5">
                  <li className="text-[9px] text-neutral-50 flex gap-1"><span>•</span>Provide stellar, engaging instruction to high school students</li>
                  <li className="text-[9px] text-neutral-50 flex gap-1"><span>•</span>Develop collaborative lesson plans and materials</li>
                </ul>
              </div>
            </div>

            {/* Person photo circle */}
            <div className="absolute top-2 right-16 w-[100px] h-[100px] rounded-full bg-gradient-to-br from-pink-200 via-pink-100 to-orange-100 z-20 flex items-end justify-center overflow-hidden">
              <div className="w-[65px] h-[75px] bg-gradient-to-b from-pink-300 to-pink-200 rounded-t-full" />
            </div>

            {/* Resume Score badge */}
            <div className="absolute top-[120px] left-0 bg-white rounded-xl shadow-lg border border-neutral-20 px-3 py-2.5 z-30 flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center">
                <span className="text-white text-[12px] font-bold">81%</span>
              </div>
              <div>
                <div className="text-[12px] font-semibold text-neutral-90">Resume</div>
                <div className="text-[11px] text-neutral-50">Score</div>
              </div>
            </div>

            {/* ATS Perfect badge */}
            <div className="absolute top-[85px] right-4 bg-primary/10 border border-primary/20 rounded-full px-3 py-1.5 z-30 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
              </svg>
              <span className="text-[12px] font-semibold text-primary">ATS Perfect</span>
            </div>

            {/* Skills tags */}
            <div className="absolute bottom-[110px] right-0 bg-white rounded-xl shadow-lg border border-neutral-20 p-3.5 z-20 w-[185px]">
              <div className="text-[12px] font-semibold text-neutral-90 mb-2.5 flex items-center gap-1.5">
                Skills <svg className="w-3 h-3 text-neutral-40" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {['Management Skills', 'Analytical Thinking', 'Leadership'].map(skill => (
                  <span key={skill} className="px-2 py-0.5 bg-neutral-10 rounded text-[10px] text-neutral-70 font-medium">{skill}</span>
                ))}
              </div>
              <button className="mt-1.5 text-[11px] text-primary font-medium flex items-center gap-1">
                + Add skill
              </button>
            </div>

            {/* AI Coach bar */}
            <div className="absolute bottom-[40px] left-8 bg-white rounded-xl shadow-lg border border-neutral-20 px-3.5 py-2.5 z-30 flex items-center gap-2.5 w-[260px]">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center flex-shrink-0">
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <span className="text-[12px] text-neutral-50">Ask AI coach anything...</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
