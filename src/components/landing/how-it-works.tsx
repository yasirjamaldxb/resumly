import Link from 'next/link';

const features = [
  {
    tag: 'Resumly',
    tagColor: 'bg-primary/10 text-primary',
    title: 'Step-by-step guidance',
    description: 'Our resume builder walks you through each section and tells you exactly what to fill out and how.',
    link: '/resume-builder',
    linkText: 'Create my resume',
    bg: 'bg-white',
    mockup: (
      <div className="bg-neutral-10 rounded-xl p-3.5 mt-3">
        <div className="text-[11px] font-semibold text-neutral-70 mb-2.5">Personal Details</div>
        <div className="grid grid-cols-2 gap-2">
          {['First Name', 'Last Name', 'Job Title', 'Email'].map(f => (
            <div key={f}>
              <div className="text-[9px] text-neutral-40 mb-0.5">{f}</div>
              <div className="h-5 bg-white border border-neutral-20 rounded" />
            </div>
          ))}
        </div>
        <div className="mt-2">
          <div className="text-[9px] text-neutral-40 mb-0.5">Professional Summary</div>
          <div className="h-10 bg-white border border-neutral-20 rounded" />
        </div>
      </div>
    ),
  },
  {
    tag: 'AI Assist',
    tagColor: 'bg-purple-100 text-purple-700',
    title: 'AI writes for you',
    description: 'Stuck on what to write? Just click and our AI will help you create compelling, job-winning content.',
    link: '/ai-resume-builder',
    linkText: 'Try AI writer',
    bg: 'bg-white',
    mockup: (
      <div className="bg-purple-50 rounded-xl p-3.5 mt-3">
        <div className="flex items-center gap-2 mb-2.5">
          <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
          </div>
          <span className="text-[11px] font-semibold text-neutral-70">AI Writing Assistant</span>
        </div>
        <div className="space-y-1 mb-2.5">
          <div className="h-2 bg-white rounded w-full" />
          <div className="h-2 bg-white rounded w-4/5" />
          <div className="h-2 bg-purple-200 rounded w-full" />
          <div className="h-2 bg-purple-200 rounded w-3/4" />
        </div>
        <div className="h-6 bg-purple-500 rounded text-white text-[10px] flex items-center justify-center font-semibold">Generate with AI</div>
      </div>
    ),
  },
  {
    tag: 'Resumly',
    tagColor: 'bg-green-100 text-green-700',
    title: 'Instant cover letters',
    description: 'Use our cover letter builder to create a matching cover letter for any position in seconds.',
    link: '/cover-letter-builder',
    linkText: 'Create cover letter',
    bg: 'bg-white',
    mockup: (
      <div className="bg-green-50 rounded-xl p-3.5 mt-3">
        <div className="flex items-center gap-2 mb-2.5">
          <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
          <span className="text-[11px] font-semibold text-neutral-70">Cover Letter</span>
        </div>
        <div className="space-y-1">
          <div className="h-2 bg-white rounded w-3/4" />
          <div className="h-2 bg-white rounded w-full" />
          <div className="h-2 bg-white rounded w-5/6" />
          <div className="h-2 bg-white rounded w-full" />
          <div className="h-2 bg-white rounded w-2/3" />
        </div>
      </div>
    ),
  },
  {
    tag: 'Smart Match',
    tagColor: 'bg-orange-100 text-orange-700',
    title: 'Paste any job link',
    description: "Paste a job URL and we'll tailor your resume automatically, matching keywords and requirements.",
    link: '/resume-builder',
    linkText: 'Try smart match',
    bg: 'bg-white',
    mockup: (
      <div className="bg-orange-50 rounded-xl p-3.5 mt-3">
        <div className="text-[11px] font-semibold text-neutral-70 mb-2.5">Paste job link</div>
        <div className="h-7 bg-white border border-neutral-20 rounded flex items-center px-2.5 mb-2.5">
          <svg className="w-3 h-3 text-neutral-30 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.556a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 00-6.364 6.364L4.343 8.53" />
          </svg>
          <div className="h-2 bg-neutral-20 rounded flex-1" />
        </div>
        <div className="space-y-1.5">
          {['Keywords matched', 'Skills aligned', 'Format optimized'].map(item => (
            <div key={item} className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              </div>
              <span className="text-[10px] text-neutral-60">{item}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <h2 className="text-[28px] sm:text-[34px] font-medium text-neutral-90 text-center mb-12 tracking-tight leading-tight">
          Way beyond a resume builder...
        </h2>

        <div className="grid sm:grid-cols-2 gap-5">
          {features.map((f) => (
            <div key={f.title} className={`${f.bg} rounded-2xl border border-neutral-20 p-6 transition-all hover:shadow-md hover:border-neutral-30`}>
              <span className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full ${f.tagColor}`}>{f.tag}</span>
              <h3 className="text-[18px] font-semibold text-neutral-90 mt-3 mb-1.5 tracking-tight">{f.title}</h3>
              <p className="text-[13px] text-neutral-50 leading-relaxed">{f.description}</p>
              {f.mockup}
              <Link href={f.link} className="inline-flex items-center gap-1 mt-4 text-[13px] font-semibold text-primary hover:text-primary-dark transition-colors">
                {f.linkText}
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
