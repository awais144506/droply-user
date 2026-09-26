"use client";

import { useState } from "react";
import { Copy, QrCode, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { useBankDetails } from "../api/use-subscription";
import Image from "next/image";

export function PaymentChannels() {
  const { data: banks, isLoading } = useBankDetails();
  const [selectedQr, setSelectedQr] = useState<string | null>(null);


  const copyToClipboard = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-slate-900">
          Official Droply Payment Channels & QRs
        </h3>
        <p className="text-sm text-slate-500">
          Scan the QR code on your banking app or copy the IBAN/account number to clear renewals.
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        </div>
      ) : banks?.length === 0 ? (
        <div className="text-center p-12 border-2 border-dashed border-slate-200 rounded-xl text-slate-500">
          No payment channels available at the moment.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {banks?.map((bank) => (
            <div
              key={bank.id}
              className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col"
            >
              {/* Card Header: Bank Info */}
              <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                <h4 className="text-slate-900 text-lg">
                  <span className="font-bold text-xs uppercase tracking-wider text-slate-500">Bank:</span>{" "}
                  <span className="font-bold">{bank.bankName}</span>
                </h4>
                <p className="text-sm font-medium text-slate-900 mt-1">
                  <span className="font-bold text-[11px] uppercase tracking-wider text-slate-500">Title: </span>
                  {bank.accountTitle}
                </p>
              </div>

              {/* Card Body: QR Button */}
              <div className="flex-1 flex flex-col items-center justify-center p-6 bg-slate-50/30">
                {bank.qrCodeUrl ? (
                  <button
                    onClick={() => setSelectedQr(bank.qrCodeUrl)}
                    className="flex items-center cursor-pointer justify-center gap-2 w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-colors shadow-sm font-medium"
                  >
                    <QrCode className="w-5 h-5" />
                    Show QR Code
                  </button>
                ) : (
                  <div className="w-full py-3 px-4 flex items-center justify-center gap-2 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-sm font-medium">
                    <QrCode className="w-5 h-5 opacity-50" />
                    No QR Available
                  </div>
                )}
              </div>

              {/* Card Footer: Account Details */}
              <div className="p-5 space-y-3 border-t border-slate-100 bg-white">
                {/* Account Number Field */}
                {bank.accountNumber && (
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Account Number
                    </label>
                    <div
                      onClick={() => copyToClipboard(bank.accountNumber, "Account number")}
                      className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 border border-slate-200 rounded-lg cursor-pointer transition-colors group"
                      title="Click to copy"
                    >
                      <span className="font-mono text-sm font-medium text-slate-700 truncate">
                        {bank.accountNumber}
                      </span>
                      <Copy className="w-4 h-4 text-slate-400 group-hover:text-slate-700 shrink-0 transition-colors" />
                    </div>
                  </div>
                )}

                {/* IBAN Field */}
                {bank.iban && (
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      IBAN
                    </label>
                    <div
                      onClick={() => copyToClipboard(bank.iban, "IBAN")}
                      className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 border border-slate-200 rounded-lg cursor-pointer transition-colors group"
                      title="Click to copy"
                    >
                      <span className="font-mono text-sm font-medium text-slate-700 truncate">
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedQr(null)}
        >
          <div
            className="relative bg-white p-8 rounded-3xl max-w-md w-full flex flex-col items-center shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()} // Prevents closing when clicking the modal body
          >
            <button
              onClick={() => setSelectedQr(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h4 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <QrCode className="w-6 h-6" /> Scan to Pay
            </h4>

            {/* Using Next Image with 'fill' and 'object-contain' prevents uneven stretching */}
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 bg-white rounded-xl border-2 border-slate-100 p-2">
              <Image
                src={selectedQr}
                alt="Enlarged QR Code"
                fill
                className="object-contain p-2"
                priority
              />
            </div>

            <p className="text-sm font-medium text-slate-500 mt-6 text-center">
              Align the QR code within your banking app&apos;s scanner.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}