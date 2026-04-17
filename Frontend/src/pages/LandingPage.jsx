import React, { useState, useEffect } from "react";
import {
  Ambulance, FlaskConical, Microscope, ShieldPlus, Stethoscope, MapPin,
  ArrowRight, Phone, CalendarCheck, TestTube, MessageCircleQuestion,
  FolderHeart, Heart, Brain, Bone, Ribbon, Baby, Leaf, Syringe,
  Ear, Eye, Pill, Radiation, Droplets, Activity, Package, Search,
  Loader2, AlertCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import DoctorCard from "../components/common/DoctorCard";
import TestimonialSection from "../components/common/Testimonials";
import { useAppContext } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const SPECIALITIES = [
  "Cardiology", "Neurology", "Orthopedics", "Oncology",
  "Pediatrics", "Dermatology", "Gynecology", "ENT",
  "Ophthalmology", "General Medicine", "Psychiatry",
  "Radiology", "Urology", "Endocrinology",
];

const HEALTH_PACKAGES = [
  { name: "Basic Wellness", tests: 20, price: 1999 },
  { name: "Heart Care", tests: 25, price: 2999 },
  { name: "Diabetes Care", tests: 18, price: 2499 },
  { name: "Full Body Checkup", tests: 35, price: 3999 },
  { name: "Senior Citizen Package", tests: 40, price: 4499 },
];

const QUICK_ACTIONS = [
  { label: "Book Appointment", href: "/appointments", icon: CalendarCheck },
  { label: "Lab Tests", href: "/lab-services", icon: TestTube },
  { label: "Ask Expert", href: "/ask-expert", icon: MessageCircleQuestion },
  { label: "Health Records", href: "/health-records", icon: FolderHeart },
];

const SPECIALTY_MAP = {
  Cardiology: { icon: Heart },
  Neurology: { icon: Brain },
  Orthopedics: { icon: Bone },
  Oncology: { icon: Ribbon },
  Pediatrics: { icon: Baby },
  Dermatology: { icon: Leaf },
  Gynecology: { icon: Syringe },
  ENT: { icon: Ear },
  Ophthalmology: { icon: Eye },
  "General Medicine": { icon: Stethoscope },
  Psychiatry: { icon: Activity },
  Radiology: { icon: Radiation },
  Urology: { icon: Droplets },
  Endocrinology: { icon: Pill },
  default: { icon: Stethoscope },
};

export default function LandingPage() {
  const { isAuthenticated, user } = useAuth();
  const { doctors, loading: loadingDoctors } = useAppContext();
  const [feedData, setFeedData] = useState([]);
  const [loadingFeed, setLoadingFeed] = useState(false);

  useEffect(() => {
    const fetchFeed = async () => {
      setLoadingFeed(true);
      try {
        const res = await api.get("/api/feed");
        setFeedData(res.data || []);
      } catch (err) {
        console.error("Failed to fetch feed on landing", err);
      } finally {
        setLoadingFeed(false);
      }
    };
    fetchFeed();
  }, []);

  return (
    <main className="bg-slate-900 overflow-x-hidden w-full" style={{ maxWidth: "100vw", boxSizing: "border-box" }}>

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section className="relative h-screen min-h-[600px] w-full overflow-hidden">

        {/* Animated fallback background */}
        <div className="absolute inset-0 bg-gradient-to-br from-sky-950 via-sky-900 to-slate-900">
          <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-sky-600/20 blur-3xl animate-pulse" />
          <div
            className="absolute bottom-1/3 right-1/4 h-72 w-72 rounded-full bg-blue-500/15 blur-3xl animate-pulse"
            style={{ animationDelay: "1.5s" }}
          />
        </div>

        {/* Hero Video — min-w-full + min-h-full ensures it always covers the full container
            regardless of the video's native aspect ratio. left-1/2 + -translate-x-1/2
            keeps it centered so neither side gets cropped unfairly. */}
        <video
          className="absolute top-0 left-1/2 -translate-x-1/2 min-w-full min-h-full w-auto h-auto object-cover"
          style={{ width: "100vw", height: "100%" }}
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/video/hos.mp4" type="video/mp4" />
        </video>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-slate-900/55" />

        {/* FIX 2: Bottom fade uses dark theme — was bg-gradient-to-t from-white, now from-slate-900 */}
        <div className="absolute bottom-0 left-0 right-0 h-72 bg-gradient-to-t from-slate-900 to-transparent" />

        {/* ── Center content ── */}
        <div className="relative z-10 flex h-full flex-col justify-center px-6 pb-56 md:px-16 lg:px-24 text-white">
          <span className="mb-5 inline-block w-fit rounded-full border border-emerald-400/30 bg-emerald-500/20 px-4 py-1.5 text-xs font-bold tracking-widest text-emerald-300 uppercase">
            Trusted Multi-Speciality Care
          </span>
          <h1 className="max-w-2xl text-4xl font-black leading-tight md:text-6xl">
            Your Health,{" "}
            <span className="text-sky-400">Our Priority</span>
          </h1>
          <p className="mt-5 max-w-xl text-sm text-white/80 leading-relaxed md:text-lg">
            Integrated appointments, diagnostics, and digital records — inspired by leading healthcare networks. Expert care, wherever you are.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {(!user || user.role === "patient") && (
              <Link
                to={isAuthenticated ? "/appointments" : "/login"}
                className="flex items-center gap-2 rounded-xl bg-sky-500 px-6 py-3 text-sm font-bold text-white hover:bg-sky-400 transition-all shadow-lg shadow-sky-500/30 hover:-translate-y-0.5"
              >
                <CalendarCheck className="h-4 w-4" /> Book Appointment
              </Link>
            )}
            <Link
              to="https://maps.app.goo.gl/VFZK2mmZW4cPFhm37"
              className="flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold backdrop-blur-sm hover:bg-white/20 transition-all"
            >
              <MapPin className="h-4 w-4" /> Visit Us
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap gap-8">
            {[
              ["500+", "Specialist Doctors"],
              ["50K+", "Patients Treated"],
              ["25+", "Specialities"],
              ["24/7", "Emergency Care"],
            ].map(([v, l]) => (
              <div key={l}>
                <p className="text-2xl font-black">{v}</p>
                <p className="text-xs text-sky-200 mt-0.5">{l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bottom: search + action buttons ── */}
        <div className="absolute bottom-0 left-0 right-0 z-10 px-4 pb-6 md:px-8 lg:px-16">
          <div className="mx-auto max-w-4xl mb-4">
            <div className="flex items-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 overflow-hidden shadow-2xl">
              <Search className="ml-5 h-5 w-5 text-white/70 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search for Doctors, Specialities and Health Checkups..."
                className="flex-1 bg-transparent px-4 py-4 text-sm text-white placeholder:text-white/60 outline-none"
              />
              <button className="flex-shrink-0 flex items-center justify-center h-12 w-12 m-1 rounded-full bg-sky-500 hover:bg-sky-400 transition-all">
                <Search className="h-4 w-4 text-white" />
              </button>
            </div>
          </div>
          {(!user || user.role === "patient") && (
            <div className="mx-auto max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-2">
              {QUICK_ACTIONS.map((a) => {
                const Icon = a.icon;
                const dest =
                  !isAuthenticated &&
                    ["/appointments", "/lab-services", "/health-records"].includes(a.href)
                    ? "/login"
                    : a.href;
                return (
                  <Link
                    key={a.label}
                    to={dest}
                    className="group flex items-center justify-between gap-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 px-5 py-3.5 hover:bg-white/20 transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-white flex-shrink-0" strokeWidth={1.75} />
                      <span className="text-sm font-semibold text-white">{a.label}</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-white/60 group-hover:text-white group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── QUICK BOOK BAR ──────────────────────────────────────── */}
      {/*
        FIX 3: Removed negative margin (-mt-20) that caused overlap.
        Now uses positive mt-8 for clean spacing below the hero section.
        FIX 4: Changed bg-white → bg-slate-800/60 + backdrop-blur for dark glass theme.
        Changed border-slate-100 → border-white/10, inputs use bg-slate-700/60.
      */}
      {/* {(!user || user.role === "patient") && (
        <section className="mx-auto max-w-5xl px-4 mt-8 mb-2 md:px-6">
          <div className="rounded-2xl border border-white/10 bg-slate-800/60 backdrop-blur-xl p-4 shadow-xl shadow-black/40 grid gap-3 md:grid-cols-4">
          <input
            className="rounded-xl border border-white/10 bg-slate-700/60 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-400 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 transition-all"
            placeholder="Patient Name"
          />
          <select className="rounded-xl border border-white/10 bg-slate-700/60 px-3.5 py-2.5 text-sm text-slate-300 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 transition-all">
            <option value="">All Specialities</option>
            {SPECIALITIES.map((s, i) => (
              <option key={i}>{s}</option>
            ))}
          </select>
          <input
            type="date"
            className="rounded-xl border border-white/10 bg-slate-700/60 px-3.5 py-2.5 text-sm text-slate-300 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 transition-all"
          />
          <button className="px-4 py-2 text-[13px] font-bold text-white rounded-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 transition-all duration-200 shadow-lg shadow-sky-500/30 hover:shadow-sky-400/50 hover:-translate-y-0.5">
            Quick Book
          </button>
        </div>
        </section>
      )} */}

      {/* ── TOP SPECIALITIES ────────────────────────────────────── */}
      {/*
        FIX 5: bg-slate-50 → bg-slate-800/40 for dark theme consistency.
        Cards changed from bg-white to bg-slate-800/60 glass cards.
        FIX 2 (continued): Left/right fades use from-slate-900 instead of from-white.
      */}
      <section className="bg-slate-800/40 py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-sky-400 mb-1">Medical Specialities</p>
              <h2 className="text-2xl font-black text-white">Top Specialities</h2>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => document.getElementById("spec-track").scrollBy({ left: -220, behavior: "smooth" })}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-slate-700/60 text-slate-300 hover:border-sky-400/50 hover:text-sky-400 hover:bg-slate-700 transition-all shadow-sm"
              >
                <ArrowRight className="h-4 w-4 rotate-180" />
              </button>
              <button
                onClick={() => document.getElementById("spec-track").scrollBy({ left: 220, behavior: "smooth" })}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-slate-700/60 text-slate-300 hover:border-sky-400/50 hover:text-sky-400 hover:bg-slate-700 transition-all shadow-sm"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Scrollable track */}
          <div className="relative">
            {/* FIX 2: Fades now use slate-900 so no white bleed */}
            <div className="absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-slate-800/80 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-slate-800/80 to-transparent z-10 pointer-events-none" />
            <div
              id="spec-track"
              className="flex gap-4 overflow-x-auto px-4 pb-2 scroll-smooth"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {SPECIALITIES.map((item) => {
                const spec = SPECIALTY_MAP[item] || SPECIALTY_MAP.default;
                const Icon = spec.icon;
                return (
                  <div
                    key={item}
                    className="group flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-slate-800/60 backdrop-blur-sm p-5 shadow-md shadow-black/20 hover:border-sky-400/30 hover:shadow-sky-500/10 hover:-translate-y-1 transition-all duration-200 cursor-pointer flex-shrink-0 w-36 text-center"
                  >
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-700/80 group-hover:bg-sky-500/20 group-hover:scale-110 transition-all duration-200">
                      <Icon className="h-7 w-7 text-slate-300 group-hover:text-sky-400 transition-colors" strokeWidth={1.5} />
                    </div>
                    <p className="text-xs font-semibold text-slate-400 group-hover:text-sky-300 transition-colors leading-tight">{item}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── OUR DOCTORS ─────────────────────────────────────────── */}
      {/*
        FIX 1 & 5: The carousel uses width:max-content which can break layout.
        Wrapped in overflow-hidden. Left/right fades changed to slate-900.
        bg now bg-slate-900 (dark) instead of default white.
      */}
      <section className="py-16 bg-slate-800/40 overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 md:px-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-sky-400 mb-1">Expert Team</p>
              <h2 className="text-2xl font-black text-white">Our Doctors</h2>
            </div>
            <Link to="/doctors" className="text-sm font-semibold text-sky-400 hover:text-sky-300 hover:underline flex items-center gap-1 transition-colors">
              All doctors <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Scrolling track */}
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none" />

          {loadingDoctors && doctors.length === 0 ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
            </div>
          ) : (
            <div
              className="flex gap-5 animate-scroll-fast"
              style={{ width: "max-content" }}
              onMouseEnter={(e) => (e.currentTarget.style.animationPlayState = "paused")}
              onMouseLeave={(e) => (e.currentTarget.style.animationPlayState = "running")}
            >
              {[...(doctors || []), ...(doctors || [])].map((doc, i) => (
                <div key={i} className="w-[300px] flex-shrink-0">
                  <DoctorCard doctor={doc} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── HEALTH PACKAGES + LAB SERVICES ──────────────────────── */}
      {/*
        FIX 3: bg-slate-50 → bg-slate-800/40 dark section.
        Cards changed from bg-white to bg-slate-800/60 glass.
        Border and item backgrounds updated to dark glass theme.
      */}
      <section className="bg-slate-800/40 py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6 grid gap-6 md:grid-cols-2">

          {/* Health Packages */}
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-800/60 backdrop-blur-xl p-6 shadow-xl shadow-black/30">
            {/* Visual background hint */}
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-sky-500/10 blur-3xl" />
            
            <p className="text-[11px] font-bold uppercase tracking-widest text-sky-400 mb-1">Preventive Care</p>
            <h3 className="text-xl font-black text-white mb-5">Health Packages</h3>
            <div className="space-y-3">
              {HEALTH_PACKAGES.map((pkg, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-700/50 px-4 py-3 hover:border-sky-400/30 hover:bg-slate-700/80 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/20 border border-sky-500/30">
                      <Package className="h-4 w-4 text-sky-400" strokeWidth={1.75} />
                    </div>
                    <p className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">{pkg.name}</p>
                  </div>
                  <p className="text-sm font-bold text-emerald-400">${pkg.price}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Lab Services */}
          <div className="rounded-2xl border border-white/10 bg-slate-800/60 backdrop-blur-xl p-6 shadow-xl shadow-black/30">
            <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-400 mb-1">Diagnostics</p>
            <h3 className="text-xl font-black text-white mb-5">Lab Services</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: <FlaskConical className="h-5 w-5" />, label: "Diagnostics", color: "bg-sky-500/10 text-sky-300 border-sky-500/20 hover:bg-sky-500/20 hover:border-sky-400/40" },
                { icon: <Microscope className="h-5 w-5" />, label: "Testing", color: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20 hover:bg-emerald-500/20 hover:border-emerald-400/40" },
                { icon: <ShieldPlus className="h-5 w-5" />, label: "Preventive", color: "bg-violet-500/10 text-violet-300 border-violet-500/20 hover:bg-violet-500/20 hover:border-violet-400/40" },
                { icon: <Stethoscope className="h-5 w-5" />, label: "Home Collection", color: "bg-amber-500/10 text-amber-300 border-amber-500/20 hover:bg-amber-500/20 hover:border-amber-400/40" },
              ].map((item) => (
                <Link
                  key={item.label}
                  to="/lab-services"
                  className={`flex items-center gap-3 rounded-xl border p-4 font-semibold text-sm hover:-translate-y-0.5 hover:shadow-md transition-all backdrop-blur-sm ${item.color}`}
                >
                  {item.icon} {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────────────── */}
      <TestimonialSection />

      {/* ── HEALTH ARTICLES ─────────────────────────────────────── */}
      {/*
        FIX 3: bg-slate-50 → bg-slate-800/40. Cards changed to dark glass.
        Article cards use bg-slate-800/60, dark borders, and proper text colors.
      */}
      <section className="bg-slate-800/40 py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-sky-400 mb-1">Health Blog</p>
              <h2 className="text-2xl font-black text-white">Health Articles</h2>
            </div>
            <Link to="/health-feed" className="text-sm font-semibold text-sky-400 hover:text-sky-300 hover:underline flex items-center gap-1 transition-colors">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {loadingFeed ? (
              <div className="col-span-full flex justify-center py-10"><Loader2 className="animate-spin text-sky-500" /></div>
            ) : feedData.slice(0, 3).map((item) => (
              <article
                key={item._id}
                className="group rounded-2xl border border-white/10 bg-slate-800/60 backdrop-blur-sm p-5 shadow-md shadow-black/20 hover:shadow-sky-500/10 hover:border-sky-400/20 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                <span className="inline-block rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-3">
                  {item.category || "Health"}
                </span>
                <h3 className="text-base font-bold text-slate-100 leading-snug mb-2 group-hover:text-sky-300 transition-colors line-clamp-2">
                  {item.question || item.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed line-clamp-3">{item.answer || item.summary}</p>
                <p className="mt-4 text-xs font-semibold text-sky-400">By Dr. {item.answeredBy?.name || item.doctor?.name || "Apollo Expert"}</p>
              </article>
            ))}
            {!loadingFeed && feedData.length === 0 && (
              <p className="col-span-full text-center text-slate-500 py-10">No health articles currently available.</p>
            )}
          </div>
        </div>
      </section>

      {/* ── EMERGENCY ───────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 rounded-2xl bg-gradient-to-r from-red-700 to-red-600 px-8 py-7 shadow-xl shadow-red-900/40 border border-red-500/20">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 backdrop-blur flex-shrink-0 border border-white/10">
              <Ambulance className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-red-200 mb-0.5">24/7 Emergency Services</p>
              <p className="text-white font-bold text-lg">Immediate medical assistance available round the clock</p>
            </div>
          </div>
          <a
            href="tel:+18009112273"
            className="flex items-center gap-2 rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm px-6 py-3 text-sm font-bold text-white hover:bg-white/20 transition-all shadow-md flex-shrink-0"
          >
            <Phone className="h-4 w-4" />
            +1 800 911 CARE
          </a>
        </div>
      </section>

    </main>
  );
}