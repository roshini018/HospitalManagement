import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ShieldOff } from "lucide-react";

/* ── Admin blocked view ─────────────────────────────────── */
function AdminBlocked() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-md text-center space-y-5">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-500/15 border border-red-500/25">
          <ShieldOff className="h-9 w-9 text-red-400" />
        </div>
        <div>
          <h1 className="text-xl font-black text-white">Access Restricted</h1>
          <p className="text-sm text-slate-400 mt-2 leading-relaxed">
            Health records are private medical data. Admins do not have access to patient records — only patients and their treating doctors can view this information.
          </p>
        </div>
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-5 py-4 text-left">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">Why this restriction?</p>
          <p className="text-xs text-amber-400/80 leading-relaxed">
            Patient health data is protected under medical privacy laws (HIPAA). Access is limited to the patient themselves and authorised medical staff directly involved in their care.
          </p>
        </div>
      </div>
    </main>
  );
}

/* ── Main export — role router ──────────────────────────── */
export default function HealthRecordPage() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;
  if (user.role === "admin")  return <AdminBlocked />;
  if (user.role === "doctor") return <Navigate to="/dashboard?tab=Shared Reports" replace />;
  // Patients → redirect to the Records tab inside PatientDashboardPage
  return <Navigate to="/dashboard?tab=Records" replace />;
}