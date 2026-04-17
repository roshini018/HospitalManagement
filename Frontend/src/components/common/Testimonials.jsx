import React, { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

const TESTIMONIALS = [
  { patient: "Aarav Sharma", quote: "Smooth appointment process and excellent care team." },
  { patient: "Riya Kapoor",  quote: "Doctors are very professional and helpful." },
  { patient: "Kiran Reddy",  quote: "Lab reports were delivered on time. Great service!" },
  { patient: "Sneha Gupta",  quote: "User-friendly app and easy booking." },
  { patient: "Mohan Das",    quote: "Outstanding emergency response. Truly life-saving." },
  { patient: "Lakshmi N.",   quote: "The staff were caring and the facility was clean." },
];

export default function TestimonialSection() {
  const [index, setIndex] = useState(0);
  const perPage = 3;
  const pages = Math.ceil(TESTIMONIALS.length / perPage);

  useEffect(() => {
    const interval = setInterval(() => setIndex((p) => (p + 1) % pages), 4000);
    return () => clearInterval(interval);
  }, [pages]);

  const visible = TESTIMONIALS.slice(index * perPage, index * perPage + perPage);
  while (visible.length < perPage) visible.push(TESTIMONIALS[visible.length % TESTIMONIALS.length]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16">

      {/* Header */}
      <div className="mb-10">
        <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-sky-400 mb-2">
          Patient Stories
          <span className="h-px w-10 bg-sky-500/40" />
        </p>
        <h2 className="text-3xl font-black text-white leading-tight">
          What Our <span className="text-sky-400">Patients</span> Say
        </h2>
        <p className="text-slate-400 mt-2 text-sm font-light">Real experiences from thousands of verified patients</p>
      </div>

      {/* Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((t, i) => (
          <div
            key={i}
            className="relative overflow-hidden rounded-2xl border border-white/10 bg-slate-800/60 backdrop-blur-xl p-6 shadow-xl shadow-black/30 hover:shadow-2xl hover:shadow-sky-500/10 hover:border-white/20 hover:-translate-y-1 transition-all duration-300"
          >
            {/* Large quote mark */}
            <span className="absolute top-4 right-5 text-6xl font-serif leading-none text-white/[0.06] select-none">❝</span>

            {/* Stars */}
            <div className="flex gap-0.5 mb-3">
              {[1,2,3,4,5].map((s) => (
                <Star key={s} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>

            {/* Quote */}
            <p className="text-sm text-slate-300 leading-relaxed italic mb-5">{t.quote}</p>

            {/* Patient */}
            <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-500/20 to-sky-600/20 border border-sky-500/20 text-sm font-bold text-sky-400 flex-shrink-0">
                {t.patient.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{t.patient}</p>
                <p className="text-xs text-emerald-400 font-medium">✓ Verified Patient</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="mt-8 flex items-center justify-center gap-3">
        <button
          onClick={() => setIndex((index - 1 + pages) % pages)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-slate-800/60 text-slate-400 hover:border-sky-400/30 hover:text-sky-400 hover:bg-slate-700/60 transition-all"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <div className="flex gap-1.5">
          {Array.from({ length: pages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all duration-300 ${i === index ? "w-6 bg-sky-500" : "w-2 bg-slate-600 hover:bg-slate-500"}`}
            />
          ))}
        </div>

        <button
          onClick={() => setIndex((index + 1) % pages)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-slate-800/60 text-slate-400 hover:border-sky-400/30 hover:text-sky-400 hover:bg-slate-700/60 transition-all"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
}