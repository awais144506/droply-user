"use client";

import { useState } from "react";
import {
  FileText,
  Plus,
  Search,
  Printer,
  DollarSign,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  Filter,
  Calendar,
  Building2,
  Download,
  CreditCard,
  Send,
  Eye,
  MapPin,
  Check,
} from "lucide-react";

// --- TYPES ---
export type InvoiceStatus = "PAID" | "UNPAID" | "PARTIAL" | "OVERDUE";

export interface InvoiceItemRow {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface CustomerInvoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  zoneName: string;
  issueDate: string;
  dueDate: string;
  items: InvoiceItemRow[];
  subtotal: number;
  discount: number;
  totalAmount: number;
  paidAmount: number;
  balanceDue: number;
  status: InvoiceStatus;
}

// --- DUMMY DATA (Sahiwal Invoices) ---
const MOCK_INVOICES: CustomerInvoice[] = [
  {
    id: "inv-101",
    invoiceNumber: "INV-2026-0891",
    customerName: "Al-Madina Sweets & Bakers",
    customerPhone: "+92 300 7788990",
    customerAddress: "Shop 12-14, Main Bazar, Sahiwal",
    zoneName: "Tariq Bin Ziad Colony",
    issueDate: "Aug 25, 2026",
    dueDate: "Sep 01, 2026",
    items: [
      { description: "19L Water Refill (Bulk Commercial)", quantity: 60, unitPrice: 190, total: 11400 },
      { description: "55mm Smart Caps (Replacement Pack)", quantity: 2, unitPrice: 300, total: 600 },
    ],
    subtotal: 12000,
    discount: 500,
    totalAmount: 11500,
    paidAmount: 11500,
    balanceDue: 0,
    status: "PAID",
  },
  {
    id: "inv-102",
    invoiceNumber: "INV-2026-0892",
    customerName: "Tariq Mahmood",
    customerPhone: "+92 321 4455667",
    customerAddress: "House 14, Block Y, Farid Town, Sahiwal",
    zoneName: "Farid Town (Block Y & Z)",
    issueDate: "Aug 28, 2026",
    dueDate: "Sep 04, 2026",
    items: [
      { description: "19L Water Refill", quantity: 8, unitPrice: 200, total: 1600 },
      { description: "Bottle Security Deposit (2 New)", quantity: 2, unitPrice: 1000, total: 2000 },
    ],
    subtotal: 3600,
    discount: 0,
    totalAmount: 3600,
    paidAmount: 2000,
    balanceDue: 1600,
    status: "PARTIAL",
  },
  {
    id: "inv-103",
    invoiceNumber: "INV-2026-0885",
    customerName: "Muhammad Bilal",
    customerPhone: "+92 304 9988776",
    customerAddress: "Shop 4, High Street Market, Sahiwal",
    zoneName: "High Street Commercial",
    issueDate: "Aug 10, 2026",
    dueDate: "Aug 20, 2026",
    items: [
      { description: "Monthly Corporate Water Plan (30 Refills)", quantity: 1, unitPrice: 5500, total: 5500 },
    ],
    subtotal: 5500,
    discount: 0,
    totalAmount: 5500,
    paidAmount: 0,
    balanceDue: 5500,
    status: "OVERDUE",
  },
  {
    id: "inv-104",
    invoiceNumber: "INV-2026-0893",
    customerName: "Dr. Shahida Parveen",
    customerPhone: "+92 333 1122334",
    customerAddress: "Near Girls College, Fateh Sher Colony, Sahiwal",
    zoneName: "Fateh Sher Colony",
    issueDate: "Aug 29, 2026",
    dueDate: "Sep 05, 2026",
    items: [
      { description: "19L Water Refill", quantity: 4, unitPrice: 200, total: 800 },
    ],
    subtotal: 800,
    discount: 0,
    totalAmount: 800,
    paidAmount: 0,
    balanceDue: 800,
    status: "UNPAID",
  },
];

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<CustomerInvoice[]>(MOCK_INVOICES);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<CustomerInvoice | null>(null);

  // Quick Payment Collection Form State
  const [paymentAmount, setPaymentAmount] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<string>("CASH");

  // Calculations
  const totalBilled = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const totalCollected = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
  const totalUnpaidKhata = invoices.reduce((sum, inv) => sum + inv.balanceDue, 0);
  const overdueInvoicesCount = invoices.filter((inv) => inv.status === "OVERDUE").length;

  // Filtered List
  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.zoneName.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (statusFilter !== "ALL" && inv.status !== statusFilter) return false;

    return true;
  });

  const handleOpenPaymentModal = (invoice: CustomerInvoice) => {
    setSelectedInvoice(invoice);
    setPaymentAmount(String(invoice.balanceDue));
    setIsPaymentModalOpen(true);
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;

    const amountPaid = parseFloat(paymentAmount) || 0;

    setInvoices((prev) =>
      prev.map((inv) => {
        if (inv.id === selectedInvoice.id) {
          const newPaid = inv.paidAmount + amountPaid;
          const newBalance = Math.max(0, inv.totalAmount - newPaid);
          const newStatus: InvoiceStatus =
            newBalance === 0 ? "PAID" : newPaid > 0 ? "PARTIAL" : "UNPAID";

          return {
            ...inv,
            paidAmount: newPaid,
            balanceDue: newBalance,
            status: newStatus,
          };
        }
        return inv;
      })
    );

    setIsPaymentModalOpen(false);
    setSelectedInvoice(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Invoices & Billing
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Generate plant bills, track customer ledger balances, and record collections for Sahiwal accounts.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center justify-center gap-1.5 h-9 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold transition-colors shadow-xs"
        >
          <Plus className="h-4 w-4" />
          <span>Generate New Invoice</span>
        </button>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Total Billed */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Total Invoiced
            </span>
            <div className="h-7 w-7 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600">
              <FileText className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 font-mono">
            Rs {totalBilled.toLocaleString()}
          </p>
        </div>

        {/* Total Cash Collected */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Cash Collected
            </span>
            <div className="h-7 w-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-700 font-mono">
            Rs {totalCollected.toLocaleString()}
          </p>
        </div>

        {/* Total Unpaid / Khata Balance */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Outstanding Balance
            </span>
            <div className="h-7 w-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-amber-600 font-mono">
            Rs {totalUnpaidKhata.toLocaleString()}
          </p>
        </div>

        {/* Overdue Count */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Overdue Invoices
            </span>
            <div className="h-7 w-7 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
              <AlertCircle className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-rose-600 font-mono">
            {overdueInvoicesCount} <span className="text-xs font-sans text-slate-400 font-normal">Accounts</span>
          </p>
        </div>
      </div>

      {/* Directory Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Filter Controls */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search by invoice #, customer, or sector..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-medium text-slate-600 self-start md:self-auto">
            <button
              onClick={() => setStatusFilter("ALL")}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                statusFilter === "ALL" ? "bg-white text-slate-900 shadow-2xs font-semibold" : ""
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter("PAID")}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                statusFilter === "PAID" ? "bg-white text-emerald-700 shadow-2xs font-semibold" : ""
              }`}
            >
              Paid
            </button>
            <button
              onClick={() => setStatusFilter("PARTIAL")}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                statusFilter === "PARTIAL" ? "bg-white text-sky-700 shadow-2xs font-semibold" : ""
              }`}
            >
              Partial
            </button>
            <button
              onClick={() => setStatusFilter("UNPAID")}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                statusFilter === "UNPAID" ? "bg-white text-amber-700 shadow-2xs font-semibold" : ""
              }`}
            >
              Unpaid
            </button>
            <button
              onClick={() => setStatusFilter("OVERDUE")}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                statusFilter === "OVERDUE" ? "bg-white text-rose-700 shadow-2xs font-semibold" : ""
              }`}
            >
              Overdue
            </button>
          </div>
        </div>

        {/* Directory Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Customer & Sector</th>
                <th className="py-3 px-4">Issue / Due Date</th>
                <th className="py-3 px-4 text-right">Total Amount</th>
                <th className="py-3 px-4 text-right">Paid / Balance Due</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Invoice # */}
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-slate-900 block">{inv.invoiceNumber}</span>
                      <span className="text-[10px] text-slate-400">{inv.items.length} Line Item(s)</span>
                    </td>

                    {/* Customer */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{inv.customerName}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="h-2.5 w-2.5 shrink-0 text-slate-400" />
                        <span className="truncate max-w-xs">{inv.zoneName}</span>
                      </div>
                    </td>

                    {/* Dates */}
                    <td className="py-3 px-4 font-mono text-slate-600">
                      <div>{inv.issueDate}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Due: {inv.dueDate}</div>
                    </td>

                    {/* Total Amount */}
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                      Rs {inv.totalAmount.toLocaleString()}
                    </td>

                    {/* Paid & Balance Due */}
                    <td className="py-3 px-4 text-right font-mono">
                      <div className="text-emerald-700 font-semibold">
                        Rs {inv.paidAmount.toLocaleString()} paid
                      </div>
                      {inv.balanceDue > 0 ? (
                        <div className="text-amber-600 font-bold text-[11px] mt-0.5">
                          Rs {inv.balanceDue.toLocaleString()} due
                        </div>
                      ) : (
                        <div className="text-emerald-600 font-medium text-[10px] mt-0.5">
                          Settled
                        </div>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-4 text-center">
                      {inv.status === "PAID" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Paid</span>
                        </span>
                      ) : inv.status === "PARTIAL" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
                          <Clock className="h-3 w-3" />
                          <span>Partial</span>
                        </span>
                      ) : inv.status === "OVERDUE" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          <AlertCircle className="h-3 w-3" />
                          <span>Overdue</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock className="h-3 w-3" />
                          <span>Unpaid</span>
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        {inv.balanceDue > 0 && (
                          <button
                            onClick={() => handleOpenPaymentModal(inv)}
                            className="h-7 px-2.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/80 text-[11px] font-bold inline-flex items-center gap-1 transition-colors"
                          >
                            <CreditCard className="h-3 w-3" />
                            <span>Collect</span>
                          </button>
                        )}

                        <button
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                          title="Print / View Invoice"
                        >
                          <Printer className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No invoices match the selected status or search term.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: CREATE NEW INVOICE */}
      {/* ========================================================= */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                  <FileText className="h-4 w-4" />
                </div>
                <h2 className="text-sm font-bold text-slate-900">Generate Plant Invoice</h2>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsCreateModalOpen(false);
              }}
              className="space-y-3"
            >
              {/* Customer */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Select Customer *</label>
                <select className="w-full h-9 rounded-xl border border-slate-300 px-3 text-xs bg-white focus:ring-2 focus:ring-sky-500/20">
                  <option value="c-1">Al-Madina Sweets (Main Bazar)</option>
                  <option value="c-2">Tariq Mahmood (Farid Town)</option>
                  <option value="c-3">Muhammad Bilal (High Street)</option>
                  <option value="c-4">Dr. Shahida Parveen (Fateh Sher Colony)</option>
                </select>
              </div>

              {/* Line Items */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                  Invoice Items
                </span>

                <div className="grid grid-cols-12 gap-2 text-xs">
                  <input
                    type="text"
                    defaultValue="19L Water Refill"
                    className="col-span-6 h-8 rounded-lg border border-slate-300 px-2 text-xs bg-white"
                  />
                  <input
                    type="number"
                    defaultValue={10}
                    className="col-span-2 h-8 rounded-lg border border-slate-300 px-1 text-center text-xs font-mono font-bold bg-white"
                  />
                  <input
                    type="number"
                    defaultValue={200}
                    className="col-span-4 h-8 rounded-lg border border-slate-300 px-2 text-right text-xs font-mono font-bold bg-white"
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Issue Date</label>
                  <input
                    type="date"
                    defaultValue="2026-08-29"
                    className="w-full h-9 rounded-xl border border-slate-300 px-3 text-xs bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Payment Due Date</label>
                  <input
                    type="date"
                    defaultValue="2026-09-05"
                    className="w-full h-9 rounded-xl border border-slate-300 px-3 text-xs bg-white"
                  />
                </div>
              </div>

              {/* Total Calculation */}
              <div className="p-3 bg-slate-100/70 rounded-xl flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">Net Billed Amount:</span>
                <span className="text-sm font-bold font-mono text-slate-900">Rs 2,000.00</span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="h-8 px-3 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-8 px-4 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold transition-colors shadow-xs"
                >
                  Issue Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: RECORD PAYMENT COLLECTION */}
      {/* ========================================================= */}
      {isPaymentModalOpen && selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CreditCard className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Record Payment Collection</h2>
                  <p className="text-[11px] text-slate-400">{selectedInvoice.invoiceNumber}</p>
                </div>
              </div>
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-3">
              {/* Account Overview */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1 text-xs">
                <span className="font-bold text-slate-900">{selectedInvoice.customerName}</span>
                <div className="flex justify-between text-slate-500 pt-1">
                  <span>Current Outstanding Balance:</span>
                  <span className="font-mono font-bold text-amber-600">
                    Rs {selectedInvoice.balanceDue.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Amount Paid Input */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Amount Collected (Rs) *</label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full h-10 rounded-xl border border-slate-300 px-3 text-sm font-mono font-bold text-slate-900 bg-emerald-50/30 border-emerald-300 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                  required
                />
              </div>

              {/* Payment Method */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Payment Mode</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full h-9 rounded-xl border border-slate-300 px-3 text-xs bg-white"
                >
                  <option value="CASH">Cash Collection</option>
                  <option value="BANK_TRANSFER">Bank Transfer (HBL / Meezan)</option>
                  <option value="MOBILE_WALLET">JazzCash / EasyPaisa</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="h-8 px-3 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-8 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors shadow-xs"
                >
                  Record Payment & Clear Khata
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}