import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { TemplatePreview } from '@/components/resume/template-preview';

const templates = [
  { id: 'ats-pro', name: 'ATS Pro', category: 'ATS Optimized', color: '#1a91f0' },
  { id: 'modern', name: 'Modern', category: 'Sidebar', color: '#7c3aed' },
  { id: 'professional', name: 'Professional', category: 'Classic', color: '#1e3a5f' },
  { id: 'minimal', name: 'Minimal', category: 'Clean', color: '#0d9488' },
  { id: 'executive', name: 'Executive', category: 'Leadership', color: '#16a34a' },
  { id: 'compact', name: 'Compact', category: 'Dense', color: '#2563eb' },
  { id: 'elegant', name: 'Elegant', category: 'Refined', color: '#8b5cf6' },
  { id: 'technical', name: 'Technical', category: 'Engineering', color: '#2d3748' },
  { id: 'classic', name: 'Classic', category: 'Traditional', color: '#374151' },
  { id: 'creative', name: 'Creative', category: 'Sidebar', color: '#ea580c' },
];

export function TemplatesShowcase() {
  return (
    <section className="py-20 bg-neutral-10">
      <div className="max-w-[1200px] mx-auto px-6">
        <h2 className="text-[40px] sm:text-[48px] font-medium text-neutral-90 text-center mb-4 tracking-tight leading-tight">
          Recruiter-tested resume templates
        </h2>
        <p className="text-[17px] text-neutral-50 text-center mb-14 max-w-[500px] mx-auto">
          Pick from our collection of beautiful, ATS-friendly templates. Download to PDF in one click.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 mb-14">
          {templates.map((t) => (
            <Link key={t.id} href={`/resume-templates#${t.id}`} className="group block relative">
              <div className="w-full aspect-[0.75] rounded-lg shadow-md border border-neutral-20 overflow-hidden relative group-hover:shadow-xl transition-all duration-300">
                <TemplatePreview templateId={t.id} color={t.color} className="w-full h-full" />
                <div className="absolute inset-0 bg-primary/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-lg">
                  <span className="text-white font-semibold text-[15px] px-5 py-2.5 border border-white/40 rounded bg-white/10">Use this template</span>
                </div>
              </div>
              <div className="mt-4 text-center">
                <p className="text-[12px] text-neutral-40 mb-0.5">{t.category}</p>
                <p className="text-[15px] font-semibold text-neutral-90">{t.name}</p>
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
