'use client';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { supabase, Question, Test } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useParams } from 'next/navigation';

type ExamState = {
  [questionId: string]: {
    selectedOption: 'A' | 'B' | 'C' | 'D' | null;
    isMarked: boolean;
  };
};

export default function OnlineExamEngine() {
  const { id: testId } = useParams() as { id: string };
  const { profile, user } = useAuth();
  const router = useRouter();

  const [test, setTest] = useState<Test | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [examState, setExamState] = useState<ExamState>({});
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function initExamData() {
      const { data: tData } = await supabase.from('tests').select('*').eq('id', testId).single();
      const { data: qData } = await supabase.from('questions').select('*').eq('test_id', testId).order('sort_order', { ascending: true });
      
      if (tData && qData) {
        setTest(tData);
        setQuestions(qData);
        setTimeLeft(tData.duration_minutes * 60);

        const defaultState: ExamState = {};
        qData.forEach((q) => {
          defaultState[q.id] = { selectedOption: null, isMarked: false };
        });
        setExamState(defaultState);
      }
    }
    initExamData();
  }, [testId]);

  const submitExam = useCallback(async () => {
    if (isSubmitting || !user || !test) return;
    setIsSubmitting(true);

    let finalScore = 0;
    let correctCount = 0;
    let wrongCount = 0;

    questions.forEach((q) => {
      const state = examState[q.id];
      if (state && state.selectedOption) {
        if (state.selectedOption === q.correct_option) {
          correctCount++;
          finalScore += (test.total_marks / questions.length);
        } else {
          wrongCount++;
          finalScore -= Number(test.negative_marking);
        }
      }
    });

    const timeTaken = (test.duration_minutes * 60) - timeLeft;

    const { data: attempt, error: attemptErr } = await supabase.from('attempts').insert({
      user_id: user.id,
      test_id: test.id,
      score: Math.max(0, finalScore),
      correct_count: correctCount,
      wrong_count: wrongCount,
      time_taken_seconds: timeTaken,
    }).select().single();

    if (attempt) {
      const answersToInsert = questions.map((q) => ({
        attempt_id: attempt.id,
        question_id: q.id,
        selected_option: examState[q.id]?.selectedOption,
        is_marked_for_review: examState[q.id]?.isMarked || false,
      }));

      await supabase.from('answers').insert(answersToInsert);
      router.push(`/result/${attempt.id}`);
    } else {
      console.error(attemptErr);
      setIsSubmitting(false);
    }
  }, [isSubmitting, user, test, questions, examState, timeLeft, router]);

  useEffect(() => {
    if (timeLeft <= 0 && test) {
      submitExam();
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, test, submitExam]);

  const currentQuestion = useMemo(() => questions[currentIndex], [questions, currentIndex]);

  const handleOptionSelect = (option: 'A' | 'B' | 'C' | 'D') => {
    setExamState((prev) => ({
      ...prev,
      [currentQuestion.id]: { ...prev[currentQuestion.id], selectedOption: option },
    }));
  };

  const clearSelection = () => {
    setExamState((prev) => ({
      ...prev,
      [currentQuestion.id]: { ...prev[currentQuestion.id], selectedOption: null },
    }));
  };

  const toggleMarkReview = () => {
    setExamState((prev) => ({
      ...prev,
      [currentQuestion.id]: { ...prev[currentQuestion.id], isMarked: !prev[currentQuestion.id].isMarked },
    }));
  };

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!test || questions.length === 0) {
    return <div className="p-12 text-center text-slate-500 font-semibold animate-pulse">Locking Exam Environment State...</div>;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      {/* Workspace Area */}
      <div className="flex-grow p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800">
        <div>
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">{test.title}</h2>
              <p className="text-xs text-slate-400 mt-1">Section: General Strategy</p>
            </div>
            <div className="px-4 py-2 bg-red-950 border border-red-800 text-red-400 font-mono text-lg font-bold rounded-lg tracking-wider">
              {formatTime(timeLeft)}
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-800 rounded-xl p-6 mb-6">
            <span className="text-xs font-bold text-orange-400 uppercase tracking-wide">Question {currentIndex + 1} of {questions.length}</span>
            <p className="text-lg mt-3 text-white font-medium leading-relaxed">{currentQuestion.question_text}</p>
          </div>

          <div className="space-y-3">
            {([
              { key: 'A', text: currentQuestion.option_a },
              { key: 'B', text: currentQuestion.option_b },
              { key: 'C', text: currentQuestion.option_c },
              { key: 'D', text: currentQuestion.option_d }
            ] as const).map((opt) => {
              const isSelected = examState[currentQuestion.id]?.selectedOption === opt.key;
              return (
                <button
                  key={opt.key}
                  onClick={() => handleOptionSelect(opt.key)}
                  className={`w-full text-left p-4 rounded-xl border text-sm font-medium transition flex items-center space-x-4 ${isSelected ? 'bg-blue-600/20 border-blue-500 text-blue-300' : 'bg-slate-800/30 border-slate-800 text-slate-300 hover:bg-slate-800/60'}`}
                >
                  <span className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs ${isSelected ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-400'}`}>
                    {opt.key}
                  </span>
                  <span>{opt.text}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 mt-8 pt-4 border-t border-slate-800">
          <div className="flex items-center space-x-2">
            <button onClick={toggleMarkReview} className="px-4 py-2.5 bg-amber-600/20 border border-amber-500/40 text-amber-400 text-xs font-bold rounded-lg hover:bg-amber-600/30 transition">
              {examState[currentQuestion.id]?.isMarked ? 'Unmark Review' : 'Mark For Review'}
            </button>
            <button onClick={clearSelection} className="px-4 py-2.5 text-xs text-slate-400 hover:text-white font-semibold transition">
              Clear Choice
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button 
              disabled={currentIndex === 0} 
              onClick={() => setCurrentIndex((p) => p - 1)} 
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-bold rounded-lg transition"
            >
              Previous
            </button>
            <button 
              onClick={() => currentIndex === questions.length - 1 ? submitExam() : setCurrentIndex((p) => p + 1)} 
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-xs font-bold rounded-lg transition text-white shadow-md shadow-blue-600/20"
            >
              {currentIndex === questions.length - 1 ? 'Finish & Submit Exam' : 'Save & Next'}
            </button>
          </div>
        </div>
      </div>

      {/* Control Palette */}
      <div className="w-full md:w-80 p-6 bg-slate-950/40 flex flex-col justify-between">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Question Matrix Grid</h3>
          <div className="grid grid-cols-5 gap-2">
            {questions.map((q, idx) => {
              const state = examState[q.id];
              let btnClass = 'bg-slate-800 text-slate-400 border-slate-700';
              if (state?.selectedOption) btnClass = 'bg-green-600 border-green-500 text-white';
              if (state?.isMarked) btnClass = 'bg-amber-500 border-amber-400 text-slate-950';
              if (idx === currentIndex) btnClass += ' ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-950';

              return (
                <button 
                  key={q.id} 
                  onClick={() => setCurrentIndex(idx)} 
                  className={`w-10 h-10 font-bold text-xs rounded-lg border transition ${btnClass}`}
                >
                  {(idx + 1).toString().padStart(2, '0')}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-slate-900">
          <button 
            onClick={submitExam} 
            disabled={isSubmitting}
            className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-extrabold text-sm tracking-wide rounded-xl transition shadow-lg shadow-red-600/20"
          >
            {isSubmitting ? 'Processing Metrics...' : 'Terminate & Submit'}
          </button>
        </div>
      </div>
    </div>
  );
}