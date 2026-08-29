"use client";

import { useState } from "react";
import {
  Receipt,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  X,
  Bike,
  Fuel,
  Wrench,
  Zap,
  Coffee,
  Wallet,
  Building2,
  TrendingDown,
  ArrowUpRight,
  Download,
  ShieldCheck,
} from "lucide-react";

// --- TYPES ---
export type ExpenseCategory =
  | "FLEET_MAINTENANCE" // Punctures, oil, spare parts
  | "FLEET_FUEL" // Bike & loader rickshaw petrol
  | "PLANT_UTILITIES" // Electricity (WAPDA), Generator Diesel
  | "RO_MAINTENANCE" // Filter cartridge, membrane cleaning, salt
  | "STAFF_PETTY" // Tea, lunch, mobile balance
  | "RENT_SALARIES"; // Fixed plant rent, rider wages

export type PaymentSource =
  | "RIDER_BAG_DEDUCTION" // Deducted on-the-go from rider cash collection
  | "CASH_DRAWER" // Plant petty cash safe
  | "BANK_TRANSFER"; // Corporate bank account

export interface OperationalExpense {
  id: string;
  voucherNumber: string;
  category: ExpenseCategory;
  title: string;
  amount: number;
  paidVia: PaymentSource;
  claimedBy?: string; // e.g. "Majid Ali (Rider)"
  approvedBy: string;
  timestamp: string;
  receiptNote?: string;
  hasReceiptImage?: boolean;
}

// --- DUMMY DATA ---
const MOCK_EXPENSES: OperationalExpense[] = [
  {
    id: "exp-101",
    voucherNumber: "EXP-2026-091",
    category: "FLEET_MAINTENANCE",
    title: "Rear tyre puncture & tube valve replacement",
    amount: 350,
    paidVia: "RIDER_BAG_DEDUCTION",
    claimedBy: "Majid Ali (Farid Town Sector)",
    approvedBy: "Kamran Akmal",
    timestamp: "Today, 11:20 AM",
    receiptNote: "Repaired at College Chowk tyre shop",
    hasReceiptImage: true,
  },
  {
    id: "exp-102",
    voucherNumber: "EXP-2026-090",
    category: "FLEET_FUEL",
    title: "Daily Petrol refill for 3 delivery bikes",
    amount: 2400,
    paidVia: "CASH_DRAWER",
    claimedBy: "Usman & Bilal (Fleet Pool)",
    approvedBy: "Kamran Akmal",
    timestamp: "Today, 08:30 AM",
    receiptNote: "PSO Petrol Pump, High Street Sahiwal",
    hasReceiptImage: false,
  },
  {
    id: "exp-103",
    voucherNumber: "EXP-2026-089",
    category: "RO_MAINTENANCE",
    title: "20-inch PP Sediment & Carbon Filter Replacement (4 Pcs)",
    amount: 6800,
    paidVia: "BANK_TRANSFER",
    approvedBy: "Plant Admin",
    timestamp: "Yesterday, 04:15 PM",
    receiptNote: "Bi-weekly filtration maintenance batch",
    hasReceiptImage: true,
  },
  {
    id: "exp-104",
    voucherNumber: "EXP-2026-088",
    category: "PLANT_UTILITIES",
    title: "Generator Diesel (Load-shedding backup 20L)",
    amount: 5600,
    paidVia: "CASH_DRAWER",
    approvedBy: "Plant Admin",
    timestamp: "Aug 27, 2026",
    receiptNote: "Emergency backup run for evening shift",
    hasReceiptImage: false,
  },
  {
    id: "exp-105",
    voucherNumber: "EXP-2026-087",
    category: "STAFF_PETTY",
    title: "Shift evening tea & refreshments",
    amount: 650,
    paidVia: "CASH_DRAWER",
    claimedBy: "Plant Workers",
    approvedBy: "Kamran Akmal",
    timestamp: "Aug 26, 2026",
    receiptNote: "Daily operational tea allowance",
    hasReceiptImage: false,
  },
];

export default function AdminExpensesPage() {
  const [expenses, setExpenses] = useState<OperationalExpense[]>(MOCK_EXPENSES);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [sourceFilter, setSourceFilter] = useState<string>("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "FLEET_MAINTENANCE" as ExpenseCategory,
    paidVia: "RIDER_BAG_DEDUCTION" as PaymentSource,
    claimedBy: "Majid Ali (Rider)",
    receiptNote: "",
  });

  // KPI Aggregates
  const totalExpensesMonth = expenses.reduce((sum, e) => sum + e.amount, 0);
  const riderBagDeductionsTotal = expenses
    .filter((e) => e.paidVia === "RIDER_BAG_DEDUCTION")
    .reduce((sum, e) => sum + e.amount, 0);
  const fleetMaintenanceTotal = expenses
    .filter((e) => e.category === "FLEET_MAINTENANCE" || e.category === "FLEET_FUEL")
    .reduce((sum, e) => sum + e.amount, 0);
  const roPlantUpkeepTotal = expenses
    .filter((e) => e.category === "RO_MAINTENANCE" || e.category === "PLANT_UTILITIES")
    .reduce((sum, e) => sum + e.amount, 0);

  // Filter Logic
  const filteredExpenses = expenses.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.voucherNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.claimedBy && e.claimedBy.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (categoryFilter !== "ALL" && e.category !== categoryFilter) return false;
    if (sourceFilter !== "ALL" && e.paidVia !== sourceFilter) return false;

    return true;
  });

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.amount) return;

    const newExp: OperationalExpense = {
      id: `exp-${Date.now()}`,
      voucherNumber: `EXP-2026-${Math.floor(100 + Math.random() * 900)}`,
      category: form.category,
      title: form.title,
      amount: parseFloat(form.amount) || 0,
      paidVia: form.paidVia,
      claimedBy: form.claimedBy,
      approvedBy: "Shift Manager",
      timestamp: "Today, Just now",
      receiptNote: form.receiptNote,
    };

    setExpenses([newExp, ...expenses]);
    setIsModalOpen(false);
    setForm({
      title: "",
      amount: "",
      category: "FLEET_MAINTENANCE",
      paidVia: "RIDER_BAG_DEDUCTION",
      claimedBy: "Majid Ali (Rider)",
      receiptNote: "",
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Plant & Petty Expenses
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Log and audit fleet repairs, rider tyre punctures, fuel, and RO plant maintenance.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="h-9 px-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Log Expense</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Total Expenses */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Total OPEX (August)
          </span>
          <p className="text-lg font-bold text-rose-600 font-mono mt-0.5">
            Rs {totalExpensesMonth.toLocaleString()}
          </p>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            {expenses.length} Logged Vouchers
          </span>
        </div>

        {/* Rider Bag Deductions */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Rider Bag Deductions
          </span>
          <p className="text-lg font-bold text-slate-900 font-mono mt-0.5">
            Rs {riderBagDeductionsTotal.toLocaleString()}
          </p>
          <span className="text-[10px] text-rose-600 font-medium block mt-0.5">
            Auto-reconciled on shift close
          </span>
        </div>

        {/* Fleet Fuel & Repairs */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Fleet Fuel & Repairs
          </span>
          <p className="text-lg font-bold text-slate-900 font-mono mt-0.5">
            Rs {fleetMaintenanceTotal.toLocaleString()}
          </p>
          <span className="text-[10px] text-slate-400 block mt-0.5">Punctures & Petrol</span>
        </div>

        {/* RO Filtration Upkeep */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            Plant & Generator
          </span>
          <p className="text-lg font-bold text-slate-900 font-mono mt-0.5">
            Rs {roPlantUpkeepTotal.toLocaleString()}
          </p>
          <span className="text-[10px] text-slate-400 block mt-0.5">Filters & Diesel</span>
        </div>
      </div>

      {/* Expenses Directory Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
        {/* Table Filters */}
        <div className="p-3.5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search description, rider, voucher #..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-8 pl-8 pr-3 rounded-xl border border-slate-200 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-8 px-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 focus:outline-none"
            >
              <option value="ALL">All Categories</option>
              <option value="FLEET_MAINTENANCE">Fleet Repairs / Punctures</option>
              <option value="FLEET_FUEL">Fleet Petrol</option>
              <option value="RO_MAINTENANCE">RO Filters & Spares</option>
              <option value="PLANT_UTILITIES">Electricity & Generator</option>
              <option value="STAFF_PETTY">Staff Tea & Refreshments</option>
            </select>

            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="h-8 px-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-700 focus:outline-none"
            >
              <option value="ALL">All Sources</option>
              <option value="RIDER_BAG_DEDUCTION">Rider Cash Bag</option>
              <option value="CASH_DRAWER">Plant Cash Safe</option>
              <option value="BANK_TRANSFER">Bank Wire</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                <th className="py-2.5 px-4">Voucher #</th>
                <th className="py-2.5 px-4">Expense Description</th>
                <th className="py-2.5 px-4">Category</th>
                <th className="py-2.5 px-4">Paid Via / Claimed By</th>
                <th className="py-2.5 px-4 text-right">Amount</th>
                <th className="py-2.5 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredExpenses.length > 0 ? (
                filteredExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Voucher */}
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {exp.voucherNumber}
                      <span className="text-[10px] font-sans text-slate-400 block font-normal">
                        {exp.timestamp}
                      </span>
                    </td>

                    {/* Description */}
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 block">{exp.title}</span>
                      {exp.receiptNote && (
                        <span className="text-[10px] text-slate-400 block mt-0.5">
                          {exp.receiptNote}
                        </span>
                      )}
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4">
                      {exp.category === "FLEET_MAINTENANCE" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200/60">
                          <Bike className="h-3 w-3" />
                          <span>Puncture / Repair</span>
                        </span>
                      ) : exp.category === "FLEET_FUEL" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
                          <Fuel className="h-3 w-3" />
                          <span>Petrol</span>
                        </span>
                      ) : exp.category === "RO_MAINTENANCE" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                          <Wrench className="h-3 w-3" />
                          <span>RO Filter</span>
                        </span>
                      ) : exp.category === "PLANT_UTILITIES" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200/60">
                          <Zap className="h-3 w-3" />
                          <span>Generator</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                          <Coffee className="h-3 w-3" />
                          <span>Staff Tea</span>
                        </span>
                      )}
                    </td>

                    {/* Paid Via */}
                    <td className="py-3 px-4">
                      {exp.paidVia === "RIDER_BAG_DEDUCTION" ? (
                        <div>
                          <span className="font-semibold text-rose-600 block">
                            Rider Shift Cash Bag
                          </span>
                          <span className="text-[10px] text-slate-400">{exp.claimedBy}</span>
                        </div>
                      ) : exp.paidVia === "CASH_DRAWER" ? (
                        <div>
                          <span className="font-semibold text-slate-800 block">Plant Safe</span>
                          {exp.claimedBy && (
                            <span className="text-[10px] text-slate-400">{exp.claimedBy}</span>
                          )}
                        </div>
                      ) : (
                        <span className="font-semibold text-sky-700">Bank Transfer</span>
                      )}
                    </td>

                    {/* Amount */}
                    <td className="py-3 px-4 text-right font-mono font-bold text-rose-600">
                      -Rs {exp.amount.toLocaleString()}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="h-3 w-3" />
                        Approved
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-400">
                    No expense vouchers found matching the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Log New Expense */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-xl border border-slate-100 space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2">
                <Receipt className="h-4 w-4 text-rose-600" />
                <h3 className="text-xs font-bold text-slate-900">Record Operational Expense</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Category *</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                  className="w-full h-8 px-2.5 rounded-xl border border-slate-300 bg-white"
                >
                  <option value="FLEET_MAINTENANCE">Fleet Repairs & Punctures</option>
                  <option value="FLEET_FUEL">Fleet Petrol / Fuel</option>
                  <option value="RO_MAINTENANCE">RO Plant Filter Spares</option>
                  <option value="PLANT_UTILITIES">Generator Diesel / Power</option>
                  <option value="STAFF_PETTY">Staff Tea & Refreshments</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Description *</label>
                <input
                  type="text"
                  placeholder="e.g. Majid bike puncture repair"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full h-8 px-3 rounded-xl border border-slate-300"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Amount (Rs) *</label>
                <input
                  type="number"
                  placeholder="350"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className="w-full h-9 px-3 rounded-xl border border-slate-300 font-mono font-bold bg-rose-50/30 text-rose-700 border-rose-200"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Paid From</label>
                  <select
                    value={form.paidVia}
                    onChange={(e) => setForm({ ...form, paidVia: e.target.value as any })}
                    className="w-full h-8 px-2 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="RIDER_BAG_DEDUCTION">Rider Cash Bag</option>
                    <option value="CASH_DRAWER">Plant Cash Safe</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Claimed By</label>
                  <input
                    type="text"
                    value={form.claimedBy}
                    onChange={(e) => setForm({ ...form, claimedBy: e.target.value })}
                    className="w-full h-8 px-2.5 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Location / Vendor Note</label>
                <input
                  type="text"
                  placeholder="e.g. Tyre shop at College Chowk"
                  value={form.receiptNote}
                  onChange={(e) => setForm({ ...form, receiptNote: e.target.value })}
                  className="w-full h-8 px-3 rounded-xl border border-slate-300"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="h-8 px-3 text-slate-600 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-8 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-semibold shadow-2xs"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}