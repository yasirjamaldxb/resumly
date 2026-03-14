import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function CTASection() {
  return (
    <section className="py-24 bg-blue-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-6">
          Your dream job is one resume away
        </h2>
        <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
          Join 100,000+ job seekers who built their resumes with Resumly. Free, fast, and proven to work.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="xl"
            className="bg-white text-blue-600 hover:bg-blue-50 shadow-xl"
            asChild
          >
            <Link href="/resume-builder">Build My Free Resume →</Link>
          </Button>
          <Button
            variant="outline"
            size="xl"
            className="border-white text-white hover:bg-blue-700"
            asChild
          >
            <Link href="/resume-examples">See Examples</Link>
          </Button>
        </div>
        <p className="text-blue-200 text-sm mt-6">No sign-up required. No credit card. No watermarks.</p>
      </div>
    </section>
  );
}
