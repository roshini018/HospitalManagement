import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";
import { useAppContext } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";

// Local Components
import DashboardHeader from "../components/patient/DashboardHeader";
import DashboardHome from "../components/patient/DashboardHome";
import AppointmentsSection from "../components/patient/AppointmentsSection";
import RecordsSection from "../components/patient/RecordsSection";
import ProfileSection from "../components/patient/ProfileSection";
import EditProfileModal from "../components/patient/EditProfileModal";

// Common Components
import ChangePassword from "../components/common/ChangePassword";

// Icons for stats (passing to StatsGrid via DashboardHome)
import { CalendarDays, FlaskConical, FileText, Hospital } from "lucide-react";

const TABS = ["Dashboard", "Appointments", "Records", "Profile", "Security"];

const STAT_CARDS = (upcoming, myReports, myRecords) => [
  { label: "Upcoming", value: upcoming.length, bg: "bg-sky-600", text: "text-white", icon: <CalendarDays className="h-5 w-5" /> },
  { label: "Reports", value: (myReports || []).length, bg: "bg-emerald-600", text: "text-white", icon: <FlaskConical className="h-5 w-5" /> },
  { label: "Prescription", value: (myRecords || []).length, bg: "bg-violet-600", text: "text-white", icon: <FileText className="h-5 w-5" /> },
  { label: "Total Visits", value: (upcoming.length + (myRecords?.length || 0)), bg: "bg-amber-500", text: "text-white", icon: <Hospital className="h-5 w-5" /> },
];

export default function PatientDashboardPage() {
  const {
    appointments, downloadPrescription,
    myRecords, myReports, myPrescriptions, fetchUserData
  } = useAppContext();
  const { user, updateProfile } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "Dashboard");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    age: user?.age || "",
    bloodGroup: user?.bloodGroup || "",
    weight: user?.weight || "",
    height: user?.height || "",
    address: user?.address || "",
  });

  useEffect(() => {
    setActiveTab(searchParams.get("tab") || "Dashboard");
    if (user) {
      setEditFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        age: user.age || "",
        bloodGroup: user.bloodGroup || "",
        weight: user.weight || "",
        height: user.height || "",
        address: user.address || "",
      });
    }
  }, [searchParams, user]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const getStatus = (s) => (s || "").toLowerCase();

  const myAppointments = (appointments || []).filter(a => {
    const pId = a.patient?._id || a.patient;
    const uId = user?._id || user?.id;
    return (pId && uId && pId.toString() === uId.toString()) || a.patientName === user?.name;
  });

  const upcoming = myAppointments.filter(a =>
    ["scheduled", "waiting", "active"].includes(getStatus(a.status))
  );

  const history = myAppointments.filter(a =>
    ["completed", "cancelled", "skipped", "missed"].includes(getStatus(a.status))
  );

  const handleUpdateProfile = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setUpdating(true);
    try {
      const res = await updateProfile(editFormData);
      // Depending on how updateProfile is implemented now (it might return response or just perform the operation)
      // I'll stick to a safe check or assume success if no error thrown
      setIsEditModalOpen(false);
    } catch (err) {
      console.error("Failed to update profile", err);
      // Consider adding some alert or feedback here if needed, but keeping logic same
    } finally {
      setUpdating(false);
    }
  };

  const stats = STAT_CARDS(upcoming, myReports, myRecords);
  stats[2].value = (myPrescriptions || []).length;
  stats[3].value = upcoming.length + (myRecords?.length || 0) + (myPrescriptions?.length || 0);

  return (
    <main className="min-h-screen bg-slate-900 pb-16 font-primary text-white">
      <DashboardHeader 
        user={user} 
        activeTab={activeTab} 
        onTabChange={handleTabChange} 
        tabs={TABS} 
      />

      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 space-y-10">
        {activeTab === "Dashboard" && (
          <DashboardHome 
            stats={stats} 
            user={user} 
            upcoming={upcoming} 
            fetchUserData={fetchUserData} 
            myReports={myReports} 
          />
        )}

        {activeTab === "Appointments" && (
          <AppointmentsSection 
            upcoming={upcoming} 
            history={history} 
            appointments={appointments} 
            fetchUserData={fetchUserData} 
            getStatus={getStatus} 
          />
        )}

        {activeTab === "Records" && (
          <RecordsSection 
            myPrescriptions={myPrescriptions} 
            myRecords={myRecords} 
            myReports={myReports} 
            downloadPrescription={downloadPrescription} 
          />
        )}

        {activeTab === "Profile" && (
          <ProfileSection 
            user={user} 
            onEditClick={() => setIsEditModalOpen(true)} 
          />
        )}

        {activeTab === "Security" && (
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <ChangePassword />
          </div>
        )}
      </div>

      <EditProfileModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        formData={editFormData} 
        onFormChange={setEditFormData} 
        onSubmit={handleUpdateProfile} 
        updating={updating} 
      />
    </main>
  );
}