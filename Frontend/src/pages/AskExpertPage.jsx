import { useState, useEffect } from "react";
import { MessageCircle, Send, ChevronDown, ChevronUp, Loader2, AlertCircle } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const inputCls =
  "w-full rounded-xl border border-white/10 bg-slate-700/50 backdrop-blur-sm px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 transition-all";

const CATEGORIES = [
  "General Medicine", "Cardiology", "Neurology",
  "Orthopedics", "Pediatrics", "Dermatology",
];

export default function AskExpertPage() {
  const { user } = useAuth();
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("General Medicine");
  const [question, setQuestion] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState("");
  const [expanded, setExpanded] = useState(null);

  const [questions, setQuestions] = useState([]);
  const [loadingQ, setLoadingQ] = useState(true);
  const [qError, setQError] = useState("");

  const fetchQuestions = async () => {
    setLoadingQ(true);
    setQError("");
    try {
      const res = await api.get("/api/feed");
      setQuestions(res.data || []);
    } catch (err) {
      setQError(err?.response?.data?.message || "Failed to load questions");
    } finally {
      setLoadingQ(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !question.trim()) return;
    setSubmitting(true);
    setSubmitMsg("");
    try {
      await api.post("/api/questions", { subject, category, body: question });
      setSubmitMsg("✅ Question submitted! A doctor will respond shortly.");
      setSubject("");
      setQuestion("");
      fetchQuestions();
    } catch (err) {
      setSubmitMsg("❌ " + (err?.response?.data?.message || "Submission failed. Please try again."));
    } finally {
      setSubmitting(false);
      setTimeout(() => setSubmitMsg(""), 5000);
    }
  };

  // Only display answered questions
  const answered = questions.filter((q) => q.answer || q.status === "answered");

  return (
    <main className="min-h-screen bg-slate-900 pb-16">

      {/* Header */}
      <div className="border-b border-white/[0.06] bg-slate-800/40 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
          <p className="text-[11px] font-bold uppercase tracking-widest text-sky-400 mb-1">Medical Advice</p>
          <h1 className="text-2xl font-black text-white">Ask an Expert</h1>
          <p className="text-sm text-slate-400 mt-1">Submit medical questions and get answers from verified doctors</p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8 md:px-6 space-y-8">

        {/* Submit Form */}
        <div className="rounded-2xl border border-white/10 bg-slate-800/60 backdrop-blur-xl p-6 shadow-xl shadow-black/30">
          <h2 className="flex items-center gap-2 text-base font-bold text-white mb-5">
            <MessageCircle className="h-4 w-4 text-sky-400" /> Submit Your Question
          </h2>

          {submitMsg && (
            <div className={`mb-4 rounded-xl border px-4 py-3 text-sm font-medium ${submitMsg.startsWith("✅") ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-400" : "border-red-500/25 bg-red-500/10 text-red-400"}`}>
              {submitMsg}
            </div>
          )}

          {!user && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-400">
              <AlertCircle className="h-4 w-4 flex-shrink-0" /> Please log in to submit a question.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              placeholder="Question subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className={inputCls}
              disabled={!user}
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={inputCls}
              disabled={!user}
            >
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
            <textarea
              rows={4}
              placeholder="Describe your question in detail..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className={`${inputCls} resize-none`}
              disabled={!user}
            />
            <button
              type="submit"
              disabled={submitting || !user}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-sky-500/25 hover:from-sky-400 hover:to-blue-500 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {submitting ? "Submitting..." : "Submit Question"}
            </button>
          </form>
        </div>

        {/* Doctor Answers */}
        <div>
          <h2 className="text-base font-bold text-white mb-4">Doctor Answers</h2>

          {loadingQ ? (
            <div className="flex items-center justify-center py-12 text-slate-500">
              <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading...
            </div>
          ) : qError ? (
            <div className="flex items-center gap-2 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              <AlertCircle className="h-4 w-4" /> {qError}
            </div>
          ) : answered.length === 0 ? (
            <p className="text-sm text-slate-500">No answered questions yet. Be the first to ask!</p>
          ) : (
            <div className="space-y-3">
              {answered.map((item, i) => (
                <div
                  key={item._id || i}
                  className="rounded-2xl border border-white/10 bg-slate-800/60 backdrop-blur-xl shadow-lg shadow-black/20 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setExpanded(expanded === i ? null : i)}
                    className="flex w-full items-center justify-between p-5 text-left hover:bg-slate-700/30 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-sky-500/15 border border-sky-500/20 text-xs font-bold text-sky-400">Q</span>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-sky-400/80 mb-0.5">{item.category}</p>
                        <p className="text-sm font-semibold text-white">{item.subject}</p>
                      </div>
                    </div>
                    {expanded === i
                      ? <ChevronUp className="h-4 w-4 text-slate-400 flex-shrink-0" />
                      : <ChevronDown className="h-4 w-4 text-slate-400 flex-shrink-0" />}
                  </button>
                  {expanded === i && (
                    <div className="border-t border-white/[0.06] bg-slate-700/30 p-5">
                      <div className="mb-4 pl-9">
                        <p className="text-xs text-slate-400 italic">"{item.question}"</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/20 text-xs font-bold text-emerald-400">A</span>
                        <div>
                          <p className="text-sm text-slate-300 leading-relaxed">{item.answer}</p>
                          {item.doctor && (
                            <p className="mt-3 text-xs font-semibold text-sky-400">
                              Dr. {item.doctor?.name || "Expert"} · Verified Doctor
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}