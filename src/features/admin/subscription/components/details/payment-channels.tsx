"use client";

import { useState } from "react";
import { Copy, QrCode, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { useSubscription } from "../../api/use-subscription";
import Image from "next/image";
import { useRole } from "@/lib/hooks/use-role";

export function PaymentChannels() {
  const { branchId } = useRole();
  const { data: subscription, isLoading } = useSubscription(branchId);
  const [selectedQr, setSelectedQr] = useState<string | null>(null);

  const activeBanks = subscription?.bankDetails?.filter((bank) => bank.isActive) ?? [];

  const copyToClipboard = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  return (
    <div className="space-y-4 sm:space-y-6 min-w-0">
      {isLoading ? (
        <div className="flex items-center justify-center p-10 sm:p-12">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        </div>
      ) : activeBanks.length === 0 ? (
        <div className="text-center p-8 sm:p-12 border-2 border-dashed border-slate-200 rounded-xl text-xs sm:text-sm text-slate-500">
          No payment channels available at the moment.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 min-w-0">
          {activeBanks.map((bank) => (
            <div
              key={bank.id}
              className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col min-w-0"
            >
              {/* Card Header: Bank Info */}
              <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50 min-w-0">
                <h4 className="text-slate-900 text-base sm:text-lg wrap-break-word">
                  <span className="font-bold text-xs uppercase tracking-wider text-slate-500">Bank:</span>{" "}
                  <span className="font-bold">{bank.bankName}</span>
                </h4>
                <p className="text-xs sm:text-sm font-medium text-slate-900 mt-1 wrap-break-word">
                  <span className="font-bold text-[11px] uppercase tracking-wider text-slate-500">Title: </span>
                  {bank.accountTitle}
                </p>
              </div>

              {/* Card Body: QR Button */}
              <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 bg-slate-50/30">
                {bank.qrCodeUrl ? (
                  <button
                    type="button"
                    onClick={() => setSelectedQr(bank.qrCodeUrl)}
                    className="flex items-center cursor-pointer justify-center gap-2 w-full py-2.5 sm:py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm rounded-xl transition-colors shadow-sm font-medium whitespace-nowrap"
                  >
                    <QrCode className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                    <span>Show QR Code</span>
                  </button>
                ) : (
                  <div className="w-full py-2.5 sm:py-3 px-4 flex items-center justify-center gap-2 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-xs sm:text-sm font-medium whitespace-nowrap">
                    <QrCode className="w-4 h-4 sm:w-5 sm:h-5 opacity-50 shrink-0" />
                    <span>No QR Available</span>
                  </div>
                )}
              </div>

              {/* Card Footer: Account Details */}
              <div className="p-4 sm:p-5 space-y-3 border-t border-slate-100 bg-white min-w-0">
                {/* Account Number Field */}
                {bank.accountNumber && (
                  <div className="space-y-1.5 min-w-0">
                    <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Account Number
                    </label>
                    <div
                      onClick={() => copyToClipboard(bank.accountNumber, "Account number")}
                      className="flex items-center justify-between gap-2 p-2.5 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 border border-slate-200 rounded-lg cursor-pointer transition-colors group min-w-0"
                      title="Click to copy"
                    >
                      <span className="font-mono text-xs sm:text-sm font-medium text-slate-700 truncate min-w-0">
                        {bank.accountNumber}
                      </span>
                      <Copy className="w-4 h-4 text-slate-400 group-hover:text-slate-700 shrink-0 transition-colors" />
                    </div>
                  </div>
                )}

                {/* IBAN Field */}
                {bank.iban && (
                  <div className="space-y-1.5 min-w-0">
                    <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      IBAN
                    </label>
                    <div
                      onClick={() => copyToClipboard(bank.iban, "IBAN")}
                      className="flex items-center justify-between gap-2 p-2.5 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 border border-slate-200 rounded-lg cursor-pointer transition-colors group min-w-0"
                      title="Click to copy"
                    >
                      <span className="font-mono text-xs sm:text-sm font-medium text-slate-700 truncate min-w-0">
                        {bank.iban}
                      </span>
                      <Copy className="w-4 h-4 text-slate-400 group-hover:text-slate-700 shrink-0 transition-colors" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Full Screen QR Modal */}
      {selectedQr && (
        <div
          className="fixed inset-0 z-9999 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedQr(null)}
        >
          <div
            className="relative bg-white p-5 sm:p-8 rounded-2xl sm:rounded-3xl max-w-md w-full flex flex-col items-center shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedQr(null)}
              className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <h4 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 sm:mb-6 flex items-center gap-2">
              <QrCode className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
              <span>Scan to Pay</span>
            </h4>

            <div className="relative w-52 h-52 sm:w-72 sm:h-72 bg-white rounded-xl border-2 border-slate-100 p-2">
              <Image
                src={selectedQr}
                alt="Enlarged QR Code"
                fill
                className="object-contain p-2"
                priority
              />
            </div>

            <p className="text-xs sm:text-sm font-medium text-slate-500 mt-4 sm:mt-6 text-center leading-relaxed">
              Align the QR code within your banking app&apos;s scanner.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}