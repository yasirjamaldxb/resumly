import { CTAInput } from '@/components/landing/cta-input';

export function CTASection() {
  return (
    <section className="py-16 bg-primary">
      <div className="max-w-[720px] mx-auto px-6 text-center">
        <h2 className="text-[28px] sm:text-[34px] font-medium text-white mb-3 tracking-tight leading-tight">
          Ready to land your
          <br />
          next interview?
        </h2>
        <p className="text-[15px] text-white/80 mb-7">
          Paste a job link and get a tailored resume in minutes. No credit card needed.
        </p>
        <div className="max-w-[480px] mx-auto">
          <CTAInput />
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
          {['AI-Tailored Resumes', 'ATS-Optimized', 'Cover Letters', 'Application Tracking'].map((item) => (
            <div key={item} className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-white/70 font-medium text-[13px]">{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
