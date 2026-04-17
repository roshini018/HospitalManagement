import { useState, useEffect } from "react";
import { FlaskConical, Home, Upload, CheckCircle, Download, Share2, Loader2, AlertCircle, X, FileSearch } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import ErrorBoundary from "../components/common/ErrorBoundary";

const TESTS = [
  "Complete Blood Count",
  "Liver Function Test",
  "Kidney Function Test",
  "Thyroid Profile",
  "Lipid Profile",
  "Vitamin D & B12",
];

const inputCls = "w-full rounded-xl border border-white/10 bg-slate-700/50 backdrop-blur-sm px-4 py-3 text-sm text-white outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-500/10 transition-all placeholder:text-slate-500 appearance-none";

const STATUS_COLOR = {
  pending: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  approved: "text-sky-400 bg-sky-500/10 border-sky-500/20",
  completed: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
};

function LabServicesContent() {
  const { user } = useAuth();
  const [selectedTest, setSelectedTest] = useState(TESTS[0]);
  const [homeCollection, setHomeCollection] = useState(true);
  const [bookMsg, setBookMsg] = useState("");
  const [booking, setBooking] = useState(false);

  const [reports, setReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [reportsError, setReportsError] = useState("");

  const [doctors, setDoctors] = useState([]);
  
  // Share modal state
  const [shareId, setShareId] = useState(null);
  const [doctorEmail, setDoctorEmail] = useState("");
  const [sharing, setSharing] = useState(false);
  const [shareMsg, setShareMsg] = useState("");

  const fetchReports = async () => {
    setLoadingReports(true);
    setReportsError("");
    try {
      const res = await api.get("/api/lab-tests/my");
      setReports(res.data || []);
    } catch (err) {
      setReportsError(
        err?.response?.data?.message || "Failed to load reports"
      );
    } finally {
      setLoadingReports(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const res = await api.get("/api/doctors");
      // Fix: API returns { success: true, doctors: [...] }
      setDoctors(res.data?.doctors || []);
    } catch (err) {
      console.error("Failed to fetch doctors", err);
      setDoctors([]);
    }
  };

  useEffect(() => {
    if (user) {
      fetchReports();
      fetchDoctors();
    }
  }, [user]);

  const handleBook = async () => {
    setBooking(true);
    setBookMsg("");
    try {
      await api.post("/api/lab-tests", {
        testType: selectedTest || "General Test",
        testName: selectedTest || "General Test",
        date: new Date().toISOString().split("T")[0],
        homeCollection: !!homeCollection,
      });
      setBookMsg(`✅ ${selectedTest} booked successfully!`);
      fetchReports();
    } catch (err) {
      setBookMsg(
        "❌ " + (err?.response?.data?.message || "Booking failed")
      );
    } finally {
      setBooking(false);
      setTimeout(() => setBookMsg(""), 4000);
    }
  };

  const handleDownload = (report) => {
    // FIX: Core requirement - Priority to recordId for the records API
    const downloadId = report?.recordId || report?._id || report?.id;

    console.log("👉 Full Report Object:", report);
    console.log("👉 Using ID for Download API:", downloadId);

    if (!downloadId) {
      console.error("❌ Invalid report ID - cannot trigger download");
      return;
    }

    // Trigger download via the record download endpoint
    window.open(`http://localhost:5001/api/records/download/${downloadId}`, "_blank");
  };

  const handleShare = async () => {
    if (!doctorEmail) return;
    setSharing(true);
    setShareMsg("");
    try {
      await api.post(`/api/lab-tests/${shareId}/share`, { doctorEmail });
      setShareMsg("✅ Report shared with doctor successfully!");
      setTimeout(() => { 
        setShareId(null); 
        setDoctorEmail(""); 
        setShareMsg(""); 
      }, 2000);
    } catch (err) {
      setShareMsg("❌ " + (err?.response?.data?.message || "Share failed"));
    } finally {
      setSharing(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 pb-16">
      {/* Header */}
      <div className="border-b border-white/[0.06] bg-slate-800/40 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
          <p className="text-[11px] font-black uppercase tracking-[0.2em] text-sky-400 mb-2">Diagnostics</p>
          <h1 className="text-3xl font-black text-white tracking-tight">Lab <span className="text-sky-500">Services</span></h1>
          <p className="text-sm text-slate-400 mt-1 font-medium">Book tests, home sample collection, and view results</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 md:px-6 space-y-8">
        {/* Book Test */}
        <div className="rounded-[2.5rem] bg-slate-800/60 backdrop-blur-xl border border-white/10 p-8 md:p-12 shadow-2xl shadow-black/40">
          <h2 className="flex items-center gap-2 text-lg font-black text-white mb-6">
            <FlaskConical className="h-5 w-5 text-sky-400" /> Book a Lab Test
          </h2>

          {bookMsg && (
            <div className={`mb-4 animate-in fade-in slide-in-from-top-2 duration-300 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium ${bookMsg.startsWith("✅") ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-400" : "border-red-500/25 bg-red-500/10 text-red-400"}`}>
              <CheckCircle className="h-4 w-4" /> {bookMsg}
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 ml-1">Select Test</label>
              <select value={selectedTest} onChange={(e) => setSelectedTest(e.target.value)} className={inputCls}>
                {TESTS.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>

            <div className="flex items-end">
              <label className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-700/50 backdrop-blur-sm px-4 py-3 cursor-pointer hover:bg-slate-600/50 hover:border-white/20 transition-all w-full h-[46px]">
                <input type="checkbox" checked={!!homeCollection} onChange={(e) => setHomeCollection(e.target.checked)} className="accent-sky-500 h-4 w-4 rounded" />
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <Home className="h-4 w-4 text-sky-400" /> Home Collection
                </div>
              </label>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleBook}
                disabled={booking}
                className="w-full flex h-[46px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 to-sky-600 px-4 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-sky-500/20 hover:from-sky-500 hover:to-sky-700 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:pointer-events-none"
              >
                {booking ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                {booking ? "Booking..." : "Request This Test"}
              </button>
            </div>
          </div>
        </div>

        {/* Results List */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-sky-400">Your Test Results</h2>
            <div className="h-0.5 flex-1 bg-white/5" />
            <span className="rounded-full bg-sky-500/10 border border-sky-500/20 px-3 py-1 text-[9px] font-black text-sky-400 uppercase tracking-widest">
              {reports?.length || 0} Reports
            </span>
          </div>

          {loadingReports ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
              <Loader2 className="h-8 w-8 animate-spin mb-3 text-sky-500" />
              <p className="text-sm font-medium">Retrieving diagnostic data...</p>
            </div>
          ) : reportsError ? (
            <div className="flex items-center gap-3 rounded-2xl border border-red-500/25 bg-red-500/10 p-6 text-sm text-red-400">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <div>
                <p className="font-bold">Error loading reports</p>
                <p className="opacity-80 mt-0.5">{reportsError}</p>
              </div>
            </div>
          ) : reports.length === 0 ? (
            <div className="rounded-[2.5rem] bg-slate-800/60 backdrop-blur-xl border border-dashed border-white/10 p-16 text-center shadow-2xl shadow-black/40">
              <FileSearch className="h-10 w-10 text-slate-700 mx-auto mb-4" />
              <p className="text-sm text-slate-500 font-bold uppercase tracking-widest text-[10px]">No diagnostic reports found in your healthy history.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {reports.map((r) => (
                <div key={r?._id} className="group rounded-2xl border border-white/10 bg-slate-800/60 backdrop-blur-xl p-5 shadow-sm hover:shadow-2xl hover:shadow-black/40 hover:border-white/20 transition-all duration-300">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-[0.15em] text-sky-400 mb-0.5">Lab Report</p>
                      <p className="text-base font-black text-white leading-tight">{r?.testName || r?.testType || "Diagnostic Test"}</p>
                      <p className="text-[10px] text-slate-500 mt-1 font-bold uppercase tracking-tight">
                        Scheduled: {r?.date || (r?.createdAt ? new Date(r.createdAt).toLocaleDateString() : "Date Pending")}
                      </p>
                    </div>
                    <span className={`rounded-full border px-3 py-1 text-[9px] font-black uppercase tracking-widest ${STATUS_COLOR[r?.status] || "text-slate-500 bg-slate-700/40 border-white/5"}`}>
                      {r?.status || "Pending"}
                    </span>
                  </div>

                  <div className="mt-5 flex gap-2">
                    {r?.status === "completed" && r?.reportFile ? (
                      <>
                        <button
                          onClick={() => handleDownload(r)}
                          className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-emerald-50 border border-emerald-100 px-3 py-2.5 text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:bg-emerald-100 transition-all"
                        >
                          <Download className="h-3.5 w-3.5" /> Download
                        </button>
                        <button
                          onClick={() => setShareId(r?._id)}
                          className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-sky-50 border border-sky-100 px-3 py-2.5 text-[10px] font-black uppercase tracking-widest text-sky-600 hover:bg-sky-100 transition-all"
                        >
                          <Share2 className="h-3.5 w-3.5" /> Share
                        </button>
                      </>
                    ) : (
                      <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-50 border border-gray-100 px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 italic">
                        <div className="h-1 w-1 rounded-full bg-gray-200 animate-pulse" />
                        {r?.status === "completed" ? "File Pending Upload" : "In Progress"}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Share Modal */}
      {shareId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md px-4 animate-in fade-in duration-300">
          <div className="w-full max-w-sm rounded-[2.5rem] border border-gray-100 bg-white p-8 shadow-2xl space-y-6 animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-700">Share Results</h3>
                <p className="text-xs text-slate-400 mt-0.5">Choose a doctor to review your report</p>
              </div>
              <button 
                onClick={() => { setShareId(null); setDoctorEmail(""); setShareMsg(""); }}
                className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:text-slate-700 hover:bg-gray-100 transition-all"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">Select Practitioner</label>
                  <select
                    value={doctorEmail}
                    onChange={(e) => setDoctorEmail(e.target.value)}
                    className={inputCls}
                  >
                    <option value="">Choose a doctor...</option>
                    {doctors?.length > 0 ? (
                      doctors.map((d) => (
                        <option key={d?._id} value={d?.user?.email}>
                          {d?.user?.name ? (d.user.name.toLowerCase().startsWith("dr") ? d.user.name : `Dr. ${d.user.name} — ${d?.specialization || "Expert"}`) : "Practitioner"}
                        </option>
                      ))
                    ) : (
                      <option disabled>No doctors available</option>
                    )}
                  </select>
              </div>

              {shareMsg && (
                <div className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 p-4 rounded-xl border ${shareMsg.startsWith("✅") ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-red-50 border-red-100 text-red-600"}`}>
                  <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                  {shareMsg}
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => { setShareId(null); setDoctorEmail(""); setShareMsg(""); }} className="flex-1 rounded-2xl border border-gray-100 bg-gray-50 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-gray-100 transition-all">
                Cancel
              </button>
              <button
                onClick={handleShare}
                disabled={sharing || !doctorEmail}
                className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-400 to-sky-600 py-4 text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-sky-500/20 disabled:opacity-50 disabled:pointer-events-none hover:from-sky-500 hover:to-sky-700 hover:-translate-y-0.5 transition-all duration-300"
              >
                {sharing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Share2 className="h-4 w-4" />}
                Share Now
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default function LabServicesPage() {
  return (
    <ErrorBoundary>
      <LabServicesContent />
    </ErrorBoundary>
  );
}