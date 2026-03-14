const stats = [
  { value: '100,000+', label: 'Resumes created' },
  { value: '93%', label: 'Interview rate' },
  { value: '6+', label: 'ATS-ready templates' },
  { value: '4.8/5', label: 'User rating' },
];

export function StatsBar() {
  return (
    <section className="bg-blue-600 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center text-white">
              <p className="text-3xl font-extrabold mb-1">{stat.value}</p>
              <p className="text-blue-100 text-sm font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
