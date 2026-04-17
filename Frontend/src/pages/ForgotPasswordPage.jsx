import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Loader2, KeyRound, ArrowLeft, CheckCircle2 } from "lucide-react";
import api from "../services/api";

const inputCls = "w-full rounded-xl border border-white/10 bg-slate-800/50 py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 transition-all";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1); // 1: Email, 2: New Password, 3: Success
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    setError("");
    if (!email) return setError("Please enter your email");
    setLoading(true);
    try {
      await api.post("/api/auth/forgot-password", { email });
      setStep(2);
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) return setError("Password must be at least 6 characters");
    setLoading(true);
    try {
      await api.put("/api/auth/reset-password", { email, newPassword: password });
      setStep(3);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-500/10 border border-sky-500/20 mb-4">
            <KeyRound className="h-7 w-7 text-sky-400" />
          </div>
          <h1 className="text-2xl font-black text-white">Reset Password</h1>
          <p className="text-sm text-slate-400 mt-2">
            {step === 1 && "Enter your email to verify your account."}
            {step === 2 && "Set a new secure password for your account."}
            {step === 3 && "Your password has been reset successfully."}
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleVerifyEmail} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputCls}
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-sky-500 py-3 text-sm font-bold text-white hover:bg-sky-400 transition-all flex justify-center items-center gap-2"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify Email"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type={showPwd ? "text" : "password"}
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputCls}
                required
              />
              <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-sky-500 py-3 text-sm font-bold text-white hover:bg-sky-400 transition-all flex justify-center items-center gap-2"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Reset Password"}
            </button>
          </form>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center gap-2 text-emerald-400 py-4">
              <CheckCircle2 className="h-12 w-12" />
              <p className="font-bold">Password Reset Complete!</p>
            </div>
            <Link
              to="/login"
              className="block w-full rounded-xl bg-slate-800 py-3 text-center text-sm font-bold text-white hover:bg-slate-700 transition-all"
            >
              Back to Sign In
            </Link>
          </div>
        )}

        {step !== 3 && (
          <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Sign In
          </Link>
        )}
      </div>
    </div>
  );
}
