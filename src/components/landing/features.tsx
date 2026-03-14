const features = [
  {
    icon: '🤖',
    title: 'AI-Powered Writing',
    description:
      'Stuck on wording? Our AI generates professional bullet points, compelling summaries, and suggests the right skills for your target role — all in seconds.',
  },
  {
    icon: '✅',
    title: '99% ATS Pass Rate',
    description:
      'Every template is rigorously tested against top ATS systems (Workday, Greenhouse, Lever). Your resume will always reach a human recruiter.',
  },
  {
    icon: '⚡',
    title: 'Build in Under 10 Minutes',
    description:
      'Our step-by-step guided builder takes the guesswork out. Just fill in your details and we handle the formatting, layout, and design.',
  },
  {
    icon: '📊',
    title: 'Real-Time ATS Score',
    description:
      'See your ATS score update as you build. Get specific, actionable tips on exactly what to add or change to maximize your chances.',
  },
  {
    icon: '🎨',
    title: '6+ Expert Templates',
    description:
      'Designed by professional recruiters and career coaches. From modern to traditional — every template is optimized to impress hiring managers.',
  },
  {
    icon: '📄',
    title: 'Instant PDF Download',
    description:
      'Download your polished resume as a perfectly formatted PDF instantly, for free. No watermarks, no hidden fees.',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            Everything you need to land your dream job
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Resumly combines intelligent AI with proven resume strategies to give you an unfair advantage in your job search.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group p-6 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all bg-white"
            >
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl mb-5 group-hover:bg-blue-100 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
