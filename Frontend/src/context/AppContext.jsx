import { createContext, useContext, useMemo, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { jsPDF } from "jspdf";
import api from "../services/api";

const AppContext = createContext();

export function AppProvider({ children }) {
  const { user } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [myRecords, setMyRecords] = useState([]);
  const [myReports, setMyReports] = useState([]);
  const [myPrescriptions, setMyPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch notifications from real API when user is logged in
  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }
    const fetchNotifications = async () => {
      try {
        const res = await api.get("/api/notifications");
        setNotifications(res.data.notifications || []);
      } catch {
        setNotifications([]);
      }
    };
    fetchNotifications();
  }, [user]);

  const fetchAppointments = useCallback(async () => {
    if (!user || !user.role) return;
    try {
      const appointmentPath =
        user.role === "doctor"
          ? "/api/appointments/doctor"
          : user.role === "admin"
          ? "/api/appointments/all"
          : "/api/appointments/my";
      const res = await api.get(appointmentPath);
      setAppointments(res.data.appointments || []);
    } catch (err) {
      console.error("Failed to fetch appointments", err);
    }
  }, [user]);

  // Fetch core app data
  const fetchUserData = useCallback(async () => {
    setLoading(true);
    try {
      let isPatient = user?.role === "patient";
      let isLoggedIn = Boolean(user && user.role);

      const [docsRes, recordsRes, reportsRes, prescRes] = await Promise.all([
        api.get("/api/doctors"), 
        (isLoggedIn && isPatient) ? api.get("/api/records/my") : Promise.resolve({ data: { records: [] } }),
        (isLoggedIn && isPatient) ? api.get("/api/lab-tests/my") : Promise.resolve({ data: [] }),
        (isLoggedIn && isPatient) ? api.get("/api/prescriptions/my") : Promise.resolve({ data: { prescriptions: [] } }),
      ]);

      setDoctors(docsRes.data.doctors || []);
      setMyRecords(recordsRes.data.records || []);
      setMyReports(reportsRes.data || []);
      setMyPrescriptions(prescRes.data.prescriptions || []);
      
      // Also fetch appointments
      await fetchAppointments();
    } catch (err) {
      console.error("Failed to fetch app data", err);
    } finally {
      setLoading(false);
    }
  }, [user, fetchAppointments]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const addNotification = useCallback((message) => {
    setNotifications((prev) => [
      { id: `n${Date.now()}`, message, read: false, time: "Just now" },
      ...prev,
    ]);
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
  }, []);

  const bookAppointment = useCallback(
    async (data) => {
      try {
        const res = await api.post("/api/appointments", data);
        const appointment = res.data.appointment;
        
        // Refresh latest appointments from server to ensure sync
        await fetchAppointments();
        
        const doctorName = appointment?.doctor?.user?.name || "Doctor";
        const time = appointment?.timeSlot || appointment?.time || "time";
        const token = res.data.tokenNumber || appointment?.tokenNumber || "N/A";

        addNotification(
          `Appointment booked for ${doctorName} at ${time}. Token #${token}`
        );
        return { success: true, data: appointment };
      } catch (err) {
        const msg = err?.response?.data?.message || "Booking failed";
        addNotification(`Booking error: ${msg}`);
        return { success: false, message: msg };
      }
    },
    [addNotification, fetchAppointments]
  );

  const updateAppointmentStatus = useCallback(
    async (id, newStatus) => {
      try {
        const res = await api.put(`/api/appointments/${id}/status`, { status: newStatus });
        const updated = res.data;
        setAppointments((prev) =>
          prev.map((a) => (a._id === id || a.id === id ? { ...a, status: newStatus } : a))
        );
        addNotification(`Appointment marked as ${newStatus}`);
        return { success: true };
      } catch (err) {
        return { success: false, message: err?.response?.data?.message || "Status update failed" };
      }
    },
    [addNotification]
  );

  const downloadPrescription = useCallback((record) => {
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
    const patientName = record.patientName || record.patient?.name || "N/A";
    const doctorName = record.doctorName || record.doctor?.user?.name || record.doctorName || "N/A";
    
    doc.text(`Name: ${patientName}`, 20, 65);
    doc.text(`Date: ${record.date || new Date(record.createdAt).toLocaleDateString() || "N/A"}`, 140, 65);
    doc.text(`Doctor: ${doctorName}`, 20, 72);
    doc.setDrawColor(226, 232, 240);
    doc.line(20, 80, 190, 80);
    doc.setFont("helvetica", "bold");
    doc.text("DIAGNOSIS & CLINICAL NOTES", 20, 95);
    doc.setFont("helvetica", "normal");
    doc.text(record.diagnosis || record.problem || "General Checkup", 20, 105);
    doc.setFont("helvetica", "bold");
    doc.text("PRESCRIPTION / MEDICINES", 20, 125);
    doc.setFont("helvetica", "normal");
    
    let medsText = record.prescription || "";
    if (!medsText && record.medicines && Array.isArray(record.medicines)) {
      medsText = record.medicines.map(m => `${m.name} (${m.dosage}) - ${m.frequency}`).join("\n");
    }
    if (!medsText) medsText = "Monitor symptoms and rest.";

    doc.text(medsText, 20, 135);
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text("Electronically generated prescription. No signature required.", 20, 280);
    doc.save(`Prescription_${record.id || Date.now()}.pdf`);
  }, []);

  const addDoctor = useCallback(async (doc) => {
    try {
      const res = await api.post("/api/admin/doctors", doc);
      setDoctors((prev) => [...prev, res.data.doctor]);
      addNotification(`New doctor added: ${doc.name}`);
    } catch (err) {
      addNotification(`Error adding doctor: ${err?.response?.data?.message || err.message}`);
    }
  }, [addNotification]);

  const removeDoctor = useCallback(async (id) => {
    try {
      await api.delete(`/api/admin/doctors/${id}`);
      setDoctors((prev) => prev.filter((d) => d._id !== id && d.id !== id));
      addNotification("Doctor profile removed.");
    } catch (err) {
      addNotification(`Error removing doctor: ${err?.response?.data?.message || err.message}`);
    }
  }, [addNotification]);

  const value = useMemo(
    () => ({
      notifications,
      unreadCount: notifications.filter((n) => !n.read).length,
      markAllRead,
      addNotification,
      doctors,
      addDoctor,
      removeDoctor,
      appointments,
      bookAppointment,
      updateAppointmentStatus,
      downloadPrescription,
      myRecords,
      myReports,
      myPrescriptions,
      loading,
      fetchUserData,
    }),
    [notifications, doctors, appointments, myRecords, myReports, myPrescriptions, loading, fetchUserData, markAllRead, addNotification, addDoctor, removeDoctor, bookAppointment, updateAppointmentStatus, downloadPrescription]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppProvider");
  return context;
};