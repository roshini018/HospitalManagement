import { FileText, Download, Share2, Clock, CheckCircle, FileUp } from "lucide-react";
import { useState } from "react";
import api from "../services/api";

export default function MedicalRecordCard({ record, onShareSuccess }) {
  const [isSharing, setIsSharing] = useState(false);
  const [doctorEmail, setDoctorEmail] = useState("");
  const [sharingLoading, setSharingLoading] = useState(false);

  const isCompleted = record?.status === "completed";
  const formattedDate = record?.date 
    ? new Date(record.date).toLocaleDateString() 
    : new Date(record.createdAt).toLocaleDateString();

  const handleDownload = () => {
    // Open in new tab for direct download
    window.open(`http://localhost:5001/api/records/${record._id}/download`, "_blank");
  };

  const handleShare = async (e) => {
    e.preventDefault();
    if (!doctorEmail) return;
    setSharingLoading(true);
    try {
      await api.post(`/api/records/${record._id}/share`, { doctorEmail });
      alert(`Shared successfully with ${doctorEmail}`);
      setIsSharing(false);
      setDoctorEmail("");
      if (onShareSuccess) onShareSuccess();
    } catch (err) {
      alert(err.response?.data?.message || "Sharing failed");
    } finally {
      setSharingLoading(false);
    }
  };

  return (
    <article className="rounded-2xl border border-white/10 bg-slate-800/60 backdrop-blur-xl p-5 shadow-xl shadow-black/20 hover:border-sky-500/30 transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
            <FileText className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white leading-tight">{record?.title || "Medical Record"}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-slate-500 font-medium">{formattedDate}</span>
              <span className="h-1 w-1 rounded-full bg-slate-700" />
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">{record?.category || "Other"}</span>
            </div>
            
            <div className="mt-3 flex items-center gap-2">
               <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-widest border ${
                 isCompleted 
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                  : "bg-amber-500/10 text-amber-400 border-amber-500/20"
               }`}>
                 {isCompleted ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                 {record?.status || "Pending"}
               </span>
            </div>
          </div>
        </div>

        <div className="flex sm:flex-col gap-2">
          <button 
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-sky-500 border border-sky-400/50 px-4 py-2 text-xs font-black text-white hover:bg-sky-400 transition-all shadow-lg shadow-sky-500/20"
          >
            <Download className="h-3.5 w-3.5" /> Download
          </button>
          <button 
            onClick={() => setIsSharing(!isSharing)}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-white/10 transition-all"
          >
            <Share2 className="h-3.5 w-3.5" /> Share
          </button>
        </div>
      </div>

      {/* Share Section */}
      {isSharing && (
        <form onSubmit={handleShare} className="mt-4 pt-4 border-t border-white/[0.06] animate-in slide-in-from-top-2">
          <p className="text-[10px] font-bold text-slate-500 uppercase mb-2 ml-1">Share with Doctor (Email)</p>
          <div className="flex gap-2">
            <input 
              type="email"
              placeholder="doctor@hospital.com"
              required
              value={doctorEmail}
              onChange={(e) => setDoctorEmail(e.target.value)}
              className="flex-1 rounded-xl bg-slate-900/50 border border-white/10 px-4 py-2 text-xs text-white placeholder:text-slate-600 outline-none focus:border-sky-500 transition-all"
            />
            <button 
              disabled={sharingLoading}
              type="submit"
              className="rounded-xl bg-sky-500/20 border border-sky-500/20 px-4 py-2 text-xs font-bold text-sky-400 hover:bg-sky-500/30 transition-all"
            >
              {sharingLoading ? "..." : "Send"}
            </button>
          </div>
        </form>
      )}

      {/* Attachment Footer */}
      <div className="mt-5 flex items-center justify-between gap-2 rounded-xl bg-slate-900/40 border border-white/[0.04] px-4 py-2.5">
        <div className="flex items-center gap-2 truncate">
          <FileUp className="h-3 w-3 text-slate-500" />
          <p className="text-[10px] text-slate-500 font-bold truncate">
            {record?.fileName || record?.filePath ? (record?.fileName || record?.filePath) : "No file uploaded"}
          </p>
        </div>
        <span className="text-[10px] font-black text-slate-700">ATTACHMENT</span>
      </div>
    </article>
  );
}