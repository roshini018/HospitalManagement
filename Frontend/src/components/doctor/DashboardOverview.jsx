import React from 'react';
import { Radio, CheckCircle, Clock, ChevronRight, Bell } from 'lucide-react';

const DashboardOverview = ({ 
  liveAppt, 
  waitingQ, 
  doneQ, 
  queue, 
  onStatusChange, 
  onTabChange,
  helpers 
}) => {
  const { getS, getMeta, patientDisplay } = helpers;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-4">

        {/* Live Now Card */}
        {liveAppt ? (
          <div className={`relative overflow-hidden rounded-2xl border p-5 ${getS(liveAppt.status) === 'active' ? 'border-sky-500/30 bg-sky-500/10' : 'border-amber-500/30 bg-amber-500/10'}`}>
            <div className={`absolute top-4 right-4 flex items-center gap-1.5 rounded-full px-3 py-1 ${getS(liveAppt.status) === 'active' ? 'bg-sky-500' : 'bg-amber-500'}`}>
              <Radio className={`h-3 w-3 text-white ${getS(liveAppt.status) === 'active' ? 'animate-pulse' : ''}`} />
              <span className="text-[10px] font-black text-white uppercase tracking-widest">
                {getS(liveAppt.status) === 'active' ? 'Live' : 'Next Up'}
              </span>
            </div>
            <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${getS(liveAppt.status) === 'active' ? 'text-sky-400' : 'text-amber-400'}`}>Now Serving</p>
            <p className="text-lg font-black text-white">
              Token #{liveAppt.tokenNumber} — {patientDisplay(liveAppt)}
            </p>
            <p className="text-xs text-slate-400 mt-1">{liveAppt.symptoms || "General Consultation"} · {liveAppt.timeSlot}</p>
            <div className="mt-3 flex gap-2">
              {getS(liveAppt.status) === "active" ? (
                <button
                  onClick={() => onStatusChange(liveAppt._id, "completed")}
                  className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-400 transition-all"
                >
                  <CheckCircle className="h-3.5 w-3.5" /> Complete
                </button>
              ) : (
                <button
                  onClick={() => onStatusChange(liveAppt._id, "active")}
                  className="flex items-center gap-1.5 rounded-lg bg-sky-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-sky-400 transition-all"
                >
                  <Radio className="h-3.5 w-3.5" /> Start Now
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-slate-800/60 p-5 text-center text-sm text-slate-500">
            No active or waiting appointments
          </div>
        )}

        {/* Queue Preview */}
        <div className="rounded-2xl border border-white/10 bg-slate-800/60 backdrop-blur-xl p-6 shadow-xl shadow-black/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="h-4 w-4 text-emerald-400" /> Next in Queue
            </h2>
            <button onClick={() => onTabChange("Queue")} className="text-xs font-semibold text-sky-400 hover:underline">
              Full Queue →
            </button>
          </div>
          <div className="space-y-2">
            {waitingQ.slice(0, 4).map(q => {
              const meta = getMeta(q.status);
              return (
                <div key={q._id} className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-slate-700/40 p-3 gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 flex-col items-center justify-center rounded-lg bg-slate-900/60 border border-white/10 flex-shrink-0">
                      <span className="text-[8px] text-slate-500 font-bold leading-none">Tkn</span>
                      <span className="text-sm font-black text-emerald-400 leading-none">{q.tokenNumber}</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{patientDisplay(q)}</p>
                      <p className="text-xs text-slate-400">{q.timeSlot} · {q.symptoms || "General"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full border px-2.5 py-1 text-[9px] font-black ${meta.cls}`}>{meta.label}</span>
                    {(getS(q.status) === "waiting" || getS(q.status) === "scheduled") && (
                      <button
                        onClick={() => onStatusChange(q._id, "active")}
                        className="rounded-lg bg-sky-500 px-2.5 py-1 text-[10px] font-bold text-white hover:bg-sky-400 transition-all"
                      >
                        Start
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
            {waitingQ.length === 0 && (
              <p className="text-sm text-slate-500 text-center py-6">No patients waiting</p>
            )}
          </div>
        </div>
      </div>

      {/* Right col */}
      <div className="space-y-4">
        <div className="rounded-2xl border border-white/10 bg-slate-800/60 backdrop-blur-xl p-5 shadow-xl shadow-black/20">
          <h3 className="text-sm font-bold text-white mb-4">Quick Actions</h3>
          <div className="space-y-1">
            {[
              { label: "Full Queue", tab: "Queue" },
              { label: "Patient Roster", tab: "Patients" },
              { label: "Latest Reviews", tab: "Reviews" },
              { label: "Edit Profile", tab: "Profile" },
            ].map(a => (
              <button
                key={a.label}
                onClick={() => onTabChange(a.tab)}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-400 transition-colors"
              >
                {a.label} <ChevronRight className="h-3.5 w-3.5" />
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-800/60 backdrop-blur-xl p-5 shadow-xl shadow-black/20">
          <h3 className="flex items-center gap-2 text-sm font-bold text-white mb-4">
            <Bell className="h-3.5 w-3.5 text-amber-500" /> Queue Summary
          </h3>
          <div className="space-y-2">
            {[
              { label: "Waiting", count: waitingQ.length, cls: "bg-amber-500" },
              { label: "Completed", count: doneQ.filter(q => getS(q.status) === 'completed').length, cls: "bg-emerald-500" },
              { label: "Missed", count: queue.filter(q => getS(q.status) === 'missed').length, cls: "bg-red-500" },
              { label: "Skipped", count: queue.filter(q => getS(q.status) === 'skipped').length, cls: "bg-orange-500" },
            ].map(s => (
              <div key={s.label} className="flex items-center justify-between rounded-xl bg-slate-700/40 border border-white/[0.06] px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full ${s.cls}`} />
                  <span className="text-xs text-slate-300">{s.label}</span>
                </div>
                <span className="text-sm font-black text-white">{s.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
