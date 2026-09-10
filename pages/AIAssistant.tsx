import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, Wrench, ShieldAlert, CheckCircle2, ArrowRight, RotateCcw, 
  HelpCircle, Zap, Droplets, Snowflake, Activity, AlertTriangle, ShieldCheck 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../api/client';
import { TroubleshootingQuestion, TroubleshootingSession } from '../types';

export const AIAssistant: React.FC = () => {
  const navigate = useNavigate();
  const [problems, setProblems] = useState<any[]>([]);
  const [selectedProblemKey, setSelectedProblemKey] = useState<string | null>(null);
  const [session, setSession] = useState<TroubleshootingSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCelebrated, setIsCelebrated] = useState(false);

  useEffect(() => {
    loadProblems();
  }, []);

  const loadProblems = async () => {
    try {
      const data = await api.getTroubleshootProblems();
      setProblems(data);
    } catch (err: any) {
      setError('Could not load diagnostic problems.');
    }
  };

  const startDiagnosis = async (problemKey: string) => {
    setSelectedProblemKey(problemKey);
    setLoading(true);
    setError('');
    setIsCelebrated(false);

    try {
      const res = await api.startTroubleshoot(problemKey);
      setSession(res);
    } catch (err: any) {
      setError(err.message || 'Failed to start diagnostic session');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = async (questionId: string, optionId: string) => {
    if (!session) return;
    setLoading(true);
    setError('');

    try {
      const res = await api.submitTroubleshootAnswer({
        session_token: session.session_token,
        question_id: questionId,
        selected_option_id: optionId
      });
      setSession(res);

      if (res.is_completed && res.outcome === 'SAFE_RESOLVED') {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
        setIsCelebrated(true);
      }
    } catch (err: any) {
      setError(err.message || 'Error processing response');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedProblemKey(null);
    setSession(null);
    setIsCelebrated(false);
    setError('');
  };

  const getProblemIcon = (icon: string) => {
    switch (icon) {
      case 'Wind': return <Zap className="w-5 h-5 text-amber-500" />;
      case 'Snowflake': return <Snowflake className="w-5 h-5 text-cyan-500" />;
      case 'Droplets': return <Droplets className="w-5 h-5 text-blue-500" />;
      case 'Activity': return <Activity className="w-5 h-5 text-emerald-500" />;
      default: return <Wrench className="w-5 h-5 text-emerald-500" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      
      {/* Title & Concept Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          Fixora AI Diagnostics
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Diagnose First. Book Only When Needed.
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          Save unnecessary service fees. Answer safe, non-technical questions to discover if your issue is a simple DIY fix or requires a verified technician.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-2xl text-xs text-rose-600 dark:text-rose-300 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={handleReset} className="font-bold underline ml-2">Try Again</button>
        </div>
      )}

      {/* Step 1: Problem Selection View */}
      {!selectedProblemKey && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Select Your Symptom
            </h2>
            <span className="text-xs text-slate-400">Step 1 of 2</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {problems.map(prob => (
              <button
                key={prob.problem_key}
                onClick={() => startDiagnosis(prob.problem_key)}
                className="p-5 rounded-2xl glass-card text-left hover:border-emerald-500 flex items-start gap-4 transition group"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  {getProblemIcon(prob.icon)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition">
                    {prob.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {prob.description}
                  </p>
                </div>
              </button>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
            <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
            <span>
              <strong>Safety Guarantee:</strong> Fixora strictly enforces non-hazardous protocols. We never suggest manipulating live electrical wiring or opening sealed compressors.
            </span>
          </div>
        </div>
      )}

      {/* Step 2: Interactive Decision Tree Question View */}
      {selectedProblemKey && session && !session.is_completed && session.current_question && (
        <div className="rounded-3xl glass-card border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl">
          
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Diagnosing:
              </span>
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {session.problem_title}
              </span>
            </div>
            <button
              onClick={handleReset}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Start Over
            </button>
          </div>

          {/* Question Text */}
          <div className="space-y-2">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 leading-snug">
              {session.current_question.text}
            </h2>
            {session.current_question.explanation && (
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                {session.current_question.explanation}
              </p>
            )}
          </div>

          {/* Answer Options */}
          <div className="space-y-3 pt-2">
            {session.current_question.options.map(opt => (
              <button
                key={opt.id}
                disabled={loading}
                onClick={() => handleAnswer(session.current_question!.id, opt.id)}
                className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 bg-white/70 dark:bg-slate-900/70 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 text-left text-sm font-medium text-slate-800 dark:text-slate-200 flex items-center justify-between transition group"
              >
                <span>{opt.text}</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-transform" />
              </button>
            ))}
          </div>

          {loading && (
            <div className="flex items-center justify-center gap-2 text-xs text-slate-400 pt-2">
              <div className="w-3.5 h-3.5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              Analyzing symptom with Fixora rules...
            </div>
          )}

        </div>
      )}

      {/* Step 3: Diagnostic Outcome Result View */}
      {session && session.is_completed && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Outcome Card */}
          {session.outcome === 'SAFE_RESOLVED' ? (
            <div className="rounded-3xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/60 dark:bg-emerald-950/30 p-6 sm:p-8 space-y-6">
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/30">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                    Fixora Self-Guided Diagnosis
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
                    {session.outcome_title || 'Safe DIY Solution Found!'}
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    Good news! A technician visit is likely not necessary. Follow the safe steps below:
                  </p>
                </div>
              </div>

              {/* Guidance Box */}
              <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-emerald-200/60 dark:border-emerald-800/40 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {session.guidance}
              </div>

              {/* Steps List */}
              {session.steps && session.steps.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Step-by-Step Resolution:
                  </h3>
                  <div className="space-y-2">
                    {session.steps.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200">
                        <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-bold flex items-center justify-center shrink-0 text-[11px]">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-emerald-200/50 dark:border-emerald-800/40">
                <button
                  onClick={handleReset}
                  className="px-5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition"
                >
                  Diagnose Another Problem
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      confetti();
                      setIsCelebrated(true);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Problem Solved!
                  </button>

                  <button
                    onClick={() => navigate('/technicians')}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:underline"
                  >
                    Still Having Trouble? Book Technician
                  </button>
                </div>
              </div>

            </div>
          ) : (
            /* TECHNICIAN REQUIRED */
            <div className="rounded-3xl border border-amber-200 dark:border-amber-800/60 bg-amber-50/60 dark:bg-amber-950/30 p-6 sm:p-8 space-y-6">
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/30">
                  <ShieldAlert className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                    Fixora Professional Diagnosis
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
                    {session.outcome_title || 'Certified Technician Recommended'}
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                    Basic troubleshooting steps did not safely resolve this issue. Professional equipment or parts are required.
                  </p>
                </div>
              </div>

              {/* Guidance Box */}
              <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-amber-200/60 dark:border-amber-800/40 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                {session.guidance}
              </div>

              {/* Safety Precaution Steps */}
              {session.steps && session.steps.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Immediate Safety Advice:
                  </h3>
                  <div className="space-y-2">
                    {session.steps.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200">
                        <span className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 font-bold flex items-center justify-center shrink-0 text-[11px]">
                          {idx + 1}
                        </span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Estimated Pricing & Service Recommendation */}
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] text-slate-400 uppercase font-semibold">
                    Estimated Service Price Range
                  </span>
                  <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                    {session.price_estimate || '₹299 - ₹599'}
                  </div>
                  <p className="text-[11px] text-slate-500">Includes technician visit & diagnosis</p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleReset}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50"
                  >
                    Reset
                  </button>
                  <button
                    onClick={() => {
                      // Navigate to technicians carrying diagnostic summary
                      navigate(`/technicians?diagnosis=${encodeURIComponent(session.outcome_title + ': ' + session.guidance)}`);
                    }}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition"
                  >
                    Book Matched Technician <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
};
