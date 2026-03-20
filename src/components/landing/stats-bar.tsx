const features = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'A draft in 10 mins',
    desc: 'Our step-by-step builder is 10x faster than starting from scratch.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'ATS-compatible PDFs',
    desc: 'Text-based PDFs that pass every applicant tracking system.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
    title: '10 tested templates',
    desc: 'Recruiter-approved designs for every industry and experience level.',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
      </svg>
    ),
    title: 'Stand out from the crowd',
    desc: 'Professional formatting that makes recruiters take notice.',
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
            Build your <span className="text-primary font-semibold">perfect resume</span> in minutes
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
