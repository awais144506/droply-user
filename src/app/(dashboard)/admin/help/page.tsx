"use client";

import { useState } from "react";
import {
  Send,
  Paperclip,
  X,
  CheckCircle2,
  Image as ImageIcon,
  Clock,
  Plus,
  RefreshCw,
} from "lucide-react";
import { FaWhatsapp, FaInstagram, FaEnvelope } from "react-icons/fa6";

export interface TicketResponse {
  id: string;
  ticketNumber: string;
  subject: string;
  type: "BUG" | "FEATURE" | "SUPPORT";
  status: "OPEN" | "IN_PROGRESS" | "RESOLVED";
  createdAt: string;
  updatedAt: string;
  userMessage: string;
  attachmentName?: string;
  adminReply?: {
    repliedBy: string;
    text: string;
    repliedAt: string;
  };
}

const MOCK_SUBMITTED_TICKETS: TicketResponse[] = [
  {
    id: "ut-101",
    ticketNumber: "TK-9021",
    subject: "Rider offline sync queue not clearing in Farid Town",
    type: "BUG",
    status: "IN_PROGRESS",
    createdAt: "Aug 29, 2026, 10:20 AM",
    updatedAt: "11:05 AM",
    userMessage: "Hi, rider Majid completed 5 drops offline in Farid Town, but 2 drops are stuck in pending.",
    attachmentName: "farid_town_sync_err.png",
    adminReply: {
      repliedBy: "Droply Engineering Desk",
      text: "We identified a delta lock on the local SQLite queue. Please ask Majid to tap 'Force Sync' on Wi-Fi. A patch has been deployed.",
      repliedAt: "11:05 AM",
    },
  },
  {
    id: "ut-100",
    ticketNumber: "TK-8810",
    subject: "Request for Bluetooth thermal printer integration",
    type: "FEATURE",
    status: "RESOLVED",
    createdAt: "Aug 20, 2026",
    updatedAt: "Aug 22, 2026",
    userMessage: "Would love to print cash receipts directly from the rider app using Sunmi mobile printers.",
    adminReply: {
      repliedBy: "Droply Product Team",
      text: "ESC/POS Bluetooth printing has been enabled in the latest app update v2.4. You can enable it under Mobile App Settings.",
      repliedAt: "Aug 22, 2026",
    },
  },
];

export default function UserHelpPage() {
  const [activeTab, setActiveTab] = useState<"NEW" | "INBOX">("INBOX");
  const [tickets, setTickets] = useState<TicketResponse[]>(MOCK_SUBMITTED_TICKETS);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // New Ticket Form State
  const [type, setType] = useState<"BUG" | "FEATURE" | "SUPPORT">("BUG");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    // Simulate lightweight API fetch for ticket status updates
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newTicket: TicketResponse = {
      id: `ut-${Date.now()}`,
      ticketNumber: `TK-${Math.floor(1000 + Math.random() * 9000)}`,
      subject: subject || "Support Ticket",
      type,
      status: "OPEN",
      createdAt: "Just now",
      updatedAt: "Just now",
      userMessage: message,
      attachmentName: file ? file.name : undefined,
    };

    setTickets([newTicket, ...tickets]);
    setSubject("");
    setMessage("");
    setFile(null);
    setActiveTab("INBOX");
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-5">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Help & Support Tickets
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Submit issues and check official replies from Droply support.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setActiveTab("INBOX")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "INBOX"
                ? "bg-white text-slate-900 shadow-2xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Support Inbox ({tickets.length})
          </button>
          <button
            onClick={() => setActiveTab("NEW")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1 transition-all cursor-pointer ${
              activeTab === "NEW"
                ? "bg-sky-600 text-white shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Submit Ticket</span>
          </button>
        </div>
      </div>

      {/* TAB 1: ONE-WAY SUPPORT INBOX */}
      {activeTab === "INBOX" && (
        <div className="space-y-3">
          {/* Refresh Action Bar */}
          <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-200/90 shadow-2xs text-xs">
            <span className="text-slate-500 font-medium">
              Official Admin Responses & Status Logs
            </span>

            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="h-8 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-sky-600" : ""}`} />
              <span>{isRefreshing ? "Checking..." : "Refresh Inbox"}</span>
            </button>
          </div>

          {/* Ticket Cards List */}
          <div className="space-y-3">
            {tickets.length > 0 ? (
              tickets.map((t) => (
                <div
                  key={t.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs space-y-3"
                >
                  {/* Top Bar */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-slate-900">
                        {t.ticketNumber}
                      </span>
                      <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                        {t.type}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {t.createdAt}
                      </span>
                    </div>

                    {t.status === "RESOLVED" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Resolved</span>
                      </span>
                    ) : t.status === "IN_PROGRESS" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
                        <Clock className="h-3 w-3" />
                        <span>Under Investigation</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        <Clock className="h-3 w-3" />
                        <span>Queued for Review</span>
                      </span>
                    )}
                  </div>

                  {/* Subject & User Submitted Message */}
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{t.subject}</h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <strong className="text-slate-700 font-semibold block text-[10px] uppercase mb-0.5">Your Submission:</strong>
                      {t.userMessage}
                    </p>
                    {t.attachmentName && (
                      <span className="text-[10px] font-mono text-slate-400 mt-1 block">
                        📎 Attached: {t.attachmentName}
                      </span>
                    )}
                  </div>

                  {/* Admin Reply Section */}
                  {t.adminReply ? (
                    <div className="p-3 bg-sky-50/70 rounded-xl border border-sky-200/70 text-xs space-y-1">
                      <div className="flex items-center justify-between text-sky-900 font-bold text-[11px]">
                        <span>💬 Reply from {t.adminReply.repliedBy}</span>
                        <span className="text-[10px] text-sky-700 font-mono font-normal">
                          {t.adminReply.repliedAt}
                        </span>
                      </div>
                      <p className="text-slate-800 leading-relaxed font-medium">
                        {t.adminReply.text}
                      </p>
                    </div>
                  ) : (
                    <div className="p-2.5 bg-slate-50 rounded-xl text-center text-[11px] text-slate-400 italic">
                      No admin reply yet. Droply support usually responds within 1 hour.
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="py-16 text-center text-slate-400 bg-white rounded-2xl border border-slate-200/90 text-xs">
                No tickets submitted yet. Click &quot;Submit Ticket&quot; to reach out.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: SUBMIT TICKET FORM */}
      {activeTab === "NEW" && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs">
          <form onSubmit={handleCreateTicket} className="space-y-4">
            {/* Category Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-fit">
              {[
                { id: "BUG", label: "Report Bug" },
                { id: "FEATURE", label: "Feature Request" },
                { id: "SUPPORT", label: "General Support" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setType(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    type === tab.id
                      ? "bg-white text-slate-900 shadow-2xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Subject */}
            <div>
              <input
                type="text"
                placeholder="Subject / Short title..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full h-9 px-3 rounded-xl border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                required
              />
            </div>

            {/* Message Area */}
            <div>
              <textarea
                rows={4}
                placeholder="Describe your issue or suggestion in detail..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 resize-none leading-relaxed"
                required
              />
            </div>

            {/* File Upload */}
            <div className="flex items-center justify-between pt-1">
              <div>
                <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-medium cursor-pointer transition-colors">
                  <Paperclip className="h-3.5 w-3.5 text-slate-400" />
                  <span>{file ? "Change Screenshot" : "Attach Screenshot"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                </label>

                {file && (
                  <div className="inline-flex items-center gap-1 ml-2 text-xs font-medium text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                    <ImageIcon className="h-3 w-3 text-slate-500" />
                    <span className="truncate max-w-[140px]">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      className="hover:text-rose-600 p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="inline-flex items-center gap-1.5 h-9 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Submit Ticket</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Official Brand Social Bar */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2 border-t border-slate-200/80">
        <a
          href="https://wa.me/923001234567"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:border-emerald-500 hover:text-emerald-700 text-xs font-medium transition-all shadow-2xs"
        >
          <FaWhatsapp className="h-4 w-4 text-emerald-600" />
          <span>WhatsApp</span>
        </a>

        <a
          href="mailto:support@droply.pk"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:border-sky-500 hover:text-sky-700 text-xs font-medium transition-all shadow-2xs"
        >
          <FaEnvelope className="h-3.5 w-3.5 text-sky-600" />
          <span>support@droply.pk</span>
        </a>

        <a
          href="https://instagram.com/droply.pk"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:border-rose-500 hover:text-rose-700 text-xs font-medium transition-all shadow-2xs"
        >
          <FaInstagram className="h-4 w-4 text-rose-600" />
          <span>@droply.pk</span>
        </a>
      </div>
    </div>
  );
}