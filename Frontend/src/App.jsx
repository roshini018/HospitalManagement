import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import DoctorSearchPage from "./pages/DoctorSearchPage";
// DoctorProfilePage has been refactored into DoctorDashboardPage as per layout consolidation
import AppointmentBookingPage from "./pages/AppointmentBookingPage";
import HealthFeedPage from "./pages/HealthFeedPage";
import LabServicesPage from "./pages/LabServicesPage";
import AskExpertPage from "./pages/AskExpertPage";
import FeedbackPage from "./pages/FeedbackPage";
import PatientDashboardPage from "./pages/PatientDashboardPage";
import DoctorDashboardPage from "./pages/DoctorDashboardPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
// Will be removed after verification
import HealthRecordPage from "./pages/HealthRecordPage";

import { Loader2 } from "lucide-react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { AppProvider } from "./context/AppContext";
import { ThemeProvider } from "./context/ThemeContext";

/* ── Role-based profile redirect ─────────────────────────── */
function ProfileRouter() {
  const { user, isLoading } = useAuth();
  if (isLoading) return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900">
      <Loader2 className="h-10 w-10 animate-spin text-sky-500" />
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === "doctor") return <Navigate to="/dashboard" replace />;
  if (user.role === "admin") return <AdminDashboardPage />;
  return <Navigate to="/dashboard?tab=Profile" replace />;
}

/* ── Role-based dashboard redirect ───────────────────────── */
function DashboardRouter() {
  const { user, isLoading } = useAuth();
  if (isLoading) return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900">
      <Loader2 className="h-10 w-10 animate-spin text-sky-500" />
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === "doctor") return <DoctorDashboardPage />;
  if (user.role === "admin") return <AdminDashboardPage />;
  return <PatientDashboardPage />;
}

/* ── Health records: patient + doctor only ────────────────── */
function HealthRecordRouter() {
  const { user, isLoading } = useAuth();
  if (isLoading) return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900">
      <Loader2 className="h-10 w-10 animate-spin text-sky-500" />
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  return <HealthRecordPage />;
}

function ProtectedRouter({ children }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900">
      <Loader2 className="h-10 w-10 animate-spin text-sky-500" />
    </div>
  );
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppProvider>
            <Navbar />

            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />

              <Route path="/doctors" element={<DoctorSearchPage />} />
              {/* Profile view consolidated into dashboard, public views routed back to search for now */}
              <Route path="/doctor/:id" element={<Navigate to="/doctors" replace />} />

              <Route path="/appointments" element={<ProtectedRouter><AppointmentBookingPage /></ProtectedRouter>} />
              <Route path="/health-feed" element={<HealthFeedPage />} />
              <Route path="/lab-services" element={<ProtectedRouter><LabServicesPage /></ProtectedRouter>} />
              <Route path="/ask-expert" element={<AskExpertPage />} />
              <Route path="/feedback" element={<FeedbackPage />} />

              {/* Role-guarded */}
              <Route path="/health-records" element={<HealthRecordRouter />} />
              <Route path="/dashboard" element={<DashboardRouter />} />
              <Route path="/profile" element={<ProfileRouter />} />

              {/* Direct admin route */}
              <Route path="/admin" element={<AdminDashboardPage />} />
            </Routes>

            <Footer />
          </AppProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;