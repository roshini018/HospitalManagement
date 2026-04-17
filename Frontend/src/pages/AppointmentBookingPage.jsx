// import { useEffect, useState } from "react";
// import { Calendar, Clock, CheckCircle2, Loader2, CalendarCheck2, AlertCircle, Sparkles } from "lucide-react";
// import api from "../services/api";
// import AppointmentForm from "../components/common/AppointmentForm";
// import AppointmentItem from "../components/common/AppointmentItem";

// export default function AppointmentBookingPage() {
//   const [tab, setTab] = useState("book");
//   const [appointments, setAppointments] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const fetchMyAppointments = async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const res = await api.get("/api/appointments/my");
//       setAppointments(res.data.appointments || []);
//     } catch (err) {
//       console.error("Failed to fetch appointments", err);
//       setError("Unable to retrieve appointments. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (tab !== "book") fetchMyAppointments();
//   }, [tab]);

//   const getStatus = (s) => (s || "").toLowerCase();

//   const upcoming = appointments.filter(a =>
//     ["scheduled", "waiting", "active"].includes(getStatus(a.status))
//   );

//   const past = appointments.filter(a =>
//     ["completed", "cancelled", "skipped"].includes(getStatus(a.status))
//   );

//   return (
//     <main className="min-h-screen bg-slate-900 pb-20 font-primary">
//       {/* ── HEADER (Matching Dashboard) ────────────────────────────── */}
//       <div className="border-b border-white/[0.04] bg-slate-900/50 backdrop-blur-2xl sticky top-0 z-40">
//         <div className="mx-auto max-w-5xl px-4 py-8 md:px-6">
//           <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//              <div>
//                 <div className="flex items-center gap-2 text-sky-400 mb-1">
//                   <Sparkles className="h-4 w-4" />
//                   <p className="text-[10px] font-black uppercase tracking-widest leading-none">Clinical Scheduling</p>
//                 </div>
//                 <h1 className="text-3xl font-black text-white tracking-tight">Consultations</h1>
//                 <p className="text-sm text-slate-500 mt-1 font-medium">Manage your clinical sessions and upcoming health interventions.</p>
//              </div>

//              {/* Unified Tab Switcher */}
//              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar rounded-2xl bg-slate-800/40 p-1.5 border border-white/5">
//                 {[
//                   { key: "book", label: "Schedule Visit", icon: <Clock className="h-3.5 w-3.5" /> },
//                   { key: "upcoming", label: `Upcoming (${upcoming.length})`, icon: <Calendar className="h-3.5 w-3.5" /> },
//                   { key: "past", label: "Archive", icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
//                 ].map((t) => (
//                   <button
//                     key={t.key}
//                     onClick={() => setTab(t.key)}
//                     className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-5 py-2.5 text-xs font-bold transition-all duration-300 ${
//                       tab === t.key 
//                         ? "bg-sky-500 text-white shadow-lg shadow-sky-500/20" 
//                         : "text-slate-400 hover:text-white"
//                     }`}
//                   >
//                     {t.icon}
//                     {t.label}
//                   </button>
//                 ))}
//              </div>
//           </div>
//         </div>
//       </div>

//       <div className="mx-auto max-w-5xl px-4 py-10 md:px-6">
//         <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
//           {/* Error Message */}
//           {error && (
//             <div className="mb-8 flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-500">
//               <AlertCircle className="h-5 w-5" />
//               <p className="font-bold">{error}</p>
//             </div>
//           )}

//           {/* SINGLE CLEAN CONTAINER FOR ALL TABS */}
//           <div className="rounded-[2rem] bg-slate-800/60 backdrop-blur-xl border border-white/10 p-6 md:p-8 shadow-2xl shadow-black/40">
//             {/* Book Tab */}
//             {tab === "book" && <AppointmentForm />}

//             {/* Upcoming Tab */}
//             {tab === "upcoming" && (
//               <div className="space-y-6">
//                 {loading ? (
//                   <div className="flex flex-col items-center justify-center py-24 text-slate-500">
//                     <Loader2 className="h-10 w-10 animate-spin text-sky-500 mb-4" />
//                     <p className="text-sm font-bold uppercase tracking-widest opacity-50">Syncing schedules...</p>
//                   </div>
//                 ) : upcoming.length === 0 ? (
//                   <div className="flex flex-col items-center justify-center py-20">
//                     <div className="h-20 w-20 rounded-full bg-slate-900 flex items-center justify-center mb-6">
//                       <Calendar className="h-8 w-8 text-slate-700" />
//                     </div>
//                     <h3 className="text-lg font-black text-white mb-1">No confirmed schedules</h3>
//                     <p className="text-xs text-slate-600 font-bold uppercase tracking-widest">Select 'Schedule Visit' to begin</p>
//                   </div>
//                 ) : (
//                   <div className="grid gap-4">
//                     <div className="flex items-center gap-3 mb-2">
//                        <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-sky-500">Upcoming Interventions</h2>
//                        <div className="h-px flex-1 bg-white/5" />
//                     </div>
//                     <div className="grid gap-3">
//                       {upcoming.map((a) => <AppointmentItem key={a._id} appointment={a} />)}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Past Tab */}
//             {tab === "past" && (
//               <div className="space-y-6">
//                 {loading ? (
//                   <div className="flex flex-col items-center justify-center py-24 text-slate-500">
//                     <Loader2 className="h-10 w-10 animate-spin text-sky-500 mb-4" />
//                     <p className="text-sm font-bold uppercase tracking-widest opacity-50">Retrieving clinic records...</p>
//                   </div>
//                 ) : past.length === 0 ? (
//                   <div className="flex flex-col items-center justify-center py-20">
//                     <div className="h-20 w-20 rounded-full bg-slate-900 flex items-center justify-center mb-6">
//                       <CheckCircle2 className="h-8 w-8 text-slate-700" />
//                     </div>
//                     <h3 className="text-lg font-black text-white mb-1">Archive is empty</h3>
//                     <p className="text-xs text-slate-600 font-bold uppercase tracking-widest">Completed visits appear here</p>
//                   </div>
//                 ) : (
//                   <div className="grid gap-4">
//                     <div className="flex items-center gap-3 mb-2">
//                        <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Medical History</h2>
//                        <div className="h-px flex-1 bg-white/5" />
//                     </div>
//                     <div className="grid gap-3">
//                       {past.map((a) => (
//                         <div key={a._id} className="opacity-70 grayscale-[0.2] hover:opacity-100 hover:grayscale-0 transition-all duration-300">
//                           <AppointmentItem appointment={a} />
//                         </div>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// }


import { useEffect, useState, useCallback } from "react";
import {
  Calendar, Clock, CheckCircle2, Loader2, AlertCircle,
  Sparkles, SkipForward, Radio, Timer,
} from "lucide-react";
import api from "../services/api";
import AppointmentForm from "../components/common/AppointmentForm";

/* ── helpers ─────────────────────────────────────────────── */
const fmt = (d) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

const STATUS_META = {
  active: { label: "Live Now", cls: "bg-sky-500 text-white border-sky-400 shadow-lg shadow-sky-500/20" },
  waiting: { label: "Waiting", cls: "bg-sky-500/10 text-sky-400 border-sky-500/20" },
  scheduled: { label: "Scheduled", cls: "bg-slate-800/40 text-slate-400 border-white/10" },
  completed: { label: "Done", cls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  missed: { label: "Missed", cls: "bg-red-500/10 text-red-400 border-red-500/20" },
  skipped: { label: "Skipped", cls: "bg-orange-500/10 text-orange-400 border-orange-200/20" },
  cancelled: { label: "Cancelled", cls: "bg-slate-800/40 text-slate-500 border-white/10" },
};

const getS = (raw) => (raw || "scheduled").toLowerCase();

/* ── LiveCard ────────────────────────────────────────────── */
function LiveCard({ appt, onSkip, skipping }) {
  const doctorName = (() => {
    const n = appt?.doctor?.user?.name || "";
    return n.toLowerCase().startsWith("dr") ? n : `Dr. ${n || "Unknown"}`;
  })();

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-800/60 backdrop-blur-xl p-6 shadow-2xl shadow-black/40 mb-6">
      <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-sky-500 px-3 py-1">
        <Radio className="h-3 w-3 text-white animate-pulse" />
        <span className="text-[10px] font-black text-white uppercase tracking-widest">Live Now</span>
      </div>

      <p className="text-[10px] font-black uppercase tracking-widest text-sky-400 mb-1">Queue Status — Token #{appt.tokenNumber}</p>
      <h2 className="text-2xl font-black text-white mb-1">{doctorName}</h2>
      <p className="text-sm text-slate-400 font-semibold">{appt.doctor?.specialization || "Specialist"}</p>

      <div className="mt-4 flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
          <Calendar className="h-3.5 w-3.5 text-sky-500" /> {fmt(appt.date)}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
          <Clock className="h-3.5 w-3.5 text-sky-500" /> {appt.timeSlot}
        </div>
      </div>

      <button
        onClick={() => onSkip(appt._id)}
        disabled={skipping}
        className="mt-5 flex items-center gap-2 rounded-xl border border-orange-500/30 bg-orange-500/10 px-4 py-2.5 text-xs font-bold text-orange-400 hover:bg-orange-500/20 transition-all disabled:opacity-50"
      >
        {skipping ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <SkipForward className="h-3.5 w-3.5" />}
        Skip My Turn
      </button>
    </div>
  );
}

/* ── AppointmentCard ─────────────────────────────────────── */
function AppointmentCard({ appt, onSkip, skipping }) {
  const status = getS(appt.status);
  const meta = STATUS_META[status] || STATUS_META.scheduled;

  const doctorName = (() => {
    const n = appt?.doctor?.user?.name || "";
    return n.toLowerCase().startsWith("dr") ? n : `Dr. ${n || "Unknown"}`;
  })();

  const waitMins = appt.tokenNumber > 1 ? (appt.tokenNumber - 1) * 15 : 0;
  const canSkip = ["waiting", "scheduled"].includes(status);

  return (
    <div className={`group rounded-2xl border p-4 transition-all hover:shadow-md bg-solid-white-light ${status === "completed" || status === "missed" || status === "cancelled"
      ? "border-white/10 bg-slate-800/40 opacity-60"
      : "border-white/10 bg-slate-800/60 backdrop-blur-xl hover:border-white/20"
      }`}>
      <div className="flex items-center justify-between gap-3">
        {/* Token */}
        <div className="flex h-12 w-12 flex-shrink-0 flex-col items-center justify-center rounded-xl border border-white/10 bg-white/10">
          <span className="text-[8px] font-black uppercase text-slate-400 leading-none">Token</span>
          <span className="text-lg font-black text-sky-500 leading-none">{appt.tokenNumber || "–"}</span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white truncate">{doctorName}</p>
          <p className="text-xs text-sky-400 font-semibold">{appt.doctor?.specialization || "Specialist"}</p>
          <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
            <Calendar className="h-3 w-3" /> {fmt(appt.date)}
            <span>·</span>
            <Clock className="h-3 w-3" /> {appt.timeSlot}
          </div>
        </div>

        {/* Status + wait */}
        <div className="flex flex-col items-end gap-1.5">
          <span className={`rounded-full border px-2.5 py-1 text-[9px] font-black uppercase tracking-wider ${meta.cls}`}>
            {meta.label}
          </span>
          {canSkip && waitMins > 0 && (
            <span className="flex items-center gap-1 text-[9px] text-slate-500">
              <Timer className="h-3 w-3" /> ~{waitMins}m wait
            </span>
          )}
        </div>
      </div>

      {/* Symptoms */}
      {appt.symptoms && appt.symptoms !== "General Checkup" && (
        <p className="mt-2.5 text-xs text-slate-500 italic border-t border-white/[0.06] pt-2 truncate">
          {appt.symptoms}
        </p>
      )}

      {/* Skip button */}
      {canSkip && (
        <button
          onClick={() => onSkip(appt._id)}
          disabled={skipping}
          className="mt-3 flex items-center gap-1.5 rounded-lg border border-orange-500/20 bg-orange-500/8 px-3 py-1.5 text-[10px] font-bold text-orange-400 hover:bg-orange-500/15 transition-all disabled:opacity-50"
        >
          {skipping ? <Loader2 className="h-3 w-3 animate-spin" /> : <SkipForward className="h-3 w-3" />}
          Skip
        </button>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════ */
export default function AppointmentsPage() {
  const [tab, setTab] = useState("book");
  const [appointments, setAppts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [skippingId, setSkippingId] = useState(null);

  const fetchMyAppointments = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/api/appointments/my");
      const raw = res.data.appointments || [];

      // Client-side: mark missed if time passed and still scheduled/waiting
      const now = Date.now();
      const enriched = raw.map(a => {
        const dt = a.dateTime ? new Date(a.dateTime) : new Date(`${new Date(a.date).toISOString().split('T')[0]} ${a.timeSlot}`);
        if (["scheduled", "waiting"].includes((a.status || "").toLowerCase()) && dt < now) {
          return { ...a, status: "missed" };
        }
        return a;
      });

      // Sort by tokenNumber
      enriched.sort((a, b) => (a.tokenNumber || 99) - (b.tokenNumber || 99));
      setAppts(enriched);
    } catch {
      setError("Unable to load appointments. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (tab !== "book") fetchMyAppointments();
  }, [tab, fetchMyAppointments]);

  const handleSkip = async (id) => {
    setSkippingId(id);
    try {
      await api.put(`/api/appointments/${id}/skip`);
      await fetchMyAppointments();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to skip");
    } finally {
      setSkippingId(null);
    }
  };

  const getStatus = (s) => (s || "").toLowerCase();

  const liveAppt = appointments.find(a => getStatus(a.status) === "active");

  const upcoming = appointments.filter(a =>
    ["scheduled", "waiting", "active"].includes(getStatus(a.status))
  );

  const past = appointments.filter(a =>
    ["completed", "cancelled", "missed", "skipped"].includes(getStatus(a.status))
  );

  const TABS = [
    { key: "book", label: "Schedule", icon: <Clock className="h-3.5 w-3.5" /> },
    { key: "upcoming", label: `Upcoming (${upcoming.length})`, icon: <Calendar className="h-3.5 w-3.5" /> },
    { key: "past", label: `History (${past.length})`, icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  ];

  return (
    <main className="min-h-screen bg-slate-900 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-white/[0.06] bg-slate-800/40 backdrop-blur-xl px-4 py-6">
        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-1 flex items-center gap-2 text-sky-400">
                <Sparkles className="h-3.5 w-3.5" />
                <p className="text-[10px] font-black uppercase tracking-widest">Clinical Scheduling</p>
              </div>
              <h1 className="text-2xl font-black text-white">Consultations</h1>
            </div>

            <div className="flex items-center gap-1 overflow-x-auto rounded-2xl border border-white/5 bg-slate-800/60 p-1.5">
              {TABS.map(t => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2 text-xs font-bold transition-all ${tab === t.key
                    ? "bg-sky-500 text-white shadow-lg shadow-sky-500/20"
                    : "text-slate-400 hover:text-white"
                    }`}
                >
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8 md:px-6">
        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
            <AlertCircle className="h-4 w-4 flex-shrink-0" /> {error}
          </div>
        )}

        {/* BOOK */}
        {tab === "book" && <AppointmentForm />}

        {/* UPCOMING */}
        {tab === "upcoming" && (
          <>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
                <p className="text-xs font-bold uppercase tracking-widest text-slate-600">Syncing schedules…</p>
              </div>
            ) : upcoming.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Calendar className="h-12 w-12 text-slate-700 mb-4" />
                <h3 className="text-lg font-black text-white">No upcoming appointments</h3>
                <p className="mt-1 text-xs text-slate-600 uppercase tracking-widest font-bold">
                  Use "Schedule" to book a visit
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Live station */}
                {liveAppt && (
                  <LiveCard
                    appt={liveAppt}
                    onSkip={handleSkip}
                    skipping={skippingId === liveAppt._id}
                  />
                )}

                {/* Queue */}
                <div className="space-y-2">
                  {upcoming
                    .filter(a => getStatus(a.status) !== "active")
                    .map(a => (
                      <AppointmentCard
                        key={a._id}
                        appt={a}
                        onSkip={handleSkip}
                        skipping={skippingId === a._id}
                      />
                    ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* HISTORY */}
        {tab === "past" && (
          <>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
                <p className="text-xs font-bold uppercase tracking-widest text-slate-600">Loading records…</p>
              </div>
            ) : past.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <CheckCircle2 className="h-12 w-12 text-slate-700 mb-4" />
                <h3 className="text-lg font-black text-white">No history yet</h3>
              </div>
            ) : (
              <div className="space-y-2">
                {past.map(a => (
                  <AppointmentCard
                    key={a._id}
                    appt={a}
                    onSkip={handleSkip}
                    skipping={skippingId === a._id}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}