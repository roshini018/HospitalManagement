import React from 'react';
import { Loader2, Star } from 'lucide-react';

const ReviewsSection = ({ loadingReviews, reviews, avgRating }) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-800/60 backdrop-blur-xl p-6 shadow-xl shadow-black/20">
      <div className="flex items-center justify-between mb-6 pb-5 border-b border-white/[0.06]">
        <div>
          <h2 className="text-base font-bold text-white">Patient Reviews</h2>
          <p className="text-xs text-slate-400 mt-1">{reviews.length} verified reviews</p>
        </div>
        <div className="flex items-center gap-2">
          <Star className="h-6 w-6 text-amber-400 fill-amber-400" />
          <span className="text-3xl font-black text-white">{avgRating}</span>
          <span className="text-sm text-slate-500 mb-1">/ 5.0</span>
        </div>
      </div>
      {loadingReviews ? (
        <div className="flex justify-center py-10"><Loader2 className="animate-spin text-emerald-500" /></div>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-10">No reviews yet</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((r, i) => (
            <div key={i} className="rounded-xl bg-slate-700/40 border border-white/[0.06] p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    {[...Array(5)].map((_, idx) => (
                      <Star
                        key={idx}
                        className={`h-3 w-3 ${idx < (r.rating || 0) ? "text-amber-400 fill-amber-400" : "text-slate-600"}`}
                      />
                    ))}
                  </div>
                  <p className="text-xs font-black text-white uppercase">{r.name || "A patient"}</p>
                </div>
                <p className="text-[10px] text-slate-500 font-bold">{new Date(r.createdAt).toLocaleDateString()}</p>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed italic">"{r.comment || "No comment provided."}"</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsSection;
