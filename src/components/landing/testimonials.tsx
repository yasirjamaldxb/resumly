const reviews = [
  {
    rating: 4.5,
    stars: 5,
    title: 'Satisfied',
    text: 'The resume builder is easy to use and in addition to a beautiful layout, it has guides to help you fill out the sections, such that it feels less stressful.',
    author: 'Jessica M.',
  },
  {
    rating: 5,
    stars: 5,
    title: 'The Resume Game Changer',
    text: 'I used Resumly to create my resume and it was such a comprehensive and professional tool. It was so helpful, really saving me during the recruitment process.',
    author: 'Daniel R.',
  },
  {
    rating: 5,
    stars: 5,
    title: 'Love it',
    text: 'Super helpful to use during the job-seeking process. Simple, clean look. The automated process is very straightforward and incredibly easy to do.',
    author: 'Sarah K.',
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(count)].map((_, i) => (
        <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
            92% of customers recommend us
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {reviews.map((r) => (
            <div key={r.title} className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <Stars count={r.stars} />
                <span className="text-xs text-gray-400 font-medium">{r.rating} out of 5</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{r.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">{r.text}</p>
              <p className="text-xs font-medium text-gray-500">{r.author}</p>
            </div>
          ))}
        </div>

        {/* Rating summary */}
        <div className="flex items-center justify-center gap-8 text-center">
          <div>
            <div className="text-2xl font-extrabold text-gray-900 mb-1">4.5 out of 5</div>
            <Stars count={5} />
            <p className="text-xs text-gray-500 mt-1">based on 12,400+ reviews</p>
          </div>
        </div>
      </div>
    </section>
  );
}
