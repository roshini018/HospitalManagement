import React, { useState } from "react";
import { X, Ban } from "lucide-react";

/**
 * RejectReasonModal Component
 * Modal for specifying a reason when rejecting a lab test request.
 */
const RejectReasonModal = ({ 
  isOpen, 
  onClose, 
  onConfirm 
}) => {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!reason.trim()) return alert("Please provide a reason for rejection");
    onConfirm(reason);
    setReason("");
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/80 backdrop-blur-md px-4 animate-in fade-in duration-300">
      <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-slate-900 p-8 shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 flex items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20 shadow-inner">
              <Ban className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white uppercase tracking-tight">Reject Request</h2>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Specify rejection reason</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="rounded-xl border border-white/10 p-2 text-slate-400 hover:bg-slate-700/60 transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Rejection Reason *</label>
            <textarea
              rows="4"
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="E.g., Missing patient data, clinical necessity not met..."
              className="w-full rounded-2xl border border-white/10 bg-slate-800/50 px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 outline-none focus:border-red-400 focus:ring-4 focus:ring-red-500/10 transition-all font-secondary resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button 
            onClick={onClose} 
            className="flex-1 rounded-2xl border border-white/10 py-3.5 text-xs font-black text-slate-400 hover:bg-slate-700/60 transition-all uppercase tracking-widest"
          >
            Go Back
          </button>
          <button 
            onClick={handleConfirm} 
            className="flex-[2] rounded-2xl bg-red-600 py-3.5 text-xs font-black text-white hover:bg-red-500 transition-all shadow-xl shadow-red-500/20 uppercase tracking-widest"
          >
            Finalize Rejection
          </button>
        </div>
      </div>
    </div>
  );
};

export default RejectReasonModal;
