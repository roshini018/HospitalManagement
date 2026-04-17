import { useMemo, useState } from "react";
import DoctorCard from "../components/common/DoctorCard";
import { useAppContext } from "../context/AppContext";
import { Search, SlidersHorizontal, Loader2 } from "lucide-react";

const selectCls = "w-full rounded-xl border border-white/10 bg-slate-700/50 backdrop-blur-sm px-3.5 py-2.5 text-sm text-slate-200 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 transition-all";

export default function DoctorSearchPage() {
  const { doctors, loading } = useAppContext();
  const [specialization, setSpecialization] = useState("All");
  const [location, setLocation] = useState("All");
  const [minExperience, setMinExperience] = useState(0);
  const [minRating, setMinRating] = useState(0);

  const specializations = useMemo(() => [...new Set(doctors?.map((d) => d.specialization))].filter(Boolean), [doctors]);
  const locations = useMemo(() => [...new Set(doctors?.map((d) => d.location))].filter(Boolean), [doctors]);

  const filteredDoctors = useMemo(() => {
    console.log("All Doctors inside search:", doctors);
    console.log("Selected specialization:", specialization);
    
    return (doctors || []).filter((d) => {
      const matchSpec = specialization === "All" || (d.specialization && d.specialization.toLowerCase() === specialization.toLowerCase());
      const matchLoc  = location === "All" || (d.location && d.location.toLowerCase() === location.toLowerCase());
      const matchExp  = (d.experience || 0) >= minExperience;
      const matchRating = (d.rating || 0) >= minRating;
      return matchSpec && matchLoc && matchExp && matchRating;
    });
  }, [doctors, specialization, location, minExperience, minRating]);

  if (loading && doctors.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900">
        <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-900 pb-16">

      {/* Header */}
      <div className="border-b border-white/[0.06] bg-slate-800/40 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
          <p className="text-[11px] font-bold uppercase tracking-widest text-sky-400 mb-1">Find Your Doctor</p>
          <h1 className="text-2xl font-black text-white">Doctor Search</h1>
          <p className="text-sm text-slate-400 mt-1">Filter by speciality, experience, rating & location</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 space-y-6">

        {/* Filters */}
        <div className="rounded-2xl border border-white/10 bg-slate-800/60 backdrop-blur-xl p-5 shadow-xl shadow-black/30">
          <div className="flex items-center gap-2 mb-4">
            <SlidersHorizontal className="h-4 w-4 text-sky-400" />
            <h2 className="text-sm font-bold text-white">Filter Doctors</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-4">
            <select className={selectCls} value={specialization} onChange={(e) => setSpecialization(e.target.value)}>
              <option value="All">All Specializations</option>
              {specializations.map((s, i) => <option key={i}>{s}</option>)}
            </select>
            <select className={selectCls} value={location} onChange={(e) => setLocation(e.target.value)}>
              <option value="All">All Locations</option>
              {locations.map((l, i) => <option key={i}>{l}</option>)}
            </select>
            <input
              type="number" min="0" placeholder="Min Experience (yrs)"
              value={minExperience || ""}
              onChange={(e) => setMinExperience(Number(e.target.value) || 0)}
              className={selectCls}
            />
            <input
              type="number" min="0" max="5" step="0.1" placeholder="Min Rating (0–5)"
              value={minRating || ""}
              onChange={(e) => setMinRating(Number(e.target.value) || 0)}
              className={selectCls}
            />
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-400">
            Showing <span className="font-bold text-white">{filteredDoctors.length}</span> doctors
          </p>
          {filteredDoctors.length < doctors.length && (
            <button
              onClick={() => { setSpecialization("All"); setLocation("All"); setMinExperience(0); setMinRating(0); }}
              className="text-xs font-semibold text-sky-400 hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Results */}
        {filteredDoctors.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredDoctors.map((doctor) => (
              <DoctorCard key={doctor._id || doctor.id} doctor={doctor} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-slate-800/40 py-20">
            <Search className="h-10 w-10 text-slate-600 mb-3" />
            <p className="text-slate-400 font-medium">No doctors found</p>
            <p className="text-sm text-slate-500 mt-1">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </main>
  );
}