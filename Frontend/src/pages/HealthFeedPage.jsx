import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Loader2, AlertCircle } from "lucide-react";
import api from "../services/api";

const FAQS = [
  { question: "How soon are prescriptions available?", answer: "Within 15 minutes after consultation." },
  { question: "Can I download lab reports?",           answer: "Yes, reports are available in PDF format." },
  { question: "Do you provide emergency services?",    answer: "Yes, 24/7 emergency care is available." },
];

export default function HealthFeedPage() {
  const [expanded, setExpanded] = useState(null);
  const [feedItems, setFeedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFeed = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get("/api/feed");
        setFeedItems(res.data || []);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load health feed");
      } finally {
        setLoading(false);
      }
    };
    fetchFeed();
  }, []);

  return (
    <main className="min-h-screen bg-slate-900 pb-16">

      {/* Header */}
      <div className="border-b border-white/[0.06] bg-slate-800/40 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
          <p className="text-[11px] font-bold uppercase tracking-widest text-sky-400 mb-1">Stay Informed</p>
          <h1 className="text-2xl font-black text-white">Health Feed</h1>
          <p className="text-sm text-slate-400 mt-1">Doctor-answered questions and medical advice from our experts</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 space-y-12">

        {/* Articles / Answered Questions Feed */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <p className="text-[11px] font-bold uppercase tracking-widest text-sky-400">Expert Medical Answers</p>
            <div className="h-px flex-1 bg-white/[0.06]" />
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16 text-slate-500">
              <Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading feed...
            </div>
          ) : error ? (
            <div className="flex items-center gap-2 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              <AlertCircle className="h-4 w-4" /> {error}
            </div>
          ) : feedItems.length === 0 ? (
            <p className="text-sm text-slate-500">No answered questions available yet.</p>
          ) : (
            <div className="grid gap-5 md:grid-cols-3">
              {feedItems.map((item) => (
                <article
                  key={item._id}
                  className="group rounded-2xl border border-white/10 bg-slate-800/60 backdrop-blur-xl p-6 shadow-xl shadow-black/20 hover:shadow-2xl hover:border-white/20 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                  <span className="inline-block rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-3">
                    {item.category || "General"}
                  </span>
                  <h3 className="text-base font-bold text-white leading-snug mb-2 group-hover:text-sky-400 transition-colors">
                    {item.subject || item.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed mb-4">
                    {item.answer
                      ? item.answer.length > 120
                        ? item.answer.slice(0, 120) + "..."
                        : item.answer
                      : item.summary || ""}
                  </p>
                  {(item.answeredBy || item.doctor) && (
                    <div className="flex items-center gap-2 pt-3 border-t border-white/[0.06]">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-500/15 border border-sky-500/20 text-xs font-bold text-sky-400">
                        {(item.answeredBy?.name || item.doctor?.name || "D").charAt(0)}
                      </div>
                      <p className="text-xs font-semibold text-sky-400">
                        By {item.answeredBy?.name || item.doctor?.name || "Expert"}
                      </p>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Static FAQ */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <p className="text-[11px] font-bold uppercase tracking-widest text-sky-400">Common Questions</p>
            <div className="h-px flex-1 bg-white/[0.06]" />
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="rounded-2xl border border-white/10 bg-slate-800/60 backdrop-blur-xl shadow-lg shadow-black/20 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setExpanded(expanded === i ? null : i)}
                  className="flex w-full items-center justify-between px-6 py-4 text-left hover:bg-slate-700/30 transition-colors"
                >
                  <p className="text-sm font-semibold text-white pr-4">{faq.question}</p>
                  {expanded === i
                    ? <ChevronUp className="h-4 w-4 text-slate-400 flex-shrink-0" />
                    : <ChevronDown className="h-4 w-4 text-slate-400 flex-shrink-0" />}
                </button>
                {expanded === i && (
                  <div className="border-t border-white/[0.06] bg-slate-700/30 px-6 py-4">
                    <p className="text-sm text-slate-300 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}