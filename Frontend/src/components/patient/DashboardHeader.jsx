import React from 'react';

const PatientHeader = ({ user, activeTab, onTabChange, tabs }) => {
  return (
    <div className="border-b border-white/[0.06] bg-slate-800/60 backdrop-blur-2xl sticky top-0 z-40">
      <div className="mx-auto max-w-7xl px-4 py-6 md:px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-sky-400 mb-1">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Healthy Living Dashboard</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">Welcome back, {user?.name?.split(' ')[0] || "Guest"}</h1>
          </div>

          <nav className="flex items-center gap-1 overflow-x-auto rounded-2xl bg-white/10 p-1.5 no-scrollbar border border-white/5 shadow-inner">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => onTabChange(tab)}
                className={`rounded-xl px-5 py-2 text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === tab
                    ? "bg-sky-500 text-white shadow-lg shadow-sky-500/20"
                    : "text-slate-400 hover:text-white"
                  }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default PatientHeader;
