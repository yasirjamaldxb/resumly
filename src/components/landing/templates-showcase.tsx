import Link from 'next/link';
import { Button } from '@/components/ui/button';

const templates = [
  { id: 'ats-pro', name: 'ATS Pro', category: 'Functional', users: '2,200,000+', color: '#1a91f0' },
  { id: 'modern', name: 'Modern', category: "Today's job", users: '1,800,000+', color: '#7c3aed' },
  { id: 'professional', name: 'Professional', category: 'Classic', users: '1,500,000+', color: '#1e3a5f' },
  { id: 'minimal', name: 'Minimal', category: 'Compact', users: '900,000+', color: '#0d9488' },
  { id: 'executive', name: 'Executive', category: 'Professional', users: '750,000+', color: '#16a34a' },
  { id: 'creative', name: 'Creative', category: 'Prime ATS', users: '600,000+', color: '#ea580c' },
];

function TemplateMockup({ color }: { color: string }) {
  return (
    <div className="w-full aspect-[0.75] bg-white rounded-lg shadow-md border border-neutral-20 p-4 overflow-hidden relative group-hover:shadow-xl transition-all duration-300">
      {/* Header area */}
      <div className="mb-3 pb-3" style={{ borderBottom: `2px solid ${color}` }}>
        <div className="h-4 bg-neutral-90 rounded w-3/4 mb-1.5" />
        <div className="h-2.5 rounded w-1/2 mb-2" style={{ backgroundColor: color }} />
        <div className="flex gap-2">
          <div className="h-2 bg-neutral-20 rounded w-16" />
          <div className="h-2 bg-neutral-20 rounded w-12" />
          <div className="h-2 bg-neutral-20 rounded w-14" />
        </div>
      </div>
      {/* Content sections */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="mb-3">
          <div className="h-2 rounded w-16 mb-1.5" style={{ backgroundColor: color, opacity: 0.7 }} />
          <div className="space-y-1">
            <div className="h-1.5 bg-neutral-10 rounded w-full" />
            <div className="h-1.5 bg-neutral-10 rounded w-11/12" />
            <div className="h-1.5 bg-neutral-10 rounded w-5/6" />
            <div className="h-1.5 bg-neutral-10 rounded w-4/5" />
          </div>
        </div>
      ))}
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-primary/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-lg">
        <span className="text-white font-semibold text-[15px] px-5 py-2.5 border border-white/40 rounded bg-white/10">Use this template</span>
      </div>
    </div>
  );
}

export function TemplatesShowcase() {
  return (
    <section className="py-20 bg-neutral-10">
      <div className="max-w-[1200px] mx-auto px-6">
        <h2 className="text-[40px] sm:text-[48px] font-medium text-neutral-90 text-center mb-4 tracking-tight leading-tight">
          Tested resume templates
        </h2>
        <p className="text-[17px] text-neutral-50 text-center mb-14 max-w-[500px] mx-auto">
          Pick from our collection of beautiful, recruiter-tested templates. Download to PDF in one click.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 mb-14">
          {templates.map((t) => (
            <Link key={t.id} href={`/resume-templates#${t.id}`} className="group block">
              <TemplateMockup color={t.color} />
              <div className="mt-4 text-center">
                <p className="text-[12px] text-neutral-40 mb-0.5">{t.category}</p>
                <p className="text-[15px] font-semibold text-neutral-90">{t.name}</p>
                <p className="text-[12px] text-primary mt-0.5">{t.users} users chose this</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Button size="lg" variant="outline" asChild>
            <Link href="/resume-templates">See all templates</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
