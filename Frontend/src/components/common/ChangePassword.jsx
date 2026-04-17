import { useState } from "react";
import { Lock, Eye, EyeOff, Loader2, CheckCircle2, ShieldCheck } from "lucide-react";
import api from "../../services/api";

const inputCls = "w-full rounded-2xl bg-slate-700/50 border border-white/10 px-4 py-3.5 text-sm text-white focus:border-sky-500 transition-all outline-none";

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      return setError("Passwords do not match");
    }
    if (newPassword.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    setLoading(true);
    try {
      await api.put("/api/auth/change-password", { currentPassword, newPassword });
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-[2.5rem] bg-slate-800/40 border border-white/10 p-8 md:p-10 shadow-2xl overflow-hidden relative backdrop-blur-xl">
      <div className="absolute top-0 right-0 p-8 opacity-5">
        <ShieldCheck className="h-24 w-24 text-white" />
      </div>

      <div className="relative z-10 max-w-md">
        <h2 className="text-2xl font-black text-white flex items-center gap-3 mb-2">
          <Lock className="h-6 w-6 text-sky-400" /> Security
        </h2>
        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-8">Update your account password</p>

        {success && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400 animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="h-4 w-4" /> Password updated successfully!
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-400 animate-in fade-in slide-in-from-top-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Current Password</label>
            <div className="relative">
              <input
                type={showPwd ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className={inputCls}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">New Password</label>
            <div className="relative">
              <input
                type={showPwd ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className={inputCls}
                placeholder="Min. 6 characters"
                required
              />
              <button 
                type="button" 
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
              >
                {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">Confirm New Password</label>
            <input
              type={showPwd ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={inputCls}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-sky-500 py-4 text-xs font-black text-white shadow-xl shadow-sky-500/20 hover:scale-[1.02] active:scale-95 transition-all flex justify-center items-center gap-2"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
