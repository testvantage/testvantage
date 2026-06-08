'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function ContenderDashboard() {
  const { user, profile } = useAuth();
  const [attempts, setAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    async function fetchHistoricalData() {
      const { data } = await supabase
        .from('attempts')
        .select('*, tests(title, total_marks)')
        .eq('user_id', user.id)
        .order('submitted_at', { ascending: false });
      if (data) setAttempts(data);
      setLoading(false);
    }
    fetchHistoricalData();
  }, [user]);

  if (loading) return <div className="p-12 text-center text-slate-500 font-semibold animate-pulse">Syncing Metrics Array...</div>;

  const totalAttempted = attempts.length;
  const avgScore = totalAttempted > 0 ? (attempts.reduce((acc, curr) => acc + Number(curr.score), 0) / totalAttempted).toFixed(2) : '0.00';

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Performance Command Terminal</h1>
        <p className="text-slate-500 text-sm mt-1">Telemetry summary profiles for identifier: {profile?.email}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="text-slate-400 text-xs font-bold tracking-wider uppercase">Assessments Executed</div>
          <div className="text-4xl font-black text-blue-900 mt-2">{totalAttempted}</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="text-slate-400 text-xs font-bold tracking-wider uppercase">Average Running Score</div>
          <div className="text-4xl font-black text-orange-500 mt-2">{avgScore}</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="text-slate-400 text-xs font-bold tracking-wider uppercase">System Access Role</div>
          <div className="text-4xl font-black text-slate-800 mt-2 capitalize">{profile?.role}</div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 text-lg">Historical Session Index logs</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold text-xs uppercase border-b border-slate-200">
                <th className="p-4">Exam Architecture Profile</th>
                <th className="p-4">Score Matrix Output</th>
                <th className="p-4">Correct / Incorrect Ratio</th>
                <th className="p-4">Timestamp Verified</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium text-slate-700 divide-y divide-slate-100">
              {attempts.map((att) => (
                <tr key={att.id} className="hover:bg-slate-50/80 transition">
                  <td className="p-4 font-bold text-slate-900">{att.tests?.title}</td>
                  <td className="p-4 text-blue-800 font-bold">{att.score} / {att.tests?.total_marks}</td>
                  <td className="p-4">
                    <span className="text-green-600 font-bold">+{att.correct_count}</span>
                    <span className="text-slate-300 mx-1">/</span>
                    <span className="text-red-500 font-bold">-{att.wrong_count}</span>
                  </td>
                  <td className="p-4 text-slate-400 text-xs">{new Date(att.submitted_at).toLocaleString()}</td>
                </tr>
              ))}
              {attempts.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-400 font-semibold">No operational testing arrays logged.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}