import { Bell } from "lucide-react";
import { useAppContext } from "../context/AppContext";

export default function NotificationBell() {
  const { unreadCount } = useAppContext();

  return (
    <button
      type="button"
      aria-label="Notifications"
      className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-slate-400 shadow-sm hover:border-white/20 hover:bg-white/[0.12] hover:text-white transition-all duration-200"
    >
      <Bell className="h-[17px] w-[17px]" />
      {unreadCount > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-sky-500 text-[8px] font-bold text-white ring-1 ring-slate-900 shadow-md shadow-sky-500/40">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </button>
  );
}