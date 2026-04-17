export default function QueueStatus({ queueNumber, estimatedMinutes }) {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-800/60 backdrop-blur-xl p-6 md:p-8 shadow-2xl shadow-black/40">

      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-400 via-sky-500 to-sky-400" />

      {/* Live indicator */}
      <div className="flex items-center gap-2 mb-6">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Live Queue Status</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl bg-slate-700/50 backdrop-blur-sm border border-white/10 px-5 py-4 transition-all hover:border-emerald-500/30">
          <p className="text-3xl font-black text-emerald-400">#{queueNumber}</p>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Your Token</p>
        </div>
        <div className="rounded-2xl bg-slate-700/50 backdrop-blur-sm border border-white/10 px-5 py-4 transition-all hover:border-emerald-500/30">
          <p className="text-3xl font-black text-emerald-400">{estimatedMinutes}<span className="text-sm font-bold"> min</span></p>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Estimated Wait</p>
        </div>
      </div>
    </div>
  );
}