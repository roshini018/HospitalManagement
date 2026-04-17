import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="flex min-h-[400px] w-full flex-col items-center justify-center rounded-2xl border border-white/10 bg-slate-800/40 p-10 text-center backdrop-blur-xl">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="mb-2 text-lg font-black text-white">Something went wrong</h2>
          <p className="mb-6 text-sm text-slate-400 max-w-xs">
            An error occurred while rendering this section. Please try refreshing the page or contact support if the issue persists.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 rounded-xl bg-sky-500 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-sky-500/20 hover:bg-sky-400 transition-all active:scale-95"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
