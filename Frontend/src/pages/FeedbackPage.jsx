import { useState, useEffect } from "react";
import FeedbackStars from "../components/common/FeedbackStars";
import { Send, Star, Loader2, AlertCircle } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const inputCls =
  "w-full rounded-xl border border-white/10 bg-slate-700/50 backdrop-blur-sm px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20 transition-all";

export default function FeedbackPage() {
  const { user } = useAuth();
  const [rating, setRating] = useState(4);
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [review, setReview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState("");
  const [searchParams] = useSearchParams();
  const queryDoctorId = searchParams.get("doctorId");
  const queryAppointmentId = searchParams.get("appointmentId");

  // Doctors list from backend
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);

  // Existing reviews for feedback
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await api.get("/api/doctors");
        console.log("FeedbackPage doctors fetch:", res.data);
        const list = res.data.doctors || res.data || [];
        setDoctors(list);
        if (queryDoctorId) {
          setSelectedDoctorId(queryDoctorId);
        } else if (list.length > 0) {
          setSelectedDoctorId(list[0]._id || list[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch doctors for feedback", err);
      } finally {
        setLoadingDoctors(false);
      }
    };
    fetchDoctors();
  }, []);

  // Fetch reviews for selected doctor
  useEffect(() => {
    if (!selectedDoctorId) return;
    const fetchReviews = async () => {
      setLoadingReviews(true);
      try {
        const res = await api.get(`/api/feedback/doctor/${selectedDoctorId}`);
        console.log("Feedback reviews fetch:", res.data);
        setReviews(res.data || []);
      } catch (err) {
        console.error("Failed to fetch reviews", err);
        setReviews([]);
      } finally {
        setLoadingReviews(false);
      }
    };
    fetchReviews();
  }, [selectedDoctorId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!review.trim() || !selectedDoctorId) return;
    setSubmitting(true);
    setSubmitMsg("");
    try {
      const payload = {
        doctorId: selectedDoctorId,
        appointmentId: queryAppointmentId,
        rating,
        comment: review, // Backend expects 'comment'
      };
      console.log("Submitting feedback with payload:", payload);
      const res = await api.post("/api/feedback", payload);
      console.log("Feedback submission result:", res.data);
      setSubmitMsg("✅ Feedback submitted! Thank you for your review.");
      setReview("");
      setRating(4);
      // Refresh reviews
      const fresh = await api.get(`/api/feedback/doctor/${selectedDoctorId}`);
      setReviews(fresh.data || []);
    } catch (err) {
      console.error("Feedback submission error:", err);
      setSubmitMsg("❌ " + (err?.response?.data?.message || "Submission failed. Please try again."));
    } finally {
      setSubmitting(false);
      setTimeout(() => setSubmitMsg(""), 5000);
    }
  };

  const selectedDoctorName =
    doctors.find((d) => d._id === selectedDoctorId)?.name || "";

  return (
    <main className="min-h-screen bg-slate-900 pb-16">

      {/* Header */}
      <div className="border-b border-white/[0.06] bg-slate-800/40 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-6">
          <p className="text-[11px] font-bold uppercase tracking-widest text-sky-400 mb-1">Your Experience</p>
          <h1 className="text-2xl font-black text-white">Feedback & Reviews</h1>
          <p className="text-sm text-slate-400 mt-1">Rate doctors and share your consultation experience</p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8 md:px-6 space-y-8">

        {/* Form */}
        <div className="rounded-2xl border border-white/10 bg-slate-800/60 backdrop-blur-xl p-6 shadow-xl shadow-black/30">
          <h2 className="text-base font-bold text-white mb-5">Leave a Review</h2>

          {submitMsg && (
            <div className={`mb-4 rounded-xl border px-4 py-3 text-sm font-medium ${submitMsg.startsWith("✅") ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-400" : "border-red-500/25 bg-red-500/10 text-red-400"}`}>
              {submitMsg}
            </div>
          )}

          {!user && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-400">
              <AlertCircle className="h-4 w-4 flex-shrink-0" /> Please log in to leave feedback.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Select Doctor</label>
              {loadingDoctors ? (
                <div className="flex items-center gap-2 text-sm text-slate-500 py-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading doctors...
                </div>
              ) : (
                <select
                  className={inputCls}
                  value={selectedDoctorId}
                  onChange={(e) => setSelectedDoctorId(e.target.value)}
                  disabled={!user}
                >
                  <option value="">Select a doctor</option>
                  {doctors?.length > 0 ? (
                    doctors.map((d) => (
                      <option key={d?._id} value={d?._id}>{d?.user?.name || d?.name || "Doctor"}</option>
                    ))
                  ) : (
                    <option disabled>No doctors found</option>
                  )}
                </select>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Your Rating</label>
              <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-slate-700/40 px-4 py-3">
                <FeedbackStars value={rating} onChange={setRating} />
                <span className="text-sm font-bold text-white">
                  {rating}/5 — {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Your Review</label>
              <textarea
                rows={4}
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Share your experience with this doctor..."
                className={`${inputCls} resize-none`}
                disabled={!user}
              />
            </div>

            <button
              type="submit"
              disabled={submitting || !user || !selectedDoctorId}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-400 hover:to-emerald-500 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {submitting ? "Submitting..." : "Submit Feedback"}
            </button>
          </form>
        </div>

        {/* Reviews for selected doctor */}
        <div>
          <h2 className="text-base font-bold text-white mb-4">
            {selectedDoctorName ? `Reviews for ${selectedDoctorName}` : "Recent Reviews"}
          </h2>

          {loadingReviews ? (
            <div className="flex items-center gap-2 text-sm text-slate-500 py-4">
              <Loader2 className="h-4 w-4 animate-spin" /> Loading reviews...
            </div>
          ) : reviews.length === 0 ? (
            <p className="text-sm text-slate-500">No reviews yet for this doctor.</p>
          ) : (
            <div className="space-y-4">
              {reviews.map((r, i) => (
                <div key={r._id || i} className="rounded-2xl border border-white/10 bg-slate-800/60 backdrop-blur-xl p-5 shadow-xl shadow-black/20">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-500/20 to-sky-600/20 border border-sky-500/20 text-sm font-bold text-sky-400">
                        {(r.patient?.name || r.patientName || "P").charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{r.patient?.name || r.patientName || "Patient"}</p>
                        <p className="text-xs text-sky-400 font-medium">{r.doctor?.name || selectedDoctorName}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className={`h-3.5 w-3.5 ${s <= r.rating ? "fill-amber-400 text-amber-400" : "text-slate-600"}`} />
                        ))}
                      </div>
                      <p className="text-[10px] text-slate-500">
                        {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ""}
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-slate-400 leading-relaxed">{r.review || r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}