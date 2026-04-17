import { 
  MapPin, Star, Stethoscope, Heart, Brain, Bone, Ribbon, Baby, 
  Leaf, Syringe, Ear, Eye, Activity, Radiation, Droplets, Pill 
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const SPECIALTY_ICON_MAP = {
  Cardiology: { icon: Heart, color: "from-rose-500/20 to-red-600/20", accent: "text-rose-400" },
  Neurology: { icon: Brain, color: "from-violet-500/20 to-indigo-600/20", accent: "text-violet-400" },
  Orthopedics: { icon: Bone, color: "from-amber-400/20 to-orange-600/20", accent: "text-amber-400" },
  Oncology: { icon: Ribbon, color: "from-pink-500/20 to-rose-600/20", accent: "text-pink-400" },
  Pediatrics: { icon: Baby, color: "from-sky-400/20 to-blue-500/20", accent: "text-sky-400" },
  Dermatology: { icon: Leaf, color: "from-emerald-400/20 to-green-500/20", accent: "text-emerald-400" },
  Gynecology: { icon: Syringe, color: "from-fuchsia-400/20 to-purple-600/20", accent: "text-fuchsia-400" },
  ENT: { icon: Ear, color: "from-indigo-400/20 to-blue-600/20", accent: "text-indigo-400" },
  Ophthalmology: { icon: Eye, color: "from-cyan-400/20 to-teal-500/20", accent: "text-cyan-400" },
  Psychiatry: { icon: Activity, color: "from-violet-400/20 to-purple-700/20", accent: "text-violet-400" },
  Radiology: { icon: Radiation, color: "from-yellow-400/20 to-amber-600/20", accent: "text-yellow-400" },
  Urology: { icon: Droplets, color: "from-blue-500/20 to-sky-600/20", accent: "text-blue-400" },
  Endocrinology: { icon: Pill, color: "from-rose-400/20 to-red-500/20", accent: "text-rose-400" },
  default: { icon: Stethoscope, color: "from-slate-600/20 to-slate-800/20", accent: "text-slate-400" },
};

export default function DoctorCard({ doctor, showButton = true }) {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleBook = () => {
    if (!isAuthenticated) return navigate("/login");
    navigate(`/appointments?doctorId=${doctor?._id || doctor?.id}`);
  };

  const theme = SPECIALTY_ICON_MAP[doctor?.specialization] || SPECIALTY_ICON_MAP.default;
  const Icon = theme.icon;

  // Initial calculation logic
  const docName = doctor?.user?.name || "Doctor";
  const cleanName = docName.replace(/^(Dr\.|Dr|Mr\.|Mr|Ms\.|Ms)\s*/i, "");
  const initial = cleanName.charAt(0).toUpperCase();

  return (
    <article className="group relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-800/40 backdrop-blur-xl shadow-2xl shadow-black/40 hover:shadow-sky-500/10 hover:border-white/20 transition-all duration-500">
      
      {/* Top Banner Accent */}
      <div className={`h-24 w-full bg-gradient-to-br transition-all duration-700 ${theme.color}`} />

      <div className="relative px-6 pb-6 -mt-12">
        
        {/* Profile Image / Initial Section */}
        <div className="relative inline-block mb-4">
          <div className="flex h-24 w-24 items-center justify-center rounded-[2rem] bg-slate-900 border-4 border-slate-800/80 shadow-2xl text-3xl font-black text-white group-hover:scale-105 group-hover:rotate-1 transition-all duration-500">
            {initial}
            <div className={`absolute inset-0 rounded-[2rem] bg-gradient-to-br ${theme.color} opacity-40`} />
          </div>
          
          {/* Availability Pulse Badge */}
          <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-xl bg-slate-900 border-2 border-slate-800 p-1">
             <div className="h-full w-full rounded-lg bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)] flex items-center justify-center">
                <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
             </div>
          </div>
        </div>

        {/* Speciality Icon Badge (Floating Right) */}
        <div className="absolute top-0 right-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-xl group-hover:-translate-y-1 transition-transform">
           <Icon className={`h-6 w-6 ${theme.accent}`} strokeWidth={1.5} />
        </div>

        {/* Info Content */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-500">Certified Expert</span>
              <div className="h-px flex-1 bg-white/5" />
            </div>
            <h3 className="text-xl font-black text-white tracking-tight mt-1 group-hover:text-sky-400 transition-colors">
              {docName.toLowerCase().startsWith("dr") ? docName : `Dr. ${docName}`}
            </h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">{doctor.specialization || "Expert Practitioner"}</p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-2 py-3 border-y border-white/5">
            <div className="text-center">
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Experience</p>
              <p className="text-sm font-black text-white">{doctor.experience || 0}y</p>
            </div>
            <div className="w-px h-full bg-white/5 mx-auto" />
            <div className="text-center">
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-0.5">Public Rating</p>
              <div className="flex items-center justify-center gap-1.5">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <p className="text-sm font-black text-white">{doctor.rating || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Location / Fee */}
          <div className="flex items-center gap-3">
            <div className="flex flex-1 items-center gap-2 rounded-2xl bg-white/[0.03] border border-white/5 px-4 py-3 group-hover:bg-white/[0.05] transition-colors">
              <MapPin className="h-4 w-4 text-emerald-500" />
              <div className="min-w-0">
                 <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Base Practice</p>
                 <p className="text-[11px] font-black text-white truncate">{doctor.location || "On-site"}</p>
              </div>
            </div>
            <div className="flex flex-1 flex-col items-center justify-center rounded-2xl bg-sky-500/10 border border-sky-500/20 py-2.5 px-3">
              <p className="text-[8px] font-black text-sky-400 uppercase tracking-widest mb-0.5">Consult Fee</p>
              <p className="text-lg font-black text-white tracking-tighter">₹{doctor.consultationFee || doctor.fee || 0}</p>
            </div>
          </div>

          {/* Action Button */}
          {showButton && (!user || user.role === "patient") && (
            <button
              onClick={handleBook}
              className="group/btn relative w-full overflow-hidden rounded-[1.25rem] bg-white p-[1px] shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]">
              <div className="relative flex items-center justify-center gap-2 rounded-[1.2rem] bg-slate-900 px-6 py-4 text-xs font-black uppercase tracking-widest text-white transition-all group-hover/btn:bg-transparent group-hover/btn:text-slate-900">
                <span className="relative z-10 transition-colors duration-500">Book Consult</span>
                <div className="absolute inset-0 z-0 bg-white translate-y-20 group-hover/btn:translate-y-0 transition-transform duration-500 ease-out" />
              </div>
            </button>
          )}
        </div>
      </div>
    </article>
  );
}