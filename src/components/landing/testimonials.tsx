const benefits = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Built for ATS',
    description: 'Every resume is designed to pass Applicant Tracking Systems. Your application reaches real humans.not filtered out by software that can\'t read your PDF.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
    title: 'AI That Understands Jobs',
    description: 'Our AI reads the job description, identifies what matters, and rewrites your resume to match.right keywords, right tone, right format. No generic templates.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25z" />
      </svg>
    ),
    title: 'One Platform, Every Application',
    description: 'Resume, cover letter, application tracking.all in one place. No more juggling between LinkedIn, Google Docs, and spreadsheets. Resumly is your complete job search hub.',
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-16 bg-neutral-10">
      <div className="max-w-[1200px] mx-auto px-6">
        <h2 className="text-[28px] sm:text-[34px] font-medium text-neutral-90 text-center mb-3 tracking-tight leading-tight">
          Why job seekers choose Resumly
        </h2>
        <p className="text-[14px] text-neutral-50 text-center mb-10 max-w-[500px] mx-auto">
          We built the job search tool we wished existed. Not just a resume builder.a complete application companion.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {benefits.map((benefit) => (
            <div key={benefit.title} className="bg-white rounded-2xl border border-neutral-20 p-6 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                {benefit.icon}
              </div>
              <h3 className="text-[16px] font-semibold text-neutral-90 mb-2">{benefit.title}</h3>
              <p className="text-[13px] text-neutral-50 leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
