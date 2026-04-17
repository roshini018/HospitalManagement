import React from 'react';
import { X, FileText, Plus, Trash2, Save, Loader2 } from 'lucide-react';

const PrescriptionModal = ({ 
  isOpen, 
  onClose, 
  patientName, 
  diagnosis, 
  onDiagnosisChange, 
  medicines, 
  onMedicineChange, 
  onAddMedicine, 
  onRemoveMedicine, 
  advice, 
  onAdviceChange, 
  followUp, 
  onFollowUpChange, 
  onSave, 
  saving 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-end md:p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="h-full w-full max-w-2xl bg-slate-900 md:rounded-[2.5rem] border-l md:border border-white/10 shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 md:p-8 border-b border-white/[0.06] bg-slate-800/40 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight">Prescription</h3>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-0.5">Patient: {patientName}</p>
            </div>
          </div>
          <button onClick={onClose} className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 no-scrollbar">
          
          {/* Diagnosis */}
          <section className="space-y-4">
            <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] ml-1">Clinical Diagnosis</h4>
            <textarea
              placeholder="Primary diagnosis or reason for visit..."
              value={diagnosis || ""}
              onChange={(e) => onDiagnosisChange(e.target.value)}
              className="w-full rounded-2xl bg-slate-800/60 border border-white/10 p-5 text-sm text-white focus:border-emerald-500/50 outline-none transition-all min-h-[100px] resize-none"
            />
          </section>

          {/* Medicines */}
          <section className="space-y-4">
            <div className="flex items-center justify-between ml-1">
              <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">Medication Plan</h4>
              <button
                onClick={onAddMedicine}
                className="flex items-center gap-1.5 text-[10px] font-black text-sky-400 uppercase tracking-widest hover:text-white transition-all"
              >
                <Plus className="h-3 w-3" /> Add Item
              </button>
            </div>
            
            <div className="space-y-3">
              {medicines.map((m, i) => (
                <div key={i} className="group relative rounded-2xl border border-white/[0.06] bg-slate-800/40 p-5 space-y-4">
                  <button
                    onClick={() => onRemoveMedicine(i)}
                    className="absolute top-4 right-4 text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none ml-1">Medicine Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Paracetamol 500mg"
                        value={m.name}
                        onChange={(e) => onMedicineChange(i, "name", e.target.value)}
                        className="w-full rounded-xl bg-slate-900 border border-white/10 px-4 py-2.5 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none ml-1">Dosage</label>
                      <input
                        type="text"
                        placeholder="e.g. 1 morning, 1 night"
                        value={m.dosage}
                        onChange={(e) => onMedicineChange(i, "dosage", e.target.value)}
                        className="w-full rounded-xl bg-slate-900 border border-white/10 px-4 py-2.5 text-xs text-white"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none ml-1">Frequency</label>
                      <input
                        type="text"
                        placeholder="e.g. After meals"
                        value={m.frequency}
                        onChange={(e) => onMedicineChange(i, "frequency", e.target.value)}
                        className="w-full rounded-xl bg-slate-900 border border-white/10 px-4 py-2.5 text-xs text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none ml-1">Duration</label>
                      <input
                        type="text"
                        placeholder="e.g. 5 days"
                        value={m.duration}
                        onChange={(e) => onMedicineChange(i, "duration", e.target.value)}
                        className="w-full rounded-xl bg-slate-900 border border-white/10 px-4 py-2.5 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Advice */}
          <section className="space-y-4">
            <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] ml-1">Advice & Follow-up</h4>
            <div className="space-y-4">
              <textarea
                placeholder="General precautions, lifestyle advice..."
                value={advice || ""}
                onChange={(e) => onAdviceChange(e.target.value)}
                className="w-full rounded-2xl bg-slate-800/60 border border-white/10 p-5 text-sm text-white focus:border-emerald-500/50 outline-none transition-all min-h-[80px] resize-none"
              />
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Next Visit / Follow-up</label>
                <input
                  type="text"
                  placeholder="e.g. Next week or as needed"
                  value={followUp || ""}
                  onChange={(e) => onFollowUpChange(e.target.value)}
                  className="w-full rounded-xl bg-slate-800/60 border border-white/10 px-4 py-3 text-xs text-white"
                />
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="p-6 md:p-8 border-t border-white/[0.06] bg-slate-800/40 backdrop-blur-xl">
          <button
            onClick={onSave}
            disabled={saving || !diagnosis}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-500 py-4 text-sm font-black text-white shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
            GENERATE & SAVE PRESCRIPTION
          </button>
        </div>

      </div>
    </div>
  );
};

export default PrescriptionModal;
