import Image from 'next/image';
import { JobLinkInput } from '@/components/landing/job-link-input';

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#f0f4ff] via-[#f6f8ff] to-white">
      {/* Decorative blobs */}
      <div className="absolute top-[-120px] right-[-80px] w-[400px] h-[400px] bg-primary/[0.07] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-[-60px] left-[-100px] w-[350px] h-[350px] bg-blue-400/[0.06] rounded-full blur-[90px] pointer-events-none" />

      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.3] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, #94a3b8 0.5px, transparent 0.5px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative max-w-[1100px] mx-auto px-6 pt-20 pb-20">
        <div className="grid lg:grid-cols-[1fr_380px] gap-12 items-center">

          {/* Left */}
          <div>
            {/* Trust pill */}
            <div className="mb-6">
              <div className="inline-flex items-center gap-2.5 bg-white/80 backdrop-blur-sm border border-neutral-20/60 rounded-full px-3.5 py-1.5 shadow-sm">
                <div className="flex -space-x-1.5">
                  {[
                    'bg-gradient-to-br from-blue-400 to-indigo-500',
                    'bg-gradient-to-br from-emerald-400 to-teal-500',
                    'bg-gradient-to-br from-violet-400 to-purple-500',
                    'bg-gradient-to-br from-amber-400 to-orange-500',
                    'bg-gradient-to-br from-rose-400 to-pink-500',
                  ].map((bg, i) => (
                    <div key={i} className={`w-[20px] h-[20px] rounded-full ${bg} ring-[1.5px] ring-white flex items-center justify-center`}>
                      <svg className="w-2.5 h-2.5 text-white/90" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                  ))}
                </div>
                <span className="text-[11px] text-neutral-50 font-medium">Trusted by 2,000+ professionals</span>
              </div>
            </div>

            {/* Headline: pain-first, outcome-driven */}
            <h1 className="text-[36px] sm:text-[46px] lg:text-[52px] font-bold text-neutral-90 leading-[1.08] tracking-[-0.03em] mb-4">
              One job link.
              <br />
              <span className="bg-gradient-to-r from-primary via-blue-500 to-cyan-500 bg-clip-text text-transparent">
                Complete application.
              </span>
            </h1>

            <p className="text-[17px] text-neutral-50 mb-8 leading-relaxed max-w-[460px]">
              Paste any job link or description and Resumly builds everything you need to apply: tailored resume, cover letter, ATS optimization, and application tracking. All in under 5 minutes.
            </p>

            {/* THE INPUT */}
            <div className="mb-4 max-w-[560px]">
              <JobLinkInput />
            </div>

            {/* Free badge + what you get */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <span className="inline-flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 text-[12px] font-semibold px-3 py-1 rounded-full">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                First application free
              </span>
              <span className="text-[12px] text-neutral-40 font-medium">Resume + Cover Letter + ATS Check</span>
              <span className="text-neutral-20">·</span>
              <span className="text-[12px] text-neutral-40 font-medium">No credit card</span>
            </div>
          </div>

          {/* Right: visual proof */}
          <div className="hidden lg:block relative">
            <div className="relative">
              <div className="w-full aspect-[1/1.35] bg-white rounded-2xl shadow-2xl border border-neutral-20/60 overflow-hidden">
                <Image
                  src="/templates/professional.png"
                  alt="AI-generated resume tailored to job description"
                  width={794}
                  height={1123}
                  className="w-full h-full object-cover object-top"
                  quality={85}
                  priority
                />
              </div>

              {/* ATS score badge */}
              <div className="absolute -left-8 top-[35%] bg-white rounded-xl shadow-lg border border-neutral-20/60 px-3 py-2.5 flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center">
                  <span className="text-white text-[12px] font-bold">92%</span>
                </div>
                <div>
                  <div className="text-[11px] font-semibold text-neutral-80">ATS Score</div>
                  <div className="text-[10px] text-green-600 font-medium">Excellent match</div>
                </div>
              </div>

              {/* Tailored for tag */}
              <div className="absolute -right-4 top-6 bg-white rounded-lg shadow-lg border border-neutral-20/60 px-3 py-2">
                <div className="text-[10px] text-neutral-40 mb-0.5">Tailored for</div>
                <div className="text-[12px] font-semibold text-neutral-80">Product Designer at Stripe</div>
              </div>

              {/* Cover letter indicator */}
              <div className="absolute -right-2 bottom-[30%] bg-white rounded-lg shadow-lg border border-neutral-20/60 px-3 py-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                <div>
                  <div className="text-[11px] font-semibold text-neutral-80">Cover Letter</div>
                  <div className="text-[10px] text-green-600 font-medium">Auto-generated</div>
                </div>
              </div>

              {/* Keywords matched */}
              <div className="absolute -left-4 bottom-12 bg-white rounded-lg shadow-lg border border-neutral-20/60 px-3 py-2">
                <div className="text-[10px] text-neutral-40 mb-1.5">Keywords matched</div>
                <div className="flex flex-wrap gap-1">
                  {['Figma', 'Design Systems', 'User Research'].map(k => (
                    <span key={k} className="px-1.5 py-0.5 bg-primary/8 rounded text-[9px] text-primary font-medium">{k}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
