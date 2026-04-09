import Link from 'next/link';

const features = [
  {
    tag: 'Step 1',
    tagColor: 'bg-primary/10 text-primary',
    title: 'Paste any job link',
    description: 'Found a job you like on LinkedIn, Indeed, or any job board? Just paste the link. We\'ll extract the title, company, skills, and requirements automatically.',
    link: '#hero-input',
    linkText: 'Try it now',
    bg: 'bg-white',
    mockup: (
      <div className="bg-orange-50 rounded-xl p-3.5 mt-3">
        <div className="text-[11px] font-semibold text-neutral-70 mb-2.5">Paste job link</div>
        <div className="h-7 bg-white border border-neutral-20 rounded flex items-center px-2.5 mb-2.5">
          <svg className="w-3 h-3 text-neutral-30 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757" />
          </svg>
          <span className="text-[9px] text-neutral-40">https://linkedin.com/jobs/view/...</span>
        </div>
        <div className="space-y-1.5">
          {['Job title extracted', 'Company identified', 'Requirements parsed'].map(item => (
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
  {
    tag: 'Step 2',
    tagColor: 'bg-purple-100 text-purple-700',
    title: 'AI builds your resume',
    description: 'Our AI takes your experience and rewrites it to match the job description.highlighting the right skills, using the right keywords, in the right format.',
    link: '#hero-input',
    linkText: 'Try it now',
    bg: 'bg-white',
    mockup: (
      <div className="bg-purple-50 rounded-xl p-3.5 mt-3">
        <div className="flex items-center gap-2 mb-2.5">
          <div className="w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
          </div>
          <span className="text-[11px] font-semibold text-neutral-70">AI tailoring your resume...</span>
        </div>
        <div className="space-y-1 mb-2">
          <div className="h-2 bg-white rounded w-full" />
          <div className="h-2 bg-white rounded w-4/5" />
          <div className="h-2 bg-purple-200 rounded w-full" />
          <div className="h-2 bg-purple-200 rounded w-3/4" />
        </div>
        <div className="text-[9px] text-purple-600 font-medium">Matching keywords to job description...</div>
      </div>
    ),
  },
  {
    tag: 'Step 3',
    tagColor: 'bg-green-100 text-green-700',
    title: 'Get your cover letter too',
    description: 'A matching cover letter is auto-generated from your resume and the job posting. Personalized, professional, and ready to send alongside your CV.',
    link: '#hero-input',
    linkText: 'Get started',
    bg: 'bg-white',
    mockup: (
      <div className="bg-green-50 rounded-xl p-3.5 mt-3">
        <div className="flex items-center gap-2 mb-2.5">
          <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
          <span className="text-[11px] font-semibold text-neutral-70">Cover Letter</span>
        </div>
        <div className="text-[9px] text-neutral-50 mb-1.5">Dear Hiring Team at Stripe,</div>
        <div className="space-y-1">
          <div className="h-1.5 bg-white rounded w-full" />
          <div className="h-1.5 bg-white rounded w-5/6" />
          <div className="h-1.5 bg-white rounded w-full" />
          <div className="h-1.5 bg-white rounded w-2/3" />
        </div>
      </div>
    ),
  },
  {
    tag: 'Step 4',
    tagColor: 'bg-blue-100 text-blue-700',
    title: 'Track and repeat',
    description: 'Download your PDF, track your application status, and when you find another job.do it all again in seconds. Your profile is saved, so repeat applications are instant.',
    link: '#hero-input',
    linkText: 'Start now',
    bg: 'bg-white',
    mockup: (
      <div className="bg-blue-50 rounded-xl p-3.5 mt-3">
        <div className="text-[11px] font-semibold text-neutral-70 mb-2.5">Your applications</div>
        <div className="space-y-2">
          {[
            { role: 'Product Designer', company: 'Stripe', status: 'Applied', color: 'bg-green-100 text-green-700' },
            { role: 'UX Lead', company: 'Notion', status: 'Interview', color: 'bg-purple-100 text-purple-700' },
            { role: 'Design Manager', company: 'Linear', status: 'Draft', color: 'bg-neutral-100 text-neutral-600' },
          ].map(app => (
            <div key={app.role} className="flex items-center justify-between bg-white rounded-lg px-2.5 py-1.5">
              <div>
                <div className="text-[10px] font-medium text-neutral-80">{app.role}</div>
                <div className="text-[9px] text-neutral-40">{app.company}</div>
              </div>
              <span className={`text-[8px] font-semibold px-1.5 py-0.5 rounded-full ${app.color}`}>{app.status}</span>
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
        <h2 className="text-[28px] sm:text-[34px] font-medium text-neutral-90 text-center mb-3 tracking-tight leading-tight">
          How Resumly works
        </h2>
        <p className="text-[14px] text-neutral-50 text-center mb-12 max-w-[480px] mx-auto">
          From job link to tailored application in under 5 minutes. No templates to fill out manually.AI handles everything.
        </p>

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
