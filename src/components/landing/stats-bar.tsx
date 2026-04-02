const features = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757" />
      </svg>
    ),
    title: 'Paste any job link',
    desc: 'We extract the role, company, and requirements instantly.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
    title: 'AI tailors your CV',
    desc: 'Your resume is rewritten to match the job description.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'ATS-optimized output',
    desc: 'Text-based PDFs that pass every applicant tracking system.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
      </svg>
    ),
    title: 'Land more interviews',
    desc: 'Your application stands out to recruiters and hiring managers.',
  },
];

export function StatsBar() {
  return (
    <section className="py-10 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Value prop */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-[22px] sm:text-[28px] font-medium text-neutral-90 tracking-tight">
            From <span className="text-primary font-semibold">job link</span> to <span className="text-primary font-semibold">tailored resume</span> in minutes
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10">
          {features.map((f) => (
            <div key={f.title} className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 text-neutral-50 flex items-center justify-center">
                {f.icon}
              </div>
              <h3 className="text-[14px] font-semibold text-neutral-90 mb-1">{f.title}</h3>
              <p className="text-[13px] text-neutral-50 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
