/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { Search, Printer, Pencil, Trash2, Landmark, Wallet, CreditCard, CheckCircle2, Clock } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import { SupplierPayment, PaymentStatus } from "../api/use-supplier-payments";
import { Button } from "@/components/ui/button";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type FilterType = "ALL" | PaymentStatus;

export function PaymentTable({ payments, onEdit }: { payments: SupplierPayment[], onEdit: (p: SupplierPayment) => void }) {
  const [localPayments, setLocalPayments] = useState<SupplierPayment[]>([]);
  useEffect(() => { setLocalPayments(payments); }, [payments]);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterType>("ALL");
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; 

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<SupplierPayment | null>(null);

  useEffect(() => { setCurrentPage(1); }, [searchQuery, statusFilter]);

  const filteredPayments = localPayments.filter((p) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      p.voucherNumber.toLowerCase().includes(searchLower) || 
      p.supplierName.toLowerCase().includes(searchLower) ||
      p.poRef.toLowerCase().includes(searchLower);
    
    if (statusFilter !== "ALL") return matchesSearch && p.status === statusFilter;
    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPayments = filteredPayments.slice(startIndex, startIndex + itemsPerPage);

  const formatCurrency = (val: number) => `Rs ${val.toLocaleString("en-PK")}`;
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const getMethodIcon = (method: string) => {
    if (method === "BANK_TRANSFER") return <Landmark className="h-3.5 w-3.5 text-sky-600" />;
    if (method === "CASH") return <Wallet className="h-3.5 w-3.5 text-amber-600" />;
    return <CreditCard className="h-3.5 w-3.5 text-purple-600" />;
  };

  const getMethodLabel = (method: string) => {
    if (method === "BANK_TRANSFER") return "Bank Transfer";
    if (method === "CASH") return "Cash Voucher";
    return "Cheque Payment";
  };

  const handleDeleteClick = (payment: SupplierPayment) => {
    setSelectedPayment(payment);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedPayment) return;
    setLocalPayments(prev => prev.filter(p => p.id !== selectedPayment.id));
    toast.success(`Voucher ${selectedPayment.voucherNumber} has been deleted.`);
    setDeleteModalOpen(false);
  };

  const handlePrint = (payment: SupplierPayment) => {
    toast.success(`Generating Voucher PDF for ${payment.voucherNumber}...`);
    
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(2, 132, 199);
    doc.text("Droply Disbursments", 14, 22);
    
    doc.setFontSize(16);
    doc.setTextColor(15, 23, 42);
    doc.text("PAYMENT VOUCHER", 14, 32);
    
    // Meta Info
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Voucher Number: ${payment.voucherNumber}`, 14, 42);
    doc.text(`Date Issued: ${formatDate(payment.paymentDate)}`, 14, 47);
    doc.text(`Status: ${payment.status.replace("_", " ")}`, 14, 52);
    
    // Supplier & Account Info
    doc.setFontSize(12);
    doc.setTextColor(15, 23, 42);
    doc.text("Payment Details:", 14, 65);
    
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.text(`Supplier: ${payment.supplierName}`, 14, 72);
    doc.text(`PO Reference: ${payment.poRef}`, 14, 77);
    doc.text(`Method: ${getMethodLabel(payment.method)}`, 14, 82);
    doc.text(`Account: ${payment.accountDetails}`, 14, 87);
    
    // Financials Table
    autoTable(doc, {
      startY: 95,
      head: [['Description', 'Amount']],
      body: [
        ['Total PO Amount', formatCurrency(payment.totalAmount)],
        ['Amount Paid', formatCurrency(payment.amountPaid)],
        ['Remaining Balance', formatCurrency(payment.remainingBalance)]
      ],
      theme: 'grid',
      headStyles: { fillColor: [2, 132, 199], textColor: [255, 255, 255], fontStyle: 'bold' },
      styles: { fontSize: 10, cellPadding: 5 },
      columnStyles: {
        0: { cellWidth: 100, fontStyle: 'bold' },
        1: { cellWidth: 'auto', halign: 'right' }
      }
    });
    
    doc.save(`${payment.voucherNumber}-Voucher.pdf`);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
      <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by voucher #, supplier, or PO ref..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
          />
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button onClick={() => setStatusFilter("ALL")} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${statusFilter === "ALL" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>All Payments</button>
          <button onClick={() => setStatusFilter("FULLY_CLEARED")} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${statusFilter === "FULLY_CLEARED" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>Fully Cleared</button>
          <button onClick={() => setStatusFilter("PARTIAL_PAYMENT")} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${statusFilter === "PARTIAL_PAYMENT" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>Partial Payment</button>
        </div>
      </div>

      <div className="overflow-x-auto min-h-75">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50/50 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 whitespace-nowrap">Voucher # & Date</th>
              <th className="px-6 py-4 whitespace-nowrap">Supplier Firm</th>
              <th className="px-6 py-4 whitespace-nowrap">Payment Method</th>
              <th className="px-6 py-4 whitespace-nowrap">PO Ref</th>
              <th className="px-6 py-4 whitespace-nowrap">Total Amount</th>
              <th className="px-6 py-4 whitespace-nowrap">Amount Paid</th>
              <th className="px-6 py-4 whitespace-nowrap">Remaining</th>
              <th className="px-6 py-4 whitespace-nowrap">Status</th>
              <th className="px-6 py-4 whitespace-nowrap text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedPayments.length > 0 ? (
              paginatedPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">{payment.voucherNumber}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{formatDate(payment.paymentDate)}</p>
                  </td>
                  
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">{payment.supplierName}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{payment.supplierCategory}</p>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      {getMethodIcon(payment.method)}
                      <span className="font-bold text-slate-700 text-xs">{getMethodLabel(payment.method)}</span>
                    </div>
                    <p className="text-[11px] text-slate-400">{payment.accountDetails}</p>
                  </td>

                  <td className="px-6 py-4">
                    <span className="text-xs font-semibold text-sky-600">{payment.poRef}</span>
                  </td>

                  <td className="px-6 py-4 font-bold text-slate-700">
                    {formatCurrency(payment.totalAmount)}
                  </td>

                  <td className="px-6 py-4 font-bold text-emerald-600">
                    {formatCurrency(payment.amountPaid)}
                  </td>

                  <td className="px-6 py-4 font-bold">
                    {payment.remainingBalance > 0 ? (
                      <span className="text-rose-600">{formatCurrency(payment.remainingBalance)}</span>
                    ) : (
                      <span className="text-slate-400">Rs 0</span>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    {payment.status === "FULLY_CLEARED" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-100">
                        <CheckCircle2 className="h-3 w-3" />Cleared
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-100">
                        <Clock className="h-3 w-3" /> Partial
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="sm" onClick={() => onEdit(payment)} className="text-slate-400 hover:text-sky-600 h-8 w-8 rounded-lg cursor-pointer">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handlePrint(payment)} className="text-slate-400 hover:text-slate-700 h-8 w-8 rounded-lg cursor-pointer">
                        <Printer className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteClick(payment)} className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 h-8 w-8 rounded-lg cursor-pointer">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="px-6 py-12 text-center text-slate-500 text-sm">
                  No payments match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50 gap-4">
          <p className="text-xs font-medium text-slate-500">
            Showing <span className="font-bold text-slate-900">{startIndex + 1}</span> to <span className="font-bold text-slate-900">{Math.min(startIndex + itemsPerPage, filteredPayments.length)}</span> of <span className="font-bold text-slate-900">{filteredPayments.length}</span> records
          </p>
          <div className="flex items-center gap-1.5">
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="h-8 rounded-lg text-xs text-slate-700 bg-white cursor-pointer">
              Prev
            </Button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button key={i} onClick={() => setCurrentPage(i + 1)} className={`h-8 w-8 rounded-lg text-xs font-bold transition-colors flex items-center justify-center cursor-pointer ${currentPage === i + 1 ? "bg-sky-600 text-white shadow-sm" : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"}`}>
                {i + 1}
              </button>
            ))}
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="h-8 rounded-lg text-xs text-slate-700 bg-white cursor-pointer">
              Next
            </Button>
          </div>
        </div>
      )}

      <AlertDialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <AlertDialogContent className="rounded-3xl max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl text-rose-600">Delete Payment Voucher?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-600">
              Are you sure you want to delete voucher <span className="font-bold text-slate-900">{selectedPayment?.voucherNumber}</span>? 
              This will return the amount back to the accounts payable ledger. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="rounded-xl border-slate-200 cursor-pointer">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-md cursor-pointer">
              Delete Voucher
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}