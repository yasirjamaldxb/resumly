import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

const templates = [
  { id: 'ats-pro', name: 'ATS Pro', category: 'ATS Optimized' },
  { id: 'modern', name: 'Modern', category: 'Sidebar' },
  { id: 'professional', name: 'Professional', category: 'Classic' },
  { id: 'minimal', name: 'Minimal', category: 'Clean' },
  { id: 'executive', name: 'Executive', category: 'Leadership' },
  { id: 'compact', name: 'Compact', category: 'Dense' },
  { id: 'elegant', name: 'Elegant', category: 'Refined' },
  { id: 'technical', name: 'Technical', category: 'Engineering' },
  { id: 'classic', name: 'Classic', category: 'Traditional' },
  { id: 'creative', name: 'Creative', category: 'Sidebar' },
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
              <div className="w-full rounded-lg shadow-md border border-neutral-20 overflow-hidden relative group-hover:shadow-xl transition-all duration-300">
                <Image
                  src={`/templates/${t.id}.png`}
                  alt={`${t.name} resume template`}
                  width={794}
                  height={1123}
                  className="w-full h-auto"
                  quality={80}
                />
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
