import React from "react";
import { TrendingUp, Loader2 } from "lucide-react";
import Stars from "../common/Stars";

/**
 * RatingsTab Component
 * Renders the Doctor Performance Hub and Recent Patient Reviews.
 * 
 * @param {Array} doctors - List of doctor objects.
 * @param {Object} doctorAnalytics - Map of doctor IDs to their performance metrics.
 * @param {Array} reviews - List of recent patient reviews.
 * @param {boolean} loadingReviews - Loading state for the reviews list.
 */
const RatingsTab = ({ doctors, doctorAnalytics, reviews, loadingReviews }) => {
  return (
    <div className="space-y-6">
      
      {/* Performance Hub */}
      <section className="rounded-[2.5rem] border border-white/10 bg-slate-800/60 backdrop-blur-xl p-8 shadow-xl shadow-black/20">
        <div className="mb-8">
          <h2 className="text-xl font-black text-white tracking-tight leading-none mb-1 uppercase">Doctor Performance Hub</h2>
          <p className="text-[10px] font-bold uppercase tracking-widest text-violet-400 opacity-80">Aggregate quality metrics across all departments</p>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {doctors.map(d => {
            const dId = d._id || d.id;
            const analytics = doctorAnalytics[dId] || { avgRating: "5.0", reviewCount: 0, uniquePatients: 0 };
            const docName = d.user?.name || "Doctor";
            const cleanName = docName.replace(/^(Dr\.|Dr|Mr\.|Mr|Ms\.|Ms)\s+/i, "");
            const initial = cleanName.charAt(0).toUpperCase();

            return (
              <div key={dId} className="group relative overflow-hidden rounded-3xl border border-white/[0.08] bg-slate-900/40 p-6 hover:bg-slate-800/60 hover:-translate-y-1 transition-all duration-300">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <TrendingUp className="h-20 w-20 text-white" />
                </div>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-white/10 text-lg font-black text-violet-400 flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                    {initial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-white truncate group-hover:text-violet-400 transition-colors uppercase tracking-tight">
                      {docName.toLowerCase().startsWith("dr") ? docName : `Dr. ${docName}`}
                    </p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest truncate">{d.specialization || "Expert Practitioner"}</p>
                  </div>
                </div>

                <div className="flex items-end justify-between mb-2">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 leading-none">Public Rating</p>
                    <Stars rating={parseFloat(analytics.avgRating)} />
                  </div>
                  <div className="text-right leading-none">
                    <span className="text-3xl font-black text-white tracking-tighter group-hover:text-amber-400 transition-colors">{analytics.avgRating}</span>
                  </div>
                </div>

                <div className="h-1.5 w-full rounded-full bg-slate-800/50 mb-4 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-amber-500 transition-all duration-700 ease-out" style={{ width: `${(parseFloat(analytics.avgRating) / 5) * 100}%` }} />
                </div>

                <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                  <div className="flex-1">
                    <span className="block text-xs font-black text-white uppercase tracking-tight">{analytics.reviewCount}</span>
                    <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-widest">Public Reviews</span>
                  </div>
                  <div className="w-px h-6 bg-white/10" />
                  <div className="flex-1">
                    <span className="block text-xs font-black text-white uppercase tracking-tight">{analytics.uniquePatients}</span>
                    <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-widest">Lives Impacted</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Recent Reviews */}
      <section className="rounded-2xl border border-white/10 bg-slate-800/60 backdrop-blur-xl p-6 shadow-xl shadow-black/20">
        <h2 className="text-base font-bold text-white mb-5 uppercase tracking-tight">Recent Patient Reviews</h2>
        <div className="space-y-3 max-h-[500px] overflow-y-auto no-scrollbar pr-1">
          {loadingReviews ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-sky-400" />
            </div>
          ) : reviews.length === 0 ? (
            <p className="text-center text-sm text-slate-500 py-10 font-medium">No system-wide reviews recorded yet</p>
          ) : reviews.map((r, i) => (
            <div key={r._id || i} className="flex items-start justify-between gap-4 rounded-xl border border-white/[0.06] bg-slate-700/40 p-4 hover:bg-slate-700/60 transition-all">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-500/15 text-sm font-black text-sky-400 flex-shrink-0 border border-sky-500/10">
                  {(r.patient?.name || "P").charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{r.patient?.name || "Patient"}</p>
                  <p className="text-[10px] text-sky-400 font-bold uppercase tracking-tight">
                    {r.doctor?.user?.name?.toLowerCase().startsWith("dr") ? r.doctor.user.name : `Dr. ${r.doctor?.user?.name || "Doctor"}`} 
                    <span className="mx-1 text-slate-600 font-normal">|</span>
                    {r.doctor?.specialization || "Specialist"}
                  </p>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed font-medium italic italic-slate-500">"{r.comment}"</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <Stars rating={r.rating} />
                <p className="text-[10px] text-slate-500 font-bold">{new Date(r.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default RatingsTab;
