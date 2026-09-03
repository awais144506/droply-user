"use client";

import { Landmark, Zap, Smartphone, Copy, QrCode } from "lucide-react";
import { toast } from "sonner";

export function PaymentChannels() {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Copied to clipboard: ${text}`);
  };

  const channels = [
    { name: "Meezan Bank", title: "Droply Systems (Pvt) Ltd", type: "Bank Transfer", acc: "0104-0109921448", icon: <Landmark className="h-4 w-4 text-emerald-600" /> },
    { name: "Raast Instant", title: "Droply Tech Operations", type: "0% Fee", acc: "+92 300 9876543", icon: <Zap className="h-4 w-4 text-sky-500" /> },
    { name: "JazzCash", title: "Droply Water Management", type: "Till / Wallet", acc: "0300-9876543", icon: <Smartphone className="h-4 w-4 text-rose-600" /> },
    { name: "Easypaisa", title: "Droply Tech Solutions", type: "Merchant QR", acc: "0345-1234567", icon: <Smartphone className="h-4 w-4 text-emerald-500" /> },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-bold text-slate-900">Official Droply Payment Channels & QRs</h3>
        <p className="text-sm text-slate-500">Scan QR code on your banking app or copy the IBAN/account number to clear renewals.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {channels.map((ch, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col">
            <div className="flex justify-between items-start mb-1">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
                {ch.icon} {ch.name}
              </div>
              <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">{ch.type}</span>
            </div>
            <p className="text-[11px] text-slate-500 mb-4">{ch.title}</p>
            
            <div className="flex-1 flex flex-col items-center justify-center py-4 border-y border-dashed border-slate-200 mb-4">
              <div className="bg-slate-900 p-2 rounded-xl mb-2">
                <QrCode className="h-12 w-12 text-white" />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Scan to Pay</span>
            </div>

            <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-lg p-2.5 mb-2 cursor-pointer hover:bg-slate-100 transition-colors" onClick={() => copyToClipboard(ch.acc)}>
              <span className="font-mono text-xs font-bold text-slate-700">{ch.acc}</span>
              <Copy className="h-3.5 w-3.5 text-slate-400" />
            </div>

            <button className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold rounded-lg border border-slate-100 transition-colors flex items-center justify-center gap-1.5">
              <QrCode className="h-3.5 w-3.5" /> Fullscreen QR
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}