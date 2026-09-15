"use client";

import { UploadCloud, Check, AlertTriangle, Clock } from "lucide-react";
import { BillingRecord } from "../api/use-subscription";
import { Button } from "@/components/ui/button";

export function BillingLedger({ ledger }: { ledger: BillingRecord[] }) {
  const formatCurrency = (val: number) => `Rs ${val.toLocaleString("en-PK")}`;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
      <div className="p-6 border-b border-slate-100">
        <h3 className="text-lg font-bold text-slate-900">Billing Ledger & Verification Log</h3>
        <p className="text-sm text-slate-500">Track submitted transfer slips and Droply admin clearance stamps.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50/50 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 whitespace-nowrap">Billing Month</th>
              <th className="px-6 py-4 whitespace-nowrap">Billing Period</th>
              <th className="px-6 py-4 whitespace-nowrap">Fee (PKR)</th>
              <th className="px-6 py-4 whitespace-nowrap">Due Date</th>
              <th className="px-6 py-4 whitespace-nowrap">Status</th>
              <th className="px-6 py-4 whitespace-nowrap">Verification Ref</th>
              <th className="px-6 py-4 whitespace-nowrap text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {ledger.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-bold text-slate-900">{row.billingMonth}</p>
                  <p className="text-[10px] font-mono text-slate-400 mt-0.5 uppercase">{row.invoiceRef}</p>
                </td>
                <td className="px-6 py-4 text-xs font-medium text-slate-500">{row.billingPeriod}</td>
                <td className="px-6 py-4 font-bold text-slate-900">{formatCurrency(row.feePKR)}</td>
                <td className="px-6 py-4 text-xs font-medium text-slate-500">{new Date(row.dueDate).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })}</td>
                
                <td className="px-6 py-4">
                  {row.status === "UNPAID" && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 text-[10px] font-bold border border-rose-100">
                      <AlertTriangle className="h-3 w-3" /> Unpaid
                    </span>
                  )}
                  {row.status === "PENDING_VERIFICATION" && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-100">
                      <Clock className="h-3 w-3" /> Verifying...
                    </span>
                  )}
                  {row.status === "CLEARED" && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-100">
                      <Check className="h-3 w-3" /> Cleared
                    </span>
                  )}
                </td>

                <td className="px-6 py-4">
                  {row.verificationRef ? (
                    <div>
                      <p className="text-[11px] font-bold text-slate-900">{row.verificationRef}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{row.verificationDate}</p>
                    </div>
                  ) : (
                    <span className="text-slate-300">—</span>
                  )}
                </td>

                <td className="px-6 py-4 text-right">
                  {row.status === "UNPAID" ? (
                    <Button size="sm" className="bg-sky-600 hover:bg-sky-700 text-white rounded-xl h-8 text-xs font-bold shadow-sm">
                      <UploadCloud className="h-3.5 w-3.5 mr-1.5" /> Upload Slip
                    </Button>
                  ) : row.status === "PENDING_VERIFICATION" ? (
                    <span className="text-xs font-bold text-amber-500">Processing...</span>
                  ) : (
                    <div className="flex items-center justify-end gap-1.5 text-emerald-600">
                      <Check className="h-4 w-4" /> <span className="text-xs font-bold">Verified</span>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}