import React from "react";
import { ShieldCheck } from "lucide-react";

const AdminHeader = ({ user, onLogout }) => {
  return (
    <div className="bg-gradient-to-r from-violet-700 to-violet-800">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 flex flex-col md:flex-row items-center md:items-end gap-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 border border-white/20 flex-shrink-0">
          <ShieldCheck className="h-10 w-10 text-white" />
        </div>
        <div className="flex-1 text-center md:text-left">
          <p className="text-[11px] font-bold uppercase tracking-widest text-violet-300 mb-1">Admin Portal</p>
          <h1 className="text-2xl font-black text-white">{user?.name || "Administrator"}</h1>
          <p className="text-sm text-violet-300 mt-0.5">{user?.email} · System Administrator</p>
        </div>
        <button
          onClick={onLogout}
          className="rounded-xl bg-red-500/20 border border-red-400/30 px-5 py-2.5 text-sm font-semibold text-red-300 hover:bg-red-500/30 transition-all font-secondary"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default AdminHeader;
