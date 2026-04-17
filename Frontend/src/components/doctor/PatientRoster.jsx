import React from 'react';
import { FileText } from 'lucide-react';

const PatientRoster = ({ patientRoster, onOpenNotes, helpers }) => {
  const { getMeta } = helpers;

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-800/60 backdrop-blur-xl p-6 shadow-xl shadow-black/20">
      <h2 className="text-base font-bold text-white mb-5">Patient Roster</h2>
      {patientRoster.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-10">No patients in roster yet</p>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {patientRoster.map(p => {
            const meta = getMeta(p.status);
            return (
              <div key={p.id} className="rounded-xl border border-white/[0.06] bg-slate-700/40 p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/15 text-sm font-bold text-emerald-400">
                      {(p.name || "P").charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{p.name}</p>
                      <p className="text-xs text-slate-400">{p.lastVisit}</p>
                    </div>
                  </div>
                  <span className={`rounded-full border px-2.5 py-1 text-[9px] font-black ${meta.cls}`}>
                    {meta.label}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{p.condition}</p>
                <button
                  onClick={() => onOpenNotes(p)}
                  className="mt-3 flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-700/60 transition-all"
                >
                  <FileText className="h-3.5 w-3.5" /> Notes
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PatientRoster;
