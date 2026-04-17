import { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";
import QueueStatus from "./QueueStatus";
import { Calendar, Clock, User, FileText, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

const slots = ["09:00 AM", "10:30 AM", "12:00 PM", "02:00 PM", "04:30 PM", "06:00 PM", "07:30 PM", "09:00 PM"];

const inputCls = "w-full rounded-xl border border-white/10 bg-slate-700/50 backdrop-blur-sm px-4 py-3 text-sm text-white outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all placeholder:text-slate-500 appearance-none";

export default function AppointmentForm() {
  const { doctors, bookAppointment, appointments, loading } = useAppContext();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlDoctorId = searchParams.get("doctorId");

  const [doctorId, setDoctorId] = useState(urlDoctorId || "");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [timeSlot, setTimeSlot] = useState(slots[0]);
  const [symptoms, setSymptoms] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (urlDoctorId) {
      setDoctorId(urlDoctorId);
    } else if (doctors && doctors.length > 0 && !doctorId) {
      setDoctorId(doctors[0]._id || doctors[0].id);
    }
  }, [doctors, urlDoctorId, doctorId]);

  // Calculate live queue stats for the selected doctor
  const myDoctorApts = appointments.filter(a => (a.doctorId === doctorId || a.doctor === doctorId) && (a.status === "Waiting" || a.status === "In Progress" || a.status === "active"));
  const queueAmt = myDoctorApts.length;
  const estimatedMinutes = queueAmt * 15;

  const handleSubmit = async () => {
    if (!user) {
      alert("Please login to book an appointment");
      navigate("/login");
      return;
    }

    if (!doctorId || !date || !timeSlot || !symptoms) {
      setError("Please select a doctor, date, time slot, and describe your symptoms.");
      return;
    }

    setError("");
    setSuccess("");
    setIsSubmitting(true);

    const selectedDoc = doctors.find(d => d._id === doctorId || d.id === doctorId);
    if (!selectedDoc) {
      setError("Please select a valid doctor");
      setIsSubmitting(false);
      return;
    }

    const payload = {
      doctorId: selectedDoc._id || selectedDoc.id,
      date: new Date(date).toISOString(),
      timeSlot: timeSlot,
      symptoms: symptoms,
    };

    try {
      const res = await bookAppointment(payload);
      if (res.success || res.appointment) {
        setSuccess("✅ Appointment scheduled! Redirecting...");
        setTimeout(() => {
          navigate("/dashboard?tab=Appointments");
        }, 2000);
      } else {
        setError(res.message || "Failed to book appointment");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to book appointment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-[2.5rem] bg-slate-800/60 backdrop-blur-xl border border-white/10 p-8 md:p-12 shadow-2xl shadow-black/40 space-y-10 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex flex-col gap-1.5 border-b border-white/5 pb-8">
        <h2 className="text-3xl font-black text-white tracking-tight">Book an <span className="text-sky-500">Appointment</span></h2>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Select your clinical parameters</p>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm font-bold text-red-600 animate-in shake duration-300">
          <AlertCircle className="h-5 w-5 flex-shrink-0" /> {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-4 text-sm font-bold text-emerald-600">
          <CheckCircle className="h-5 w-5 flex-shrink-0" /> {success}
        </div>
      )}

      <form className="grid gap-8 md:grid-cols-2">
        {/* Doctor */}
        <div className="space-y-2.5">
          <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
            <User className="h-3 w-3 text-sky-500" /> Practitioner
          </label>
          <div className="relative">
            <select
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              className={inputCls}
              disabled={loading && doctors.length === 0}
            >
              <option value="" disabled>Choose a Specialist</option>
              {doctors.map((d) => (
                <option key={d._id || d.id} value={d._id || d.id}>
                  {d.user?.name?.toLowerCase().startsWith("dr") ? "" : "Dr. "}{d.user?.name || "Practitioner"} — {d.specialization || "Expert"}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
            </div>
          </div>
        </div>

        {/* Date */}
        <div className="space-y-2.5">
          <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
            <Calendar className="h-3 w-3 text-sky-500" /> Calendar Date
          </label>
          <div className="relative">
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={inputCls}
            />
          </div>
        </div>

        {/* Symptoms */}
        <div className="space-y-2.5 md:col-span-2">
          <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
            <FileText className="h-3 w-3 text-sky-500" /> Reason for Consultation
          </label>
          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="Describe your symptoms or health concerns..."
            rows={4}
            className={`${inputCls} resize-none`}
          />
        </div>

        {/* Time Slots */}
        <div className="space-y-4 md:col-span-2">
          <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
            <Clock className="h-3 w-3 text-sky-500" /> Preferred Time Slot
          </label>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {slots.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() => setTimeSlot(slot)}
                className={`rounded-xl border py-4 text-xs font-black transition-all duration-300 ${
                  timeSlot === slot
                    ? "border-sky-500 bg-sky-500 text-white shadow-lg shadow-sky-500/20 scale-[1.02]"
                    : "border-white/10 bg-slate-700/50 text-slate-400 hover:border-sky-500/30 hover:bg-sky-500/10 hover:text-white"
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-2 pt-6 flex flex-col items-center gap-10">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-sky-400 to-sky-600 py-5 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-sky-500/20 hover:from-sky-500 hover:to-sky-700 hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin text-white" /> : <CheckCircle className="h-4 w-4" />}
            {isSubmitting ? "Processing..." : "Confirm Schedule"}
          </button>

          {/* Live Stats UI */}
          <div className="w-full">
            <QueueStatus queueNumber={queueAmt + 1} estimatedMinutes={estimatedMinutes} />
          </div>
        </div>
      </form>
    </div>
  );
}