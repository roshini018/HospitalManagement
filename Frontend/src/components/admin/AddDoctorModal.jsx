import React from "react";
import { X, UserPlus } from "lucide-react";

const AddDoctorModal = ({ 
  isOpen, 
  onClose, 
  newDoc, 
  onDocChange, 
  onAdd, 
  specialties 
}) => {
  if (!isOpen) return null;

  const inputCls = "w-full rounded-xl border border-white/10 bg-slate-700/50 px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20 transition-all font-secondary";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 backdrop-blur-md px-4 animate-in fade-in duration-300">
      <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-slate-800/60 backdrop-blur-xl p-8 shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-black text-white tracking-tight uppercase">Add New Doctor</h2>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">Register a new medical professional</p>
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
              value={newDoc.name} 
              onChange={e => onDocChange('name', e.target.value)} 
              placeholder="Dr. Full Name" 
              className={inputCls} 
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1.5 ml-1">Specialization *</label>
            <select 
              value={newDoc.specialization} 
              onChange={e => onDocChange('specialization', e.target.value)} 
              className={`${inputCls} appearance-none`}
            >
              {specialties.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1.5 ml-1">Experience *</label>
              <input 
                type="number" 
                value={newDoc.experience} 
                onChange={e => onDocChange('experience', e.target.value)} 
                placeholder="Years" 
                className={inputCls} 
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1.5 ml-1">Phone</label>
              <input 
                value={newDoc.phone} 
                onChange={e => onDocChange('phone', e.target.value)} 
                placeholder="Mobile Number" 
                className={inputCls} 
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1.5 ml-1">Email *</label>
              <input 
                type="email" 
                value={newDoc.email} 
                onChange={e => onDocChange('email', e.target.value)} 
                placeholder="doctor@hospital.com" 
                className={inputCls} 
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-1.5 ml-1">Password *</label>
              <input 
                type="password" 
                value={newDoc.password} 
                onChange={e => onDocChange('password', e.target.value)} 
                placeholder="Security Pass" 
                className={inputCls} 
              />
            </div>
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
            className="flex-[2] items-center justify-center gap-2 rounded-2xl bg-violet-600 py-3.5 text-xs font-black text-white hover:bg-violet-500 transition-all shadow-xl shadow-violet-500/20 uppercase tracking-widest"
          >
            <UserPlus className="h-4 w-4 inline mr-1" /> Register Doctor
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddDoctorModal;
