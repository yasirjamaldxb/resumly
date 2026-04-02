import Link from 'next/link';

const tools = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
    title: 'AI Resume Builder',
    description: 'Paste a job link and our AI creates a tailored resume that matches the role\'s keywords, skills, and requirements so your application gets noticed.',
    color: 'bg-blue-50',
    iconColor: 'text-primary',
    link: '/',
    linkText: 'Paste a job link',
    mockup: (
      <div className="bg-white/80 rounded-xl p-4 mb-4 min-h-[120px] shadow-sm">
        <div className="flex items-center gap-2 mb-2.5">
          <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center"><div className="w-2 h-2 bg-green-500 rounded-full" /></div>
          <span className="text-[10px] text-neutral-60 font-medium">Keywords matched to job description</span>
        </div>
        <div className="space-y-1.5">
          {['Product Strategy', 'Cross-functional Leadership', 'Data-Driven Decisions'].map(s => (
            <div key={s} className="flex items-center gap-2">
              <svg className="w-3 h-3 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
              <span className="text-[10px] text-neutral-70">{s}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: 'ATS Score Checker',
    description: 'See how your resume scores against the applicant tracking systems employers use. Get actionable tips to improve and make sure your application gets through.',
    color: 'bg-green-50',
    iconColor: 'text-green-600',
    link: '/ats-checker',
    linkText: 'Check your score',
    mockup: (
      <div className="bg-white/80 rounded-xl p-4 mb-4 min-h-[120px] shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-semibold text-neutral-70">ATS Compatibility</span>
          <span className="text-[14px] font-bold text-green-600">92%</span>
        </div>
        <div className="w-full h-2 bg-neutral-10 rounded-full overflow-hidden mb-2">
          <div className="h-full bg-green-500 rounded-full" style={{ width: '92%' }} />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-[9px] text-neutral-50"><span className="text-green-500">&#10003;</span> Proper section headings</div>
          <div className="flex items-center gap-1.5 text-[9px] text-neutral-50"><span className="text-green-500">&#10003;</span> Keywords from job description</div>
          <div className="flex items-center gap-1.5 text-[9px] text-neutral-50"><span className="text-green-500">&#10003;</span> Text-based PDF format</div>
        </div>
      </div>
    ),
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
    title: 'Cover Letter Generator',
    description: 'Auto-generate a matching cover letter from your resume and the job description. Tailored to the role and ready to send. No more staring at a blank page.',
    color: 'bg-purple-50',
    iconColor: 'text-purple-600',
    link: '/',
    linkText: 'Generate a cover letter',
    mockup: (
      <div className="bg-white/80 rounded-xl p-4 mb-4 min-h-[120px] shadow-sm">
        <div className="text-[10px] text-neutral-50 mb-2">Dear Hiring Manager,</div>
        <div className="space-y-1">
          <div className="h-1.5 bg-purple-100 rounded w-full" />
          <div className="h-1.5 bg-purple-100 rounded w-11/12" />
          <div className="h-1.5 bg-purple-100 rounded w-full" />
          <div className="h-1.5 bg-purple-100 rounded w-4/5" />
          <div className="h-1.5 bg-neutral-10 rounded w-full mt-2" />
          <div className="h-1.5 bg-neutral-10 rounded w-3/4" />
        </div>
        <div className="text-[9px] text-purple-600 font-medium mt-2">Tailored to job requirements</div>
      </div>
    ),
  },
];

export function FeaturesSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <h2 className="text-[28px] sm:text-[34px] font-medium text-neutral-90 text-center mb-12 tracking-tight leading-tight">
          Everything you need to land the job
        </h2>

        <div className="grid md:grid-cols-3 gap-5">
          {tools.map((tool) => (
            <div key={tool.title} className={`${tool.color} rounded-2xl p-6 transition-all hover:shadow-lg group`}>
              <div className={`w-10 h-10 rounded-xl bg-white flex items-center justify-center mb-4 ${tool.iconColor} shadow-sm`}>
                {tool.icon}
              </div>
              <h3 className="text-[18px] font-semibold text-neutral-90 mb-1.5">{tool.title}</h3>
              <p className="text-[13px] text-neutral-60 leading-relaxed mb-5">{tool.description}</p>

              {tool.mockup}

              <Link href={tool.link} className="text-[13px] font-semibold text-primary hover:text-primary-dark inline-flex items-center gap-1 transition-colors">
                {tool.linkText}
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
