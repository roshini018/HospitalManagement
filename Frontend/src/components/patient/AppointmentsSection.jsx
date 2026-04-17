import React from 'react';
import { History } from 'lucide-react';
import LiveStation from '../common/LiveStation';
import AppointmentItem from '../common/AppointmentItem';

const AppointmentsSection = ({ upcoming, history, appointments, fetchUserData, getStatus }) => {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <LiveStation appointment={upcoming.find(a => getStatus(a.status) === 'active') || upcoming[0]} allAppointments={appointments} />
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-black text-white">Upcoming Visits</h2>
            <span className="h-px flex-1 bg-white/5" />
            <span className="rounded-full bg-sky-500/10 border border-sky-500/20 px-3 py-1 text-[10px] font-black text-sky-400">{upcoming.length} Pending</span>
          </div>
          <div className="space-y-3">
            {upcoming.length > 0 ? (
              upcoming.map(item => <AppointmentItem key={item._id} appointment={item} onStatusChange={fetchUserData} />)
            ) : (
              <div className="rounded-[2rem] border border-dashed border-white/10 bg-slate-800/40 p-16 text-center">
                <p className="text-sm font-bold text-slate-400">No active appointments found.</p>
              </div>
            )}
          </div>
        </div>
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center gap-4 opacity-50">
            <h2 className="text-lg font-black text-white tracking-tight">Visit History</h2>
            <span className="h-px flex-1 bg-white/5" />
            <History className="h-4 w-4" />
          </div>
          <div className="space-y-3">
            {history.length > 0 ? (
              history.slice(0, 10).map(item => (
                <div key={item._id} className="opacity-70 hover:opacity-100 transition-all">
                  <AppointmentItem appointment={item} onStatusChange={fetchUserData} />
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-600 italic">No history available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentsSection;
