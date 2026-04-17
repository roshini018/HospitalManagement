import React, { useState } from 'react';
import { SkipForward, Loader2, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export default function AppointmentItem({ appointment, onStatusChange }) {
  const [skipping, setSkipping] = useState(false);

  const getStatus = (s) => (s || "").toLowerCase();
  const status = getStatus(appointment?.status);
  
  const doctorName = appointment?.doctor?.user?.name || appointment?.doctorName || "Unknown Doctor";
  const formattedDoctor = doctorName.toLowerCase().startsWith("dr") ? doctorName : `Dr. ${doctorName}`;
  
  const dateStr = appointment?.date ? new Date(appointment.date).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short'
  }) : "—";
  
  const timeStr = appointment?.timeSlot || appointment?.time || "—";

  const canSkip = ["waiting", "scheduled"].includes(status);

  const handleSkip = async () => {
    if (!appointment?._id) return;
    setSkipping(true);
    try {
      await api.put(`/api/appointments/${appointment._id}/skip`);
      // If parent provided a callback, call it to refresh data
      if (onStatusChange) onStatusChange();
      // Otherwise force a page reload as fallback
      else window.location.reload();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to skip appointment");
    } finally {
      setSkipping(false);
    }
  };

  const statusStyles = {
    waiting: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    active: "bg-sky-500 text-white shadow-lg shadow-sky-500/20",
    completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    cancelled: "bg-slate-800/40 text-slate-500 border-white/10",
    scheduled: "bg-slate-800/40 text-slate-400 border-white/10",
    skipped: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    missed: "bg-red-500/10 text-red-400 border-red-100 dark:border-red-500/20",
  };

  const statusLabel = {
    active: "Consulting Now",
    waiting: "Waiting",
    scheduled: "Scheduled",
    completed: "Completed",
    skipped: "Skipped",
    cancelled: "Cancelled",
    missed: "Missed",
  };

  return (
    <div className="group flex items-center justify-between rounded-2xl border border-white/10 bg-slate-800/60 bg-solid-white-light backdrop-blur-xl p-4 transition-all duration-300 hover:border-white/20">
      <div className="flex items-center gap-4">
        {/* Token Box */}
        <div className={`flex flex-col items-center justify-center h-12 w-12 rounded-xl border transition-all duration-300 ${status === 'active' ? 'bg-sky-500 border-sky-400 shadow-xl shadow-sky-500/20' : 'bg-white/10 border-white/10'}`}>
          <span className={`text-[9px] font-black uppercase tracking-tighter leading-none mb-0.5 ${status === 'active' ? 'text-sky-100' : 'text-slate-400'}`}>Token</span>
          <span className={`text-lg font-black leading-none ${status === 'active' ? 'text-white' : 'text-sky-400'}`}>
            {appointment?.tokenNumber || appointment?.token || "—"}
          </span>
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <h4 className="text-sm font-black text-white group-hover:text-sky-400 transition-colors uppercase">
            {formattedDoctor}
          </h4>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-[11px] font-bold text-slate-500">
               {dateStr} • {timeStr}
            </p>
            <span className="h-0.5 w-0.5 rounded-full bg-white/10" />
            <p className="text-[11px] font-medium text-slate-400 italic max-w-[120px] truncate">
              {appointment?.problem || appointment?.symptoms || "General Visit"}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Feedback Button — only for completed && !reviewed */}
        {status === 'completed' && !appointment?.reviewed && (
          <Link
            to={`/feedback?doctorId=${appointment?.doctor?._id || appointment?.doctorId}&appointmentId=${appointment?._id}`}
            className="flex items-center gap-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-[10px] font-bold text-emerald-400 hover:bg-emerald-500/20 transition-all"
          >
            <Star className="h-3 w-3 fill-emerald-400" />
            Rate
          </Link>
        )}

        {/* Skip Button — only for waiting/scheduled */}
        {canSkip && (
          <button
            onClick={handleSkip}
            disabled={skipping}
            className="flex items-center gap-1.5 rounded-xl border border-orange-500/20 bg-orange-500/10 px-3 py-1.5 text-[10px] font-bold text-orange-400 hover:bg-orange-500/20 transition-all disabled:opacity-50"
          >
            {skipping
              ? <Loader2 className="h-3 w-3 animate-spin" />
              : <SkipForward className="h-3 w-3" />
            }
            Skip
          </button>
        )}

        <div className="flex flex-col items-end gap-1">
          <span className={`rounded-full border px-3 py-1 text-[9px] font-black uppercase tracking-widest transition-all ${statusStyles[status] || statusStyles.scheduled}`}>
            {statusLabel[status] || status}
          </span>
          {appointment?.estimatedWait > 0 && canSkip && (
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter pr-1">
              ~{appointment.estimatedWait}m wait
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
