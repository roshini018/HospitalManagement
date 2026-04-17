import React from "react";
import { Loader2, CheckCircle2, Trash2 } from "lucide-react";

/**
 * QueueTab Component
 * Renders the Live Queue management view in the Admin Dashboard.
 * 
 * @param {boolean} loading - Loading state for the queue.
 * @param {Array} queue - List of normalized queue objects.
 * @param {function} onCycleStatus - Callback to cycle the status of an appointment.
 * @param {function} onMarkDone - Callback to mark an appointment as complete.
 * @param {function} onDelete - Callback to remove an appointment from the queue.
 * @param {Object} statusStyleMap - Mapping of status labels to CSS style classes.
 */
const QueueTab = ({ 
  loading, 
  queue, 
  onCycleStatus, 
  onMarkDone, 
  onDelete, 
  statusStyleMap 
}) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-800/60 backdrop-blur-xl p-6 shadow-xl shadow-black/20">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <h2 className="text-base font-bold text-white uppercase tracking-tight">Live Queue Management</h2>
        <div className="flex gap-2">
          {["Active", "Waiting", "Done"].map(status => (
            <span 
              key={status}
              className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider border ${
                status === "Active" ? "bg-sky-500/10 text-sky-400 border-sky-500/20" :
                status === "Waiting" ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              }`}
            >
              {queue.filter(q => q.status === status).length} {status}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-3 max-h-[600px] overflow-y-auto no-scrollbar pr-1">
        {loading ? (
          <div className="flex items-center justify-center py-12 text-slate-500">
            <Loader2 className="h-6 w-6 animate-spin mr-2" /> 
            <span className="text-sm font-medium">Synchronizing live queue...</span>
          </div>
        ) : queue.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-slate-500 font-medium">The queue is currently empty</p>
          </div>
        ) : (
          queue.map((q, idx) => (
            <div 
              key={q._id}
              className={`flex items-center justify-between rounded-xl border p-4 transition-all duration-300 ${
                q.status === "Active" ? "border-sky-500/30 bg-sky-500/10 shadow-lg shadow-sky-500/5" :
                q.status === "Done" ? "border-emerald-500/20 bg-emerald-500/5 opacity-60" :
                "border-white/[0.06] bg-slate-700/40 hover:bg-slate-700/60"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-xs font-black flex-shrink-0 border ${
                  q.status === "Active" ? "bg-sky-600 text-white border-sky-400/50" :
                  q.status === "Done" ? "bg-emerald-600 text-white border-emerald-400/50" :
                  "bg-slate-800 text-slate-500 border-white/5"
                }`}>
                  #{q.tokenNumber || idx + 1}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{q.patient?.name || "Anonymous Patient"}</p>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                    {q.doctor?.user?.name?.toLowerCase().startsWith("dr") ? q.doctor.user.name : `Dr. ${q.doctor?.user?.name || "Staff"}`} 
                    <span className="mx-1.5 opacity-30">|</span>
                    {q.doctor?.specialization || "Consultant"}
                    <span className="mx-1.5 opacity-30">|</span>
                    {new Date(q.date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onCycleStatus(q._id, q.status)}
                  className={`rounded-full border px-2.5 py-1 text-[9px] font-black uppercase tracking-wider transition-all hover:scale-105 active:scale-95 ${
                    statusStyleMap[q.status] || "bg-slate-700/40 text-slate-400 border-white/10"
                  }`}
                >
                  {q.status}
                </button>
                {q.status !== "Done" && (
                  <button 
                    onClick={() => onMarkDone(q._id)}
                    title="Mark as Completed"
                    className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-1.5 text-emerald-400 hover:bg-emerald-500/20 transition-all"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </button>
                )}
                <button 
                  onClick={() => onDelete(q._id)}
                  title="Remove from Queue"
                  className="rounded-lg border border-white/10 bg-slate-800/60 p-1.5 text-slate-400 hover:text-red-400 hover:border-red-500/25 transition-all"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-5 p-4 rounded-xl bg-slate-900/40 border border-white/[0.04]">
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-pulse" />
          Queue Management Tips
        </p>
        <p className="mt-2 text-[11px] text-slate-400 leading-relaxed font-medium">
          Click the <span className="text-violet-400">status badge</span> to cycle through <span className="text-amber-400">Waiting</span> → <span className="text-sky-400">Active</span> → <span className="text-emerald-400">Done</span>. Use the <span className="text-emerald-400">check icon</span> to mark an appointment as completed instantly.
        </p>
      </div>
    </div>
  );
};

export default QueueTab;
