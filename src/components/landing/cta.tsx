import Link from 'next/link';
import { Button } from '@/components/ui/button';

const companies = ['Amazon', 'Google', 'Meta', 'Shopify', 'Spotify'];

export function CTASection() {
  return (
    <section className="py-20 bg-blue-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">
          Join over 43,852
          <br />
          resume makers
        </h2>
        <p className="text-xl text-blue-100 mb-8">
          Start now and get hired faster
        </p>
        <Button
          size="xl"
          className="bg-white text-blue-600 hover:bg-blue-50 shadow-xl"
          asChild
        >
          <Link href="/resume-builder">Create my resume</Link>
        </Button>

        {/* Company logos */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8">
          {companies.map((name) => (
            <span key={name} className="text-blue-200 font-bold text-lg tracking-tight opacity-60">{name}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
