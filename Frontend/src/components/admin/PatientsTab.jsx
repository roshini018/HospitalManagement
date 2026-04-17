import React from "react";
import { Search, UserPlus, Loader2, Trash2 } from "lucide-react";

/**
 * PatientsTab Component
 * Renders the Patient management view in the Admin Dashboard.
 * 
 * @param {string} search - Search query for filtering patients.
 * @param {function} onSearchChange - Callback for search input.
 * @param {Array} patients - List of filtered patient objects.
 * @param {boolean} loading - Loading state for patients.
 * @param {function} onAddClick - Callback to show the add patient modal.
 * @param {function} onRemove - Callback to remove a patient.
 */
const PatientsTab = ({ search, onSearchChange, patients, loading, onAddClick, onRemove }) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-800/60 backdrop-blur-xl p-6 shadow-xl shadow-black/20">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <h2 className="text-base font-bold text-white uppercase tracking-tight">Manage Patients</h2>
        <button 
          onClick={onAddClick}
          className="flex items-center gap-1.5 rounded-xl border border-sky-500/25 bg-sky-500/10 px-4 py-2 text-xs font-bold text-sky-400 hover:bg-sky-500/15 transition-all font-secondary"
        >
          <UserPlus className="h-3.5 w-3.5" /> Add Patient
        </button>
      </div>
      
      <div className="relative mb-4">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input 
          placeholder="Search patients by name or email..." 
          value={search} 
          onChange={e => onSearchChange(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-slate-700/50 py-2.5 pl-10 pr-4 text-sm text-slate-200 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 transition-all font-secondary" 
        />
      </div>

      <div className="space-y-3 max-h-[600px] overflow-y-auto no-scrollbar pr-1">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin h-8 w-8 text-sky-400" />
          </div>
        ) : (
          <>
            {patients.map((p) => (
              <div 
                key={p._id || p.id} 
                className="group flex items-center justify-between rounded-xl border border-white/[0.06] bg-slate-700/40 p-4 hover:bg-slate-700/60 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500/15 text-sm font-black text-sky-400 flex-shrink-0 border border-sky-500/10">
                    {(p.name || "P").charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{p.name || "Unknown Patient"}</p>
                    <p className="text-[10px] font-medium text-slate-400 mt-0.5 uppercase tracking-wider">{p.email}</p>
                    <p className="text-[10px] font-bold text-slate-500 mt-0.5">{p.phone || "No phone linked"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[9px] uppercase font-black tracking-widest text-slate-500 px-2 py-1 rounded-lg bg-slate-800/80 border border-white/5">
                    {p.role || "patient"}
                  </span>
                  <button 
                    onClick={() => onRemove(p._id || p.id)}
                    className="rounded-lg border border-white/10 bg-slate-800/60 p-1.5 text-slate-500 hover:text-red-400 hover:border-red-500/25 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
            {patients.length === 0 && (
              <div className="text-center py-12">
                <p className="text-sm text-slate-500 font-medium">No patients found</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PatientsTab;
