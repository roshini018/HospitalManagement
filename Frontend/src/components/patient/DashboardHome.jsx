import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Sparkles, CalendarCheck2, ArrowRight, FlaskConical, Download } from 'lucide-react';
import AppointmentItem from '../common/AppointmentItem';
import StatsGrid from './StatsGrid';

const DashboardHome = ({ stats, user, upcoming, fetchUserData, myReports }) => {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <StatsGrid stats={stats} />

        <Link to="/dashboard?tab=Profile" className="lg:col-span-4">
          <div className="flex h-full flex-col justify-center rounded-[2rem] bg-gradient-to-br from-sky-500 to-blue-600 p-8 shadow-2xl relative overflow-hidden group">
            <Sparkles className="absolute top-4 right-4 h-20 w-20 text-white/10 -rotate-12" />
            <div className="relative z-10 flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white text-xl font-black shadow-inner">
                {user?.name?.charAt(0) || "U"}
              </div>
              <div>
                <p className="text-xs font-bold text-white/70 uppercase tracking-wider">Member Since 2024</p>
                <p className="text-lg font-black text-white leading-tight">Your Health Profile</p>
              </div>
            </div>
          </div>
        </Link>
      </div>

      <div className="grid gap-10 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-8">
          <section>
            <div className="flex items-center justify-between mb-4 px-1">
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-500">Next Consultation</h2>
              <Link to="/appointments" className="text-[10px] font-black uppercase text-sky-400 hover:tracking-widest transition-all">Book New Visit</Link>
            </div>
            {upcoming.length > 0 ? (
              <div className="space-y-3">
                {upcoming.slice(0, 3).map(a => <AppointmentItem key={a._id} appointment={a} onStatusChange={fetchUserData} />)}
              </div>
            ) : (
              <div className="rounded-[1.5rem] border border-dashed border-white/20 p-10 text-center">
                <CalendarCheck2 className="h-10 w-10 text-slate-400 mx-auto mb-3" />
                <p className="text-sm text-slate-500 font-medium">No active appointments scheduled</p>
              </div>
            )}
          </section>

          <section>
            <div className="flex items-center justify-between mb-4 px-1">
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-500">Common Tasks</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Book Appointment", href: "/appointments", color: "bg-sky-500/10 text-sky-400 border-sky-500/20" },
                { label: "Chat with Expert", href: "/ask-expert", color: "bg-violet-500/10 text-violet-400 border-violet-500/20" },
                { label: "Medical History", href: "/health-records", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
                { label: "Lab Services", href: "/lab-services", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
              ].map((task) => (
                <Link key={task.label} to={task.href} className={`flex items-center justify-between rounded-2xl border px-5 py-3.5 text-xs font-bold transition-all hover:-translate-y-0.5 ${task.color}`}>
                  {task.label} <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              ))}
            </div>
          </section>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <section className="rounded-[1.5rem] border border-white/10 bg-slate-800/40 p-6 backdrop-blur-xl">
            <h2 className="text-xs font-black uppercase tracking-widest text-emerald-400 mb-6 flex items-center justify-between">
              Recent Lab Docs <FlaskConical className="h-4 w-4" />
            </h2>
            <div className="space-y-4">
              {(myReports || []).slice(0, 3).map(r => (
                <div key={r._id} className="group flex items-center justify-between border-b border-white/[0.05] pb-4 last:border-0 last:pb-0">
                  <div>
                    <p className="text-[13px] font-bold text-white group-hover:text-emerald-400 transition-colors uppercase leading-none">{r.testType}</p>
                    <p className="text-[9px] font-medium text-slate-400 uppercase tracking-widest mt-1.5">{new Date(r.createdAt).toLocaleDateString()}</p>
                  </div>
                  {r.status === "completed" && (
                    <button className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-emerald-500 transition-all border border-white/10 shadow-sm">
                      <Download className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))}
              {(!myReports || myReports.length === 0) && <p className="text-xs text-slate-600 text-center py-4 italic">No reports available</p>}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
