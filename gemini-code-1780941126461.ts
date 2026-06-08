import Link from 'next/link';

export default function HomePage() {
  const categories = [
    { name: 'SSC', slug: 'ssc', count: '12+ Tests' },
    { name: 'Railway', slug: 'railway', count: '8+ Tests' },
    { name: 'Banking', slug: 'banking', count: '15+ Tests' },
    { name: 'WBCS', slug: 'wbcs', count: '10+ Tests' },
    { name: 'WBPSC', slug: 'wbpsc', count: '6+ Tests' },
    { name: 'UPSC', slug: 'upsc', count: '5+ Tests' },
    { name: 'GATE', slug: 'gate', count: '14+ Tests' },
    { name: 'State Jobs', slug: 'state-jobs', count: '20+ Tests' },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white py-24 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,115,22,0.15),transparent_45%)]"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="bg-blue-500/10 border border-blue-400/30 text-orange-400 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-6 inline-block">
            🚀 Accelerate Your Exam Strategy
          </span>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight mb-6 leading-tight">
            Your Advantage In <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">Every Exam</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 font-light">
            Real-time interfaces, actionable diagnostic analytical tools, and high-fidelity mock questions calibrated to top competitive environments.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/tests" className="px-8 py-4 bg-orange-500 hover:bg-orange-600 font-bold rounded-xl transition shadow-lg shadow-orange-500/30">
              Explore Mock Tests
            </Link>
            <Link href="/register" className="px-8 py-4 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 font-bold rounded-xl transition">
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

      {/* Metrics Grid */}
      <section className="max-w-7xl mx-auto px-4 -mt-12 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
          {[
            { value: '45k+', metric: 'Active Contenders' },
            { value: '1.2M+', metric: 'Evaluations Completed' },
            { value: '99.4%', metric: 'Simulation Accuracy' },
            { value: '4.9/5', metric: 'Top User Rating' },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl sm:text-4xl font-extrabold text-blue-900">{item.value}</div>
              <div className="text-xs sm:text-sm text-slate-500 font-medium mt-1">{item.metric}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Comprehensive Test Domains</h2>
          <p className="text-slate-500 mt-2">Targeted preparation material matching live state and central frameworks.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link href={`/tests?category=${cat.slug}`} key={cat.slug} className="group p-6 bg-white border border-slate-200/80 rounded-xl hover:border-blue-600 hover:shadow-lg hover:shadow-blue-600/5 transition duration-300">
              <h3 className="font-bold text-slate-800 text-lg group-hover:text-blue-800 transition">{cat.name}</h3>
              <p className="text-xs font-semibold text-orange-500 mt-1">{cat.count}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}