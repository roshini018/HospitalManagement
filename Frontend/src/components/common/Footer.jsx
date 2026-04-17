import { Link } from "react-router-dom";
import { Stethoscope, Phone, Mail, MapPin, Twitter, Linkedin, Instagram, Facebook } from "lucide-react";

const socials = [
  { Icon: Twitter, href: "#" },
  { Icon: Linkedin, href: "#" },
  { Icon: Instagram, href: "#" },
  { Icon: Facebook, href: "#" },
];

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/[0.06] bg-slate-900/80 backdrop-blur-xl">

      {/* Emergency bar */}
      <div className="border-b border-red-500/20 bg-red-950/40 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 flex-wrap px-4 py-3 md:px-6">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
            </span>
            <p className="text-xs font-medium text-red-300">24/7 Emergency Services Available</p>
          </div>
          <p className="text-sm font-bold text-red-300">📞 +1 (800) 911-CARE</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="grid gap-10 md:grid-cols-4">

          {/* Brand */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 text-white shadow-lg shadow-sky-500/30">
                <Stethoscope className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">ApolloCare Health</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">Hospital & Diagnostics</p>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Advanced multispeciality care with integrated diagnostics and digital health records.
            </p>
            <div className="flex gap-2">
              {socials.map(({ Icon, href }, i) => (
                <a
                  key={i} href={href}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.05] text-slate-400 hover:border-sky-400/30 hover:text-sky-400 hover:bg-sky-500/10 transition-all duration-200"
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500">Services</h4>
            <div className="space-y-2">
              {[
                ["Book Appointment", "/appointments"],
                ["Find Doctors", "/doctors"],
                ["Lab Services", "/lab-services"],
                ["Health Records", "/health-records"],
                ["Health Blog", "/health-feed"],
                ["Ask Expert", "/ask-expert"],
              ].map(([label, href]) => (
                <Link key={href} to={href} className="block text-sm text-slate-400 hover:text-sky-400 transition-colors">
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Specialities */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500">Specialities</h4>
            <div className="space-y-2">
              {["Cardiology", "Neurology", "Orthopedics", "Oncology", "Pediatrics", "Dermatology"].map((s) => (
                <a key={s} href="#" className="block text-sm text-slate-400 hover:text-sky-400 transition-colors">{s}</a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-sky-400 flex-shrink-0" />
                <span className="text-sm text-slate-400">+1 (800) 555-0178</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-sky-400 flex-shrink-0" />
                <span className="text-sm text-slate-400">care@apollocarehealth.com</span>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-sky-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-slate-400">2200 Medical Plaza<br />New York, NY 10001</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.06] pt-6">
          <p className="text-xs text-slate-500">
            © 2026 <span className="text-sky-400 font-semibold">ApolloCare Health</span>. All rights reserved.
          </p>
          <div className="flex gap-4">
            {["Privacy Policy", "Terms of Service", "HIPAA Compliance"].map((item) => (
              <a key={item} href="#" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}