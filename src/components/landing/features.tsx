import Link from 'next/link';

const tools = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
      </svg>
    ),
    title: 'Resume Builder',
    description: 'Create a job-winning resume with our step-by-step builder. AI-powered suggestions help you write compelling content.',
    color: 'bg-blue-50',
    iconColor: 'text-primary',
    link: '/resume-builder',
    linkText: 'Create a resume',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
      </svg>
    ),
    title: 'Job Board',
    description: 'Search for any job posted in any company. We aggregate millions of positions from top job boards worldwide.',
    color: 'bg-green-50',
    iconColor: 'text-green-600',
    link: '/resume-builder',
    linkText: 'Find jobs',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    title: 'Auto Apply',
    description: 'Set your preferences and let our system automatically apply to matching positions. Save hours of manual applications.',
    color: 'bg-purple-50',
    iconColor: 'text-purple-600',
    link: '/resume-builder',
    linkText: 'Start applying',
  },
];

const companies = ['Booking.com', 'Google', 'Amazon', 'Spotify', 'Accenture', 'Apple'];

export function FeaturesSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1200px] mx-auto px-6">
        <h2 className="text-[40px] sm:text-[48px] font-medium text-neutral-90 text-center mb-16 tracking-tight leading-tight">
          Every tool you need is here...
        </h2>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {tools.map((tool) => (
            <div key={tool.title} className={`${tool.color} rounded-2xl p-8 transition-all hover:shadow-lg group`}>
              <div className={`w-12 h-12 rounded-xl bg-white flex items-center justify-center mb-5 ${tool.iconColor} shadow-sm`}>
                {tool.icon}
              </div>
              <h3 className="text-[24px] font-semibold text-neutral-90 mb-2">{tool.title}</h3>
              <p className="text-[15px] text-neutral-60 leading-relaxed mb-6">{tool.description}</p>

              {/* Card mockup area */}
              <div className="bg-white/80 rounded-xl p-5 mb-5 min-h-[140px] shadow-sm">
                <div className="space-y-2.5">
                  <div className="h-3 bg-neutral-20 rounded w-3/4" />
                  <div className="h-3 bg-neutral-20 rounded w-full" />
                  <div className="h-3 bg-neutral-20 rounded w-2/3" />
                  <div className="h-3 bg-neutral-20 rounded w-5/6" />
                </div>
              </div>

              <Link href={tool.link} className="text-[14px] font-semibold text-primary hover:text-primary-dark inline-flex items-center gap-1 transition-colors">
                {tool.linkText}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          ))}
        </div>

        {/* Company logos */}
        <div className="text-center">
          <p className="text-[14px] text-neutral-40 mb-8">Our resumes get people hired at</p>
          <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-14">
            {companies.map((name) => (
              <span key={name} className="text-neutral-30 font-bold text-[18px] sm:text-[20px] tracking-tight select-none">{name}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
