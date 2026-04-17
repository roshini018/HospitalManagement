import React from "react";
import { Clock, Pencil, X, Save } from "lucide-react";

/**
 * StaffHoursTab Component
 * Renders the Staff Working Hours management view in the Admin Dashboard.
 * 
 * @param {Array} staff - List of staff members with their schedules.
 * @param {string|null} editingStaff - ID of the staff currently being edited.
 * @param {Object} staffEdits - The temporary edit state for the staff member.
 * @param {function} onStartEdit - Callback to begin editing a staff member's hours.
 * @param {function} onSave - Callback to save the edits.
 * @param {function} onCancel - Callback to discard edits.
 * @param {function} onUpdateEdits - Callback to update a field in the edit state.
 * @param {function} onToggleDay - Callback to toggle a working day in the edit state.
 * @param {Array} allDays - List of all possible work days (e.g., ["Mon", "Tue"...]).
 */
const StaffHoursTab = ({ 
  staff, 
  editingStaff, 
  staffEdits, 
  onStartEdit, 
  onSave, 
  onCancel, 
  onUpdateEdits, 
  onToggleDay,
  allDays 
}) => {
  const inputCls = "w-full rounded-xl border border-white/10 bg-slate-700/50 px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20 transition-all font-secondary";

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-800/60 backdrop-blur-xl p-6 shadow-xl shadow-black/20">
      <div className="mb-6">
        <h2 className="text-base font-bold text-white uppercase tracking-tight">Staff Working Hours</h2>
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-1">Configure duty shifts and weekly schedules</p>
      </div>

      <div className="space-y-3">
        {staff.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-slate-500 font-medium">No system staff records available for scheduling</p>
          </div>
        ) : staff.map(s => (
          <div 
            key={s.id} 
            className={`rounded-xl border transition-all duration-300 ${
              editingStaff === s.id 
                ? "border-violet-500/30 bg-slate-800/80 shadow-lg shadow-black/40" 
                : "border-white/[0.06] bg-slate-700/40 hover:bg-slate-700/60"
            } p-4`}
          >
            {editingStaff === s.id ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-500/15 text-sm font-black text-violet-400 flex-shrink-0 border border-violet-500/20">
                    {(s.name.split(" ")[1]?.charAt(0) || s.name.charAt(0) || "D")}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{s.name}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{s.role}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Shift Start</label>
                    <input 
                      type="time" 
                      value={staffEdits.start} 
                      onChange={e => onUpdateEdits("start", e.target.value)} 
                      className={inputCls} 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Shift End</label>
                    <input 
                      type="time" 
                      value={staffEdits.end} 
                      onChange={e => onUpdateEdits("end", e.target.value)} 
                      className={inputCls} 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Active Working Days</label>
                  <div className="flex flex-wrap gap-2">
                    {allDays.map(day => (
                      <button 
                        key={day} 
                        type="button" 
                        onClick={() => onToggleDay(day)}
                        className={`rounded-xl border px-3 py-1.5 text-xs font-bold uppercase transition-all ${
                          staffEdits.days.includes(day) 
                            ? "border-violet-500 bg-violet-600 text-white shadow-lg shadow-violet-500/20" 
                            : "border-white/10 bg-slate-700/40 text-slate-400 hover:border-white/20"
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-white/5">
                  <button 
                    onClick={onCancel} 
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-white/10 px-4 py-2 text-xs font-bold text-slate-400 hover:bg-slate-700 transition-all"
                  >
                    <X className="h-4 w-4" /> Discard
                  </button>
                  <button 
                    onClick={() => onSave(s.id)} 
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-violet-600 px-4 py-2 text-xs font-bold text-white hover:bg-violet-500 transition-all font-secondary shadow-lg shadow-violet-500/20"
                  >
                    <Save className="h-4 w-4" /> Commit Hours
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500/15 text-sm font-black text-emerald-400 flex-shrink-0 border border-emerald-500/10">
                    {(s.name.split(" ")[1]?.charAt(0) || s.name.charAt(0) || "D")}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{s.name}</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">{s.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="hidden sm:flex items-center gap-2 rounded-xl bg-slate-800/60 border border-white/10 px-4 py-2">
                    <Clock className="h-3.5 w-3.5 text-violet-400" />
                    <span className="text-xs font-black text-white uppercase tracking-tighter">{s.start} – {s.end}</span>
                  </div>
                  
                  <div className="hidden md:flex gap-1.5">
                    {allDays.map(day => (
                      <span 
                        key={day} 
                        className={`rounded px-1.5 py-0.5 text-[9px] font-black uppercase ${
                          s.days.includes(day) ? "bg-violet-500/20 text-violet-400" : "bg-slate-700/30 text-slate-600"
                        }`}
                      >
                        {day}
                      </span>
                    ))}
                  </div>

                  <button 
                    onClick={() => onStartEdit(s)}
                    className="group flex items-center justify-center h-10 w-10 rounded-xl border border-white/10 bg-slate-800/60 text-slate-400 hover:border-violet-500/25 hover:text-violet-400 hover:bg-violet-500/10 transition-all"
                  >
                    <Pencil className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaffHoursTab;
