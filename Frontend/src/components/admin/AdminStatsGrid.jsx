import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

/**
 * AdminStatsGrid Component
 * Renders the 4 main statistic cards at the top of the Admin Dashboard.
 * 
 * @param {Array} stats - Array of stat objects containing label, value, icon, color, change, etc.
 * @param {Object} colorMap - Mapping of color names to Tailwind CSS classes for background and text.
 */
const AdminStatsGrid = ({ stats, colorMap }) => {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {stats.map((s) => {
        const Icon = s.icon;
        const c = colorMap[s.color] || { bg: "bg-slate-700/50", text: "text-slate-400" };
        return (
          <div
            key={s.label}
            className="rounded-2xl border border-white/10 bg-slate-800/60 backdrop-blur-xl p-5 shadow-xl shadow-black/20 hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl mb-3 ${c.bg} ${c.text}`}>
              <Icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-black text-white">{s.value}</p>
            <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
            <div
              className={`mt-2 flex items-center gap-1 text-xs font-semibold ${
                s.up ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {s.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {s.change} this month
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdminStatsGrid;
