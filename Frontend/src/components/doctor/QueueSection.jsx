import React from 'react';
import { Loader2, Radio, FileText, SkipForward } from 'lucide-react';

const QueueSection = ({ 
  loadingQ, 
  queue, 
  onRefresh, 
  onStatusChange, 
  onSkip, 
  onOpenNotes,
  skippingId,
  helpers 
}) => {
  const { getS, getMeta, patientDisplay } = helpers;

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-800/60 backdrop-blur-xl p-6 shadow-xl shadow-black/20">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-bold text-white">Today's Queue</h2>
        <button onClick={onRefresh} className="text-xs text-slate-400 hover:text-white transition-colors">
          ↻ Refresh
        </button>
      </div>

      {loadingQ ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
        </div>
      ) : queue.length === 0 ? (
        <p className="text-center text-sm text-slate-500 py-12">No appointments today</p>
      ) : (
        <div className="space-y-3">
          {queue.map(item => {
            const s = getS(item.status);
            const meta = getMeta(s);
            const isLive = s === "active";

            return (
              <div
                key={item._id}
                className={`rounded-xl border p-4 transition-all ${isLive
                    ? "border-sky-500/30 bg-sky-500/10"
                    : ["completed", "missed", "skipped"].includes(s)
                      ? "border-white/[0.04] bg-slate-800/30 opacity-60"
                      : "border-white/[0.06] bg-slate-700/40"
                  }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`flex flex-col items-center justify-center h-11 w-11 rounded-xl border flex-shrink-0 ${isLive ? "bg-sky-500 border-sky-400" : "bg-slate-900/60 border-white/10"
                      }`}>
                      <span className={`text-[8px] font-black uppercase leading-none mb-0.5 ${isLive ? "text-sky-100" : "text-slate-500"}`}>Tkn</span>
                      <span className={`text-lg font-black leading-none ${isLive ? "text-white" : "text-emerald-400"}`}>
                        {item.tokenNumber || "–"}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-white">{patientDisplay(item)}</p>
                        {isLive && (
                          <div className="flex items-center gap-1 rounded-full bg-sky-500 px-2 py-0.5">
                            <Radio className="h-2.5 w-2.5 text-white animate-pulse" />
                            <span className="text-[9px] font-black text-white">LIVE</span>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {item.timeSlot} · {item.symptoms || "General Consultation"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap justify-end">
                    <span className={`rounded-full border px-2.5 py-1 text-[9px] font-black ${meta.cls}`}>
                      {meta.label}
                    </span>

                    {/* Action buttons */}
                    {!["completed", "missed", "skipped", "cancelled"].includes(s) && (
                      <>
                        {["waiting", "scheduled"].includes(s) && (
                          <button
                            onClick={() => onStatusChange(item._id, "active")}
                            className="rounded-lg bg-sky-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-sky-400 transition-all shadow-md shadow-sky-500/20"
                          >
                            Start
                          </button>
                        )}
                        {["active", "waiting", "scheduled"].includes(s) && (
                          <button
                            onClick={() => onStatusChange(item._id, "completed")}
                            className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/20"
                          >
                            Complete
                          </button>
                        )}
                        {/* New Notes / Prescription Button */}
                        {["active", "waiting"].includes(s) && (
                          <button
                            onClick={() => onOpenNotes(item)}
                            className="rounded-lg border border-white/10 bg-slate-700/40 px-3 py-1.5 text-xs font-bold text-slate-300 hover:bg-slate-700/60 transition-all"
                          >
                            <FileText className="h-3.5 w-3.5" /> Notes
                          </button>
                        )}
                        <button
                          onClick={() => onSkip(item._id)}
                          disabled={skippingId === item._id}
                          className="rounded-lg border border-orange-500/25 bg-orange-500/10 px-3 py-1.5 text-xs font-bold text-orange-400 hover:bg-orange-500/20 transition-all disabled:opacity-50"
                        >
                          {skippingId === item._id
                            ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            : <SkipForward className="h-3.5 w-3.5" />
                          }
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default QueueSection;
