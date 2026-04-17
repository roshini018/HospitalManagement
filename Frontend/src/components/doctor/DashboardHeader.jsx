import React from 'react';
import { Edit3 } from 'lucide-react';

const DashboardHeader = ({ user, onEditProfile, onLogout }) => {
  return (
    <div className="border-b border-white/[0.06] bg-gradient-to-r from-emerald-800/20 to-teal-800/20 bg-slate-800/60 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 flex flex-col md:flex-row items-center gap-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 border border-white/20 text-3xl font-black text-white flex-shrink-0">
          {user?.name?.charAt(0) || "D"}
        </div>
        <div className="flex-1 text-center md:text-left">
          <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-400 mb-1">Doctor Workspace</p>
          <h1 className="text-2xl font-black text-white">Welcome, {user?.name || "Doctor"}</h1>
          <p className="text-sm text-slate-400 mt-0.5">Manage patients, queue, and profile</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={onEditProfile}
            className="flex items-center gap-2 rounded-xl bg-sky-500 hover:bg-sky-400 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-sky-500/25 transition-all active:scale-95"
          >
            <Edit3 className="h-4 w-4" /> Edit Profile
          </button>
          <button
            onClick={onLogout}
            className="rounded-xl bg-red-500/15 border border-red-400/25 px-4 py-2 text-sm font-semibold text-red-400 hover:bg-red-500/25 transition-all"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
