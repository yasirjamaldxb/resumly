const reviews = [
  {
    stars: 5,
    title: 'Satisfied',
    text: 'The UI is easy to understand and use, and in addition to a helpful AI feature, this site really helps you build your...',
    author: 'Rizky Febriyanto',
    time: 'about 10 hours ago',
  },
  {
    stars: 5,
    title: 'The Resume Game-Cha...',
    text: "I've been using Resumly to update my professional profile, and it has honestly taken the stress out of the entire...",
    author: 'Robert Lein',
    time: 'about 21 hours ago',
  },
  {
    stars: 5,
    title: 'Love it',
    text: 'Love it! this has been so helpful to use during the stressful job market! Love all the recommendations it tells...',
    author: 'Mia Audier',
    time: '2 days ago',
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(count)].map((_, i) => (
        <svg key={i} className="w-[18px] h-[18px] text-green-500 fill-current" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-neutral-10">
      <div className="max-w-[1200px] mx-auto px-6">
        <h2 className="text-[40px] sm:text-[48px] font-medium text-neutral-90 text-center mb-14 tracking-tight leading-tight">
          92% of customers recommend us
        </h2>

        <div className="grid md:grid-cols-4 gap-6 mb-10">
          {/* Rating summary */}
          <div className="flex flex-col items-center justify-center text-center">
            <div className="text-[28px] font-semibold text-neutral-90 mb-2">4.3 out of 5</div>
            <Stars count={5} />
            <div className="mt-3 flex items-center gap-1.5">
              <svg className="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span className="text-[14px] font-bold text-neutral-90">Trustpilot</span>
            </div>
            <p className="text-[13px] text-neutral-40 mt-1">based on 55,276 reviews</p>
          </div>

          {/* Review cards */}
          {reviews.map((r) => (
            <div key={r.title} className="bg-white rounded-2xl border border-neutral-20 p-6 hover:shadow-md transition-shadow">
              <Stars count={r.stars} />
              <h3 className="text-[17px] font-semibold text-neutral-90 mt-3 mb-2">{r.title}</h3>
              <p className="text-[14px] text-neutral-50 leading-relaxed mb-4">{r.text}</p>
              <div className="text-[13px] text-neutral-40">
                <span className="text-neutral-60 font-medium">{r.author}</span> &middot; {r.time}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-3">
          <button className="w-8 h-8 rounded-full border border-neutral-20 flex items-center justify-center text-neutral-40 hover:border-neutral-40 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button className="w-8 h-8 rounded-full border border-neutral-20 flex items-center justify-center text-neutral-40 hover:border-neutral-40 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
