const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'Software Engineer at Google',
    avatar: 'SC',
    rating: 5,
    text: "I had been applying for 3 months with zero callbacks. After using Resumly's ATS template and getting my score to 95%, I landed 4 interviews in the first week. Got the Google offer!",
  },
  {
    name: 'Marcus Williams',
    role: 'Marketing Manager at Shopify',
    avatar: 'MW',
    rating: 5,
    text: "The AI bullet point generator is incredible. It took my vague job descriptions and turned them into compelling, results-driven statements. Hired in 3 weeks.",
  },
  {
    name: 'Priya Patel',
    role: 'Data Analyst at Amazon',
    avatar: 'PP',
    rating: 5,
    text: "As a career changer from teaching to data analytics, I had no idea how to frame my experience. The AI suggestions helped me highlight transferable skills I didn't even know I had.",
  },
  {
    name: 'James O\'Brien',
    role: 'Nurse Practitioner',
    avatar: 'JO',
    rating: 5,
    text: "Healthcare resumes need specific formatting that most builders don't understand. Resumly's ATS Pro template was perfect. Got interviews at 3 top hospitals.",
  },
  {
    name: 'Aisha Rodriguez',
    role: 'UX Designer at Meta',
    avatar: 'AR',
    rating: 5,
    text: "The Modern template gave me a beautiful resume that still passes ATS. The real-time score kept me improving until I hit 94%. Best free tool out there.",
  },
  {
    name: 'David Kim',
    role: 'Recent Graduate, Finance',
    avatar: 'DK',
    rating: 5,
    text: "As a new grad with limited experience, the AI helped me write a strong summary and suggested relevant skills I'd forgotten to mention. Landed my first job within a month.",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-6 h-6 text-yellow-400 fill-current" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            92% of our users get more interviews
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real stories from real job seekers who landed their dream jobs with Resumly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex gap-0.5 mb-4">
                {[...Array(t.rating)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-5 italic">&quot;{t.text}&quot;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {t.avatar}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
