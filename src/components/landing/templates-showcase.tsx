import Link from 'next/link';
import { Button } from '@/components/ui/button';

const templates = [
  { id: 'ats-pro', name: 'ATS Pro', category: 'Functional', atsScore: 99, color: '#2563eb' },
  { id: 'modern', name: 'Modern', category: "Today's job", atsScore: 92, color: '#7c3aed' },
  { id: 'professional', name: 'Professional', category: 'Classic', atsScore: 96, color: '#1e3a5f' },
  { id: 'minimal', name: 'Minimal', category: 'Compact', atsScore: 94, color: '#0d9488' },
  { id: 'executive', name: 'Executive', category: 'Professional', atsScore: 90, color: '#16a34a' },
  { id: 'creative', name: 'Creative', category: 'Price a lot', atsScore: 78, color: '#ea580c' },
];

function TemplateMockup({ color }: { color: string }) {
  return (
    <div className="w-full aspect-[0.77] bg-white rounded-lg shadow-sm border border-gray-100 p-3 overflow-hidden relative group-hover:shadow-md transition-shadow">
      {/* Header */}
      <div style={{ borderLeft: `3px solid ${color}`, paddingLeft: 6, marginBottom: 8 }}>
        <div className="h-3 bg-gray-800 rounded w-2/3 mb-1" />
        <div className="h-2 rounded w-2/5 mb-1" style={{ backgroundColor: color, opacity: 0.7 }} />
        <div className="flex gap-1.5">
          <div className="h-1.5 bg-gray-200 rounded w-10" />
          <div className="h-1.5 bg-gray-200 rounded w-8" />
          <div className="h-1.5 bg-gray-200 rounded w-10" />
        </div>
      </div>
      {/* Sections */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="mb-2">
          <div className="h-1.5 rounded w-14 mb-1" style={{ backgroundColor: color, opacity: 0.6 }} />
          <div className="space-y-0.5">
            <div className="h-1 bg-gray-100 rounded w-full" />
            <div className="h-1 bg-gray-100 rounded w-5/6" />
            <div className="h-1 bg-gray-100 rounded w-4/5" />
          </div>
        </div>
      ))}
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-blue-600/90 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
        <span className="text-white font-semibold text-sm">Use this template</span>
      </div>
    </div>
  );
}

export function TemplatesShowcase() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            Tested resume templates
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Pick from our collection of beautiful resume templates. Download to PDF in one click.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5 mb-12">
          {templates.map((t) => (
            <Link key={t.id} href={`/resume-templates#${t.id}`} className="group block">
              <TemplateMockup color={t.color} />
              <div className="mt-3 text-center">
                <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{t.category}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" size="lg" asChild>
            <Link href="/resume-templates">See all templates</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
