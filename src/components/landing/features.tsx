import Link from 'next/link';

const tools = [
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
      </svg>
    ),
    title: 'Resume Builder',
    description: 'Create a job-winning resume with our step-by-step builder. AI-powered suggestions help you write compelling content that gets noticed.',
    color: 'bg-blue-50',
    iconColor: 'text-primary',
    link: '/resume-builder',
    linkText: 'Create a resume',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: 'ATS Score Checker',
    description: 'Check how well your resume performs with applicant tracking systems. Get instant feedback and actionable tips to improve your score.',
    color: 'bg-green-50',
    iconColor: 'text-green-600',
    link: '/ats-checker',
    linkText: 'Check your score',
  },
  {
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
    title: 'Resume Examples',
    description: 'Browse real resume examples from 30+ industries. See exactly what works for your field and use them as inspiration for your own.',
    color: 'bg-purple-50',
    iconColor: 'text-purple-600',
    link: '/resume-examples',
    linkText: 'Browse examples',
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

              {/* Card mockup area */}
              <div className="bg-white/80 rounded-xl p-4 mb-4 min-h-[120px] shadow-sm">
                <div className="space-y-2">
                  <div className="h-2.5 bg-neutral-20 rounded w-3/4" />
                  <div className="h-2.5 bg-neutral-20 rounded w-full" />
                  <div className="h-2.5 bg-neutral-20 rounded w-2/3" />
                  <div className="h-2.5 bg-neutral-20 rounded w-5/6" />
                </div>
              </div>

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
