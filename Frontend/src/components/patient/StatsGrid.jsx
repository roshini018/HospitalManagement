import React from 'react';
import { ChevronRight } from 'lucide-react';

const StatsGrid = ({ stats }) => {
  return (
    <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((s, i) => (
        <div key={i} className="group rounded-[2rem] bg-slate-800/40 backdrop-blur-xl p-6 border border-white/10 hover:bg-slate-800/60 transition-all duration-300">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className={`mb-3 h-10 w-10 flex items-center justify-center rounded-2xl ${s.bg} text-white shadow-lg`}>
                {s.icon}
              </div>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{s.label}</p>
              <p className="text-2xl font-black text-white">{s.value}</p>
            </div>
            <div className="hidden md:block">
              <ChevronRight className="h-5 w-5 text-slate-600 group-hover:text-white transition-colors" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsGrid;
