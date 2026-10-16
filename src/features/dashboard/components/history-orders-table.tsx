"use client";
import { useState } from "react";
import { 
  ReceiptText, 
  Printer, 
  FileEdit, 
  Ban, 
  Search, 
  CheckCircle2, 
  XCircle,
  Calendar,
  Eye
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ThermalReceiptDialog, { ReceiptOrderData } from "./thermal-receipt-dialog";

// Dummy History Data
const INITIAL_HISTORY = [
  {
    id: "qs-101",
    receiptNumber: "QS-481920",
    customerName: "Ali Khan",
    paymentMethod: "CASH" as const,
    subTotal: 1200,
    discount: 50,
    grandTotal: 1150,
    cashReceived: 1500,
    changeDue: 350,
    createdAt: "16 Oct 2026, 10:45 AM",
    status: "PAID" as "PAID" | "VOIDED",
    items: [
      { id: "p1", name: "19L Mineral Water Refill", qty: 2, price: 120, unit: "Bottle" },
      { id: "p2", name: "19L New Empty Bottle + Security", qty: 1, price: 1100, unit: "Bottle" },
    ],
  },
  {
    id: "qs-102",
    receiptNumber: "QS-938211",
    customerName: "Walk-in Customer",
    paymentMethod: "ONLINE" as const,
    subTotal: 360,
    discount: 0,
    grandTotal: 360,
    cashReceived: 360,
    changeDue: 0,
    createdAt: "16 Oct 2026, 11:15 AM",
    status: "PAID" as "PAID" | "VOIDED",
    items: [
      { id: "p3", name: "500ml Carton (12 Pet Bottles)", qty: 1, price: 360, unit: "Carton" },
    ],
  },
  {
    id: "qs-103",
    receiptNumber: "QS-112938",
    customerName: "Usman Ahmed",
    paymentMethod: "CASH" as const,
    subTotal: 4500,
    discount: 200,
    grandTotal: 4300,
    cashReceived: 5000,
    changeDue: 700,
    createdAt: "16 Oct 2026, 12:30 PM",
    status: "VOIDED" as "PAID" | "VOIDED",
    items: [
      { id: "p4", name: "Table Top Water Dispenser", qty: 1, price: 4500, unit: "Unit" },
    ],
  },
];



const QuickSaleHistory = () => {
  const [sales, setSales] = useState(INITIAL_HISTORY);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptOrderData | null>(null);

  // Filter sales by receipt number or customer name
  const filteredSales = sales.filter((sale) => {
    const q = searchQuery.toLowerCase();
    return (
      sale.receiptNumber.toLowerCase().includes(q) ||
      sale.customerName.toLowerCase().includes(q)
    );
  });

  // Handle Void Action
  const handleVoidSale = (id: string, receiptNum: string) => {
    setSales((prev) =>
      prev.map((sale) => (sale.id === id ? { ...sale, status: "VOIDED" } : sale))
    );
    toast.error(`Receipt #${receiptNum} has been voided.`);
  };

  // Handle Reprint Trigger
  const handlePrintReceipt = (sale: (typeof INITIAL_HISTORY)[0]) => {
    setSelectedReceipt({
      receiptNumber: sale.receiptNumber,
      createdAt: sale.createdAt,
      customerName: sale.customerName,
      paymentMethod: sale.paymentMethod,
      items: sale.items,
      discount: sale.discount,
      subTotal: sale.subTotal,
      grandTotal: sale.grandTotal,
      cashReceived: sale.cashReceived,
      changeDue: sale.changeDue,
    });
  };

  return (
    <div className="space-y-6">
      <Card className="border-slate-200/90 shadow-xs rounded-2xl">
        <CardHeader className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <ReceiptText className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-slate-900">
                Quick Sale History & Slips
              </CardTitle>
              <p className="text-xs text-slate-500">
                View past over-the-counter sales, reprint slips, or void transactions (Deletion disabled for audit compliance)
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search receipt # or customer..."
              className="pl-9 h-9 text-xs bg-slate-50 border-slate-200"
            />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/70">
              <TableRow>
                <TableHead className="text-xs font-bold text-slate-700 py-3 pl-6">
                  Receipt #
                </TableHead>
                <TableHead className="text-xs font-bold text-slate-700 py-3">
                  Customer Name
                </TableHead>
                <TableHead className="text-xs font-bold text-slate-700 py-3">
                  Payment Mode
                </TableHead>
                <TableHead className="text-xs font-bold text-slate-700 py-3">
                  Total Amount
                </TableHead>
                <TableHead className="text-xs font-bold text-slate-700 py-3">
                  Status
                </TableHead>
                <TableHead className="text-xs font-bold text-slate-700 py-3">
                  Date & Time
                </TableHead>
                <TableHead className="text-xs font-bold text-slate-700 py-3 text-right pr-6">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-100">
              {filteredSales.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center text-xs text-slate-400">
                    No quick sale records found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredSales.map((sale) => {
                  const isVoided = sale.status === "VOIDED";
                  return (
                    <TableRow key={sale.id} className={isVoided ? "bg-slate-50/60 opacity-70" : "hover:bg-slate-50/40"}>
                      <TableCell className="py-3.5 pl-6 font-mono text-xs font-bold text-slate-800">
                        {sale.receiptNumber}
                      </TableCell>
                      <TableCell className="py-3.5 text-xs font-medium text-slate-800">
                        {sale.customerName}
                      </TableCell>
                      <TableCell className="py-3.5 text-xs">
                        <span className="inline-flex px-2 py-0.5 rounded-md font-semibold bg-slate-100 text-slate-700 text-[11px]">
                          {sale.paymentMethod}
                        </span>
                      </TableCell>
                      <TableCell className="py-3.5 text-xs font-extrabold text-sky-700">
                        Rs. {sale.grandTotal.toLocaleString()}
                      </TableCell>
                      <TableCell className="py-3.5 text-xs">
                        {isVoided ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold">
                            <XCircle className="h-3 w-3" /> VOIDED
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                            <CheckCircle2 className="h-3 w-3" /> PAID
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="py-3.5 text-xs text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3 w-3 text-slate-400" />
                          {sale.createdAt}
                        </div>
                      </TableCell>
                      <TableCell className="py-3.5 pr-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Print Thermal Slip Button */}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handlePrintReceipt(sale)}
                            className="h-8 px-2.5 text-xs border-slate-200 text-sky-700 hover:bg-sky-50"
                            title="Print Thermal Receipt"
                          >
                            <Printer className="h-3.5 w-3.5 mr-1" /> Print
                          </Button>

                          {/* Edit Button (if Active) */}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={isVoided}
                            onClick={() => toast.info(`Editing transaction #${sale.receiptNumber}`)}
                            className="h-8 px-2.5 text-xs border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                            title="Edit Transaction"
                          >
                            <FileEdit className="h-3.5 w-3.5" />
                          </Button>

                          {/* Void Button */}
                          {!isVoided && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleVoidSale(sale.id, sale.receiptNumber)}
                              className="h-8 px-2.5 text-xs border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300"
                              title="Void Transaction"
                            >
                              <Ban className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Thermal Receipt Preview & Print Modal */}
      <ThermalReceiptDialog
        isOpen={Boolean(selectedReceipt)}
        onClose={() => setSelectedReceipt(null)}
        order={selectedReceipt}
      />
    </div>
  );
};

export default QuickSaleHistory;