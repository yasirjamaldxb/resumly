const benefits = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'ATS-Friendly Format',
    description: 'Every template is designed to pass Applicant Tracking Systems. Your resume gets seen by real humans, not filtered out by software.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
    title: 'Real Text-Based PDFs',
    description: 'Unlike other builders that export images, our PDFs contain real, selectable text. Recruiters and ATS can actually read your content.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: '100% Free Forever',
    description: 'No hidden fees, no premium paywalls, no credit card required. Create unlimited resumes with full access to all 10 templates.',
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
          We built the resume builder we wished existed when we were job hunting. Here&apos;s what makes it different.
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
