import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

const templates = [
  { id: 'ats-pro' },
  { id: 'modern' },
  { id: 'professional' },
  { id: 'minimal' },
  { id: 'executive' },
  { id: 'compact' },
  { id: 'elegant' },
  { id: 'technical' },
  { id: 'classic' },
  { id: 'creative' },
];

export function TemplatesShowcase() {
  return (
    <section className="py-16 bg-neutral-10">
      <div className="max-w-[1200px] mx-auto px-6">
        <h2 className="text-[28px] sm:text-[34px] font-medium text-neutral-90 text-center mb-3 tracking-tight leading-tight">
          10 recruiter-tested templates
        </h2>
        <p className="text-[14px] text-neutral-50 text-center mb-10 max-w-[460px] mx-auto">
          Every template is ATS-optimized and tested against real applicant tracking systems. Pick one and we&apos;ll tailor it to your job.
        </p>

        {/* Horizontally scrollable row — 4 cards visible at a time */}
        <div className="overflow-x-auto pb-4 -mx-6 px-6 scrollbar-none">
          <div
            className="flex gap-5"
            style={{ width: 'max-content' }}
          >
            {templates.map(({ id }) => (
              <Link
                key={id}
                href={`/resume-templates#${id}`}
                className="group block flex-shrink-0 w-[calc((min(1200px,100vw)-108px)/4)]"
              >
                <div className="w-full aspect-[1/1.414] shadow-md border border-neutral-20 overflow-hidden relative group-hover:shadow-xl transition-all duration-300">
                  <Image
                    src={`/templates/${id}.png`}
                    alt={`${id} resume template`}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 640px) 80vw, (max-width: 1024px) 45vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-primary/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="text-white font-semibold text-[13px] px-4 py-2 border border-white/40 rounded bg-white/10">Use this template</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="text-center mt-10">
          <Button size="md" variant="outline" asChild>
            <Link href="/resume-templates">See all templates</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
