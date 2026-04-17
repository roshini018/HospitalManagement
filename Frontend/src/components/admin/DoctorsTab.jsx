import React from "react";
import { Search, UserPlus, Trash2 } from "lucide-react";
import Stars from "../common/Stars";

/**
 * DoctorsTab Component
 * Renders the Doctor management view in the Admin Dashboard.
 * 
 * @param {string} search - Search query for filtering doctors.
 * @param {function} onSearchChange - Callback for search input.
 * @param {Array} doctors - List of doctor objects.
 * @param {function} onAddClick - Callback to show the add doctor modal.
 * @param {function} onRemove - Callback to remove a doctor.
 */
const DoctorsTab = ({ search, onSearchChange, doctors, onAddClick, onRemove }) => {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-white/10 bg-slate-800/60 backdrop-blur-xl p-6 shadow-xl shadow-black/20">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <h2 className="text-base font-bold text-white uppercase tracking-tight">Manage Doctors</h2>
          <button 
            onClick={onAddClick}
            className="flex items-center gap-1.5 rounded-xl border border-violet-500/25 bg-violet-500/10 px-4 py-2 text-xs font-bold text-violet-400 hover:bg-violet-500/15 transition-all font-secondary"
          >
            <UserPlus className="h-3.5 w-3.5" /> Add Doctor
          </button>
        </div>
        
        <div className="relative mb-4">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            placeholder="Search doctors by name or specialization..." 
            value={search} 
            onChange={e => onSearchChange(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-slate-700/50 py-2.5 pl-10 pr-4 text-sm text-slate-200 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20 transition-all font-secondary" 
          />
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {["Doctor", "Specialization", "Exp.", "Rating", "Patients", "Status", "Actions"].map(h => (
                  <th key={h} className="pb-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-500 pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {doctors.map(d => (
                <tr key={d._id} className="hover:bg-slate-700/40 transition-colors group">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-500/20 text-[10px] font-black text-violet-400 flex-shrink-0 border border-violet-500/10">
                        {(d.user?.name || "D").charAt(0)}
                      </div>
                      <span className="font-bold text-white whitespace-nowrap">
                        {d.user?.name?.toLowerCase().startsWith("dr") ? d.user.name : `Dr. ${d.user?.name}`}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-xs font-medium text-slate-400 whitespace-nowrap">{d.specialization || "Not Specified"}</td>
                  <td className="py-3 pr-4 text-xs font-bold text-slate-400">{d.experience}y</td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-1.5">
                      <Stars rating={d.rating || 5} />
                      <span className="text-[10px] font-black text-amber-400">{d.rating || "5.0"}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-xs font-bold text-slate-400">{(d.patients || 0).toLocaleString()}</td>
                  <td className="py-3 pr-4">
                    <span className={`rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-wider border ${
                      d.user?.isActive ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                    }`}>
                      {d.user?.isActive ? "Active" : "On Leave"}
                    </span>
                  </td>
                  <td className="py-3">
                    <button 
                      onClick={() => onRemove(d._id)}
                      className="rounded-lg border border-white/10 bg-slate-800/60 p-1.5 text-slate-500 hover:text-red-400 hover:border-red-500/25 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {doctors.length === 0 && (
            <div className="text-center py-12">
              <p className="text-sm text-slate-500 font-medium">No doctors match your search</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorsTab;
