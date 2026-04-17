import React from 'react';

const DoctorTabs = ({ activeTab, onTabChange, tabs }) => {
  return (
    <div className="flex gap-1.5 overflow-x-auto rounded-2xl border border-white/10 bg-slate-800/60 backdrop-blur-xl p-2 shadow-xl shadow-black/20">
      {tabs.map(t => (
        <button
          key={t}
          onClick={() => onTabChange(t)}
          className={`whitespace-nowrap rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${activeTab === t
              ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20"
              : "text-slate-400 hover:bg-slate-700/60 hover:text-white"
            }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
};

export default DoctorTabs;
