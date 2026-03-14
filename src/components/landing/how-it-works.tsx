import Link from 'next/link';
import { Button } from '@/components/ui/button';

const features = [
  {
    tag: 'Resumly',
    title: 'Step-by-step guidance',
    description: 'Our resume builder walks you through each section and tells you exactly what to fill out and how.',
    color: 'border-blue-200 bg-blue-50',
    tagColor: 'bg-blue-100 text-blue-700',
    mockup: (
      <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100 space-y-2">
        <div className="text-xs font-semibold text-gray-700 mb-2">Personal Details</div>
        {['First Name', 'Job Title', 'Email'].map((f) => (
          <div key={f} className="space-y-0.5">
            <div className="text-[10px] text-gray-400">{f}</div>
            <div className="h-5 bg-gray-50 border border-gray-200 rounded" />
          </div>
        ))}
        <div className="text-[10px] text-gray-400 mt-1">Professional Summary</div>
        <div className="h-10 bg-gray-50 border border-gray-200 rounded" />
      </div>
    ),
  },
  {
    tag: 'AI Assist',
    title: 'AI writer for you',
    description: 'Stuck on what to write? Just click and our AI will help you create compelling content.',
    color: 'border-purple-200 bg-purple-50',
    tagColor: 'bg-purple-100 text-purple-700',
    mockup: (
      <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
          </div>
          <div className="text-xs font-semibold text-gray-700">AI Writing Assistant</div>
        </div>
        <div className="space-y-1.5">
          <div className="h-2 bg-gray-100 rounded w-full" />
          <div className="h-2 bg-gray-100 rounded w-4/5" />
          <div className="h-2 bg-purple-100 rounded w-full" />
          <div className="h-2 bg-purple-100 rounded w-3/4" />
        </div>
        <div className="mt-2 h-6 bg-purple-500 rounded text-white text-[10px] flex items-center justify-center font-medium">
          Generate with AI
        </div>
      </div>
    ),
  },
  {
    tag: 'Resumly',
    title: 'Instant cover letters',
    description: 'Use our cover letter builder to create a matching cover letter for any position in seconds.',
    color: 'border-green-200 bg-green-50',
    tagColor: 'bg-green-100 text-green-700',
    mockup: (
      <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
          <div className="text-xs font-semibold text-gray-700">Cover Letter</div>
        </div>
        <div className="space-y-1.5">
          <div className="h-2 bg-gray-100 rounded w-3/4" />
          <div className="h-2 bg-gray-100 rounded w-full" />
          <div className="h-2 bg-gray-100 rounded w-5/6" />
          <div className="h-2 bg-gray-100 rounded w-full" />
          <div className="h-2 bg-gray-100 rounded w-2/3" />
        </div>
      </div>
    ),
  },
  {
    tag: 'Smart Match',
    title: 'Paste any job link',
    description: 'Paste a job URL and we\'ll tailor your resume automatically, matching keywords and requirements.',
    color: 'border-orange-200 bg-orange-50',
    tagColor: 'bg-orange-100 text-orange-700',
    mockup: (
      <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
        <div className="text-xs font-semibold text-gray-700 mb-2">Paste job link</div>
        <div className="h-7 bg-gray-50 border border-gray-200 rounded flex items-center px-2 mb-2">
          <svg className="w-3 h-3 text-gray-300 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.86-2.556a4.5 4.5 0 00-1.242-7.244l-4.5-4.5a4.5 4.5 0 00-6.364 6.364L4.343 8.53" />
          </svg>
          <div className="h-2 bg-gray-200 rounded w-full" />
        </div>
        <div className="space-y-1 mt-2">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-green-100 rounded-full flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
            </div>
            <div className="h-1.5 bg-gray-100 rounded w-20" />
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-green-100 rounded-full flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
            </div>
            <div className="h-1.5 bg-gray-100 rounded w-24" />
          </div>
        </div>
      </div>
    ),
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            Way beyond a resume builder...
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Resumly gives you everything to go from blank page to hired.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 mb-12">
          {features.map((f) => (
            <div key={f.title} className={`rounded-2xl border p-6 ${f.color} transition-all hover:shadow-md`}>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${f.tagColor}`}>{f.tag}</span>
              <h3 className="text-xl font-bold text-gray-900 mt-3 mb-1">{f.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{f.description}</p>
              {f.mockup}
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button size="xl" asChild>
            <Link href="/resume-builder">Start Building — It&apos;s Free</Link>
          </Button>
          <p className="text-sm text-gray-500 mt-3">No sign-up required to start</p>
        </div>
      </div>
    </section>
  );
}
