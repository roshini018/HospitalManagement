import React from "react";
import { X, UserPlus } from "lucide-react";

const AddPatientModal = ({ 
  isOpen, 
  onClose, 
  newPat, 
  onPatChange, 
  onAdd 
}) => {
  if (!isOpen) return null;

  const inputCls = "w-full rounded-xl border border-white/10 bg-slate-700/50 px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 transition-all font-secondary";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 backdrop-blur-md px-4 animate-in fade-in duration-300">
      <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-slate-800/60 backdrop-blur-xl p-8 shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-black text-white tracking-tight uppercase">Add New Patient</h2>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Register a new patient account</p>
          </div>
          <button 
            onClick={onClose} 
            className="rounded-xl border border-white/10 p-2 text-slate-400 hover:bg-slate-700/60 transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1.5 ml-1">Full Name *</label>
            <input 
              value={newPat.name} 
              onChange={e => onPatChange('name', e.target.value)} 
              placeholder="Patient Name" 
              className={inputCls} 
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1.5 ml-1">Email Address *</label>
            <input 
              type="email" 
              value={newPat.email} 
              onChange={e => onPatChange('email', e.target.value)} 
              placeholder="patient@email.com" 
              className={inputCls} 
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1.5 ml-1">Phone Number</label>
            <input 
              value={newPat.phone} 
              onChange={e => onPatChange('phone', e.target.value)} 
              placeholder="9876543210" 
              className={inputCls} 
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1.5 ml-1">Access Password *</label>
            <input 
              type="password" 
              value={newPat.password} 
              onChange={e => onPatChange('password', e.target.value)} 
              placeholder="Security code" 
              className={inputCls} 
            />
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <button 
            onClick={onClose} 
            className="flex-1 rounded-2xl border border-white/10 py-3.5 text-xs font-black text-slate-400 hover:bg-slate-700/60 transition-all uppercase tracking-widest"
          >
            Cancel
          </button>
          <button 
            onClick={onAdd} 
            className="flex-[2] items-center justify-center gap-2 rounded-2xl bg-sky-600 py-3.5 text-xs font-black text-white hover:bg-sky-500 transition-all shadow-xl shadow-sky-500/20 uppercase tracking-widest"
          >
            <UserPlus className="h-4 w-4 inline mr-1" /> Create Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPatientModal;
