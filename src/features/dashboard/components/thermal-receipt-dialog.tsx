"use client";
import { Printer, CheckCircle2, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BranchSettingData } from "@/features/admin/settings/types/settings";
import { formatPhoneNumber } from "react-phone-number-input";

export interface ReceiptOrderData {
  receiptNumber: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  paymentMethod: "CASH" | "ONLINE";
  items: {
    id: string;
    name: string;
    qty: number;
    price: number;
    unit?: string;
  }[];
  discount: number;
  subTotal: number;
  grandTotal: number;
  cashReceived: number;
  changeDue: number;
}

interface ThermalReceiptDialogProps {
  isOpen: boolean;
  onClose: () => void;
  order: ReceiptOrderData | null;
  branchDetails?: BranchSettingData;
}

export default function ThermalReceiptDialog({
  isOpen,
  onClose,
  order,
  branchDetails,
}: ThermalReceiptDialogProps) {
  if (!order) return null;

  const handlePrintThermal = () => {
    const printContents = document.getElementById("thermal-receipt-area")?.innerHTML;
    if (!printContents) return;

    // 1. Remove any lingering print iframe
    const existingIframe = document.getElementById("pos-thermal-print-iframe");
    if (existingIframe) {
      existingIframe.remove();
    }

    // 2. Create an invisible 0x0 iframe so no popup tab/window ever flashes
    const iframe = document.createElement("iframe");
    iframe.id = "pos-thermal-print-iframe";
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    iframe.style.visibility = "hidden";
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) return;

    // 3. Write self-contained 80mm thermal CSS that mirrors the preview classes
    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Receipt #${order.receiptNumber}</title>
          <style>
            @page {
              margin: 0;
              size: 80mm auto;
            }
            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
            }
            body {
              font-family: 'Courier New', Courier, monospace;
              width: 74mm;
              margin: 0 auto;
              padding: 6px 2px 12px 2px;
              font-size: 11px;
              line-height: 1.35;
              color: #000;
              background: #fff;
            }
            .text-center { text-align: center; }
            .text-left { text-align: left; }
            .text-right { text-align: right; }
            .font-bold { font-weight: 700; }
            .font-semibold { font-weight: 600; }
            .uppercase { text-transform: uppercase; }
            .text-sm { font-size: 13px; }
            .text-xs { font-size: 11px; }
            .flex { display: flex; }
            .justify-between { justify-content: space-between; }
            .divider {
              border-top: 1px dashed #000;
              margin: 6px 0;
            }
            .space-y-0\\.5 > * + * { margin-top: 2px; }
            .space-y-1 > * + * { margin-top: 4px; }
            .pt-1 { padding-top: 4px; }
            .pb-1 { padding-bottom: 4px; }
            .py-1 { padding-top: 3px; padding-bottom: 3px; }
            .pr-1 { padding-right: 4px; }
            .border-t { border-top: 1px dashed #000; }
            .border-b { border-bottom: 1px dashed #000; }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 4px 0;
            }
            th, td {
              font-size: 11px;
              vertical-align: top;
            }
            tbody tr + tr td {
              border-top: 1px dotted #ccc;
            }
          </style>
        </head>
        <body>
          ${printContents}
        </body>
      </html>
    `);
    doc.close();

    // 4. Trigger native print dialog directly & clean up iframe afterwards
    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();

      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 1500);

      onClose();
    }, 150);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2.5 text-emerald-600">
            <CheckCircle2 className="h-6 w-6 shrink-0" />
            <DialogTitle className="text-lg font-bold text-slate-900">
              Sale Completed! Print Receipt?
            </DialogTitle>
          </div>
        </DialogHeader>

        {/* 80mm Thermal Printer Paper Preview */}
        <div className="bg-white p-4 rounded-xl flex justify-center max-h-95 overflow-y-auto border border-slate-200">
          <div
            id="thermal-receipt-area"
            className="bg-white w-72.5 p-4  font-mono text-xs text-slate-900 space-y-2"
          >
            {/* Dynamic Branch Header */}
            <div className="text-center space-y-0.5">
              <p className="font-bold text-sm tracking-tight uppercase">
                {branchDetails?.name || "BLUE MIST RO PLANT"}
              </p>
              <p className="text-[11px] text-slate-600">
                {branchDetails?.address || "Main Boulevard, Sahiwal"}
              </p>
              <p className="text-[11px] text-slate-600">
                Tel: {formatPhoneNumber(branchDetails?.phone) || "0300-1234567"}
              </p>
            </div>

            <div className="border-t border-dashed border-slate-400 my-2 divider" />

            {/* Receipt Meta Details */}
            <div className="space-y-0.5 text-[11px]">
              <div className="flex justify-between">
                <span>Receipt #:</span>
                <span className="font-bold">{order.receiptNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Date:</span>
                <span>{order.createdAt}</span>
              </div>
              <div className="flex justify-between">
                <span>Customer:</span>
                <span className="font-semibold">{order.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span>Phone:</span>
                <span className="font-semibold">{order.customerPhone}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment:</span>
                <span className="font-semibold">{order.paymentMethod}</span>
              </div>
            </div>

            <div className="border-t border-dashed border-slate-400 my-2 divider" />

            {/* Line Items Table */}
            <table className="w-full text-[11px]">
              <thead>
                <tr className="border-b border-dashed border-slate-300 text-left">
                  <th className="pb-1">Item</th>
                  <th className="pb-1 text-center">Qty</th>
                  <th className="pb-1 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dashed divide-slate-200">
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td className="py-1 pr-1">
                      <div className="font-semibold">{item.name}</div>
                      <div className="text-[10px] text-slate-500">
                        @ Rs.{Number(item.price).toLocaleString()}
                      </div>
                    </td>
                    <td className="py-1 text-center">{item.qty}</td>
                    <td className="py-1 text-right font-semibold">
                      Rs.{(item.qty * item.price).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="border-t border-dashed border-slate-400 my-2 divider" />

            {/* Financial Totals */}
            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>Rs. {order.subTotal.toLocaleString()}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between">
                  <span>Discount:</span>
                  <span>- Rs. {order.discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-bold border-t border-dashed border-slate-400 pt-1">
                <span>TOTAL:</span>
                <span>Rs. {order.grandTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span>Cash Received:</span>
                <span>Rs. {order.cashReceived.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Change Due:</span>
                <span>Rs. {order.changeDue.toLocaleString()}</span>
              </div>
            </div>

            <div className="border-t border-dashed border-slate-400 my-2 divider" />

            <div className="text-center text-[10px] text-slate-500 pt-1">
              Thank you for shopping!
            </div>
          </div>
        </div>

        <DialogFooter className="flex sm:justify-between gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto border-slate-300 text-slate-700"
          >
            <PlusCircle className="mr-1.5 h-4 w-4" />
            Skip & New Sale
          </Button>
          <Button
            type="button"
            onClick={handlePrintThermal}
            className="w-full sm:w-auto bg-sky-600 hover:bg-sky-700 text-white"
          >
            <Printer className="mr-1.5 h-4 w-4" />
            Print Thermal Receipt
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}