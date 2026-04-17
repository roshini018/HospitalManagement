import React from 'react';
import { Loader2, MessageCircle, Save } from 'lucide-react';

const QuestionsSection = ({ 
  loadingQ2, 
  questionsList, 
  answerText, 
  onAnswerChange, 
  onAnswerSubmit, 
  answeringId 
}) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-800/60 backdrop-blur-xl p-6 shadow-xl shadow-black/20">
      <h2 className="text-base font-bold text-white mb-5">Unanswered Questions</h2>
      {loadingQ2 ? (
        <div className="flex justify-center py-10"><Loader2 className="animate-spin text-emerald-500" /></div>
      ) : questionsList.filter(q => !q.answer).length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-10">No pending questions</p>
      ) : (
        <div className="space-y-4">
          {questionsList.filter(q => !q.answer).map(q => (
            <div key={q._id} className="rounded-xl border border-white/[0.06] bg-slate-700/40 p-5">
              <div className="flex items-start gap-3 mb-4">
                <div className="h-8 w-8 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-400 flex-shrink-0">
                  <MessageCircle className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white leading-relaxed">{q.question}</p>
                  <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-widest">Asked by {q.patientName || "Anonymous"}</p>
                </div>
              </div>
              <div className="relative">
                <textarea
                  placeholder="Type your medical advice..."
                  value={answerText[q._id] || ""}
                  onChange={(e) => onAnswerChange(q._id, e.target.value)}
                  className="w-full rounded-xl bg-slate-900/60 border border-white/10 p-4 text-xs text-white placeholder:text-slate-600 outline-none focus:border-emerald-500/50 transition-all min-h-[80px] resize-none"
                />
                <button
                  onClick={() => onAnswerSubmit(q._id)}
                  disabled={answeringId === q._id}
                  className="absolute bottom-3 right-3 rounded-lg bg-emerald-500 px-3 py-1.5 text-[10px] font-black text-white hover:bg-emerald-400 transition-all disabled:opacity-50 flex items-center gap-1.5"
                >
                  {answeringId === q._id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
                  Submit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionsSection;
