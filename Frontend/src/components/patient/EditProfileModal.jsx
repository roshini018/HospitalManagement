import React from 'react';
import { X } from 'lucide-react';

const EditProfileModal = ({ isOpen, onClose, formData, onFormChange, onSubmit, updating }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="w-full max-w-sm rounded-[2.5rem] border border-white/10 bg-slate-900 p-8 shadow-2xl relative animate-in zoom-in-95 duration-300">
        <button
          onClick={onClose}
          className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
        <h3 className="text-2xl font-black text-white mb-8">Health Profile</h3>
        <form onSubmit={onSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 no-scrollbar">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Legal Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => onFormChange({ ...formData, name: e.target.value })}
                className="w-full rounded-2xl bg-slate-700/50 border border-white/10 px-4 py-3.5 text-sm text-white focus:border-sky-500 transition-all outline-none"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Number</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => onFormChange({ ...formData, phone: e.target.value })}
                  className="w-full rounded-2xl bg-slate-700/50 border border-white/10 px-4 py-3.5 text-sm text-white focus:border-sky-500 transition-all outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Current Age</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => onFormChange({ ...formData, age: e.target.value })}
                  className="w-full rounded-2xl bg-slate-700/50 border border-white/10 px-4 py-3.5 text-sm text-white focus:border-sky-500 transition-all outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Blood Group</label>
                <select
                  value={formData.bloodGroup}
                  onChange={(e) => onFormChange({ ...formData, bloodGroup: e.target.value })}
                  className="w-full rounded-2xl bg-slate-700/50 border border-white/10 px-4 py-3.5 text-sm text-white focus:border-sky-500 transition-all outline-none"
                >
                  <option value="">Select</option>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(g => <option key={g} className="bg-slate-900">{g}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Weight (kg)</label>
                  <input
                    type="number"
                    value={formData.weight}
                    onChange={(e) => onFormChange({ ...formData, weight: e.target.value })}
                    className="w-full rounded-2xl bg-slate-700/50 border border-white/10 px-4 py-3 text-xs text-white outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Height (cm)</label>
                  <input
                    type="number"
                    value={formData.height}
                    onChange={(e) => onFormChange({ ...formData, height: e.target.value })}
                    className="w-full rounded-2xl bg-slate-700/50 border border-white/10 px-4 py-3 text-xs text-white outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Address Details</label>
              <textarea
                value={formData.address}
                onChange={(e) => onFormChange({ ...formData, address: e.target.value })}
                className="w-full rounded-2xl bg-slate-700/50 border border-white/10 px-4 py-3.5 text-sm text-white focus:border-sky-500 transition-all outline-none h-20 resize-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={updating}
            className="w-full rounded-2xl bg-sky-500 py-4 text-xs font-black text-white shadow-xl shadow-sky-500/20 hover:scale-[1.02] active:scale-95 transition-all mt-2"
          >
            {updating ? "Saving..." : "Commit Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
