'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type LeaderboardRow = {
  id: string;
  score: number;
  submitted_at: string;
  profiles: { name: string; email: string };
  tests: { title: string };
};

export default function PlatformLeaderboard() {
  const [board, setBoard] = useState<LeaderboardRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLeaderboardMetrics() {
      const { data } = await supabase
        .from('attempts')
        .select('id, score, submitted_at, profiles(name, email), tests(title)')
        .order('score', { ascending: false })
        .limit(50);
      
      if (data) setBoard(data as any);
      setLoading(false);
    }
    loadLeaderboardMetrics();
  }, []);

  if (loading) return <div className="p-12 text-center text-slate-500 font-semibold animate-pulse">Re-indexing Global Standings Matrix...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Global Standings Leaderboard</h1>
        <p className="text-slate-500 text-sm mt-1">Aggregated live runtime metrics for top platform operators.</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900 text-slate-300 font-bold text-xs uppercase tracking-wider">
                <th className="p-4 text-center w-20">Rank Vector</th>
                <th className="p-4">Operator Nom de Guerre</th>
                <th className="p-4">Target Assessment Axis</th>
                <th className="p-4 text-right">Absolute Score Logged</th>
              </tr>
            </thead>
            <tbody className="text-sm font-medium text-slate-700 divide-y divide-slate-100">
              {board.map((row, index) => {
                const isTopThree = index < 3;
                const rankColor = index === 0 ? 'bg-amber-100 text-amber-800' : index === 1 ? 'bg-slate-100 text-slate-800' : index === 2 ? 'bg-orange-100 text-orange-800' : 'text-slate-500';

                return (
                  <tr key={row.id} className="hover:bg-slate-50 transition">
                    <td className="p-4 text-center">
                      <span className={`inline-block w-7 h-7 text-xs font-black rounded-md flex items-center justify-center mx-auto ${isTopThree ? rankColor : ''}`}>
                        {(index + 1).toString().padStart(2, '0')}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{row.profiles?.name}</div>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">{row.profiles?.email.replace(/(?<=.).(?=.*@)/g, '*')}</div>
                    </td>
                    <td className="p-4 text-slate-600 font-medium">{row.tests?.title}</td>
                    <td className="p-4 text-right font-black text-blue-900 text-base">{row.score}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}