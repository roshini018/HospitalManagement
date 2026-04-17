import React, { useState } from "react";
import { Loader2, Upload, Trash2 } from "lucide-react";

/**
 * LabTestsTab Component
 * Renders the Lab Test management view in the Admin Dashboard.
 * 
 * @param {boolean} loading - Loading state for the tests.
 * @param {Array} labTests - List of lab test objects.
 * @param {string|null} uploadingId - ID of the test currently being uploaded.
 * @param {function} onApprove - Callback to approve a pending lab test request.
 * @param {function} onRejectClick - Callback to initiate rejection (shows modal).
 * @param {function} onDeleteClick - Callback to initiate deletion (shows modal).
 * @param {function} onUpload - Callback to upload a report file.
 */
const LabTestsTab = ({ 
  loading, 
  labTests, 
  uploadingId, 
  onApprove, 
  onRejectClick, 
  onDeleteClick, 
  onUpload 
}) => {
  const [localLabFile, setLocalLabFile] = useState({});

  const handleFileChange = (testId, file) => {
    setLocalLabFile(prev => ({ ...prev, [testId]: file }));
  };

  const handleUploadClick = (testId) => {
    const file = localLabFile[testId];
    if (!file) return alert("Please select a file first");
    onUpload(testId, file);
    // Clear local file state for this test after upload
    setLocalLabFile(prev => {
      const newState = { ...prev };
      delete newState[testId];
      return newState;
    });
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-800/60 backdrop-blur-xl p-6 shadow-xl shadow-black/20">
      <div className="mb-6">
        <h2 className="text-base font-bold text-white uppercase tracking-tight">Diagnostic Requests</h2>
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-1">Process laboratory test requests and results</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12 text-slate-500">
          <Loader2 className="h-6 w-6 animate-spin mr-2 text-violet-500" /> 
          <span className="text-sm font-medium">Fetching diagnostic records...</span>
        </div>
      ) : labTests.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sm text-slate-500 font-medium font-secondary">No lab test requests found in the system</p>
        </div>
      ) : (
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {["Patient", "Test Name", "Date", "Status", "Actions"].map(h => (
                  <th key={h} className="pb-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-500 pr-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {labTests.map(test => (
                <tr key={test._id} className="hover:bg-slate-700/40 transition-colors group">
                  <td className="py-4 pr-4">
                    <p className="font-bold text-white whitespace-nowrap">{test.patient?.name || "Anonymous Patient"}</p>
                  </td>
                  <td className="py-4 pr-4 text-xs font-semibold text-slate-400 whitespace-nowrap">{test.testName || test.testType || "General Diagnostic"}</td>
                  <td className="py-4 pr-4">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">{test.date || "Pending Review"}</span>
                  </td>
                  <td className="py-4 pr-4">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-wider border ${
                      String(test.status).toLowerCase() === "pending" ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        : String(test.status).toLowerCase() === "rejected" ? "bg-red-500/10 text-red-400 border-red-500/20"
                        : String(test.status).toLowerCase() === "approved" ? "bg-sky-500/10 text-sky-400 border-sky-500/20"
                          : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    }`}>{test.status}</span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      {String(test.status).toLowerCase() === "pending" && (
                        <button 
                          onClick={() => onApprove(test._id)}
                          className="rounded-xl bg-sky-600 px-4 py-2 text-[10px] font-black text-white hover:bg-sky-500 transition-all shadow-lg shadow-sky-500/20 uppercase"
                        >
                          Approve
                        </button>
                      )}
                      
                      {String(test.status).toLowerCase() === "approved" && (
                        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-300">
                          <label className="flex items-center gap-2.5 cursor-pointer rounded-xl bg-slate-900/50 border border-white/10 px-3 py-1.5 hover:border-violet-500/50 transition-all">
                            <span className="text-[10px] font-bold text-slate-400 truncate max-w-[80px]">
                              {localLabFile[test._id]?.name || "Select PDF"}
                            </span>
                            <input 
                              type="file" 
                              className="hidden" 
                              accept=".pdf"
                              onChange={e => handleFileChange(test._id, e.target.files[0])} 
                            />
                          </label>
                          <button 
                            onClick={() => handleUploadClick(test._id)} 
                            disabled={uploadingId === test._id || !localLabFile[test._id]}
                            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-[10px] font-black text-white hover:bg-emerald-500 transition-all disabled:opacity-50 shadow-lg shadow-emerald-500/20 uppercase"
                          >
                            {uploadingId === test._id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                            Upload
                          </button>
                        </div>
                      )}
                      
                      {String(test.status).toLowerCase() === "completed" && (
                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1.5 bg-emerald-500/5 px-2 py-1 rounded-lg">
                          <div className="h-1 w-1 rounded-full bg-emerald-400" /> Result Published
                        </span>
                      )}
                      
                      {String(test.status).toLowerCase() !== "completed" && (
                        <button 
                          onClick={() => onRejectClick(test._id)}
                          className="rounded-xl bg-red-500/10 border border-red-500/20 px-3 py-2 text-[10px] font-black text-red-500 hover:bg-red-500/20 transition-all uppercase"
                        >
                          Reject
                        </button>
                      )}
                      
                      <button
                        onClick={() => onDeleteClick(test._id)}
                        className="rounded-xl border border-white/10 bg-slate-800/60 p-2 text-slate-500 hover:text-red-400 hover:border-red-500/25 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LabTestsTab;
