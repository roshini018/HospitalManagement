
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { useAppContext } from "../context/AppContext";
import api from "../services/api";
import { ShieldCheck, TrendingUp, TrendingDown, AlertCircle, Pencil, X, Save, Trash2, Users, Stethoscope, DollarSign, Star, MoreVertical, Calendar, Clock, Activity, CheckCircle2, UserPlus, Search, Loader2, Upload } from "lucide-react";

// Components
import AdminHeader from "../components/admin/AdminHeader";
import AdminStatsGrid from "../components/admin/AdminStatsGrid";
import AdminTabs from "../components/admin/AdminTabs";
import OverviewTab from "../components/admin/OverviewTab";
import DoctorsTab from "../components/admin/DoctorsTab";
import PatientsTab from "../components/admin/PatientsTab";
import QueueTab from "../components/admin/QueueTab";
import RatingsTab from "../components/admin/RatingsTab";
import StaffHoursTab from "../components/admin/StaffHoursTab";
import LabTestsTab from "../components/admin/LabTestsTab";
import AddDoctorModal from "../components/admin/AddDoctorModal";
import AddPatientModal from "../components/admin/AddPatientModal";
import ConfirmDeleteModal from "../components/admin/ConfirmDeleteModal";
import RejectReasonModal from "../components/admin/RejectReasonModal";
import ChangePassword from "../components/common/ChangePassword";
import Stars from "../components/common/Stars";

/* ─── Constants ────────────────────────────────────────── */
const TODAY = new Date().toISOString().split("T")[0];

const COLOR_MAP = {
  sky: { bg: "bg-sky-500/15", text: "text-sky-400" },
  emerald: { bg: "bg-emerald-500/15", text: "text-emerald-400" },
  amber: { bg: "bg-amber-500/15", text: "text-amber-400" },
  violet: { bg: "bg-violet-500/15", text: "text-violet-400" },
};

const BED_STATUS_INIT = {
  total: 300,
  wards: [
    { name: "General", total: 150, occupied: 112 },
    { name: "ICU", total: 30, occupied: 26 },
    { name: "Maternity", total: 40, occupied: 28 },
    { name: "Pediatrics", total: 30, occupied: 18 },
    { name: "Neurology", total: 25, occupied: 21 },
    { name: "Orthopedics", total: 25, occupied: 29 },
  ],
};

const ACTIVITY = [
  { action: "System health check — All systems normal", time: "Just now", color: "bg-sky-500" },
  { action: "Lab services online", time: "10 min ago", color: "bg-violet-500" },
  { action: "Admin session started", time: "15 min ago", color: "bg-emerald-500" },
];

const DB_TO_UI = {
  scheduled: "Waiting",
  waiting: "Waiting",
  active: "Active",
  "in-progress": "Active",
  completed: "Done",
  cancelled: "Done",
  skipped: "Done",
  missed: "Done",
};

const QUEUE_CYCLE = ["waiting", "active", "done"];

const QUEUE_STATUS_STYLE = {
  Active: "bg-sky-500/15 text-sky-400 border-sky-500/25",
  Waiting: "bg-amber-500/15 text-amber-400 border-amber-500/25",
  Done: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  Skipped: "bg-orange-500/15 text-orange-400 border-orange-500/25",
  Missed: "bg-red-500/15 text-red-400 border-red-500/25",
  Upcoming: "bg-slate-700/40 text-slate-400 border-white/10",
};

const SPECIALTIES = ["Cardiology", "Neurology", "Orthopedics", "Dermatology", "General Medicine", "Gynecology", "Pediatrics", "ENT", "Oncology", "Psychiatry"];
const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const ALL_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const inputCls = "w-full rounded-xl border border-white/10 bg-slate-700/50 px-4 py-2.5 text-sm text-slate-200 placeholder:text-slate-500 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20 transition-all font-secondary";

const TABS = ["Overview", "Doctors", "Patients", "Queue", "Ratings", "Staff Hours", "Lab Tests", "Security"];

export default function AdminDashboardPage() {
  const { user, logout } = useAuth();
  const {
    doctors, appointments,
    updateAppointmentStatus: ctxUpdateStatus,
    addDoctor: contextAddDoctor,
    removeDoctor: contextRemoveDoctor,
  } = useAppContext();

  /* ── State ── */
  const [statsData, setStatsData] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  const [tab, setTab] = useState("Overview");
  const [search, setSearch] = useState("");

  // ── TODAY'S SUMMARY: dynamic state driven by /api/appointments ──
  const [summary, setSummary] = useState({
    opd: 0,
    surgeries: 0,
    discharges: 0,
    admissions: 0,
    emergencies: 0,
  });

  const [wards, setWards] = useState(BED_STATUS_INIT.wards.map(w => ({ ...w })));
  const [editingOps, setEditingOps] = useState(false);
  const [editingWards, setEditingWards] = useState(false);
  // opsDraft mirrors summary so the manual-edit overlay still works
  const [opsDraft, setOpsDraft] = useState({ ...summary });
  const [wardsDraft, setWardsDraft] = useState([]);

  const [showAddDoc, setShowAddDoc] = useState(false);
  const [newDoc, setNewDoc] = useState({ name: "", specialization: "Not Specified", experience: "", phone: "", email: "", password: "" });

  const [showAddPat, setShowAddPat] = useState(false);
  const [newPat, setNewPat] = useState({ name: "", email: "", password: "", age: "", blood: "O+", phone: "", condition: "" });
  const [patientToDelete, setPatientToDelete] = useState(null);

  const [staff, setStaff] = useState([]);
  const [editingStaff, setEditingStaff] = useState(null);
  const [staffEdits, setStaffEdits] = useState({});

  const [queueData, setQueueData] = useState([]);
  const [loadingQueue, setLoadingQueue] = useState(false);

  const [labTests, setLabTests] = useState([]);
  const [loadingLabs, setLoadingLabs] = useState(false);
  const [labFile, setLabFile] = useState(null);
  const [uploadingId, setUploadingId] = useState(null);
  const [labToReject, setLabToReject] = useState(null);
  const [labToDelete, setLabToDelete] = useState(null);
  const [apptToDelete, setApptToDelete] = useState(null);

  /* ── Fetchers ── */
  const fetchStats = async () => {
    setLoadingStats(true);
    try { const res = await api.get("/api/admin/stats"); setStatsData(res.data.stats || null); }
    catch (err) { console.error("Failed to fetch admin stats", err); }
    finally { setLoadingStats(false); }
  };

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try { const res = await api.get("/api/admin/users"); setAllUsers(res.data.users || []); }
    catch (err) { console.error("Failed to fetch users", err); }
    finally { setLoadingUsers(false); }
  };

  const fetchLabTests = async () => {
    setLoadingLabs(true);
    try { 
      const res = await api.get("/api/lab-tests"); 
      const tests = res.data.tests || [];
      console.log("Lab tests data for admin:", tests);
      setLabTests(tests); 
    }
    catch (err) { console.error("Failed to fetch lab tests", err); }
    finally { setLoadingLabs(false); }
  };

  const fetchReviews = async () => {
    setLoadingReviews(true);
    try { const res = await api.get("/api/feedback"); setReviews(res.data || []); }
    catch (err) { console.error("Failed to fetch reviews", err); }
    finally { setLoadingReviews(false); }
  };

  const fetchQueueData = async () => {
    setLoadingQueue(true);
    try { const res = await api.get("/api/appointments/all"); setQueueData(res.data.appointments || []); }
    catch (err) { console.error("Failed to fetch queue", err); }
    finally { setLoadingQueue(false); }
  };


  const fetchSummary = async () => {
    try {
      const res = await api.get("/api/appointments/all");

      console.log("SUMMARY DATA:", res.data);

      const appts = res.data.appointments || [];

      const opd = appts.length;

      const discharges = appts.filter(
        (a) =>
          ["completed", "done", "skipped", "missed", "cancelled"].includes(a.status?.toLowerCase())
      ).length;

      const admissions = appts.filter(
        (a) => a.status?.toLowerCase() === "active"
      ).length;

      setSummary({
        opd,
        surgeries: 0,
        discharges,
        admissions,
        emergencies: 0,
      });

    } catch (err) {
      console.error("Error fetching summary:", err);
    }
  };
  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchReviews();
    fetchQueueData();
    fetchSummary();
    fetchLabTests();
    
    // Auto-refresh every 30s
    const interval = setInterval(() => {
      fetchQueueData();
      fetchSummary();
      fetchStats();
      fetchLabTests();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => { if (tab === "Lab Tests") fetchLabTests(); }, [tab]);

  useEffect(() => {
    if (doctors?.length > 0) {
      setStaff(doctors.map(d => ({
        id: d._id,
        name: d.user?.name?.toLowerCase().startsWith("dr") ? d.user.name : `Dr. ${d.user?.name || "Unknown"}`,
        role: d.specialization || "Doctor",
        start: "09:00", end: "17:00",
        days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      })));
    }
  }, [doctors]);

  // Keep opsDraft in sync whenever summary updates (so manual-edit starts fresh)
  useEffect(() => {
    setOpsDraft({ ...summary });
  }, [summary]);

  // ── Derived & Stats ─────────────────────────────────────
  const patientsList = allUsers.filter(u => u.role === "patient");

  // Calculate real-time stats for each doctor from reviews and appointments
  const doctorAnalytics = useMemo(() => {
    const stats = {};
    doctors.forEach(d => {
      const dId = d._id || d.id;
      stats[dId] = { ratingsArray: [], reviewCount: 0, patientSet: new Set() };
    });
    reviews.forEach(r => {
      const dId = r.doctor?._id || r.doctor;
      if (stats[dId]) {
        stats[dId].ratingsArray.push(r.rating);
        stats[dId].reviewCount += 1;
      }
    });
    const allAppts = queueData.length > 0 ? queueData : appointments;
    allAppts.forEach(a => {
      const dId = a.doctor?._id || a.doctor;
      const pId = a.patient?._id || a.patient;
      if (stats[dId] && pId) {
        stats[dId].patientSet.add(pId.toString());
      }
    });
    Object.keys(stats).forEach(id => {
      const arr = stats[id].ratingsArray;
      stats[id].avgRating = arr.length > 0 ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1) : "5.0";
      stats[id].uniquePatients = stats[id].patientSet.size;
    });
    return stats;
  }, [doctors, reviews, queueData, appointments]);

  const STATS = [
    { label: "Total Patients", value: statsData?.totalPatients ?? "—", change: "Live", up: true, icon: Users, color: "sky" },
    { label: "Doctors On Staff", value: statsData?.totalDoctors ?? doctors.length, change: "Live", up: true, icon: Stethoscope, color: "emerald" },
    { label: "Appointments Today", value: statsData?.todayAppointments ?? statsData?.appointmentsToday ?? "—", change: "Live", up: true, icon: DollarSign, color: "amber" },
    { label: "Lab Reports", value: labTests.length, change: "Live", up: true, icon: Star, color: "violet" },
  ];

  const totalOccupied = wards.reduce((s, w) => s + w.occupied, 0);
  const totalBeds = wards.reduce((s, w) => s + w.total, 0);
  const liveOccupancyPct = Math.round((totalOccupied / totalBeds) * 100) || 0;

  const liveAlerts = [];
  wards.forEach(w => {
    const pct = Math.round((w.occupied / w.total) * 100);
    if (pct >= 85) liveAlerts.push({ msg: `${w.name} ward at ${pct}% capacity`, type: "warning" });
  });
  const pendingLabs = labTests.filter(l => l.status?.toLowerCase() === "pending").length;
  if (pendingLabs > 0) liveAlerts.push({ msg: `${pendingLabs} lab test request${pendingLabs > 1 ? "s" : ""} pending approval`, type: "info" });
  if (summary.emergencies > 0) liveAlerts.push({ msg: `${summary.emergencies} emergency case${summary.emergencies > 1 ? "s" : ""} today`, type: "warning" });


  const saveOps = () => { setSummary({ ...opsDraft }); setEditingOps(false); };
  const saveWards = () => { setWards([...wardsDraft]); setEditingWards(false); };

  // ── Normalise DB status → UI display label ───────────────
  const normalizeStatus = (s) => DB_TO_UI[s] ?? s;

  const rawQueue = queueData.length > 0 ? queueData : appointments;
  const queue = rawQueue.map(q => ({ ...q, status: normalizeStatus(q.status) }));

  // ── Queue status helpers ─────────────────────────────────
  const updateStatus = async (id, apiValue) => {
    try {
      if (typeof ctxUpdateStatus === "function") {
        return await ctxUpdateStatus(id, apiValue.toLowerCase());
      }
      const res = await api.put(`/api/appointments/${id}/status`, { status: apiValue.toLowerCase() });
      return { success: true, data: res.data };
    } catch (err) {
      return { success: false, message: err?.response?.data?.message || "Failed to update status" };
    }
  };

  const markDone = async (id) => {
    const result = await updateStatus(id, "done");
    if (result?.success) {
      setQueueData(prev => prev.map(q => q._id === id ? { ...q, status: "completed" } : q));
      // Re-calculate summary after status change
      fetchSummary();
    } else {
      alert(result?.message || "Failed to mark done");
    }
  };

  const cycleStatus = async (id, currentUIStatus) => {
    const apiCurrent = currentUIStatus === "Active" ? "active"
      : currentUIStatus === "Done" ? "done"
        : "waiting";

    const currentIdx = QUEUE_CYCLE.indexOf(apiCurrent);
    const nextApi = QUEUE_CYCLE[(currentIdx + 1) % QUEUE_CYCLE.length];

    const result = await updateStatus(id, nextApi);

    if (result?.success) {
      const savedDb = nextApi === "done" ? "completed" : nextApi;
      setQueueData(prev => prev.map(q => q._id === id ? { ...q, status: savedDb } : q));
      // Re-calculate summary after status change
      fetchSummary();
    } else {
      alert(result?.message || "Failed to update status");
    }
  };

  /* ── Lab ── */
  const approveLabTest = async (id) => {
    try { await api.put(`/api/lab-tests/${id}/approve`); fetchLabTests(); }
    catch (err) { alert(err?.response?.data?.message || "Approval failed"); }
  };

  const uploadReport = async (id) => {
    if (!labFile) return alert("Please select a file first");
    const formData = new FormData();
    formData.append("reportFile", labFile);
    setUploadingId(id);
    console.log(`Uploading report for lab test ${id}...`);
    try {
      const res = await api.put(`/api/lab-tests/${id}/report`, formData, { headers: { "Content-Type": "multipart/form-data" } });
      console.log("Upload success:", res.data);
      setLabFile(null); fetchLabTests(); alert("Report uploaded successfully");
    } catch (err) { 
      console.error("Upload failed:", err);
      alert(err?.response?.data?.message || "Upload failed"); 
    }
    finally { setUploadingId(null); }
  };

  const rejectLabTest = async (reason) => {
    if (!reason) return alert("Please provide a reason for rejection.");
    try {
      await api.put(`/api/lab-tests/${labToReject}/reject`, { reason });
      setLabTests(prev => prev.map(t => t._id === labToReject ? { ...t, status: "rejected" } : t));
      setLabToReject(null);
      alert("Lab test rejected successfully.");
    } catch (err) {
      alert(err?.response?.data?.message || "Rejection failed");
    }
  };

  const confirmDeleteLabTest = async () => {
    try {
      await api.delete(`/api/lab-tests/${labToDelete}`);
      setLabTests(prev => prev.filter(t => t._id !== labToDelete));
      setLabToDelete(null);
    } catch (err) {
      alert(err?.response?.data?.message || "Deletion failed");
    }
  };

  const confirmDeleteAppointment = async () => {
    if (!apptToDelete) return;
    try {
      await api.delete(`/api/appointments/${apptToDelete}`);
      setQueueData(prev => prev.filter(q => q._id !== apptToDelete));
      setApptToDelete(null);
      // Refresh summary and stats
      fetchSummary();
      fetchStats();
      alert("Appointment removed from queue");
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete appointment");
      setApptToDelete(null);
    }
  };

  /* ── Doctor / Patient helpers ── */
  const addDoctor = () => {
    if (!newDoc.name || !newDoc.experience || !newDoc.password) return;
    contextAddDoctor({ ...newDoc, experience: Number(newDoc.experience), fee: 500, patients: 0, status: "Active", rating: 5, reviews: 0 });
    setNewDoc({ name: "", specialization: "Not Specified", experience: "", phone: "", email: "", password: "" });
    setShowAddDoc(false);
  };
  const removeDoctor = (id) => contextRemoveDoctor(id);

  const addPatient = async () => {
    if (!newPat.name || !newPat.email || !newPat.password) return alert("Please fill mandatory fields (Name, Email, Password)");
    try {
      const res = await api.post("/api/admin/users", {
        name: newPat.name,
        email: newPat.email,
        password: newPat.password,
        phone: newPat.phone,
        age: Number(newPat.age),
        bloodGroup: newPat.blood,
        medicalCondition: newPat.condition
      });
      
      setAllUsers(prev => [res.data.user, ...prev]);
      setNewPat({ name: "", email: "", password: "", age: "", blood: "O+", phone: "", condition: "" });
      setShowAddPat(false);
      alert("Patient added successfully!");
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to add patient");
    }
  };

  const removePatient = (id) => {
    setPatientToDelete(id);
  };

  const confirmRemovePatient = async () => {
    if (!patientToDelete) return;
    try {
      await api.delete(`/api/admin/users/${patientToDelete}`);
      setAllUsers(prev => prev.filter(u => (u._id || u.id) !== patientToDelete));
      setPatientToDelete(null);
    } catch (err) { 
      alert(err?.response?.data?.message || "Failed to remove patient"); 
      setPatientToDelete(null);
    }
  };

  /* ── Staff helpers ── */
  const startEditStaff = (s) => { setEditingStaff(s.id); setStaffEdits({ start: s.start, end: s.end, days: [...s.days] }); };
  const saveStaff = (id) => { setStaff(prev => prev.map(s => s.id === id ? { ...s, ...staffEdits } : s)); setEditingStaff(null); };
  const toggleDay = (day) => setStaffEdits(prev => ({ ...prev, days: prev.days.includes(day) ? prev.days.filter(d => d !== day) : [...prev.days, day] }));

  /* ── Filtered lists ── */
  const filteredDocs = doctors.filter(d =>
    (d.user?.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (d.specialization || "").toLowerCase().includes(search.toLowerCase())
  );
  const filteredPats = patientsList.filter(p =>
    (p.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (p.email || "").toLowerCase().includes(search.toLowerCase())
  );

  /* ────────────────────────────────────────────────────────
     RENDER
  ──────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-slate-900 pb-16">

      {/* Hero */}
      <div className="bg-gradient-to-r from-violet-700 to-violet-800">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 flex flex-col md:flex-row items-center md:items-end gap-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 border border-white/20 flex-shrink-0">
            <ShieldCheck className="h-10 w-10 text-white" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <p className="text-[11px] font-bold uppercase tracking-widest text-violet-300 mb-1">Admin Portal</p>
            <h1 className="text-2xl font-black text-white">{user?.name || "Administrator"}</h1>
            <p className="text-sm text-violet-300 mt-0.5">{user?.email} · System Administrator</p>
          </div>
          <button onClick={logout} className="rounded-xl bg-red-500/20 border border-red-400/30 px-5 py-2.5 text-sm font-semibold text-red-300 hover:bg-red-500/30 transition-all">
            Sign Out
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {STATS.map(s => {
            const Icon = s.icon;
            const c = COLOR_MAP[s.color];
            return (
              <div key={s.label} className="rounded-2xl border border-white/10 bg-slate-800/60 backdrop-blur-xl p-5 shadow-xl shadow-black/20 hover:-translate-y-0.5 transition-all">
                <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl mb-3 ${c.bg} ${c.text}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-2xl font-black text-white">{s.value}</p>
                <p className="text-xs text-slate-400 mt-0.5">{s.label}</p>
                <div className={`mt-2 flex items-center gap-1 text-xs font-semibold ${s.up ? "text-emerald-400" : "text-red-400"}`}>
                  {s.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {s.change} this month
                </div>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="flex gap-1.5 overflow-x-auto rounded-2xl border border-white/10 bg-slate-800/60 backdrop-blur-xl p-2 shadow-xl shadow-black/20">
          {TABS.map(t => (
            <button key={t} onClick={() => { setTab(t); setSearch(""); }}
              className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${tab === t ? "bg-violet-600 text-white shadow-md shadow-violet-500/20" : "text-slate-500 hover:bg-slate-700/40"}`}>
              {t}
            </button>
          ))}
        </div>

        {/* ══ OVERVIEW ══════════════════════════════════════════ */}
        {tab === "Overview" && (
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">

              {/* Recent Activity */}
              <div className="rounded-2xl border border-white/10 bg-slate-800/60 backdrop-blur-xl p-6 shadow-xl shadow-black/20">
                <h2 className="text-base font-bold text-white mb-5">Recent Activity</h2>
                <div className="space-y-4">
                  {ACTIVITY.map((a, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className={`h-2 w-2 rounded-full flex-shrink-0 ${a.color}`} />
                      <p className="flex-1 text-sm text-slate-200">{a.action}</p>
                      <p className="text-xs text-slate-400 flex-shrink-0">{a.time}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Emergencies */}
              <div className="rounded-2xl border border-white/10 bg-slate-800/60 backdrop-blur-xl p-6 shadow-xl shadow-black/20">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-white">Today's Emergencies</h2>
                  <span className="rounded-full bg-red-500/15 border border-red-500/25 px-2.5 py-1 text-[10px] font-bold text-red-400">
                    {summary.emergencies} cases
                  </span>
                </div>
                {summary.emergencies === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-4">No emergencies today ✓</p>
                ) : (
                  <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 p-3">
                    <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-red-300">{summary.emergencies} emergency case{summary.emergencies > 1 ? "s" : ""} recorded today</p>
                      <p className="text-xs text-slate-400 mt-0.5">Contact the emergency department for details</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Ward Bed Occupancy */}
              <div className="rounded-2xl border border-white/10 bg-slate-800/60 backdrop-blur-xl p-6 shadow-xl shadow-black/20">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-base font-bold text-white">Ward-wise Bed Occupancy</h2>
                  {!editingWards ? (
                    <button onClick={() => { setWardsDraft(wards.map(w => ({ ...w }))); setEditingWards(true); }}
                      className="flex items-center gap-1.5 rounded-xl border border-violet-500/25 bg-violet-500/10 px-3 py-1.5 text-xs font-bold text-violet-400 hover:bg-violet-500/15 transition-all">
                      <Pencil className="h-3 w-3" /> Update Beds
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button onClick={() => setEditingWards(false)} className="flex items-center gap-1 rounded-xl border border-white/10 px-3 py-1.5 text-xs font-semibold text-slate-400 hover:bg-slate-700/40 transition-all">
                        <X className="h-3 w-3" /> Cancel
                      </button>
                      <button onClick={saveWards} className="flex items-center gap-1 rounded-xl bg-violet-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-violet-500 transition-all">
                        <Save className="h-3 w-3" /> Save
                      </button>
                    </div>
                  )}
                </div>
                {!editingWards ? (
                  <div className="space-y-3">
                    {wards.map(w => {
                      const pct = Math.round((w.occupied / w.total) * 100);
                      const barColor = pct >= 90 ? "bg-red-400" : pct >= 75 ? "bg-amber-400" : "bg-emerald-400";
                      return (
                        <div key={w.name}>
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm font-medium text-slate-200">{w.name}</p>
                            <p className="text-xs text-slate-500">
                              {w.occupied} / {w.total}
                              <span className={`ml-1.5 font-bold ${pct >= 90 ? "text-red-400" : pct >= 75 ? "text-amber-400" : "text-emerald-400"}`}>({pct}%)</span>
                            </p>
                          </div>
                          <div className="h-2 w-full rounded-full bg-slate-700">
                            <div className={`h-2 rounded-full transition-all duration-500 ${barColor}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-xs text-slate-400 mb-3">Update occupied beds per ward. Total capacity is fixed.</p>
                    {wardsDraft.map((w, i) => {
                      const pct = Math.round((w.occupied / w.total) * 100);
                      return (
                        <div key={w.name} className="rounded-xl border border-white/10 bg-slate-700/50 p-3">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-semibold text-slate-200">{w.name}</p>
                            <span className={`text-xs font-bold ${pct >= 90 ? "text-red-400" : pct >= 75 ? "text-amber-400" : "text-emerald-400"}`}>{pct}%</span>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Occupied</label>
                              <input type="number" min="0" max={w.total} value={w.occupied}
                                onChange={e => { const val = Math.min(Number(e.target.value), w.total); setWardsDraft(prev => prev.map((ward, idx) => idx === i ? { ...ward, occupied: val } : ward)); }}
                                className="w-full rounded-lg border border-white/10 bg-slate-800/60 px-3 py-2 text-sm font-bold text-slate-200 outline-none focus:border-violet-400 transition-all" />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Total Capacity</label>
                              <input type="number" min="1" value={w.total}
                                onChange={e => { const val = Math.max(Number(e.target.value), 1); setWardsDraft(prev => prev.map((ward, idx) => idx === i ? { ...ward, total: val } : ward)); }}
                                className="w-full rounded-lg border border-white/10 bg-slate-800/60 px-3 py-2 text-sm font-bold text-slate-200 outline-none focus:border-violet-400 transition-all" />
                            </div>
                          </div>
                          <div className="mt-2 h-1.5 w-full rounded-full bg-slate-600">
                            <div className={`h-1.5 rounded-full transition-all ${pct >= 90 ? "bg-red-400" : pct >= 75 ? "bg-amber-400" : "bg-emerald-400"}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Right col */}
            <div className="space-y-4">

              {/* ── TODAY'S SUMMARY ── now reads from `summary` state ── */}
              <div className="rounded-2xl border border-white/10 bg-slate-800/60 backdrop-blur-xl p-5 shadow-xl shadow-black/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-white">Today's Summary</h3>
                  {!editingOps ? (
                    <button onClick={() => { setOpsDraft({ ...summary }); setEditingOps(true); }}
                      className="flex items-center gap-1 rounded-lg border border-violet-500/25 bg-violet-500/10 px-2.5 py-1.5 text-[10px] font-bold text-violet-400 hover:bg-violet-500/15 transition-all">
                      <Pencil className="h-3 w-3" /> Update
                    </button>
                  ) : (
                    <div className="flex gap-1.5">
                      <button onClick={() => setEditingOps(false)} className="rounded-lg border border-white/10 px-2.5 py-1.5 text-[10px] font-semibold text-slate-400 hover:bg-slate-700/40 transition-all">Cancel</button>
                      <button onClick={saveOps} className="rounded-lg bg-violet-700 px-2.5 py-1.5 text-[10px] font-bold text-white hover:bg-violet-500 transition-all">Save</button>
                    </div>
                  )}
                </div>
                {[
                  { key: "opd", label: "OPD Patients", color: "bg-sky-500" },
                  { key: "surgeries", label: "Surgeries", color: "bg-violet-500" },
                  { key: "discharges", label: "Discharges", color: "bg-emerald-500" },
                  { key: "admissions", label: "Admissions", color: "bg-amber-500" },
                  { key: "emergencies", label: "Emergencies", color: "bg-red-500" },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between py-2.5 border-b border-white/[0.06] last:border-0">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full flex-shrink-0 ${item.color}`} />
                      <p className="text-sm text-slate-300">{item.label}</p>
                    </div>
                    {editingOps ? (
                      <input type="number" min="0" value={opsDraft[item.key]}
                        onChange={e => setOpsDraft(prev => ({ ...prev, [item.key]: Number(e.target.value) }))}
                        className="w-20 rounded-lg border border-violet-500/25 bg-violet-500/10 px-2 py-1 text-sm font-black text-white text-right outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20 transition-all" />
                    ) : (
                      /* ✅ Reads from `summary` — real-time data from API */
                      <p className="text-sm font-black text-white">{summary[item.key]}</p>
                    )}
                  </div>
                ))}
              </div>

              {/* Bed Occupancy summary */}
              <div className="rounded-2xl bg-gradient-to-br from-violet-700 to-violet-800 p-5">
                <p className="text-xs font-bold uppercase tracking-widest text-violet-300 mb-2">Total Bed Occupancy</p>
                <p className="text-3xl font-black text-white">{liveOccupancyPct}<span className="text-lg text-violet-400">%</span></p>
                <div className="mt-3 h-2 rounded-full bg-violet-900/50">
                  <div className="h-2 rounded-full bg-white/40 transition-all duration-500" style={{ width: `${liveOccupancyPct}%` }} />
                </div>
                <p className="text-xs text-violet-300 mt-2">{totalOccupied} / {totalBeds} beds occupied</p>
              </div>

              {/* System Alerts */}
              <div className="rounded-2xl border border-white/10 bg-slate-800/60 backdrop-blur-xl p-5 shadow-xl shadow-black/20">
                <h3 className="text-sm font-bold text-white mb-3">
                  System Alerts
                  {liveAlerts.length > 0 && (
                    <span className="ml-2 rounded-full bg-red-500/15 text-red-400 px-2 py-0.5 text-[10px] font-bold">{liveAlerts.length}</span>
                  )}
                </h3>
                {liveAlerts.length === 0 ? (
                  <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-2.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                    <p className="text-xs text-emerald-400">All systems normal</p>
                  </div>
                ) : liveAlerts.map((a, i) => (
                  <div key={i} className={`flex items-start gap-2 rounded-lg p-2.5 mb-2 last:mb-0 ${a.type === "warning" ? "bg-amber-500/10 border border-amber-500/20" : "bg-sky-500/10 border border-sky-500/20"}`}>
                    {a.type === "warning"
                      ? <AlertCircle className="h-3.5 w-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                      : <Activity className="h-3.5 w-3.5 text-sky-400   mt-0.5 flex-shrink-0" />}
                    <p className="text-xs text-slate-300">{a.msg}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══ DOCTORS ══════════════════════════════════════════ */}
        {tab === "Doctors" && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-slate-800/60 backdrop-blur-xl p-6 shadow-xl shadow-black/20">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <h2 className="text-base font-bold text-white">Manage Doctors</h2>
                <button onClick={() => setShowAddDoc(true)}
                  className="flex items-center gap-1.5 rounded-xl border border-violet-500/25 bg-violet-500/10 px-4 py-2 text-xs font-bold text-violet-400 hover:bg-violet-500/15 transition-all">
                  <UserPlus className="h-3.5 w-3.5" /> Add Doctor
                </button>
              </div>
              <div className="relative mb-4">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input placeholder="Search doctors..." value={search} onChange={e => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-slate-700/50 py-2.5 pl-10 pr-4 text-sm text-slate-200 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-500/20 transition-all" />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      {["Doctor", "Specialization", "Exp.", "Rating", "Patients", "Status", "Actions"].map(h => (
                        <th key={h} className="pb-3 text-left text-xs font-bold uppercase tracking-wider text-slate-400 pr-4">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.06]">
                    {filteredDocs.map(d => (
                      <tr key={d._id} className="hover:bg-slate-700/40 transition-colors">
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-500/20 text-xs font-bold text-violet-400 flex-shrink-0">
                              {(d.user?.name || "D").charAt(0)}
                            </div>
                            <span className="font-semibold text-white whitespace-nowrap">{d.user?.name?.toLowerCase().startsWith("dr") ? d.user.name : `Dr. ${d.user?.name}`}</span>
                          </div>
                        </td>
                        <td className="py-3 pr-4 text-slate-300 whitespace-nowrap">{d.specialization || "Not Specified"}</td>
                        <td className="py-3 pr-4 text-slate-300">{d.experience}y</td>
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-1.5">
                            <Stars rating={d.rating || 5} />
                            <span className="text-xs font-bold text-amber-400">{d.rating || "5.0"}</span>
                          </div>
                        </td>
                        <td className="py-3 pr-4 text-slate-300">{(d.patients || 0).toLocaleString()}</td>
                        <td className="py-3 pr-4">
                          <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${d.user?.isActive ? "bg-emerald-500/15 text-emerald-400" : "bg-amber-500/15 text-amber-400"}`}>
                            {d.user?.isActive ? "Active" : "On Leave"}
                          </span>
                        </td>
                        <td className="py-3">
                          <button onClick={() => removeDoctor(d._id)}
                            className="rounded-lg border border-white/10 bg-slate-800/60 p-1.5 text-slate-400 hover:text-red-400 hover:border-red-500/25 transition-all">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredDocs.length === 0 && <p className="text-center text-sm text-slate-400 py-8">No doctors found</p>}
              </div>
            </div>
          </div>
        )}

        {/* ══ PATIENTS ══════════════════════════════════════════ */}
        {tab === "Patients" && (
          <div className="rounded-2xl border border-white/10 bg-slate-800/60 backdrop-blur-xl p-6 shadow-xl shadow-black/20">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <h2 className="text-base font-bold text-white">Manage Patients</h2>
              <button onClick={() => setShowAddPat(true)}
                className="flex items-center gap-1.5 rounded-xl border border-sky-500/25 bg-sky-500/10 px-4 py-2 text-xs font-bold text-sky-400 hover:bg-sky-500/15 transition-all">
                <UserPlus className="h-3.5 w-3.5" /> Add Patient
              </button>
            </div>
            <div className="relative mb-4">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input placeholder="Search patients..." value={search} onChange={e => setSearch(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-700/50 py-2.5 pl-10 pr-4 text-sm text-slate-200 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 transition-all" />
            </div>
            <div className="space-y-3">
              {loadingUsers ? (
                <div className="flex justify-center py-10"><Loader2 className="animate-spin text-sky-400" /></div>
              ) : filteredPats.map(p => (
                <div key={p._id || p.id} className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-slate-700/40 p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500/15 text-sm font-bold text-sky-400 flex-shrink-0">
                      {(p.name || "P").charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{p.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{p.email}</p>
                      <p className="text-xs text-slate-400">{p.phone || "No phone"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] uppercase font-bold text-slate-500 px-2 py-1 rounded bg-slate-800">{p.role}</span>
                    <button onClick={() => removePatient(p._id || p.id)}
                      className="rounded-lg border border-white/10 bg-slate-800/60 p-1.5 text-slate-400 hover:text-red-400 hover:border-red-500/25 transition-all">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
              {!loadingUsers && filteredPats.length === 0 && <p className="text-center text-sm text-slate-400 py-8">No patients found</p>}
            </div>
          </div>
        )}

        {/* ══ QUEUE ═════════════════════════════════════════════ */}
        {tab === "Queue" && (
          <div className="rounded-2xl border border-white/10 bg-slate-800/60 backdrop-blur-xl p-6 shadow-xl shadow-black/20">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
              <h2 className="text-base font-bold text-white">Live Queue Management</h2>
              <div className="flex gap-2">
                <span className="rounded-full bg-sky-500/15 border border-sky-500/25 px-3 py-1 text-xs font-bold text-sky-400">
                  {queue.filter(q => q.status === "Active").length} Active
                </span>
                <span className="rounded-full bg-amber-500/15 border border-amber-500/25 px-3 py-1 text-xs font-bold text-amber-400">
                  {queue.filter(q => q.status === "Waiting").length} Waiting
                </span>
                <span className="rounded-full bg-emerald-500/15 border border-emerald-500/25 px-3 py-1 text-xs font-bold text-emerald-400">
                  {queue.filter(q => q.status === "Done").length} Done
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {loadingQueue ? (
                <div className="flex items-center justify-center py-12 text-slate-500">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading queue…
                </div>
              ) : queue.length === 0 ? (
                <p className="text-center text-sm text-slate-400 py-10">No appointments in queue</p>
              ) : queue.map((q, idx) => (
                <div key={q._id}
                  className={`flex items-center justify-between rounded-xl border p-4 transition-all ${q.status === "Active" ? "border-sky-500/25 bg-sky-500/10"
                      : q.status === "Done" ? "border-emerald-500/20 bg-emerald-500/5 opacity-60"
                        : "border-white/10 bg-slate-800/60 hover:bg-slate-700/40"
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-black flex-shrink-0 ${q.status === "Active" ? "bg-sky-600 text-white"
                        : q.status === "Done" ? "bg-emerald-500 text-white"
                          : "bg-slate-700/40 text-slate-400"
                      }`}>
                      #{q.tokenNumber || idx + 1}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{q.patient?.name || "Patient"}</p>
                      <p className="text-xs text-slate-400">
                        {q.doctor?.user?.name?.toLowerCase().startsWith("dr") ? q.doctor.user.name : `Dr. ${q.doctor?.user?.name || "Doctor"}`} ({q.doctor?.specialization || "Not Specified"}) · {new Date(q.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      onClick={() => cycleStatus(q._id, q.status)}
                      title="Click to cycle status"
                      className={`rounded-full border px-2.5 py-1 text-[10px] font-bold cursor-pointer select-none transition-all hover:opacity-80 ${QUEUE_STATUS_STYLE[q.status] || "bg-slate-700/40 text-slate-400 border-white/10"
                        }`}
                    >
                      {q.status}
                    </span>
                    {q.status !== "Done" && (
                      <button onClick={() => markDone(q._id)}
                        title="Mark done"
                        className="rounded-lg border border-emerald-500/25 bg-emerald-500/10 p-1.5 text-emerald-400 hover:bg-emerald-500/15 transition-all">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                    <button onClick={() => setApptToDelete(q._id)}
                      title="Delete from Queue"
                      className="rounded-lg border border-white/10 bg-slate-800/60 p-1.5 text-slate-400 hover:text-red-400 hover:border-red-500/25 transition-all">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-4 text-xs text-slate-500">
              💡 Click the status badge to cycle: <strong className="text-amber-400">Waiting</strong> → <strong className="text-sky-400">Active</strong> → <strong className="text-emerald-400">Done</strong> · or tap ✓ to jump straight to Done
            </p>
          </div>
        )}

        {/* ══ RATINGS ══════════════════════════════════════════ */}
        {tab === "Ratings" && (
          <div className="space-y-6">
            <div className="rounded-[2.5rem] border border-white/10 bg-slate-800/60 backdrop-blur-xl p-8 shadow-xl shadow-black/20">
              <div className="mb-8">
                <h2 className="text-xl font-black text-white tracking-tight leading-none mb-1">Doctor Performance Hub</h2>
                <p className="text-[10px] font-bold uppercase tracking-widest text-violet-400 opacity-80">Aggregate quality metrics across all departments</p>
              </div>
              
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {doctors.map(d => {
                  const dId = d._id || d.id;
                  const analytics = doctorAnalytics[dId] || { avgRating: "5.0", reviewCount: 0, uniquePatients: 0 };
                  const docName = d.user?.name || "Doctor";
                  // Clean initial logic: skip "Dr." etc
                  const cleanName = docName.replace(/^(Dr\.|Dr|Mr\.|Mr|Ms\.|Ms)\s+/i, "");
                  const initial = cleanName.charAt(0).toUpperCase();

                  return (
                    <div key={dId} className="group relative overflow-hidden rounded-3xl border border-white/[0.08] bg-slate-900/40 p-6 hover:bg-slate-800/60 hover:-translate-y-1 transition-all duration-300">
                      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                        <TrendingUp className="h-20 w-20 text-white" />
                      </div>
                      
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-white/10 text-lg font-black text-violet-400 flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                          {initial}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-black text-white truncate group-hover:text-violet-400 transition-colors uppercase tracking-tight">
                            {docName.toLowerCase().startsWith("dr") ? docName : `Dr. ${docName}`}
                          </p>
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest truncate">{d.specialization || "Expert Practitioner"}</p>
                        </div>
                      </div>

                      <div className="flex items-end justify-between mb-2">
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Public Rating</p>
                          <Stars rating={parseFloat(analytics.avgRating)} />
                        </div>
                        <div className="text-right">
                          <span className="text-3xl font-black text-white tracking-tighter group-hover:text-amber-400 transition-colors">{analytics.avgRating}</span>
                        </div>
                      </div>

                      <div className="h-1.5 w-full rounded-full bg-slate-800/50 mb-4 overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-amber-500 transition-all duration-700 ease-out" style={{ width: `${(parseFloat(analytics.avgRating) / 5) * 100}%` }} />
                      </div>

                      <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                        <div className="flex-1">
                          <span className="block text-xs font-black text-white uppercase tracking-tight">{analytics.reviewCount}</span>
                          <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-widest">Public Reviews</span>
                        </div>
                        <div className="w-px h-6 bg-white/10" />
                        <div className="flex-1">
                          <span className="block text-xs font-black text-white uppercase tracking-tight">{analytics.uniquePatients}</span>
                          <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-widest">Lives Impacted</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-800/60 backdrop-blur-xl p-6 shadow-xl shadow-black/20">
              <h2 className="text-base font-bold text-white mb-5">Recent Patient Reviews</h2>
              <div className="space-y-3">
                {loadingReviews ? (
                  <div className="flex justify-center items-center py-10"><Loader2 className="h-6 w-6 animate-spin text-sky-400" /></div>
                ) : reviews.length === 0 ? (
                  <p className="text-center text-sm text-slate-500 py-10">No reviews yet</p>
                ) : reviews.map((r, i) => (
                  <div key={r._id || i} className="flex items-start justify-between gap-4 rounded-xl border border-white/[0.06] bg-slate-700/40 p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-500/15 text-sm font-bold text-sky-400 flex-shrink-0">
                        {(r.patient?.name || "P").charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{r.patient?.name}</p>
                        <p className="text-xs text-sky-400 font-medium">{r.doctor?.user?.name?.toLowerCase().startsWith("dr") ? r.doctor.user.name : `Dr. ${r.doctor?.user?.name || "Doctor"}`} ({r.doctor?.specialization || "Not Specified"})</p>
                        <p className="text-xs text-slate-500 mt-1 italic">"{r.comment}"</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <Stars rating={r.rating} />
                      <p className="text-[10px] text-slate-400">{new Date(r.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══ STAFF HOURS ═══════════════════════════════════════ */}
        {tab === "Staff Hours" && (
          <div className="rounded-2xl border border-white/10 bg-slate-800/60 backdrop-blur-xl p-6 shadow-xl shadow-black/20">
            <h2 className="text-base font-bold text-white mb-5">Staff Working Hours</h2>
            <div className="space-y-3">
              {staff.length === 0 ? (
                <p className="text-center text-sm text-slate-400 py-10">No staff data available</p>
              ) : staff.map(s => (
                <div key={s.id} className="rounded-xl border border-white/[0.06] bg-slate-700/40 p-4">
                  {editingStaff === s.id ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/15 text-sm font-bold text-emerald-400 flex-shrink-0">
                          {(s.name.split(" ")[1]?.charAt(0) || s.name.charAt(0) || "D")}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{s.name}</p>
                          <p className="text-xs text-slate-400">{s.role}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Start Time</label>
                          <input type="time" value={staffEdits.start} onChange={e => setStaffEdits(prev => ({ ...prev, start: e.target.value }))} className={inputCls} />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">End Time</label>
                          <input type="time" value={staffEdits.end} onChange={e => setStaffEdits(prev => ({ ...prev, end: e.target.value }))} className={inputCls} />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Working Days</label>
                        <div className="flex flex-wrap gap-2">
                          {ALL_DAYS.map(day => (
                            <button key={day} type="button" onClick={() => toggleDay(day)}
                              className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${staffEdits.days.includes(day) ? "border-violet-400 bg-violet-500/15 text-violet-400" : "border-white/10 bg-slate-700/40 text-slate-400 hover:border-white/20"}`}>
                              {day}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2 pt-1">
                        <button onClick={() => setEditingStaff(null)} className="flex items-center gap-1.5 rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-700/60 transition-all">
                          <X className="h-3.5 w-3.5" /> Cancel
                        </button>
                        <button onClick={() => saveStaff(s.id)} className="flex items-center gap-1.5 rounded-xl bg-violet-700 px-4 py-2 text-xs font-bold text-white hover:bg-violet-500 transition-all">
                          <Save className="h-3.5 w-3.5" /> Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/15 text-sm font-bold text-emerald-400 flex-shrink-0">
                          {(s.name.split(" ")[1]?.charAt(0) || s.name.charAt(0) || "D")}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{s.name}</p>
                          <p className="text-xs text-slate-400">{s.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-1.5 rounded-xl bg-slate-800/60 border border-white/10 px-3 py-2">
                          <Clock className="h-3.5 w-3.5 text-slate-400" />
                          <span className="text-xs font-semibold text-slate-200">{s.start} – {s.end}</span>
                        </div>
                        <div className="hidden md:flex gap-1">
                          {ALL_DAYS.map(day => (
                            <span key={day} className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${s.days.includes(day) ? "bg-violet-500/15 text-violet-400" : "bg-slate-700/30 text-slate-500"}`}>
                              {day}
                            </span>
                          ))}
                        </div>
                        <button onClick={() => startEditStaff(s)}
                          className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-slate-800/60 px-3 py-2 text-xs font-semibold text-slate-300 hover:border-violet-500/25 hover:text-violet-400 hover:bg-violet-500/10 transition-all">
                          <Pencil className="h-3.5 w-3.5" /> Edit
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ LAB TESTS ════════════════════════════════════════ */}
        {tab === "Lab Tests" && (
          <div className="rounded-2xl border border-white/10 bg-slate-800/60 backdrop-blur-xl p-6 shadow-xl shadow-black/20">
            <h2 className="text-base font-bold text-white mb-5">Manage Lab Test Requests</h2>
            {loadingLabs ? (
              <div className="flex items-center justify-center py-12 text-slate-500">
                <Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading tests…
              </div>
            ) : labTests.length === 0 ? (
              <p className="text-center text-sm text-slate-400 py-8">No lab tests found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      {["Patient", "Test Name", "Date", "Status", "Actions"].map(h => (
                        <th key={h} className="pb-3 text-left text-xs font-bold uppercase tracking-wider text-slate-400 pr-4">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.06]">
                    {labTests.map(test => (
                      <tr key={test._id} className="hover:bg-slate-700/40 transition-colors">
                        <td className="py-3 pr-4"><p className="font-semibold text-white">{test.patient?.name || "Unknown"}</p></td>
                        <td className="py-3 pr-4 text-slate-300">{test.testName || test.testType || "General Test" }</td>
                        <td className="py-3 pr-4 text-slate-400 text-[11px]">{test.date || "Pending"}</td>
                        <td className="py-3 pr-4">
                          <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                            String(test.status).toLowerCase() === "pending" ? "bg-amber-500/15 text-amber-400"
                              : String(test.status).toLowerCase() === "rejected" ? "bg-red-500/15 text-red-400"
                              : String(test.status).toLowerCase() === "approved" ? "bg-sky-500/15 text-sky-400"
                                : "bg-emerald-500/15 text-emerald-400"
                            }`}>{test.status}</span>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            {String(test.status).toLowerCase() === "pending" && (
                              <button onClick={() => approveLabTest(test._id)}
                                className="rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-sky-700 transition-all shadow-lg shadow-sky-500/10">
                                Approve
                              </button>
                            )}
                            {String(test.status).toLowerCase() === "approved" && (
                              <div className="flex items-center gap-2">
                                <input type="file" onChange={e => setLabFile(e.target.files[0])}
                                  className="text-xs text-slate-400 bg-slate-700/50 rounded p-1" />
                                <button onClick={() => uploadReport(test._id)} disabled={uploadingId === test._id}
                                  className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 transition-all disabled:opacity-50">
                                  {uploadingId === test._id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />} Upload
                                </button>
                              </div>
                            )}
                            {String(test.status).toLowerCase() === "completed" && <span className="text-xs text-emerald-400">Report Ready</span>}
                            {String(test.status).toLowerCase() !== "completed" && (
                              <button 
                                onClick={() => setLabToReject(test._id)}
                                className="rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-1.5 text-xs font-bold text-red-400 hover:bg-red-500/20 transition-all"
                              >
                                Reject
                              </button>
                            )}
                            <button
                              onClick={() => setLabToDelete(test._id)}
                              className="rounded-lg border border-white/10 bg-slate-800/60 p-1.5 text-slate-400 hover:text-red-400 hover:border-red-500/25 transition-all"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {tab === "Security" && (
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <ChangePassword />
          </div>
        )}
      </div>

      {/* ══ ADD DOCTOR MODAL ═════════════════════════════════ */}
      {showAddDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-800/60 backdrop-blur-xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-white">Add New Doctor</h2>
              <button onClick={() => setShowAddDoc(false)} className="rounded-lg border border-white/10 p-1.5 text-slate-400 hover:bg-slate-700/40"><X className="h-4 w-4" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Full Name *</label>
                <input value={newDoc.name} onChange={e => setNewDoc(p => ({ ...p, name: e.target.value }))} placeholder="Dr. Full Name" className={inputCls} />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Specialization *</label>
                <select value={newDoc.specialization} onChange={e => setNewDoc(p => ({ ...p, specialization: e.target.value }))} className={inputCls}>
                  {SPECIALTIES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Experience (yrs) *</label>
                  <input type="number" value={newDoc.experience} onChange={e => setNewDoc(p => ({ ...p, experience: e.target.value }))} placeholder="0" className={inputCls} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Phone</label>
                  <input value={newDoc.phone} onChange={e => setNewDoc(p => ({ ...p, phone: e.target.value }))} placeholder="9876543210" className={inputCls} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Email *</label>
                  <input type="email" value={newDoc.email} onChange={e => setNewDoc(p => ({ ...p, email: e.target.value }))} placeholder="doctor@hospital.com" className={inputCls} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Password *</label>
                  <input type="password" value={newDoc.password} onChange={e => setNewDoc(p => ({ ...p, password: e.target.value }))} placeholder="password" className={inputCls} />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowAddDoc(false)} className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm font-semibold text-slate-300 hover:bg-slate-700/40 transition-all">Cancel</button>
              <button onClick={addDoctor} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-violet-700 py-2.5 text-sm font-bold text-white hover:bg-violet-500 transition-all">
                <UserPlus className="h-4 w-4" /> Add Doctor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ ADD PATIENT MODAL ════════════════════════════════ */}
      {showAddPat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-800/60 backdrop-blur-xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-bold text-white">Add New Patient</h2>
              <button onClick={() => setShowAddPat(false)} className="rounded-lg border border-white/10 p-1.5 text-slate-400 hover:bg-slate-700/40"><X className="h-4 w-4" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Full Name *</label>
                <input value={newPat.name} onChange={e => setNewPat(p => ({ ...p, name: e.target.value }))} placeholder="Patient Full Name" className={inputCls} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Email *</label>
                  <input type="email" value={newPat.email} onChange={e => setNewPat(p => ({ ...p, email: e.target.value }))} placeholder="patient@hospital.com" className={inputCls} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Password *</label>
                  <input type="password" value={newPat.password} onChange={e => setNewPat(p => ({ ...p, password: e.target.value }))} placeholder="password" className={inputCls} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Age *</label>
                  <input type="number" value={newPat.age} onChange={e => setNewPat(p => ({ ...p, age: e.target.value }))} placeholder="25" className={inputCls} />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Blood Group</label>
                  <select value={newPat.blood} onChange={e => setNewPat(p => ({ ...p, blood: e.target.value }))} className={inputCls}>
                    {BLOOD_GROUPS.map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Phone</label>
                <input value={newPat.phone} onChange={e => setNewPat(p => ({ ...p, phone: e.target.value }))} placeholder="9876543210" className={inputCls} />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Condition / Reason</label>
                <input value={newPat.condition} onChange={e => setNewPat(p => ({ ...p, condition: e.target.value }))} placeholder="e.g. Hypertension" className={inputCls} />
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowAddPat(false)} className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm font-semibold text-slate-300 hover:bg-slate-700/40 transition-all">Cancel</button>
              <button onClick={addPatient} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-sky-700 py-2.5 text-sm font-bold text-white hover:bg-sky-600 transition-all">
                <UserPlus className="h-4 w-4" /> Add Patient
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ DELETE CONFIRMATION MODAL ═══════════════════════ */}
      {patientToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md px-4">
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20 mb-4">
              <Trash2 className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="text-xl font-black text-white mb-2">Are you sure?</h2>
            <p className="text-sm text-slate-400 mb-6 font-medium">
              This will permanently delete the patient and all associated data. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setPatientToDelete(null)}
                className="flex-1 rounded-xl border border-white/10 bg-slate-800 py-3 text-xs font-bold text-slate-300 hover:bg-slate-700 transition-all"
              >
                No, Keep it
              </button>
              <button 
                onClick={confirmRemovePatient}
                className="flex-1 rounded-xl bg-red-600 py-3 text-xs font-black text-white shadow-lg shadow-red-500/20 hover:bg-red-500 transition-all hover:scale-[1.02]"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ REJECT LAB TEST MODAL ═══════════════════════ */}
      <RejectReasonModal 
        isOpen={!!labToReject}
        onClose={() => setLabToReject(null)}
        onConfirm={(reason) => rejectLabTest(reason)}
      />

      {/* ══ DELETE LAB TEST MODAL ═══════════════════════ */}
      {labToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md px-4">
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20 mb-4">
              <Trash2 className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="text-xl font-black text-white mb-2">Delete Report?</h2>
            <p className="text-sm text-slate-400 mb-6 font-medium">
              This action cannot be undone and will permanently remove the record from the database.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setLabToDelete(null)}
                className="flex-1 rounded-xl border border-white/10 bg-slate-800 py-3 text-xs font-bold text-slate-300 hover:bg-slate-700 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDeleteLabTest}
                className="flex-1 rounded-xl bg-red-600 py-3 text-xs font-black text-white shadow-lg shadow-red-500/20 hover:bg-red-500 transition-all hover:scale-[1.02]"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ DELETE APPOINTMENT MODAL ═══════════════════════ */}
      {apptToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md px-4">
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20 mb-4">
              <Trash2 className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="text-xl font-black text-white mb-2">Clear from Queue?</h2>
            <p className="text-sm text-slate-400 mb-6 font-medium">
              This will remove the appointment from the live queue and all records. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setApptToDelete(null)}
                className="flex-1 rounded-xl border border-white/10 bg-slate-800 py-3 text-xs font-bold text-slate-300 hover:bg-slate-700 transition-all"
              >
                No, Keep
              </button>
              <button 
                onClick={confirmDeleteAppointment}
                className="flex-1 rounded-xl bg-red-600 py-3 text-xs font-black text-white shadow-lg shadow-red-500/20 hover:bg-red-500 transition-all hover:scale-[1.02]"
              >
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}