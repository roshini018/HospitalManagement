import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, Navigate } from "react-router-dom";
import { jsPDF } from "jspdf";
import { 
  Users, Clock, CheckCircle, Star, Loader2, Edit3, 
  FileText, MessageCircle, ChevronRight, Bell, Save, X,
  Plus, Trash2, Radio, SkipForward
} from "lucide-react";

import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useAppContext } from "../context/AppContext";

// Components
import DashboardHeader from "../components/doctor/DashboardHeader";
import StatsGrid from "../components/doctor/StatsGrid";
import DoctorTabs from "../components/doctor/DoctorTabs";
import DashboardOverview from "../components/doctor/DashboardOverview";
import QueueSection from "../components/doctor/QueueSection";
import PatientRoster from "../components/doctor/PatientRoster";
import SharedReportsSection from "../components/doctor/SharedReportsSection";
import QuestionsSection from "../components/doctor/QuestionsSection";
import ReviewsSection from "../components/doctor/ReviewsSection";
import ProfileSection from "../components/doctor/ProfileSection";
import PrescriptionModal from "../components/doctor/PrescriptionModal";

const TABS = ["Dashboard", "Queue", "Patients", "Shared Reports", "Questions", "Reviews", "Profile"];

const STATUS_META = {
  active: { label: "In Progress", cls: "bg-sky-500/15 text-sky-400 border-sky-500/20" },
  waiting: { label: "Waiting", cls: "bg-amber-500/15 text-amber-400 border-amber-500/20" },
  scheduled: { label: "Upcoming", cls: "bg-slate-700/50 text-slate-400 border-white/10" },
  completed: { label: "Completed", cls: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20" },
  missed: { label: "Missed", cls: "bg-red-500/15 text-red-400 border-red-500/20" },
  skipped: { label: "Skipped", cls: "bg-orange-500/15 text-orange-400 border-orange-500/20" },
  cancelled: { label: "Cancelled", cls: "bg-red-500/15 text-red-400 border-red-500/20" },
};

const getS = (s) => (s || "").toLowerCase();
const getMeta = (s) => STATUS_META[getS(s)] || STATUS_META.scheduled;
const patientDisplay = (appt) => appt?.patient?.name || appt?.patientName || "Patient";

export default function DoctorDashboardPage() {
  const { user, updateProfile, logout } = useAuth();
  const { updateAppointmentStatus, fetchUserData } = useAppContext();

  const [searchParams, setSearchParams] = useSearchParams();
  const [tab, setTabRaw] = useState(searchParams.get("tab") || "Dashboard");
  const setTab = (t) => { setTabRaw(t); setSearchParams({ tab: t }); };
  
  const [queue, setQueue] = useState([]);
  const [loadingQ, setLoadingQ] = useState(false);
  const [skippingId, setSkippingId] = useState(null);

  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || "");
  const [editFee, setEditFee] = useState(user?.doctorProfile?.consultationFee || "");
  const [editSpecialization, setEditSpec] = useState(user?.doctorProfile?.specialization || "");
  const [editExperience, setEditExp] = useState(user?.doctorProfile?.experience || "");

  const [sharedReports, setSharedReports] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loadingShared, setLoadingShared] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);

  const [questionsList, setQuestionsList] = useState([]);
  const [loadingQ2, setLoadingQ2] = useState(false);
  const [answerText, setAnswerText] = useState({});
  const [answeringId, setAnsweringId] = useState(null);

  const [activeNotesPatient, setActiveNotesPatient] = useState(null);
  const [activeAppointmentId, setActiveAppointmentId] = useState(null);
  const [savingNote, setSavingNote] = useState(false);
  
  // Prescription State
  const [diagnosis, setDiagnosis] = useState("");
  const [advice, setAdvice] = useState("");
  const [medicines, setMedicines] = useState([{ name: "", dosage: "", frequency: "", duration: "" }]);
  const [followUp, setFollowUp] = useState("");

  const addMedicine = () => setMedicines([...medicines, { name: "", dosage: "", frequency: "", duration: "" }]);
  const removeMedicine = (index) => setMedicines(medicines.filter((_, i) => i !== index));
  const updateMedicine = (index, field, val) => {
    const newMeds = [...medicines];
    newMeds[index][field] = val;
    setMedicines(newMeds);
  };

  const fetchQueue = useCallback(async () => {
    setLoadingQ(true);
    try {
      const today = new Date().toISOString().split("T")[0];
      const res = await api.get(`/api/appointments/doctor?date=${today}`);
      const raw = res.data.appointments || [];
      // Rule: sorting strictly by token for the queue
      raw.sort((a, b) => (a.tokenNumber || 0) - (b.tokenNumber || 0));
      setQueue(raw);
    } catch (err) {
      console.error("Failed to load queue", err);
    } finally {
      setLoadingQ(false);
    }
  }, []);

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 30000);
    return () => clearInterval(interval);
  }, [fetchQueue]);

  useEffect(() => {
    if (tab === "Reviews") {
      setLoadingReviews(true);
      const doctorDocId = user?.doctorProfile?._id || user?.doctorProfile?.id || user._id || user.id;
      api.get(`/api/feedback/doctor/${doctorDocId}`)
        .then(r => setReviews(r.data || []))
        .catch(console.error)
        .finally(() => setLoadingReviews(false));
    }
    if (tab === "Shared Reports") {
      setLoadingShared(true);
      api.get("/api/lab-tests/shared")
        .then(r => setSharedReports(r.data || []))
        .catch(console.error)
        .finally(() => setLoadingShared(false));
    }
    if (tab === "Questions") {
      setLoadingQ2(true);
      api.get("/api/questions")
        .then(r => setQuestionsList(r.data || []))
        .catch(console.error)
        .finally(() => setLoadingQ2(false));
    }
  }, [tab, user]);

  if (!user || user.role !== "doctor") return <Navigate to="/dashboard" replace />;

  const handleStatus = async (id, status) => {
    try {
      await api.put(`/api/appointments/${id}/status`, { status });
      await fetchQueue();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update status");
    }
  };

  const handleSkip = async (id) => {
    setSkippingId(id);
    try {
      await api.put(`/api/appointments/${id}/skip`);
      await fetchQueue();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to skip");
    } finally {
      setSkippingId(null);
    }
  };

  const handleAnswer = async (id) => {
    if (!answerText[id]?.trim()) return;
    setAnsweringId(id);
    try {
      await api.put(`/api/questions/${id}/answer`, { answer: answerText[id] });
      const r = await api.get("/api/questions");
      setQuestionsList(r.data || []);
      setAnswerText(p => ({ ...p, [id]: "" }));
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to submit answer");
    } finally {
      setAnsweringId(null);
    }
  };

  const handleSavePrescription = async () => {
    if (!diagnosis) return alert("Please enter a diagnosis.");
    setSavingNote(true);
    try {
      const doc = new jsPDF();
      doc.setFillColor(15, 23, 42); 
      doc.rect(0, 0, 210, 40, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.text("APOLLO CARE", 20, 25);
      doc.setFontSize(10);
      doc.text("DIGITAL PRESCRIPTION", 150, 25);
      
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("PATIENT INFORMATION", 20, 55);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`Name: ${activeNotesPatient.name || "N/A"}`, 20, 65);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 140, 65);
      doc.text(`Doctor: Dr. ${user.name}`, 20, 72);
      
      doc.setDrawColor(226, 232, 240);
      doc.line(20, 80, 190, 80);
      
      doc.setFont("helvetica", "bold");
      doc.text("DIAGNOSIS", 20, 95);
      doc.setFont("helvetica", "normal");
      doc.text(diagnosis, 20, 105, { maxWidth: 170 });

      doc.setFont("helvetica", "bold");
      doc.text("MEDICINES", 20, 125);
      let y = 135;
      medicines.filter(m => m.name).forEach((m, i) => {
        if (y > 250) { doc.addPage(); y = 20; }
        doc.setFont("helvetica", "bold");
        doc.text(`${i+1}. ${m.name}`, 20, y);
        doc.setFont("helvetica", "normal");
        doc.text(`${m.dosage} - ${m.frequency} (${m.duration})`, 30, y + 5);
        y += 15;
      });

      doc.setFont("helvetica", "bold");
      doc.text("ADVICE & NOTES", 20, y + 10);
      doc.setFont("helvetica", "normal");
      doc.text(advice || "None", 20, y + 20, { maxWidth: 170 });

      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text("Electronically generated prescription. No signature required.", 20, 280);

      const pdfBlob = doc.output('blob');
      const pdfFile = new File([pdfBlob], `Prescription_${Date.now()}.pdf`, { type: 'application/pdf' });
      
      const formData = new FormData();
      formData.append('file', pdfFile);
      formData.append('patientId', activeNotesPatient.id);
      formData.append('title', 'Consultation Prescription');
      formData.append('description', `Prescription from Dr. ${user.name} for ${diagnosis}`);

      const recordRes = await api.post("/api/records/doctor-note", formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const recordId = recordRes.data.record?._id;

      await api.post("/api/prescriptions", {
        patientId: activeNotesPatient.id,
        appointmentId: activeAppointmentId,
        diagnosis,
        medicines: medicines.filter(m => m.name),
        advice,
        followUpDate: followUp || null,
        recordId: recordId
      });

      setActiveNotesPatient(null);
      setDiagnosis("");
      setAdvice("");
      setMedicines([{ name: "", dosage: "", frequency: "", duration: "" }]);
      setFollowUp("");
      alert("Prescription saved and document sent to patient!");
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to save prescription.");
    } finally {
      setSavingNote(false);
    }
  };

  const saveProfile = async () => {
    try {
      const res = await api.put("/api/doctors/profile", {
        name: editName,
        consultationFee: editFee,
        specialization: editSpecialization,
        experience: editExperience,
      });

      if (res.data.doctor && res.data.doctor.user) {
        const updatedUser = {
          ...res.data.doctor.user,
          doctorProfile: { ...res.data.doctor }
        };
        delete updatedUser.doctorProfile.user;
        updateProfile(updatedUser);
      }
      await fetchUserData();
      setEditing(false);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update profile.");
    }
  };

  // Calculate queue based on required rules (waiting and active only, sorted by token)
  const sortedActiveWaiting = queue
    .filter(a => ["active", "waiting"].includes(getS(a.status)))
    .sort((a, b) => (a.tokenNumber || 0) - (b.tokenNumber || 0));

  const active = queue.find(a => getS(a.status) === "active");
  const liveAppt = active || sortedActiveWaiting[0];
  
  const waitingQ = sortedActiveWaiting;
  const doneQ = queue.filter(q => ["completed", "missed", "skipped", "cancelled"].includes(getS(q.status)));
  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : "—";

  const patientRoster = Array.from(
    new Map(queue.map(q => [q.patient?._id || q.patientId, q])).values()
  ).map(a => ({
    id: a.patient?._id || a.patientId,
    name: patientDisplay(a),
    condition: a.symptoms || "General Visit",
    lastVisit: a.date ? new Date(a.date).toLocaleDateString() : "—",
    status: a.status,
    appointmentId: a._id || a.id
  }));

  const helpers = { getS, getMeta, patientDisplay };

  return (
    <div className="min-h-screen bg-slate-900 pb-16">
      <DashboardHeader 
        user={user} 
        onEditProfile={() => { setTab("Profile"); setEditing(true); }} 
        onLogout={logout} 
      />

      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 space-y-6">
        <StatsGrid 
          queue={queue} 
          waitingQ={waitingQ} 
          doneQ={doneQ} 
          avgRating={avgRating} 
          icons={{ Users, Clock, CheckCircle, Star }} 
        />

        <DoctorTabs activeTab={tab} onTabChange={setTab} tabs={TABS} />

        {tab === "Dashboard" && (
          <DashboardOverview 
            liveAppt={liveAppt} 
            waitingQ={waitingQ} 
            doneQ={doneQ} 
            queue={queue} 
            onStatusChange={handleStatus} 
            onTabChange={setTab} 
            helpers={helpers} 
          />
        )}

        {tab === "Queue" && (
          <QueueSection 
            loadingQ={loadingQ} 
            queue={queue} 
            onRefresh={fetchQueue} 
            onStatusChange={handleStatus} 
            onSkip={handleSkip} 
            onOpenNotes={(item) => {
              setActiveNotesPatient({ id: item.patient?._id, name: patientDisplay(item) });
              setActiveAppointmentId(item._id || item.id);
            }} 
            skippingId={skippingId} 
            helpers={helpers} 
          />
        )}

        {tab === "Patients" && (
          <PatientRoster 
            patientRoster={patientRoster} 
            onOpenNotes={(p) => {
              setActiveNotesPatient({ id: p.id, name: p.name });
              setActiveAppointmentId(p.appointmentId);
            }} 
            helpers={helpers} 
          />
        )}

        {tab === "Shared Reports" && (
          <SharedReportsSection 
            loadingShared={loadingShared} 
            sharedReports={sharedReports} 
          />
        )}

        {tab === "Questions" && (
          <QuestionsSection 
            loadingQ2={loadingQ2} 
            questionsList={questionsList} 
            answerText={answerText} 
            onAnswerChange={(id, text) => setAnswerText(p => ({ ...p, [id]: text }))} 
            onAnswerSubmit={handleAnswer} 
            answeringId={answeringId} 
          />
        )}

        {tab === "Reviews" && (
          <ReviewsSection 
            loadingReviews={loadingReviews} 
            reviews={reviews} 
            avgRating={avgRating} 
          />
        )}

        {tab === "Profile" && (
          <ProfileSection 
            user={user} 
            editing={editing} 
            editName={editName} 
            editFee={editFee} 
            editSpecialization={editSpecialization} 
            editExperience={editExperience} 
            onEditChange={(field, val) => {
              if (field === 'name') setEditName(val);
              if (field === 'specialization') setEditSpec(val);
              if (field === 'fee') setEditFee(val);
              if (field === 'experience') setEditExp(val);
            }} 
            onSave={saveProfile} 
            onCancel={() => setEditing(false)} 
            onEditStart={() => setEditing(true)} 
          />
        )}
      </div>

      <PrescriptionModal 
        isOpen={!!activeNotesPatient} 
        onClose={() => setActiveNotesPatient(null)} 
        patientName={activeNotesPatient?.name} 
        diagnosis={diagnosis} 
        onDiagnosisChange={setDiagnosis} 
        medicines={medicines} 
        onMedicineChange={updateMedicine} 
        onAddMedicine={addMedicine} 
        onRemoveMedicine={removeMedicine} 
        advice={advice} 
        onAdviceChange={setAdvice} 
        followUp={followUp} 
        onFollowUpChange={setFollowUp} 
        onSave={handleSavePrescription} 
        saving={savingNote} 
      />
    </div>
  );
}