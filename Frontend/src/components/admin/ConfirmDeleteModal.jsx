import React from "react";
import { AlertTriangle, X } from "lucide-react";

const ConfirmDeleteModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Deletion", 
  message = "Are you sure you want to delete this item? This action cannot be undone.",
  confirmText = "Delete Permanently",
  confirmColor = "bg-red-600 hover:bg-red-500"
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/80 backdrop-blur-md px-4 animate-in fade-in duration-300">
      <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-red-500/10 border border-red-500/20 mx-auto mb-5 shadow-inner">
          <AlertTriangle className="h-8 w-8 text-red-500" />
        </div>
        
        <div className="text-center mb-8">
          <h2 className="text-lg font-black text-white uppercase tracking-tight mb-2">{title}</h2>
          <p className="text-sm text-slate-400 leading-relaxed px-2 font-medium">{message}</p>
        </div>

        <div className="flex flex-col gap-2">
          <button 
            onClick={onConfirm}
            className={`w-full rounded-xl py-3 text-xs font-black text-white transition-all shadow-lg uppercase tracking-widest ${confirmColor}`}
          >
            {confirmText}
          </button>
          <button 
            onClick={onClose}
            className="w-full rounded-xl border border-white/5 bg-white/5 py-3 text-xs font-black text-slate-400 hover:bg-white/10 transition-all uppercase tracking-widest"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
