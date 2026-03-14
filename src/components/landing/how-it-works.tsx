import Link from 'next/link';
import { Button } from '@/components/ui/button';

const steps = [
  {
    step: '01',
    title: 'Choose your template',
    description: 'Pick from 6 professionally designed, ATS-tested templates. Each one is optimized for the role you want.',
    icon: '🎨',
  },
  {
    step: '02',
    title: 'Fill in your details',
    description: 'Our guided form makes it easy. Add your work history, education, and skills. Not sure what to write? Let AI help.',
    icon: '✏️',
  },
  {
    step: '03',
    title: 'Get your ATS score',
    description: 'See your real-time ATS score and get specific suggestions to improve it. Hit 90%+ before downloading.',
    icon: '📊',
  },
  {
    step: '04',
    title: 'Download & apply',
    description: 'Download your perfectly formatted PDF resume instantly. Then start applying with confidence.',
    icon: '🚀',
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            Build your resume in 4 simple steps
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            No design skills needed. No hours of formatting. Just a great resume, fast.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, i) => (
            <div key={step.step} className="relative">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-blue-200 z-0" style={{ width: 'calc(100% - 4rem)', left: '4rem' }} />
              )}
              <div className="relative z-10 text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4 shadow-lg">
                  {step.icon}
                </div>
                <div className="inline-block bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full mb-3">
                  STEP {step.step}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button size="xl" asChild>
            <Link href="/resume-builder">Start Building — It&apos;s Free →</Link>
          </Button>
          <p className="text-sm text-gray-500 mt-3">No sign-up required to start. Takes less than 10 minutes.</p>
        </div>
      </div>
    </section>
  );
}
