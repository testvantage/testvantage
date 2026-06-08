'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams } from 'next/navigation';

type ResultPayload = {
  score: number;
  correct_count: number;
  wrong_count: number;
  time_taken_seconds: number;
  tests: { title: string; total_marks: number };
};

export default function DiagnosticResultDashboard() {
  const { id: attemptId } = useParams() as { id: string };
  const [data, setData] = useState<ResultPayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadResultData() {
      const { data: res } = await supabase
        .from('attempts')
        .select('score, correct_count, wrong_count, time_taken_seconds, tests(title, total_marks)')
        .eq('id', attemptId)
        .single();
      
      if (res) setData(res as any);
      setLoading(false);
    }
    loadResultData();
  }, [attemptId]);

  if (loading) return <div className="p-12 text-center text-slate-500 font-semibold animate-pulse">Synthesizing Diagnostic Performance Array...</div>;
  if (!data) return <div className="p-12 text-center text-red-500 font-bold">Error compiling execution report profile.</div>;

  const totalQuestions = data.correct_count + data.wrong_count;
  const accuracy = totalQuestions > 0 ? ((data.correct_count / totalQuestions) * 100).toFixed(1) : '0';

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-blue-900 to-indigo-950 p-8 text-white">
          <span className="text-xs font-bold tracking-widest text-orange-400 uppercase">Assessment Scorecard Engine</span>
          <h1 className="text-3xl font-black mt-1">{data.tests.title}</h1>
        </div>

        <div className="p-8 grid grid-cols-2 md:grid-cols-4 gap-6 border-b border-slate-100">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="text-slate-500 text-xs font-bold uppercase tracking-wide">Final Scaled Score</div>
            <div className="text-3xl font-black text-blue-900 mt-1">{data.score} <span className="text-xs text-slate-400">/ {data.tests.total_marks}</span></div>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="text-slate-500 text-xs font-bold uppercase tracking-wide">Accuracy Rating</div>
            <div className="text-3xl font-black text-green-600 mt-1">{accuracy}%</div>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="text-slate-500 text-xs font-bold uppercase tracking-wide">Correct Assertions</div>
            <div className="text-3xl font-black text-slate-800 mt-1">{data.correct_count}</div>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="text-slate-500 text-xs font-bold uppercase tracking-wide">Time Elapsed</div>
            <div className="text-3xl font-black text-orange-500 mt-1">{Math.floor(data.time_taken_seconds / 60)}m {data.time_taken_seconds % 60}s</div>
          </div>
        </div>

        <div className="p-8 bg-slate-50/50">
          <h3 className="font-extrabold text-slate-900 text-lg mb-4">Vector Vectorial Optimization Matrix</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                <span>Correct Hit Distribution Ratio</span>
                <span>{data.correct_count} Questions</span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div className="bg-green-500 h-full rounded-full" style={{ width: `${(data.correct_count / (totalQuestions || 1)) * 100}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                <span>Inaccurate Penalty Distribution Ratio</span>
                <span>{data.wrong_count} Questions</span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div className="bg-red-500 h-full rounded-full" style={{ width: `${(data.wrong_count / (totalQuestions || 1)) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}