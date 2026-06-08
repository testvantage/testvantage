'use client';
import { useEffect, useState } from 'react';
import { supabase, Test } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function AdminControlPanel() {
  const { profile, loading: authLoading } = useAuth();
  const router = useRouter();

  const [categories, setCategories] = useState<any[]>([]);
  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form States for creating new tests
  const [title, setTitle] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [duration, setDuration] = useState(60);
  const [totalMarks, setTotalMarks] = useState(100);
  const [negMarking, setNegMarking] = useState(0.25);

  useEffect(() => {
    if (!authLoading && (!profile || profile.role !== 'admin')) {
      router.push('/');
    }
  }, [profile, authLoading, router]);

  useEffect(() => {
    async function loadAdminData() {
      const { data: catData } = await supabase.from('categories').select('*');
      const { data: testData } = await supabase.from('tests').select('*, categories(name)');
      if (catData) setCategories(catData);
      if (testData) setTests(testData);
      setLoading(false);
    }
    if (profile?.role === 'admin') loadAdminData();
  }, [profile]);

  const handleCreateTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !categoryId) return alert('Fill mandatory parameters.');

    const { data, error } = await supabase.from('tests').insert({
      title,
      category_id: categoryId,
      duration_minutes: duration,
      total_marks: totalMarks,
      negative_marking: negMarking
    }).select().single();

    if (data) {
      alert('Test record created successfully.');
      setTests((prev) => [data, ...prev]);
      setTitle('');
    } else {
      console.error(error);
    }
  };

  const handleDeleteTest = async (id: string) => {
    if (!confirm('Are you sure you want to delete this test?')) return;
    const { error } = await supabase.from('tests').delete().eq('id', id);
    if (!error) {
      setTests((p) => p.filter((t) => t.id !== id));
    }
  };

  if (authLoading || loading) return <div className="p-12 text-center text-slate-500 font-semibold animate-pulse">Authorizing Admin Token Context...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Create Test Panel */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm h-fit">
        <h3 className="text-lg font-black text-slate-900 mb-4">Create Test Module Architecture</h3>
        <form onSubmit={handleCreateTest} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Test Title Schema</label>
            <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. SSC Mock Test 01" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"/>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Target Category Vector</label>
            <select required value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-600">
              <option value="">Select Domain</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Mins</label>
              <input type="number" required value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"/>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Marks</label>
              <input type="number" required value={totalMarks} onChange={(e) => setTotalMarks(Number(e.target.value))} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"/>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Neg</label>
              <input type="number" step="0.01" required value={negMarking} onChange={(e) => setNegMarking(Number(e.target.value))} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"/>
            </div>
          </div>
          <button type="submit" className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition shadow-md shadow-blue-700/10">
            Provision Test Object
          </button>
        </form>
      </div>

      {/* Tests Inventory List */}
      <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="font-black text-slate-900 text-lg">Active System Test Inventories</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {tests.map((t) => (
            <div key={t.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition">
              <div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 bg-slate-100 text-slate-600 rounded uppercase tracking-wide">{t.categories?.name}</span>
                <h4 className="font-bold text-slate-900 mt-1">{t.title}</h4>
                <p className="text-xs text-slate-400 mt-0.5">ID: {t.id}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button onClick={() => handleDeleteTest(t.id)} className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded transition border border-red-200">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}