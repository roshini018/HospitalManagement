import React from 'react';
import { Sparkles, Droplets, Activity, ChevronRight, UserRoundCheck } from 'lucide-react';

const ProfileSection = ({ user, onEditClick }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-800/40 border border-white/10 p-8 md:p-12 shadow-2xl backdrop-blur-xl">
        <div className="absolute top-0 right-0 p-8">
          <Sparkles className="h-12 w-12 text-sky-500/10" />
        </div>
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="h-40 w-40 rounded-[2.5rem] bg-gradient-to-tr from-sky-500 via-blue-500 to-blue-600 p-1.5 shadow-2xl shadow-sky-500/20">
            <div className="h-full w-full rounded-[2.2rem] bg-white/20 backdrop-blur-xl flex items-center justify-center text-6xl font-black text-white shadow-inner border border-white/10">
              {user?.name?.charAt(0) || "U"}
            </div>
          </div>
          <div className="text-center md:text-left flex-1 space-y-6">
            <div>
              <h2 className="text-4xl font-black text-white tracking-tighter uppercase">{user?.name}</h2>
              <div className="inline-flex items-center gap-2 mt-2 rounded-full bg-sky-500/10 border border-sky-500/20 px-3 py-1 font-black text-[10px] text-sky-400 uppercase tracking-widest">
                Verified {user?.role}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/[0.05] border border-white/5 rounded-2xl p-4">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Email Connection</p>
                <p className="text-sm font-bold text-white">{user?.email}</p>
              </div>
              <div className="bg-white/[0.05] border border-white/5 rounded-2xl p-4">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Contact Status</p>
                <p className="text-sm font-bold text-white">{user?.phone || "N/A"}</p>
              </div>
            </div>
            <div className="flex justify-center md:justify-start gap-3">
              <button onClick={onEditClick} className="rounded-2xl bg-white text-slate-900 px-8 py-3.5 text-xs font-black shadow-xl hover:scale-105 transition-all active:scale-95">
                Configure Profile
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Blood Group", value: user?.bloodGroup || "—", icon: <Droplets className="h-4 w-4 text-rose-500" /> },
          { label: "Weight", value: user?.weight ? `${user.weight} kg` : "—", icon: <Activity className="h-4 w-4 text-sky-500" /> },
          { label: "Height", value: user?.height ? `${user.height} cm` : "—", icon: <ChevronRight className="h-4 w-4 text-violet-500 -rotate-90" /> },
          { label: "Age", value: user?.age ? `${user.age} yrs` : "—", icon: <UserRoundCheck className="h-4 w-4 text-emerald-500" /> },
        ].map((stat, i) => (
          <div key={i} className="group rounded-3xl bg-slate-800/40 border border-white/10 p-6 text-center transition-all hover:bg-slate-800/60 hover:-translate-y-1 backdrop-blur-md">
            <div className="flex justify-center mb-3 group-hover:scale-125 transition-transform">{stat.icon}</div>
            <p className="text-xl font-black text-white">{stat.value}</p>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {user?.address && (
        <div className="rounded-3xl bg-slate-800/40 border border-white/10 p-6 backdrop-blur-md">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Registered Household Address</p>
          <p className="text-sm font-bold text-white leading-relaxed">{user.address}</p>
        </div>
      )}
    </div>
  );
};

export default ProfileSection;
