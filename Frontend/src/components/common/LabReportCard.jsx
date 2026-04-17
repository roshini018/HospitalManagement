import { FlaskConical, Download, Clock } from "lucide-react";

export default function LabReportCard({ report }) {
  const isReady = report?.status?.toLowerCase() === "ready" || report?.status === "completed";

  const handleDownload = () => {
    if (!report?._id && !report?.id) return;
    const downloadUrl = `/api/lab-tests/${report._id || report.id}/download`;
    window.open(downloadUrl, "_blank");
  };

  return (
    <article className="group rounded-2xl border border-white/10 bg-slate-800/60 backdrop-blur-xl p-5 shadow-xl shadow-black/20 hover:shadow-2xl hover:border-white/20 hover:-translate-y-1 transition-all duration-300">

      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">

          {/* Date */}
          <p className="text-xs font-medium text-slate-500">
            {report?.createdAt ? new Date(report.createdAt).toLocaleDateString() : (report?.date || "No date")}
          </p>

          {/* Test name */}
          <h3 className="flex items-center gap-2 text-base font-bold text-white">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/15 border border-sky-500/20">
              <FlaskConical className="h-4 w-4 text-sky-400" />
            </span>
            {report?.testName || report?.testType || "Lab Test"}
          </h3>

          {/* Status pill */}
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold border ${
            isReady
              ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/25"
              : "bg-amber-500/15 text-amber-400 border-amber-500/25"
          }`}>
            {!isReady && <Clock className="h-3 w-3" />}
            {report?.status || "Pending"}
          </span>
        </div>

        {/* Download button */}
        {isReady && (
          <button 
            onClick={handleDownload}
            className="flex items-center gap-1.5 rounded-xl border border-sky-500/25 bg-sky-500/10 px-3.5 py-2 text-xs font-semibold text-sky-400 hover:bg-sky-500/20 hover:border-sky-400/40 hover:-translate-y-0.5 transition-all duration-200 flex-shrink-0">
            <Download className="h-3.5 w-3.5" />
            Download
          </button>
        )}
      </div>

      {/* File name */}
      <div className="mt-4 flex items-center gap-2 rounded-lg bg-slate-700/40 border border-white/[0.06] px-3 py-2">
        <span className="text-slate-500">📎</span>
        <p className="text-xs text-slate-500 font-medium truncate">{report?.fileName || report?.reportFile || "No file attachment"}</p>
      </div>
    </article>
  );
}