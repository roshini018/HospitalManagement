import React from 'react';
import { Loader2, Download } from 'lucide-react';

const SharedReportsSection = ({ loadingShared, sharedReports }) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-800/60 backdrop-blur-xl p-6 shadow-xl shadow-black/20">
      <h2 className="text-base font-bold text-white mb-5">Patient Shared Reports</h2>
      {loadingShared ? (
        <div className="flex justify-center py-10"><Loader2 className="animate-spin text-emerald-500" /></div>
      ) : sharedReports.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-10">No reports shared with you yet</p>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {sharedReports.map(r => (
            <div key={r._id} className="rounded-xl border border-white/[0.06] bg-slate-700/40 p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-white">{r.testType}</p>
                <div className="flex gap-2 text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-widest">
                  <span>{r.patientName}</span>
                  <span>•</span>
                  <span>{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <a
                href={`http://localhost:5001/api/lab-tests/${r._id}/download`}
                target="_blank"
                rel="noreferrer"
                className="h-10 w-10 flex items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all shadow-lg"
              >
                <Download className="h-4 w-4" />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SharedReportsSection;
