import Link from 'next/link';
import { Button } from '@/components/ui/button';

const companies = ['Amazon', 'Google', 'Meta', 'Shopify', 'Spotify'];

export function CTASection() {
  return (
    <section className="py-20 bg-primary">
      <div className="max-w-[800px] mx-auto px-6 text-center">
        <h2 className="text-[36px] sm:text-[48px] font-medium text-white mb-3 tracking-tight leading-tight">
          Join over 39,992
          <br />
          resume makers
        </h2>
        <p className="text-[18px] text-white/80 mb-8">
          Start now and get hired faster.
        </p>
        <Button
          size="xl"
          className="bg-white text-primary hover:bg-neutral-10 shadow-lg font-semibold"
          asChild
        >
          <Link href="/resume-builder">Create my resume</Link>
        </Button>

        <div className="mt-14 flex flex-wrap items-center justify-center gap-10">
          {companies.map((name) => (
            <span key={name} className="text-white/30 font-bold text-[18px] tracking-tight select-none">{name}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
