"use client";
import {
  ArrowRight,
} from "lucide-react";
import { FaWhatsapp, FaInstagram, FaEnvelope } from "react-icons/fa6";

const handleOpenWhatsApp = () => {
  const phoneNumber = "923116631476"; // Replace with your support WhatsApp number
  const message = encodeURIComponent("Hello Droply Support, I need assistance with my branch.");
  window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
};

const handleOpenEmail = () => {
  const email = "support@dedroply.com";
  const subject = encodeURIComponent("Support Inquiry - Droply User");
  const body = encodeURIComponent("Hi Droply Team,\n\nI need help with: ");
  window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`, "_blank");
};

const handleOpenInstagram = () => {
  window.open("https://instagram.com/dedroply", "_blank");
};

export default function UserHelpPage() {

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Help & Support Tickets
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Reach out via our official support channels or track your active tickets.
          </p>
        </div>

      </div>

      {/* PROMINENT DIRECT SUPPORT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* WhatsApp Card */}
        <button
          onClick={handleOpenWhatsApp}
          className="group bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:border-emerald-500 hover:shadow-md transition-all flex flex-col justify-between text-left cursor-pointer"
        >
          <div>
            <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <FaWhatsapp className="h-5 w-5" />
            </div>
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">WhatsApp Support</h2>
            <p className="text-[11px] text-slate-500 mt-1">Instant chat assistance for urgent operational issues.</p>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs font-bold text-emerald-600 group-hover:translate-x-0.5 transition-transform">
            <span>Chat Now</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </button>

        {/* Email Card */}
        <button
          type="button"
          onClick={handleOpenEmail}
          className="group bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:border-sky-500 hover:shadow-md transition-all flex flex-col justify-between text-left cursor-pointer w-full"
        >
          <div>
            <div className="h-10 w-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <FaEnvelope className="h-4 w-4" />
            </div>
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Email Help Desk</h2>
            <p className="text-[11px] text-slate-500 mt-1">Drop us a mail at <span className="font-bold text-sky-600 text-xs">support@dedroply.com</span> for detailed inquiries.</p>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs font-bold text-sky-600 group-hover:translate-x-0.5 transition-transform">
            <span>Send Email</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </button>

        {/* Instagram Card */}
        <button
          onClick={handleOpenInstagram}
          className="group bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:border-rose-500 hover:shadow-md transition-all flex flex-col justify-between text-left cursor-pointer"
        >
          <div>
            <div className="h-10 w-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <FaInstagram className="h-5 w-5" />
            </div>
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Instagram DM</h2>
            <p className="text-[11px] text-slate-500 mt-1">Follow updates and reach out via <span className="text-rose-600 font-bold text-xs">@dedroply</span></p>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs font-bold text-rose-600 group-hover:translate-x-0.5 transition-transform">
            <span>Follow Us</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </button>
      </div>
    </div>
  );
}