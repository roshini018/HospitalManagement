import React from 'react';

const StatsGrid = ({ queue, waitingQ, doneQ, avgRating, icons }) => {
  const { Users, Clock, CheckCircle, Star } = icons;
  
  const stats = [
    { label: "Today's Patients", value: queue.length, color: "bg-sky-500/15 text-sky-400 border-sky-500/20", icon: Users },
    { label: "Waiting", value: waitingQ.length, color: "bg-amber-500/15 text-amber-400 border-amber-500/20", icon: Clock },
    { label: "Completed", value: doneQ.filter(q => (q.status || "").toLowerCase() === 'completed').length, color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20", icon: CheckCircle },
    { label: "Avg. Rating", value: avgRating, color: "bg-violet-500/15 text-violet-400 border-violet-500/20", icon: Star },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {stats.map(s => {
        const Icon = s.icon;
        return (
          <div key={s.label} className="rounded-2xl border border-white/10 bg-slate-800/60 backdrop-blur-xl p-5 shadow-xl shadow-black/20 hover:-translate-y-0.5 transition-transform">
            <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl mb-3 border ${s.color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-black text-white">{s.value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
          </div>
        );
      })}
    </div>
  );
};

export default StatsGrid;
