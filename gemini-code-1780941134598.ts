'use client';
import { useEffect, useState, useMemo } from 'react';
import { supabase, Test } from '@/lib/supabase';
import Link from 'next/Link';
import { useSearchParams } from 'next/navigation';

export default function TestsExplorer() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [tests, setTests] = useState<Test[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadPlatformData() {
      const { data: catData } = await supabase.from('categories').select('*');
      const { data: testData } = await supabase.from('tests').select('*, categories(name, slug)');
      
      if (catData) setCategories(catData);
      if (testData) setTests(testData as any);
      setLoading(false);
    }
    loadPlatformData();
  }, []);

  const filteredTests = useMemo(() => {
    return tests.filter((test) => {
      const matchCategory = selectedCategory === 'all' || test.categories?.slug === selectedCategory;
      const matchSearch = test.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [tests, selectedCategory, searchQuery]);

  if (loading) {
    return <div className="p-12 text-center font-medium text-slate-500 animate-pulse">Loading Test Matrices...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Assessment Catalogs</h1>
          <p className="text-slate-500 text-sm mt-1">Select your dynamic testing vector below.</p>
        </div>
        <input 
          type="text" 
          placeholder="Search tests..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-80 px-4 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
        />
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        <button 
          onClick={() => setSelectedCategory('all')} 
          className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wide uppercase transition ${selectedCategory === 'all' ? 'bg-blue-800 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
        >
          All Exams
        </button>
        {categories.map((c) => (
          <button 
            key={c.id} 
            onClick={() => setSelectedCategory(c.slug)} 
            className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wide uppercase transition ${selectedCategory === c.slug ? 'bg-blue-800 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
          >
            {c.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredTests.map((test) => (
          <div key={test.id} className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition">
            <div>
              <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-700 rounded-md">
                {test.categories?.name}
              </span>
              <h3 className="font-extrabold text-slate-900 text-xl mt-3">{test.title}</h3>
              <div className="grid grid-cols-2 gap-4 my-4 text-xs font-semibold text-slate-500">
                <div>⏱️ {test.duration_minutes} Mins</div>
                <div>🎯 {test.total_marks} Marks</div>
                <div>⚠️ Neg: {test.negative_marking}</div>
              </div>
            </div>
            <Link href={`/exam/${test.id}`} className="w-full mt-2 py-3 bg-blue-700 hover:bg-blue-800 text-white text-center font-bold text-sm rounded-lg transition block">
              Initialize Mock Exam
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}