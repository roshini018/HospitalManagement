import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function ErrorReporter({ error }) {
  useEffect(() => {
    if (error) console.error("Error:", error);
  }, [error]);

  if (!error) return null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 p-6">
      <div className="w-full max-w-md space-y-5 text-center">

        {/* Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/15 border border-red-500/25">
          <AlertTriangle className="h-7 w-7 text-red-400" />
        </div>

        {/* Text */}
        <div>
          <h1 className="text-xl font-bold text-white">Something went wrong</h1>
          <p className="mt-2 text-sm text-slate-400">An unexpected error occurred. Please try again.</p>
        </div>

        {/* Error message */}
        {error.message && (
          <pre className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-left text-xs text-red-300 overflow-auto font-mono whitespace-pre-wrap break-words">
            {error.message}
          </pre>
        )}

        {/* Reload */}
        <div className="flex gap-3 justify-center">

  <button
    onClick={() => window.location.reload()}
    className="inline-flex items-center gap-2 rounded-xl border border-red-500/25 bg-red-500/10 px-5 py-2.5 text-sm font-semibold text-red-400 hover:bg-red-500/20 transition-all"
  >
    <RefreshCw className="h-4 w-4" />
    Reload
  </button>

  <button
    onClick={() => window.location.href = "/"}
    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition-all"
  >
    Go Home
  </button>

</div>
      </div>
    </div>
  );
}