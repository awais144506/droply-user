
"use client";

import React from "react";
import { format } from "date-fns";
import {
  ShieldCheck,
  RotateCcw,
  Phone,
  Calendar,
  Trash2,
} from "lucide-react";
import { ColumnDef } from "@/lib/utils/components/TableCreateMachine";
import { CustomerRecoveryRecord, SaleReturnRecord } from "../types/recovery.types";

interface RecoveryColumnActions {
  onDeleteRecovery: (recovery: CustomerRecoveryRecord) => void;
  onDeleteSaleReturn: (saleReturn: SaleReturnRecord) => void;
}

// Unified Union Type for the Table Rows
export type RecoveryTableRecord =
  | (CustomerRecoveryRecord & { recordType: "RECOVERY" })
  | (SaleReturnRecord & { recordType: "SALE_RETURN" });

export const getRecoveryColumns = ({
  onDeleteRecovery,
  onDeleteSaleReturn,
}: RecoveryColumnActions): ColumnDef<RecoveryTableRecord>[] => [
    {
      header: "Code & Type",
      render: (record) => {
        const isRecovery = record.recordType === "RECOVERY";
        const code = isRecovery
          ? (record as CustomerRecoveryRecord).recoveryCode
          : (record as SaleReturnRecord).returnCode;

        return (
          <div className="flex items-start gap-2.5 py-1">
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${isRecovery
                  ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                  : "bg-sky-50 text-sky-600 border-sky-100"
                }`}
            >
              {isRecovery ? (
                <ShieldCheck className="h-4 w-4" />
              ) : (
                <RotateCcw className="h-4 w-4" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-slate-900 text-sm block">
                  #{code}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${isRecovery
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-sky-100 text-sky-800"
                    }`}
                >
                  {isRecovery ? "Recovery" : "Sale Return"}
                </span>
              </div>
              <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1 mt-0.5">
                <Calendar className="h-3 w-3 text-slate-400" />
                {record.createdAt ? format(new Date(record.createdAt), "dd MMM yyyy, hh:mm a") : "N/A"}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      header: "Customer",
      render: (record) => (
        <div>
          <span className="font-extrabold text-slate-900 text-sm block">
            {record.customer?.name || "Walk-in Customer"}
          </span>
          <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
            <Phone className="h-3 w-3 text-slate-400" />
            {record.customer?.phone || "No Phone"}
          </span>
        </div>
      ),
    },
    {
      header: "Financial Settlement",
      render: (record) => {
        const isRecovery = record.recordType === "RECOVERY";
        if (isRecovery) {
          const rec = record as CustomerRecoveryRecord;
          return (
            <div>
              <span className="text-xs font-bold text-emerald-700 block">
                Received: Rs {Number(rec.amountReceived || 0).toLocaleString()}
              </span>
              <span className="text-[11px] text-slate-500">
                Via {rec.paymentMethod} • Remaining Ledger: Rs {Number(rec.remainingCredit || 0).toLocaleString()}
              </span>
            </div>
          );
        } else {
          const ret = record as SaleReturnRecord;
          return (
            <div>
              <span className="text-xs font-bold text-sky-700 block">
                Refund: Rs {Number(ret.totalRefundAmount || 0).toLocaleString()}
              </span>
              <span className="text-[11px] text-slate-500">
                Ledger Adjusted: Rs {Number(ret.khataCredited || 0).toLocaleString()} • Cash: Rs {Number(ret.cashRefunded || 0).toLocaleString()}
              </span>
            </div>
          );
        }
      },
    },
    {
      header: "Items Recovered / Returned",
      render: (record) => {
        const isRecovery = record.recordType === "RECOVERY";
        if (isRecovery) {
          const rec = record as CustomerRecoveryRecord;
          const items = rec.recoveredItems || [];
          return (
            <div className="flex flex-wrap gap-1 max-w-xs">
              {items.length === 0 ? (
                <span className="text-xs text-slate-400">Ledger Cash Only</span>
              ) : (
                items.map((i) => (
                  <span
                    key={i.id}
                    className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-bold"
                  >
                    {i.product?.name}: <strong className="text-emerald-700">+{i.quantityReturned}</strong>
                  </span>
                ))
              )}
            </div>
          );
        } else {
          const ret = record as SaleReturnRecord;
          const items = ret.items || [];
          return (
            <div className="flex flex-wrap gap-1 max-w-xs">
              {items.map((i) => (
                <span
                  key={i.id}
                  className="px-2 py-0.5 rounded-md bg-sky-50 text-sky-800 border border-sky-100 text-[11px] font-bold"
                >
                  {i.product?.name}: <strong className="text-sky-900">-{i.returnQuantity}</strong>
                </span>
              ))}
            </div>
          );
        }
      },
    },
    {
      header: "Actions",
      render: (record) => {
        const isRecovery = record.recordType === "RECOVERY";
        return (
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() =>
                isRecovery
                  ? onDeleteRecovery(record as CustomerRecoveryRecord)
                  : onDeleteSaleReturn(record as SaleReturnRecord)
              }
              className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              title="Delete Record"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        );
      },
    },
  ];