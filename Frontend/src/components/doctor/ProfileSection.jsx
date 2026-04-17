import React from 'react';
import { Sparkles, Save, X, Edit3, MessageCircle } from 'lucide-react';

const ProfileSection = ({ 
  user, 
  editing, 
  editName, 
  editFee, 
  editSpecialization, 
  editExperience, 
  onEditChange, 
  onSave, 
  onCancel,
  onEditStart
}) => {
  const d = user?.doctorProfile || {};

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-800/40 border border-white/10 p-8 md:p-12 shadow-2xl backdrop-blur-xl">
        <div className="absolute top-0 right-0 p-8">
          <Sparkles className="h-12 w-12 text-emerald-500/10" />
        </div>
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="h-40 w-40 rounded-[2.5rem] bg-gradient-to-tr from-emerald-500 via-teal-500 to-emerald-600 p-1.5 shadow-2xl shadow-emerald-500/20">
            <div className="h-full w-full rounded-[2.2rem] bg-white/20 backdrop-blur-xl flex items-center justify-center text-6xl font-black text-white shadow-inner border border-white/10">
              {user?.name?.charAt(0) || "D"}
            </div>
          </div>
          <div className="text-center md:text-left flex-1 space-y-6">
            {!editing ? (
              <>
                <div>
                  <h2 className="text-4xl font-black text-white tracking-tighter uppercase">{user?.name}</h2>
                  <div className="inline-flex items-center gap-2 mt-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 font-black text-[10px] text-emerald-400 uppercase tracking-widest">
                    Verified {user?.role} · {d.specialization || "General Medicine"}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/[0.05] border border-white/5 rounded-2xl p-4">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Consultation Fee</p>
                    <p className="text-sm font-bold text-white">₹{d.consultationFee || 0}</p>
                  </div>
                  <div className="bg-white/[0.05] border border-white/5 rounded-2xl p-4">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Experience</p>
                    <p className="text-sm font-bold text-white">{d.experience || "N/A"} Years</p>
                  </div>
                </div>
                <div className="flex justify-center md:justify-start gap-3">
                  <button onClick={onEditStart} className="rounded-2xl bg-white text-slate-900 px-8 py-3.5 text-xs font-black shadow-xl hover:scale-105 transition-all active:scale-95">
                    Configure Profile
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => onEditChange('name', e.target.value)}
                      className="w-full rounded-xl bg-slate-900/60 border border-white/10 p-3 text-sm text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Specialization</label>
                    <input
                      type="text"
                      value={editSpecialization}
                      onChange={(e) => onEditChange('specialization', e.target.value)}
                      className="w-full rounded-xl bg-slate-900/60 border border-white/10 p-3 text-sm text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Consultation Fee (₹)</label>
                    <input
                      type="number"
                      value={editFee}
                      onChange={(e) => onEditChange('fee', e.target.value)}
                      className="w-full rounded-xl bg-slate-900/60 border border-white/10 p-3 text-sm text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Experience (Years)</label>
                    <input
                      type="text"
                      value={editExperience}
                      onChange={(e) => onEditChange('experience', e.target.value)}
                      className="w-full rounded-xl bg-slate-900/60 border border-white/10 p-3 text-sm text-white"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={onSave} className="flex-1 rounded-xl bg-emerald-500 py-3 text-xs font-black text-white shadow-lg flex items-center justify-center gap-2">
                    <Save className="h-4 w-4" /> Save Changes
                  </button>
                  <button onClick={onCancel} className="rounded-xl bg-white/5 border border-white/10 px-6 py-3 text-xs font-black text-white">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-3xl bg-slate-800/40 border border-white/10 p-8 backdrop-blur-md">
          <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
            <Edit3 className="h-4 w-4 text-emerald-400" /> Bio & About
          </h3>
          <p className="text-sm text-slate-400 leading-relaxed font-medium italic">
            {d.bio || "No information provided yet. Click configure to add your professional bio."}
          </p>
        </div>
        <div className="rounded-3xl bg-slate-800/40 border border-white/10 p-8 backdrop-blur-md">
          <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-emerald-400" /> Contact Info
          </h3>
          <div className="space-y-4">
            <div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1.5">Official Email</p>
              <p className="text-sm font-bold text-white uppercase tracking-tight">{user?.email}</p>
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1.5">Hospital Wing</p>
              <p className="text-sm font-bold text-white uppercase tracking-tight">{d.department || "General OPD"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
