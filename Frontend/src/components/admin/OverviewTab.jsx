import React, { useState } from "react";
import { 
  AlertCircle, Pencil, X, Save, Clock, Activity, 
  TrendingUp, TrendingDown, Bell 
} from "lucide-react";

const ACTIVITY = [
  { action: "System health check — All systems normal", time: "Just now", color: "bg-sky-500" },
  { action: "Lab services online", time: "10 min ago", color: "bg-violet-500" },
  { action: "Admin session started", time: "15 min ago", color: "bg-emerald-500" },
];

const OverviewTab = ({ 
  summary, 
  wards, 
  onSaveSummary, 
  onSaveWards, 
  liveAlerts, 
  occupancyPct,
  totalOccupied,
  totalBeds
}) => {
  const [editingWards, setEditingWards] = useState(false);
  const [wardsDraft, setWardsDraft] = useState([]);

  const [editingOps, setEditingOps] = useState(false);
  const [opsDraft, setOpsDraft] = useState({ ...summary });

  const handleStartEditWards = () => {
    setWardsDraft(wards.map(w => ({ ...w })));
    setEditingWards(true);
  };

  const handleSaveWards = () => {
    onSaveWards(wardsDraft);
    setEditingWards(false);
  };

  const handleStartEditOps = () => {
    setOpsDraft({ ...summary });
    setEditingOps(true);
  };

  const handleSaveOps = () => {
    onSaveSummary(opsDraft);
    setEditingOps(false);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">

        {/* Recent Activity */}
        <section className="rounded-2xl border border-white/10 bg-slate-800/60 backdrop-blur-xl p-6 shadow-xl shadow-black/20">
          <h2 className="text-base font-bold text-white mb-5">Recent Activity</h2>
          <div className="space-y-4">
            {ACTIVITY.map((a, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className={`h-2 w-2 rounded-full flex-shrink-0 ${a.color}`} />
                <p className="flex-1 text-sm text-slate-200">{a.action}</p>
                <p className="text-xs text-slate-400 flex-shrink-0">{a.time}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Emergencies */}
        <section className="rounded-2xl border border-white/10 bg-slate-800/60 backdrop-blur-xl p-6 shadow-xl shadow-black/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-white">Today's Emergencies</h2>
            <span className="rounded-full bg-red-500/15 border border-red-500/25 px-2.5 py-1 text-[10px] font-bold text-red-400">
              {summary.emergencies} cases
            </span>
          </div>
          {summary.emergencies === 0 ? (
            <p className="text-sm text-slate-400 text-center py-4">No emergencies today ✓</p>
          ) : (
            <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-3">
              <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-red-300">{summary.emergencies} emergency case{summary.emergencies > 1 ? "s" : ""} recorded today</p>
                <p className="text-xs text-slate-400 mt-0.5">Contact the emergency department for details</p>
              </div>
            </div>
          )}
        </section>

        {/* Ward Bed Occupancy */}
        <section className="rounded-2xl border border-white/10 bg-slate-800/60 backdrop-blur-xl p-6 shadow-xl shadow-black/20">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-white">Ward-wise Bed Occupancy</h2>
            {!editingWards ? (
              <button 
                onClick={handleStartEditWards}
                className="flex items-center gap-1.5 rounded-xl border border-violet-500/25 bg-violet-500/10 px-3 py-1.5 text-xs font-bold text-violet-400 hover:bg-violet-500/15 transition-all"
              >
                <Pencil className="h-3 w-3" /> Update Beds
              </button>
            ) : (
              <div className="flex gap-2">
                <button 
                  onClick={() => setEditingWards(false)} 
                  className="flex items-center gap-1 rounded-xl border border-white/10 px-3 py-1.5 text-xs font-semibold text-slate-400 hover:bg-slate-700/40 transition-all"
                >
                  <X className="h-3 w-3" /> Cancel
                </button>
                <button 
                  onClick={handleSaveWards} 
                  className="flex items-center gap-1 rounded-xl bg-violet-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-violet-500 transition-all font-secondary"
                >
                  <Save className="h-3 w-3" /> Save
                </button>
              </div>
            )}
          </div>
          
          {!editingWards ? (
            <div className="space-y-3">
              {wards.map(w => {
                const pct = Math.round((w.occupied / w.total) * 100);
                const barColor = pct >= 90 ? "bg-red-400" : pct >= 75 ? "bg-amber-400" : "bg-emerald-400";
                return (
                  <div key={w.name}>
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-slate-200">{w.name}</p>
                      <p className="text-xs text-slate-500">
                        {w.occupied} / {w.total}
                        <span className={`ml-1.5 font-bold ${pct >= 90 ? "text-red-400" : pct >= 75 ? "text-amber-400" : "text-emerald-400"}`}>({pct}%)</span>
                      </p>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-700">
                      <div className={`h-2 rounded-full transition-all duration-500 ${barColor}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-slate-400 mb-3">Update occupied beds per ward. Total capacity is fixed.</p>
              {wardsDraft.map((w, i) => {
                const pct = Math.round((w.occupied / w.total) * 100);
                return (
                  <div key={w.name} className="rounded-xl border border-white/10 bg-slate-700/50 p-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-slate-200">{w.name}</p>
                      <span className={`text-xs font-bold ${pct >= 90 ? "text-red-400" : pct >= 75 ? "text-amber-400" : "text-emerald-400"}`}>{pct}%</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 leading-none">Occupied</label>
                        <input 
                          type="number" min="0" max={w.total} value={w.occupied}
                          onChange={e => { 
                            const val = Math.min(Number(e.target.value), w.total); 
                            setWardsDraft(prev => prev.map((ward, idx) => idx === i ? { ...ward, occupied: val } : ward)); 
                          }}
                          className="w-full rounded-lg border border-white/10 bg-slate-800/60 px-3 py-2 text-sm font-bold text-slate-200 outline-none focus:border-violet-400 transition-all font-secondary" 
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 leading-none">Total Capacity</label>
                        <input 
                          type="number" min="1" value={w.total}
                          onChange={e => { 
                            const val = Math.max(Number(e.target.value), 1); 
                            setWardsDraft(prev => prev.map((ward, idx) => idx === i ? { ...ward, total: val } : ward)); 
                          }}
                          className="w-full rounded-lg border border-white/10 bg-slate-800/60 px-3 py-2 text-sm font-bold text-slate-200 outline-none focus:border-violet-400 transition-all font-secondary" 
                        />
                      </div>
                    </div>
                    <div className="mt-2 h-1.5 w-full rounded-full bg-slate-600">
                      <div className={`h-1.5 rounded-full transition-all ${pct >= 90 ? "bg-red-400" : pct >= 75 ? "bg-amber-400" : "bg-emerald-400"}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* Right col */}
      <div className="space-y-4">

        {/* Today's Summary */}
        <section className="rounded-2xl border border-white/10 bg-slate-800/60 backdrop-blur-xl p-5 shadow-xl shadow-black/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white">Today's Summary</h3>
            {!editingOps ? (
              <button 
                onClick={handleStartEditOps}
                className="flex items-center gap-1 rounded-lg border border-violet-500/25 bg-violet-500/10 px-2.5 py-1.5 text-[10px] font-bold text-violet-400 hover:bg-violet-500/15 transition-all"
              >
                <Pencil className="h-3 w-3" /> Update
              </button>
            ) : (
              <div className="flex gap-1.5">
                <button 
                  onClick={() => setEditingOps(false)} 
                  className="rounded-lg border border-white/10 px-2.5 py-1.5 text-[10px] font-semibold text-slate-400 hover:bg-slate-700/40 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveOps} 
                  className="rounded-lg bg-violet-700 px-2.5 py-1.5 text-[10px] font-bold text-white hover:bg-violet-500 transition-all font-secondary"
                >
                  Save
                </button>
              </div>
            )}
          </div>
          
          <div className="space-y-3">
            {[
              { label: "OPD Consultations", key: "opd", icon: Activity, color: "text-emerald-400", type: "number" },
              { label: "Planned Surgeries", key: "surgeries", icon: TrendingUp, color: "text-amber-400", type: "number" },
              { label: "Patient Discharges", key: "discharges", icon: Clock, color: "text-sky-400", type: "number" },
              { label: "Patient Admissions", key: "admissions", icon: Bell, color: "text-violet-400", type: "number" },
            ].map(item => (
              <div key={item.key} className="flex items-center justify-between rounded-xl bg-slate-700/40 border border-white/[0.06] px-4 py-3">
                <div className="flex items-center gap-3">
                  <item.icon className={`h-4 w-4 ${item.color}`} />
                  <span className="text-xs text-slate-300">{item.label}</span>
                </div>
                {editingOps ? (
                  <input 
                    type="number" min="0" value={opsDraft[item.key]}
                    onChange={e => setOpsDraft({ ...opsDraft, [item.key]: Number(e.target.value) })}
                    className="w-16 rounded-lg bg-slate-900 border border-white/10 px-2 py-1 text-xs text-center font-bold text-white outline-none focus:border-violet-500 font-secondary" 
                  />
                ) : (
                  <span className="text-sm font-black text-white">{summary[item.key]}</span>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Global Stats Breakdown */}
        <section className="rounded-2xl border border-white/10 bg-slate-800/60 backdrop-blur-xl p-5 shadow-xl shadow-black/20">
          <h3 className="text-sm font-bold text-white mb-4">Hospital Statistics</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-[11px] mb-1.5">
                <span className="text-slate-400 font-medium">Global Occupancy</span>
                <span className="text-violet-400 font-black">{occupancyPct}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-700 overflow-hidden">
                <div className="h-full bg-violet-500 transition-all duration-1000" style={{ width: `${occupancyPct}%` }} />
              </div>
              <p className="text-[10px] text-slate-500 mt-2 italic font-medium">
                Currently {totalOccupied} beds occupied out of {totalBeds} total capacity.
              </p>
            </div>
            
            <div className="pt-4 border-t border-white/[0.06] space-y-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Live Alerts</p>
              {liveAlerts.length === 0 ? (
                <p className="text-xs text-slate-400">All systems operational ✓</p>
              ) : (
                liveAlerts.map((alert, i) => (
                  <div key={i} className={`flex items-start gap-2 rounded-xl p-3 border ${
                    alert.type === "warning" ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-sky-500/10 border-sky-500/20 text-sky-400"
                  }`}>
                    <Bell className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                    <p className="text-[11px] font-bold leading-tight">{alert.msg}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default OverviewTab;
