import Link from 'next/link';
import { Button } from '@/components/ui/button';

const templates = [
  { id: 'ats-pro', name: 'ATS Pro', category: 'Most Popular', atsScore: 99, color: '#2563eb', desc: 'Maximized for ATS systems' },
  { id: 'modern', name: 'Modern', category: 'Trending', atsScore: 92, color: '#7c3aed', desc: 'Sidebar design with impact' },
  { id: 'professional', name: 'Professional', category: 'Classic', atsScore: 96, color: '#1e3a5f', desc: 'Trusted by Fortune 500 recruiters' },
  { id: 'minimal', name: 'Minimal', category: 'Clean', atsScore: 94, color: '#0d9488', desc: 'Let your content shine' },
  { id: 'executive', name: 'Executive', category: 'Leadership', atsScore: 90, color: '#16a34a', desc: 'Bold, authoritative presence' },
  { id: 'creative', name: 'Creative', category: 'Stand Out', atsScore: 78, color: '#ea580c', desc: 'For creative industries' },
];

function TemplateMockup({ color, name }: { color: string; name: string }) {
  return (
    <div className="w-full aspect-[0.75] bg-white rounded-lg shadow-sm border border-gray-100 p-3 overflow-hidden">
      <div style={{ borderBottom: `2px solid ${color}`, paddingBottom: 6, marginBottom: 8 }}>
        <div className="h-3 bg-gray-800 rounded mb-1" style={{ width: '70%' }} />
        <div className="h-2 rounded mb-1" style={{ width: '50%', backgroundColor: color }} />
        <div className="flex gap-2">
          <div className="h-1.5 bg-gray-200 rounded w-12" />
          <div className="h-1.5 bg-gray-200 rounded w-12" />
        </div>
      </div>
      {['Summary', 'Experience', 'Skills'].map((section) => (
        <div key={section} className="mb-2">
          <div className="h-1.5 rounded w-12 mb-1" style={{ backgroundColor: color }} />
          <div className="space-y-0.5">
            <div className="h-1 bg-gray-100 rounded w-full" />
            <div className="h-1 bg-gray-100 rounded w-5/6" />
            <div className="h-1 bg-gray-100 rounded w-4/5" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TemplatesShowcase() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            Professional resume templates tested by recruiters
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Every template is designed with one goal: get you to the interview.
            Tested against real ATS systems and reviewed by hiring managers.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {templates.map((t) => (
            <Link
              key={t.id}
              href={`/resume-templates#${t.id}`}
              className="group bg-white rounded-xl border border-gray-200 p-3 hover:border-blue-400 hover:shadow-md transition-all"
            >
              <TemplateMockup color={t.color} name={t.name} />
              <div className="mt-3">
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">{t.category}</span>
                <p className="font-semibold text-gray-900 text-sm mt-1.5">{t.name}</p>
                <div className="flex items-center gap-1 mt-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  <span className="text-xs text-gray-500">ATS {t.atsScore}%</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" size="lg" asChild>
            <Link href="/resume-templates">View All Templates →</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
