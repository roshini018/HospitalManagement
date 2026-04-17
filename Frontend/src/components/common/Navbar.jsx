import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, Bell, Heart, User, LayoutDashboard, FolderHeart, ShieldCheck, LogOut, FileText, Sun, Moon, Check } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useAppContext } from "../../context/AppContext";
import { useTheme } from "../../context/ThemeContext";

const NAV_BY_ROLE = {
  guest: [
    { label: "Home",        href: "/" },
    { label: "Doctors",     href: "/doctors" },
    { label: "Health Feed", href: "/health-feed" },
    { label: "Ask Expert",  href: "/ask-expert" },
  ],
  patient: [
    { label: "Home",         href: "/" },
    { label: "Doctors",      href: "/doctors" },
    { label: "Appointments", href: "/appointments" },
    { label: "Lab Services", href: "/lab-services" },
    { label: "Health Feed",  href: "/health-feed" },
    { label: "Ask Expert",   href: "/ask-expert" },
    { label: "Feedback",     href: "/feedback" },
  ],
  doctor: [
    { label: "Home",           href: "/" },
    { label: "Dashboard",      href: "/dashboard" },
    { label: "Health Records", href: "/health-records" },
  ],
  admin: [
    { label: "Home",        href: "/" },
    { label: "Dashboard",   href: "/dashboard" },
  ],
};

const DROPDOWN_BY_ROLE = {
  patient: [
    { icon: User,          label: "My Profile",     href: "/dashboard?tab=Profile" },
    { icon: LayoutDashboard, label: "Dashboard",    href: "/dashboard" },
    { icon: FolderHeart,   label: "Health Records", href: "/health-records" },
  ],
  doctor: [
    { icon: User,          label: "My Profile",      href: "/profile" },
    { icon: LayoutDashboard, label: "Dashboard",     href: "/dashboard" },
    { icon: FileText,      label: "Patient Records", href: "/health-records" },
  ],
  admin: [
    { icon: ShieldCheck,   label: "Admin Dashboard", href: "/dashboard" },
  ],
};

const ROLE_CONFIG = {
  patient: { badge: "bg-sky-500/15 text-sky-400 border border-sky-500/25",   avatar: "from-sky-400 to-sky-600",     dot: "bg-sky-400" },
  doctor:  { badge: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/25", avatar: "from-emerald-400 to-emerald-600", dot: "bg-emerald-400" },
  admin:   { badge: "bg-violet-500/15 text-violet-400 border border-violet-500/25",  avatar: "from-violet-400 to-violet-600",  dot: "bg-violet-400" },
};

export default function Navbar() {
  const location  = useLocation();
  const pathname  = location.pathname;
  const navigate  = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { unreadCount, notifications, markAllRead } = useAppContext();
  const { isDark, toggleTheme } = useTheme();

  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen,   setNotifOpen]   = useState(false);
  const [scrolled,    setScrolled]    = useState(false);
  const dropRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
    setMobileOpen(false);
    navigate("/");
  };

  const role      = user?.role || "guest";
  const navItems  = NAV_BY_ROLE[role] || NAV_BY_ROLE.guest;
  const dropItems = isAuthenticated ? (DROPDOWN_BY_ROLE[role] || []) : [];
  const rc        = ROLE_CONFIG[role] || ROLE_CONFIG.patient;

  return (
    <>
      {/* ── Google Font import ───────────────────────────── */}
      <link
        href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />

      <header
        style={{ fontFamily: "'Outfit', sans-serif" }}
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-slate-900/95 backdrop-blur-xl border-b border-white/[0.08] shadow-2xl shadow-black/30"
            : "bg-slate-900/80 backdrop-blur-lg border-b border-white/[0.05]"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">

          {/* ── Logo ──────────────────────────────────────── */}
          <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
            {/* Icon with animated glow */}
            <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 shadow-lg shadow-sky-500/40 group-hover:shadow-sky-400/60 group-hover:scale-105 transition-all duration-300">
              <Heart className="h-5 w-5 text-white fill-white" />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent" />
            </div>
            <div className="leading-none">
              <p className="text-[15px] font-bold text-white tracking-tight">ApolloCare</p>
              <p className="text-[9px] font-semibold text-sky-400 uppercase tracking-[0.15em] mt-0.5">Health & Diagnostics</p>
            </div>
          </Link>

          {/* ── Desktop Nav ───────────────────────────────── */}
          <nav className="hidden items-center md:flex">
            {/* Pill container */}
            <div className="flex items-center gap-0.5 rounded-full bg-white/[0.05] border border-white/[0.08] px-1.5 py-1.5">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`relative px-4 py-1.5 text-[13px] font-medium rounded-full transition-all duration-200 ${
                      isActive
                        ? "bg-white text-slate-900 shadow-sm font-semibold"
                        : "text-slate-400 hover:text-white hover:bg-white/[0.08]"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* ── Right side ────────────────────────────────── */}
          <div className="flex items-center gap-2">

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.06] border border-white/[0.1] text-slate-400 hover:text-white hover:bg-white/[0.12] hover:border-white/20 transition-all duration-200"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Bell/Notifications */}
            {isAuthenticated && (
              <div className="relative" ref={notifRef}>
                <button 
                  onClick={() => setNotifOpen(!notifOpen)}
                  className={`relative flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200 ${notifOpen ? 'bg-white/10 border-white/20 text-white' : 'bg-white/[0.06] border-white/[0.1] text-slate-400 hover:text-white hover:bg-white/[0.12] hover:border-white/20'}`}
                >
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-sky-500 text-[8px] font-bold text-white ring-1 ring-slate-900 shadow-md shadow-sky-500/40">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>
                
                {/* Notification Dropdown Panel */}
                {notifOpen && (
                  <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-80 overflow-hidden rounded-2xl border border-white/[0.1] bg-slate-900/95 backdrop-blur-xl shadow-2xl shadow-black/40">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.07]">
                      <h3 className="text-sm font-bold text-white">Notifications</h3>
                      {unreadCount > 0 && (
                        <button onClick={markAllRead} className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-sky-400 hover:text-sky-300 transition-colors">
                          <Check className="h-3 w-3" /> Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-[300px] overflow-y-auto no-scrollbar pb-1">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-xs text-slate-500">No new notifications</div>
                      ) : (
                        notifications.map((n, i) => (
                          <div key={n._id || n.id || i} className={`p-4 border-b border-white/[0.03] transition-colors hover:bg-white/[0.02] ${n.read ? "opacity-60" : ""}`}>
                            <div className="flex justify-between items-start gap-3">
                              <p className={`text-xs ${n.read ? "text-slate-400" : "text-white font-medium"} leading-relaxed`}>{n.message}</p>
                              {!n.read && <span className="h-2 w-2 rounded-full bg-sky-500 mt-1 flex-shrink-0 shadow-sm shadow-sky-500/50" />}
                            </div>
                            <span className="text-[10px] font-bold text-slate-500 mt-2 block">{n.time}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Profile / Auth */}
            {isAuthenticated && user ? (
              <div className="relative" ref={dropRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className={`flex items-center gap-2.5 rounded-full border px-3 py-1.5 transition-all duration-200 ${
                    profileOpen
                      ? "bg-white/10 border-white/20"
                      : "bg-white/[0.05] border-white/[0.1] hover:bg-white/10 hover:border-white/20"
                  }`}
                >
                  {/* Avatar */}
                  <div className={`relative flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br ${rc.avatar} text-[11px] font-bold text-white flex-shrink-0`}>
                    {(user.name || "U").charAt(0).toUpperCase()}
                    {/* Online dot */}
                    <span className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-slate-900 ${rc.dot}`} />
                  </div>

                  <div className="hidden sm:block text-left">
                    <p className="text-[12px] font-semibold text-white leading-none">{(user.name || "User").split(" ")[0]}</p>
                    <p className={`text-[9px] font-bold uppercase tracking-wider mt-0.5 ${rc.dot.replace("bg-", "text-")}`}>{role}</p>
                  </div>

                  <ChevronDown className={`h-3.5 w-3.5 text-slate-500 transition-transform duration-200 flex-shrink-0 ${profileOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Dropdown */}
                {profileOpen && (
                  <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-60 overflow-hidden rounded-2xl border border-white/[0.1] bg-slate-900/95 backdrop-blur-xl shadow-2xl shadow-black/40">
                    {/* Header */}
                    <div className="px-4 py-4 border-b border-white/[0.07]">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${rc.avatar} text-sm font-bold text-white flex-shrink-0`}>
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{user.name}</p>
                          <p className="text-xs text-slate-500 mt-0.5 truncate">{user.email}</p>
                          <span className={`mt-1 inline-block text-[9px] font-bold px-2 py-0.5 rounded-full capitalize ${rc.badge}`}>
                            {role}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Links */}
                    <div className="p-2">
                      {dropItems.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.href}
                            to={item.href}
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 hover:bg-white/[0.07] hover:text-white transition-all duration-150 group"
                          >
                            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.06] group-hover:bg-white/[0.12] transition-all">
                              <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                            </span>
                            <span className="font-medium">{item.label}</span>
                          </Link>
                        );
                      })}
                    </div>

                    {/* Sign out */}
                    <div className="border-t border-white/[0.07] p-2">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-150 group"
                      >
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/10 group-hover:bg-red-500/20 transition-all">
                          <LogOut className="h-3.5 w-3.5" strokeWidth={1.75} />
                        </span>
                        <span className="font-medium">Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-[13px] font-semibold text-slate-300 hover:text-white rounded-full bg-white/[0.05] border border-white/[0.1] hover:bg-white/10 hover:border-white/20 transition-all duration-200"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-[13px] font-bold text-white rounded-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 transition-all duration-200 shadow-lg shadow-sky-500/30 hover:shadow-sky-400/50 hover:-translate-y-0.5"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.06] border border-white/[0.1] text-slate-400 hover:text-white hover:bg-white/10 transition-all md:hidden"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* ── Mobile menu ───────────────────────────────────── */}
        {mobileOpen && (
          <div className="border-t border-white/[0.08] bg-slate-900/98 backdrop-blur-xl px-4 py-4 md:hidden space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setMobileOpen(false)}
                className={`block rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                  pathname === item.href
                    ? "bg-white text-slate-900 font-semibold"
                    : "text-slate-400 hover:bg-white/[0.07] hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ))}

            {isAuthenticated ? (
              <div className="pt-3 mt-3 border-t border-white/[0.07] space-y-1">
                {dropItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-slate-400 hover:bg-white/[0.07] hover:text-white transition-all"
                    >
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.06]">
                        <Icon className="h-3.5 w-3.5" strokeWidth={1.75} />
                      </span>
                      {item.label}
                    </Link>
                  );
                })}
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/10">
                    <LogOut className="h-3.5 w-3.5" strokeWidth={1.75} />
                  </span>
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="pt-3 mt-3 border-t border-white/[0.07] flex gap-2">
                <Link to="/login"  className="flex-1 rounded-xl border border-white/10 py-2.5 text-center text-sm font-semibold text-slate-300 hover:bg-white/5 transition-all">Sign In</Link>
                <Link to="/signup" className="flex-1 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 py-2.5 text-center text-sm font-bold text-white transition-all">Get Started</Link>
              </div>
            )}
          </div>
        )}
      </header>
    </>
  );
}