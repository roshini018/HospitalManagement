import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Stethoscope, User, ShieldCheck, ArrowRight, ArrowLeft, AlertCircle, CheckCircle2 } from "lucide-react";

const ROLES = [
  { value: "patient", label: "Patient", icon: User, desc: "Book appointments & track health", color: "sky" },
  { value: "doctor", label: "Doctor", icon: Stethoscope, desc: "Manage your practice", color: "emerald" }
 
];

const ROLE_ACTIVE = {
  patient: "border-sky-500/50 bg-sky-500/15 text-sky-400 ring-2 ring-sky-500/20",
  doctor: "border-emerald-500/50 bg-emerald-500/15 text-emerald-400 ring-2 ring-emerald-500/20"
  
};

const inputCls = "w-full rounded-xl border border-white/10 bg-slate-700/50 backdrop-blur-sm px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 transition-all";

export default function SignupPage() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [step, setStep] = useState(1);
  const [role, setRole] = useState("patient");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [dob, setDob] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [address, setAddress] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validateStep1 = () => {
    if (!name) return "Full name is required";
    if (!email) return "Email is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    if (password !== confirm) return "Passwords do not match";
    return "";
  };

  const nextStep = () => {
    const err = validateStep1();
    if (err) { setError(err); return; }
    setError("");
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await signup({ name, email, password, phone, role,
      ...(role === "patient" && { patientProfile: { bloodGroup, dob, weight, height, address } }),
      ...(role === "doctor" && { doctorProfile: { specialization } }),
    });
    setLoading(false);
    if (res.ok) navigate("/profile");
    else setError(res.error || "Signup failed");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4 py-12">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 shadow-lg shadow-sky-500/30">
            <Stethoscope className="h-5 w-5 text-white" />
          </div>
          <p className="font-bold text-white text-lg">ApolloCare Health</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-slate-800/60 backdrop-blur-xl p-8 shadow-xl shadow-black/30 space-y-6">

          {/* Step indicator */}
          <div className="flex items-center gap-3">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all ${
                  step > s ? "bg-emerald-500 text-white" : step === s ? "bg-sky-500 text-white" : "bg-slate-700 text-slate-500"
                }`}>
                  {step > s ? <CheckCircle2 className="h-4 w-4" /> : s}
                </div>
                <span className={`text-xs font-medium ${step === s ? "text-white" : "text-slate-500"}`}>
                  {s === 1 ? "Account Info" : "Profile Setup"}
                </span>
                {s === 1 && <div className={`h-px w-8 ${step > 1 ? "bg-emerald-500/50" : "bg-slate-700"}`} />}
              </div>
            ))}
          </div>

          <div>
            <h1 className="text-xl font-black text-white">
              {step === 1 ? "Create your account" : "Complete your profile"}
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              {step === 1 ? "Fill in your basic information" : "A few more details to get started"}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-4">
              {/* Role */}
              <div className="grid grid-cols-3 gap-2">
                {ROLES.map((r) => {
                  const Icon = r.icon;
                  return (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => setRole(r.value)}
                      className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-xs font-semibold transition-all ${
                        role === r.value ? ROLE_ACTIVE[r.value] : "border-white/10 bg-slate-700/40 text-slate-400 hover:bg-slate-700/60"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {r.label}
                    </button>
                  );
                })}
              </div>

              <input placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
              <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
              <input placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} />
              <input type="password" placeholder="Password (min 6 chars)" value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} />
              <input type="password" placeholder="Confirm Password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className={inputCls} />

              <button
                type="button"
                onClick={nextStep}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 py-3 text-sm font-bold text-white shadow-lg shadow-sky-500/25 hover:from-sky-400 hover:to-blue-500 hover:-translate-y-0.5 transition-all duration-300"
              >
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {role === "patient" && (
                <>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Blood Group</label>
                    <select value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} className={inputCls}>
                      <option value="">Select blood group</option>
                      {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(g => <option key={g}>{g}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Date of Birth</label>
                    <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className={inputCls} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Weight (kg)</label>
                      <input type="number" placeholder="e.g. 70" value={weight} onChange={(e) => setWeight(e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Height (cm)</label>
                      <input type="number" placeholder="e.g. 175" value={height} onChange={(e) => setHeight(e.target.value)} className={inputCls} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Address</label>
                    <textarea 
                      placeholder="Home Address" 
                      value={address} 
                      onChange={(e) => setAddress(e.target.value)} 
                      className={inputCls + " h-20 resize-none"}
                    />
                  </div>
                </>
              )}
              {role === "doctor" && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Specialization</label>
                  <select value={specialization} onChange={(e) => setSpecialization(e.target.value)} className={inputCls}>
                    <option value="">Select specialization</option>
                    {["Cardiology", "Neurology", "Orthopedics", "Oncology", "Pediatrics", "Dermatology", "General Medicine"].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              )}
              

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => { setStep(1); setError(""); }}
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-700/40 px-5 py-3 text-sm font-semibold text-slate-300 hover:bg-slate-700/60 transition-all"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-emerald-500 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60"
                >
                  {loading ? "Creating..." : <><CheckCircle2 className="h-4 w-4" /> Create Account</>}
                </button>
              </div>
            </form>
          )}
        </div>

        <p className="mt-5 text-center text-sm text-slate-400">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-sky-400 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}