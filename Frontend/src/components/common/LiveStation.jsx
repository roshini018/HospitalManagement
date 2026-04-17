import React from 'react';
import { Clock, Users, Activity } from "lucide-react";

export default function LiveStation({ appointment, allAppointments }) {
  if (!appointment) return null;

  const getStatus = (s) => (s || "").toLowerCase();
  
  const doctorName = appointment?.doctor?.user?.name || appointment?.doctorName || "Unknown Doctor";
  const formattedDoctor = doctorName.toLowerCase().startsWith("dr") ? doctorName : `Dr. ${doctorName}`;

  const doctorAppointments = allAppointments?.filter(a => {
    const doctorId = a?.doctorId || a?.doctor?._id;
    const currentDoctorId = appointment?.doctorId || appointment?.doctor?._id;
    return doctorId?.toString() === currentDoctorId?.toString();
  }) || [];

  // 1. Determine Now Serving
  const active = doctorAppointments.find(a => getStatus(a.status) === "active");
  const nowServingToken = active 
    ? active.tokenNumber 
    : doctorAppointments
        .filter(a => getStatus(a.status) === "waiting")
        .sort((a, b) => (a.tokenNumber || 0) - (b.tokenNumber || 0))[0]?.tokenNumber || 0;

  // 2. Calculate queue correctly
  const queue = doctorAppointments
    .filter(a => ["waiting", "active"].includes(getStatus(a.status)))
    .sort((a, b) => a.tokenNumber - b.tokenNumber);

  // 3. Calculate estimated time
  const avgTime = 15;
  const myIndex = queue.findIndex(a => a._id === appointment._id);
  const waitTime = myIndex > 0 ? myIndex * avgTime : 0;

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-sky-500/20 bg-slate-800/60 p-1 backdrop-blur-3xl shadow-2xl shadow-sky-900/10 transition-all duration-500 hover:border-sky-500/40">
      {/* Background Decor */}
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-sky-500/5 blur-3xl" />
      <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-emerald-500/5 blur-3xl" />
      
      <div className="relative flex flex-col items-center justify-between gap-6 p-6 md:flex-row md:p-8">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-500" />
            </span>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-sky-400">Live Station Status</p>
          </div>
          <h2 className="text-2xl font-black text-white md:text-3xl">
            In progress with <span className="text-sky-400">{formattedDoctor}</span>
          </h2>
          <p className="text-xs font-medium leading-relaxed text-slate-400 max-w-sm">
            Tracking your consultation in real-time. Please stay in the clinic area as the estimated time may vary.
          </p>
        </div>

        <div className="grid w-full grid-cols-2 gap-4 md:w-auto lg:grid-cols-3">
          <div className="flex flex-col items-center justify-center rounded-2xl bg-slate-900/60 border border-white/5 p-5 text-center transition-all hover:bg-slate-900/80">
            <p className="text-2xl font-black text-white">#{appointment?.tokenNumber || appointment?.token || "—"}</p>
            <p className="mt-1 text-[9px] font-bold uppercase tracking-widest text-slate-500">Your Token</p>
          </div>
          
          <div className="flex flex-col items-center justify-center rounded-2xl bg-sky-500/10 border border-sky-500/20 p-5 text-center transition-all hover:bg-sky-500/20 group">
             <div className="flex items-center gap-1.5 mb-1">
                <Users className="h-3 w-3 text-sky-400 group-hover:scale-110 transition-transform" />
                <p className="text-2xl font-black text-sky-400">#{nowServingToken || "—"}</p>
             </div>
             <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Now Serving</p>
          </div>

          <div className="flex flex-col items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-5 text-center transition-all hover:bg-emerald-500/20 group">
            <div className="flex items-center gap-1.5 mb-1">
               <Clock className="h-3 w-3 text-emerald-400 group-hover:rotate-12 transition-transform" />
               <p className="text-2xl font-black text-emerald-400">
                 {waitTime}<span className="text-sm"> min</span>
               </p>
            </div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Est. Wait</p>
          </div>
        </div>
      </div>
    </div>
  );
}
