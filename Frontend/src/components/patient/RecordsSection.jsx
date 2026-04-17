import React from 'react';
import { FileText, Download, FileClock, FolderHeart, FlaskConical } from 'lucide-react';

const RecordsSection = ({ myPrescriptions, myRecords, myReports, downloadPrescription }) => {
  return (
    <div className="space-y-12 animate-in fade-in duration-500">
      <section className="rounded-[2.5rem] bg-slate-800/40 border border-white/10 p-8 md:p-10 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-3">
              <FileText className="h-6 w-6 text-blue-400" /> Digital Prescriptions
            </h2>
            <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest font-bold">Active treatment plans from your doctors</p>
          </div>
          <div className="rounded-full bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 text-[10px] font-black text-blue-400 uppercase">
            {myPrescriptions?.length || 0} Total
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {(myPrescriptions || []).map(p => (
            <div key={p._id} className="group relative rounded-3xl bg-white/5 border border-white/10 p-6 transition-all hover:bg-white/10 hover:border-blue-500/30">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 mb-1">{new Date(p.createdAt).toLocaleDateString()}</p>
                  <h4 className="text-lg font-black text-white group-hover:text-blue-400 transition-colors uppercase">{p.diagnosis}</h4>
                  <p className="text-xs text-slate-400 mt-1 font-bold">Dr. {p.doctor?.user?.name || "Specialist"}</p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                  <FileText className="h-5 w-5" />
                </div>
              </div>
              <div className="space-y-2 mb-6">
                {(p.medicines || []).slice(0, 2).map((m, i) => (
                  <div key={i} className="flex items-center justify-between text-[11px] font-medium text-slate-400">
                    <span>{m.name}</span>
                    <span className="text-slate-500">{m.dosage}</span>
                  </div>
                ))}
                {(p.medicines?.length > 2) && (
                  <p className="text-[9px] font-black text-blue-400 uppercase">+{p.medicines.length - 2} more medicines</p>
                )}
              </div>
              <div className="flex gap-3">
                <button className="flex-1 rounded-xl bg-blue-500/10 border border-blue-500/20 py-3 text-[10px] font-black uppercase text-blue-500 hover:bg-blue-500 hover:text-white transition-all">Detailed View</button>
                <button
                  onClick={() => {
                    if (p.recordId) {
                      window.open(`http://localhost:5001/api/records/${p.recordId}/download`, "_blank");
                    } else {
                      downloadPrescription(p);
                    }
                  }}
                  className="rounded-xl bg-blue-500 px-4 py-3 text-white shadow-lg shadow-blue-500/20 hover:scale-105 transition-all"
                >
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          {(!myPrescriptions || myPrescriptions.length === 0) && (
            <div className="col-span-full py-16 text-center rounded-[2rem] border border-dashed border-white/5">
              <FileClock className="h-10 w-10 text-slate-700 mx-auto mb-4 opacity-30" />
              <p className="text-sm font-bold text-slate-600 italic uppercase tracking-widest">No active digital prescriptions</p>
            </div>
          )}
        </div>
      </section>
      <div className="grid gap-10 lg:grid-cols-2">
        <section className="rounded-[2.5rem] bg-slate-800/40 border border-white/10 p-8 md:p-10 backdrop-blur-xl">
          <h2 className="text-xl font-black text-white mb-8 flex items-center gap-3">
            <FolderHeart className="h-5 w-5 text-sky-400" /> Medical Documents
          </h2>
          <div className="space-y-4">
            {(myRecords || []).map(r => (
              <div key={r._id} className="group rounded-2xl bg-white/5 border border-white/10 p-5 flex items-start justify-between hover:bg-white/10 transition-all">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-sky-500 mb-1.5">{new Date(r.createdAt).toLocaleDateString()}</p>
                  <h4 className="text-sm font-black text-white group-hover:text-sky-400 transition-colors uppercase leading-tight">{r.title || "Health Assessment"}</h4>
                  <p className="text-[11px] text-slate-400 mt-2 font-medium italic line-clamp-1">{r.description || "Digital scan/document"}</p>
                </div>
                <button
                  onClick={() => window.open(`http://localhost:5001/api/records/${r._id}/download`, "_blank")}
                  className="h-10 w-10 flex items-center justify-center rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 hover:bg-sky-500 hover:text-white transition-all shadow-lg active:scale-90"
                >
                  <Download className="h-4 w-4" />
                </button>
              </div>
            ))}
            {(!myRecords || myRecords.length === 0) && <p className="text-sm text-slate-700 py-10 text-center font-bold italic">No documents found.</p>}
          </div>
        </section>
        <section className="rounded-[2.5rem] bg-slate-800/40 border border-white/10 p-8 md:p-10 backdrop-blur-xl">
          <h2 className="text-xl font-black text-white mb-8 flex items-center gap-3">
            <FlaskConical className="h-5 w-5 text-emerald-400" /> Laboratory Results
          </h2>
          <div className="space-y-4">
            {(myReports || []).map(l => (
              <div key={l._id} className="group rounded-2xl bg-white/5 border border-white/10 p-5 flex items-center justify-between hover:bg-white/10 transition-all">
                <div>
                  <p className="text-sm font-black text-white uppercase group-hover:text-emerald-400 transition-colors">{l.testType}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <p className="text-[10px] font-black uppercase text-emerald-500/70 tracking-widest">{l.status}</p>
                  </div>
                </div>
                {l.status === "completed" && (
                  <a href={`http://localhost:5001/api/lab-tests/${l._id}/download`} target="_blank" rel="noreferrer" className="h-10 w-10 flex items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all shadow-lg">
                    <Download className="h-4 w-4" />
                  </a>
                )}
              </div>
            ))}
            {(!myReports || myReports.length === 0) && <p className="text-sm text-slate-700 py-10 text-center font-bold italic">No lab reports found.</p>}
          </div>
        </section>
      </div>
    </div>
  );
};

export default RecordsSection;
