import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Stethoscope, Mail, Lock, Eye, EyeOff,
  User, ShieldCheck, AlertCircle, ArrowRight,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const ROLES = [
  { value: "patient", label: "Patient", icon: User, desc: "Book & manage appointments", color: "sky" },
  { value: "doctor", label: "Doctor", icon: Stethoscope, desc: "Manage schedule & patients", color: "emerald" },
  { value: "admin", label: "Admin", icon: ShieldCheck, desc: "Hospital management", color: "violet" },
];

const ROLE_ACTIVE = {
  patient: "border-sky-500/50 bg-sky-500/15 text-sky-400 ring-2 ring-sky-500/20",
  doctor: "border-emerald-500/50 bg-emerald-500/15 text-emerald-400 ring-2 ring-emerald-500/20",
  admin: "border-violet-500/50 bg-violet-500/15 text-violet-400 ring-2 ring-violet-500/20",
};


export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [role, setRole] = useState("patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Please fill all fields"); return; }
    setLoading(true);
    const result = await login(email, password, role);
    setLoading(false);
    if (result.ok) navigate("/profile");
    else setError(result.error || "Login failed");
  };


  return (
    <div className="flex min-h-screen bg-slate-900">

      {/* Left panel — decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-sky-900 via-sky-800 to-slate-900 flex-col justify-between p-12 relative overflow-hidden">
        {/* Background circles */}
        <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-sky-500/10" />
        <div className="absolute bottom-20 -right-16 h-56 w-56 rounded-full bg-sky-400/10" />
        <div className="absolute top-1/2 left-1/3 h-32 w-32 rounded-full bg-sky-500/15 blur-2xl" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur border border-white/10">
            <Stethoscope className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-white">ApolloCare Health</p>
            <p className="text-[10px] text-sky-300 uppercase tracking-widest">Hospital & Diagnostics</p>
          </div>
        </div>

        <div className="relative z-10 space-y-6">
          <h2 className="text-4xl font-black text-white leading-tight">
            Your Health,<br />
            <span className="text-sky-400">Our Priority</span>
          </h2>
          <p className="text-sky-200/80 text-sm leading-relaxed max-w-xs">
            Integrated appointments, diagnostics, and digital health records — expert care, wherever you are.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[["500+", "Specialists"], ["50K+", "Patients"], ["25+", "Specialities"], ["24/7", "Emergency"]].map(([v, l]) => (
              <div key={l} className="rounded-xl bg-white/[0.08] backdrop-blur border border-white/10 px-4 py-3">
                <p className="text-xl font-bold text-white">{v}</p>
                <p className="text-xs text-sky-300">{l}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs text-sky-400/60">© 2026 ApolloCare Health. All rights reserved.</p>
      </div>

      {/* Right panel — form */}
      <div className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-md space-y-7">

          {/* Mobile logo */}
          <div className="flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-blue-600">
              <Stethoscope className="h-5 w-5 text-white" />
            </div>
            <p className="font-bold text-white">ApolloCare Health</p>
          </div>

          <div>
            <h1 className="text-2xl font-black text-white">Welcome back </h1>
            <p className="text-sm text-slate-400 mt-1">Sign in to your account to continue</p>
          </div>

          {/* Role selector */}
          <div className="grid grid-cols-3 gap-2">
            {ROLES.map((r) => {
              const Icon = r.icon;
              const isActive = role === r.value;
              return (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRole(r.value)}
                  className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-all duration-200 ${
                    isActive ? ROLE_ACTIVE[r.value] : "border-white/10 bg-slate-800/60 text-slate-400 hover:border-white/20 hover:bg-slate-700/60"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <p className="text-xs font-semibold">{r.label}</p>
                </button>
              );
            })}
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-700/50 backdrop-blur-sm py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 transition-all"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type={showPwd ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-700/50 backdrop-blur-sm py-3 pl-10 pr-12 text-sm text-white placeholder:text-slate-500 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 transition-all"
              />
              <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                <input type="checkbox" className="rounded border-slate-600 accent-sky-500" />
                Remember me
              </label>
              <Link to="/forgot-password" size="sm" className="text-sky-400 font-medium hover:underline">Forgot password?</Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 py-3 text-sm font-bold text-white shadow-lg shadow-sky-500/25 hover:from-sky-400 hover:to-blue-500 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-sky-400/30 transition-all duration-300 disabled:opacity-60 disabled:translate-y-0"
            >
              {loading ? "Signing in..." : <>Sign In <ArrowRight className="h-4 w-4" /></>}
            </button>
          </form>


          <p className="text-center text-sm text-slate-400">
            Don't have an account?{" "}
            <Link to="/signup" className="font-semibold text-sky-400 hover:underline">Create account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}