"use client";

import { useState } from "react";
import {
  CreditCard,
  Plus,
  Search,
  Building2,
  Printer,
  Wallet,
  CheckCircle2,
  Calendar,
  X,
  FileText,
  AlertCircle,
  ArrowUpRight,
  ExternalLink,
  DollarSign,
  Landmark,
  BadgeCheck,
  Receipt,
} from "lucide-react";

// --- TYPES ---
export type PaymentMethod =
  | "BANK_TRANSFER"
  | "CASH_VOUCHER"
  | "CHEQUE"
  | "JAZZCASH_EASYPAISA";

export interface SupplierPaymentVoucher {
  id: string;
  voucherNumber: string;
  supplierId: string;
  supplierName: string;
  category: string;
  amountPaid: number;
  paymentMethod: PaymentMethod;
  bankAccountRef?: string;
  transactionRef?: string;
  purchaseOrderRef?: string;
  paymentDate: string;
  notes?: string;
  status: "SETTLED" | "CLEARED" | "PROCESSING";
}

// --- DUMMY DATA ---
const MOCK_SUPPLIERS = [
  {
    id: "sup-1",
    name: "Al-Sharq Plastics & Polymers",
    payableBalance: 36000,
    category: "Bottles & Preforms",
  },
  {
    id: "sup-2",
    name: "SES Group Packaging",
    payableBalance: 126282,
    category: "Caps & Seals",
  },
  {
    id: "sup-3",
    name: "Indus RO Filtration & Chemicals",
    payableBalance: 0,
    category: "RO Chemicals & Minerals",
  },
  {
    id: "sup-4",
    name: "Pak Pump Dispenser Importers",
    payableBalance: 18500,
    category: "Pumps & Spares",
  },
];

const MOCK_PAYMENTS: SupplierPaymentVoucher[] = [
  {
    id: "pay-101",
    voucherNumber: "PV-2026-0412",
    supplierId: "sup-2",
    supplierName: "SES Group Packaging",
    category: "Caps & Seals",
    amountPaid: 50000,
    paymentMethod: "BANK_TRANSFER",
    bankAccountRef: "Meezan Bank (Plant Main A/C)",
    transactionRef: "FT-MB-9921448",
    purchaseOrderRef: "PO-2026-0802",
    paymentDate: "Aug 28, 2026",
    notes: "Advance 50% for 5,000 smart caps consignment",
    status: "SETTLED",
  },
  {
    id: "pay-102",
    voucherNumber: "PV-2026-0411",
    supplierId: "sup-1",
    supplierName: "Al-Sharq Plastics & Polymers",
    category: "Bottles & Preforms",
    amountPaid: 100000,
    paymentMethod: "BANK_TRANSFER",
    bankAccountRef: "HBL Commercial Branch, Sahiwal",
    transactionRef: "HBL-TR-448102",
    purchaseOrderRef: "PO-2026-0801",
    paymentDate: "Aug 25, 2026",
    notes: "Part payment against invoice # 9920",
    status: "SETTLED",
  },
  {
    id: "pay-103",
    voucherNumber: "PV-2026-0410",
    supplierId: "sup-3",
    supplierName: "Indus RO Filtration & Chemicals",
    category: "RO Chemicals & Minerals",
    amountPaid: 20200,
    paymentMethod: "CASH_VOUCHER",
    transactionRef: "CASH-V-882",
    purchaseOrderRef: "PO-2026-0798",
    paymentDate: "Aug 19, 2026",
    notes: "Full cash settlement upon gate delivery",
    status: "SETTLED",
  },
  {
    id: "pay-104",
    voucherNumber: "PV-2026-0409",
    supplierId: "sup-4",
    supplierName: "Pak Pump Dispenser Importers",
    category: "Pumps & Spares",
    amountPaid: 35000,
    paymentMethod: "CHEQUE",
    bankAccountRef: "Bank Alfalah (Cheque # 449910)",
    transactionRef: "CHQ-449910",
    paymentDate: "Aug 12, 2026",
    notes: "Cheque cleared on Brandreth Rd branch",
    status: "CLEARED",
  },
];

export default function SupplierPaymentsPage() {
  const [payments, setPayments] = useState<SupplierPaymentVoucher[]>(MOCK_PAYMENTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [methodFilter, setMethodFilter] = useState<string>("ALL");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState(MOCK_SUPPLIERS[1].id);
  const [paymentAmount, setPaymentAmount] = useState("25000");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("BANK_TRANSFER");
  const [bankAccount, setBankAccount] = useState("Meezan Bank (Plant Main A/C)");
  const [transactionRef, setTransactionRef] = useState("");
  const [poRef, setPoRef] = useState("PO-2026-0802");
  const [notes, setNotes] = useState("");

  const targetSupplier =
    MOCK_SUPPLIERS.find((s) => s.id === selectedSupplierId) || MOCK_SUPPLIERS[0];

  // Aggregate Metrics
  const totalDisbursedMonth = payments.reduce((sum, p) => sum + p.amountPaid, 0);
  const totalBankTransfers = payments
    .filter((p) => p.paymentMethod === "BANK_TRANSFER")
    .reduce((sum, p) => sum + p.amountPaid, 0);
  const totalCashPaid = payments
    .filter((p) => p.paymentMethod === "CASH_VOUCHER")
    .reduce((sum, p) => sum + p.amountPaid, 0);
  const totalOutstandingPayable = MOCK_SUPPLIERS.reduce(
    (sum, s) => sum + s.payableBalance,
    0
  );

  // Filtered List
  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      p.voucherNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.transactionRef && p.transactionRef.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.purchaseOrderRef && p.purchaseOrderRef.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (methodFilter !== "ALL" && p.paymentMethod !== methodFilter) return false;

    return true;
  });

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const paidNum = parseFloat(paymentAmount) || 0;

    const newVoucher: SupplierPaymentVoucher = {
      id: `pay-${Date.now()}`,
      voucherNumber: `PV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      supplierId: selectedSupplierId,
      supplierName: targetSupplier.name,
      category: targetSupplier.category,
      amountPaid: paidNum,
      paymentMethod,
      bankAccountRef: paymentMethod === "BANK_TRANSFER" ? bankAccount : undefined,
      transactionRef: transactionRef || `TXN-${Date.now().toString().slice(-6)}`,
      purchaseOrderRef: poRef || undefined,
      paymentDate: "Aug 29, 2026",
      notes,
      status: "SETTLED",
    };

    setPayments([newVoucher, ...payments]);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1">
            <span>Purchases</span>
            <span>/</span>
            <span className="text-slate-700">Vendor Disbursements</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Supplier Payments Out
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Record bank transfers, cash vouchers, and cheques issued to raw material vendors and packaging suppliers.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-1.5 h-9 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold transition-colors shadow-xs"
        >
          <Plus className="h-4 w-4" />
          <span>Record Supplier Payment</span>
        </button>
      </div>

      {/* KPI Cards: Payouts & Balances */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Total Disbursed This Month */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Total Disbursed (Aug)
            </span>
            <div className="h-7 w-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Receipt className="h-4 w-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-emerald-700 font-mono">
              Rs {totalDisbursedMonth.toLocaleString()}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Across {payments.length} verified payment vouchers
            </p>
          </div>
        </div>

        {/* Bank Wire / Online Transfers */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Bank Transfers
            </span>
            <div className="h-7 w-7 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600">
              <Landmark className="h-4 w-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900 font-mono">
              Rs {totalBankTransfers.toLocaleString()}
            </p>
            <p className="text-[11px] text-sky-600 font-medium mt-0.5">
              Meezan & HBL corporate rails
            </p>
          </div>
        </div>

        {/* Cash / Counter Vouchers */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Cash Vouchers Paid
            </span>
            <div className="h-7 w-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <Wallet className="h-4 w-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900 font-mono">
              Rs {totalCashPaid.toLocaleString()}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Direct gate delivery payments
            </p>
          </div>
        </div>

        {/* Current Remaining Payable Balance */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Remaining Accounts Payable
            </span>
            <div className="h-7 w-7 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
              <AlertCircle className="h-4 w-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-rose-600 font-mono">
              Rs {totalOutstandingPayable.toLocaleString()}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Total pending supplier liabilities
            </p>
          </div>
        </div>
      </div>

      {/* Payment Vouchers Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Table Filters & Search */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search by voucher #, supplier, or transaction ref..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
            />
          </div>

          {/* Payment Method Filter */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-medium text-slate-600 self-start md:self-auto">
            <button
              onClick={() => setMethodFilter("ALL")}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                methodFilter === "ALL" ? "bg-white text-slate-900 shadow-2xs font-semibold" : ""
              }`}
            >
              All Modes
            </button>
            <button
              onClick={() => setMethodFilter("BANK_TRANSFER")}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                methodFilter === "BANK_TRANSFER" ? "bg-white text-sky-700 shadow-2xs font-semibold" : ""
              }`}
            >
              Bank Transfer
            </button>
            <button
              onClick={() => setMethodFilter("CASH_VOUCHER")}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                methodFilter === "CASH_VOUCHER" ? "bg-white text-amber-700 shadow-2xs font-semibold" : ""
              }`}
            >
              Cash Voucher
            </button>
            <button
              onClick={() => setMethodFilter("CHEQUE")}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                methodFilter === "CHEQUE" ? "bg-white text-purple-700 shadow-2xs font-semibold" : ""
              }`}
            >
              Cheque
            </button>
          </div>
        </div>

        {/* Directory Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                <th className="py-3 px-4">Voucher # & Date</th>
                <th className="py-3 px-4">Supplier Firm</th>
                <th className="py-3 px-4">Payment Method & Account</th>
                <th className="py-3 px-4">Transaction / PO Ref</th>
                <th className="py-3 px-4 text-right">Amount Paid</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredPayments.length > 0 ? (
                filteredPayments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Voucher # & Date */}
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-slate-900 block">{p.voucherNumber}</span>
                      <span className="text-[10px] text-slate-400">{p.paymentDate}</span>
                    </td>

                    {/* Supplier Firm */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{p.supplierName}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{p.category}</div>
                    </td>

                    {/* Payment Method */}
                    <td className="py-3 px-4">
                      {p.paymentMethod === "BANK_TRANSFER" ? (
                        <div>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-sky-50 text-sky-700 border border-sky-200/60">
                            <Landmark className="h-3 w-3" />
                            <span>Bank Transfer</span>
                          </span>
                          <span className="text-[10px] text-slate-400 block mt-0.5 truncate max-w-xs">
                            {p.bankAccountRef}
                          </span>
                        </div>
                      ) : p.paymentMethod === "CASH_VOUCHER" ? (
                        <div>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
                            <Wallet className="h-3 w-3" />
                            <span>Cash Voucher</span>
                          </span>
                        </div>
                      ) : (
                        <div>
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200/60">
                            <FileText className="h-3 w-3" />
                            <span>Cheque Payment</span>
                          </span>
                        </div>
                      )}
                    </td>

                    {/* Transaction / PO Ref */}
                    <td className="py-3 px-4 font-mono text-[11px]">
                      {p.transactionRef && (
                        <div className="text-slate-800 font-semibold">{p.transactionRef}</div>
                      )}
                      {p.purchaseOrderRef ? (
                        <span className="text-[10px] text-sky-600 font-semibold block">
                          Ref: {p.purchaseOrderRef}
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 block">General Account Credit</span>
                      )}
                    </td>

                    {/* Amount Paid */}
                    <td className="py-3 px-4 text-right font-mono font-bold text-sm text-emerald-700">
                      Rs {p.amountPaid.toLocaleString()}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Settled</span>
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <button
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        title="Print Payment Voucher Receipt"
                      >
                        <Printer className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No payment vouchers match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL: RECORD SUPPLIER PAYMENT VOUCHER */}
      {/* ========================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CreditCard className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Issue Payment Voucher</h2>
                  <p className="text-[11px] text-slate-400">Record outgoing settlement to supplier</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="space-y-3.5">
              {/* Supplier Selector */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Select Supplier / Vendor *</label>
                <select
                  value={selectedSupplierId}
                  onChange={(e) => setSelectedSupplierId(e.target.value)}
                  className="w-full h-9 rounded-xl border border-slate-300 px-3 text-xs bg-white focus:ring-2 focus:ring-sky-500/20"
                >
                  {MOCK_SUPPLIERS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} (Due: Rs {s.payableBalance.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              {/* Outstanding Balance Banner */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between text-xs">
                <span className="text-slate-500">Current Outstanding Payable:</span>
                <span className="font-mono font-bold text-rose-600">
                  Rs {targetSupplier.payableBalance.toLocaleString()}
                </span>
              </div>

              {/* Payment Amount */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Amount to Disburse (Rs) *</label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full h-10 rounded-xl border border-slate-300 px-3 text-sm font-mono font-bold text-slate-900 bg-emerald-50/30 border-emerald-300 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                  required
                />
              </div>

              {/* Payment Mode */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Payment Mode *</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full h-9 rounded-xl border border-slate-300 px-2 text-xs bg-white"
                  >
                    <option value="BANK_TRANSFER">Bank Transfer (Online)</option>
                    <option value="CASH_VOUCHER">Cash Voucher</option>
                    <option value="CHEQUE">Bank Cheque</option>
                    <option value="JAZZCASH_EASYPAISA">JazzCash / EasyPaisa</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Disbursing Account</label>
                  <select
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value)}
                    className="w-full h-9 rounded-xl border border-slate-300 px-2 text-xs bg-white"
                  >
                    <option value="Meezan Bank (Plant Main A/C)">Meezan Bank (Main A/C)</option>
                    <option value="HBL Commercial Branch, Sahiwal">HBL Sahiwal Branch</option>
                    <option value="Petty Cash Safe (Plant Vault)">Petty Cash Safe</option>
                  </select>
                </div>
              </div>

              {/* Reference Details */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Bank / Cheque Ref #</label>
                  <input
                    type="text"
                    placeholder="e.g. FT-MB-9921448"
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                    className="w-full h-9 rounded-xl border border-slate-300 px-3 text-xs outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Related Purchase Order (PO)</label>
                  <input
                    type="text"
                    placeholder="e.g. PO-2026-0802"
                    value={poRef}
                    onChange={(e) => setPoRef(e.target.value)}
                    className="w-full h-9 rounded-xl border border-slate-300 px-3 text-xs outline-none"
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Voucher Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Advance payment for 5,000 caps shipment"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full h-9 rounded-xl border border-slate-300 px-3 text-xs outline-none"
                />
              </div>

              {/* Remaining Balance Preview */}
              <div className="p-3 bg-slate-100 rounded-xl flex items-center justify-between text-xs">
                <span className="text-slate-600">Projected Remaining Debt:</span>
                <span className="font-mono font-bold text-slate-900">
                  Rs {Math.max(0, targetSupplier.payableBalance - (parseFloat(paymentAmount) || 0)).toLocaleString()}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="h-9 px-4 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-9 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors shadow-xs"
                >
                  Generate Voucher & Deduct Debt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}