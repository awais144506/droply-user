"use client";

import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Wallet,
  Receipt,
  Plus,
  Search,
  Filter,
  Download,
  Calendar,
  Layers,
  Wrench,
  Fuel,
  Droplet,
  Zap,
  Coffee,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  X,
  Bike,
  Building2,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

// --- TYPES ---
export type ExpenseCategory =
  | "FLEET_MAINTENANCE" // Bike puncture, oil change, tire repair
  | "FLEET_FUEL" // Petrol for delivery bikes/loader rickshaws
  | "PLANT_UTILITIES" // Electricity (WAPDA), Generator Diesel
  | "RO_MAINTENANCE" // Filter cartridge replacement, membrane cleaning, salt
  | "STAFF_PETTY" // Daily staff lunch, tea, mobile balance
  | "RENT_SALARIES"; // Fixed plant rent, rider salaries

export interface PlantExpense {
  id: string;
  voucherNumber: string;
  category: ExpenseCategory;
  title: string;
  amount: number;
  paidVia: "CASH_DRAWER" | "RIDER_BAG_DEDUCTION" | "BANK_TRANSFER";
  claimedBy?: string; // e.g. "Majid Ali (Rider)"
  approvedBy: string;
  timestamp: string;
  receiptNote?: string;
}

export interface MonthlyPLSummary {
  grossSalesRevenue: number;
  costOfGoodsSold: number; // Raw Caps, Seals, Preforms
  grossProfit: number;
  totalOperatingExpenses: number;
  netProfit: number;
  netProfitMargin: number;
}

// --- DUMMY DATA (Sahiwal RO Operations) ---
const MOCK_PL: MonthlyPLSummary = {
  grossSalesRevenue: 1420500, // Total Water + Bottle sales
  costOfGoodsSold: 284000, // Caps, seals, chemicals used
  grossProfit: 1136500,
  totalOperatingExpenses: 348200, // Fleet, WAPDA electricity, salaries, punctures
  netProfit: 788300,
  netProfitMargin: 55.5,
};

const MOCK_EXPENSES: PlantExpense[] = [
  {
    id: "exp-1",
    voucherNumber: "EXP-2026-091",
    category: "FLEET_MAINTENANCE",
    title: "Rear tyre puncture & tube valve replacement",
    amount: 350,
    paidVia: "RIDER_BAG_DEDUCTION",
    claimedBy: "Majid Ali (Farid Town Route)",
    approvedBy: "Kamran Akmal",
    timestamp: "Today, 11:20 AM",
    receiptNote: "Repaired at College Chowk tyre shop",
  },
  {
    id: "exp-2",
    voucherNumber: "EXP-2026-090",
    category: "FLEET_FUEL",
    title: "Daily Petrol refill for 3 delivery bikes",
    amount: 2400,
    paidVia: "CASH_DRAWER",
    claimedBy: "Fleet Pool (Usman & Bilal)",
    approvedBy: "Kamran Akmal",
    timestamp: "Today, 08:30 AM",
    receiptNote: "PSO Petrol Pump, High Street Sahiwal",
  },
  {
    id: "exp-3",
    voucherNumber: "EXP-2026-089",
    category: "RO_MAINTENANCE",
    title: "20-inch PP Sediment & Carbon Filter Replacement (4 Pcs)",
    amount: 6800,
    paidVia: "BANK_TRANSFER",
    approvedBy: "Plant Admin",
    timestamp: "Yesterday, 04:15 PM",
    receiptNote: "Bi-weekly filtration maintenance",
  },
  {
    id: "exp-4",
    voucherNumber: "EXP-2026-088",
    category: "PLANT_UTILITIES",
    title: "Generator Diesel (Load-shedding backup 20L)",
    amount: 5600,
    paidVia: "CASH_DRAWER",
    approvedBy: "Plant Admin",
    timestamp: "Aug 27, 2026",
    receiptNote: "Emergency backup run for evening bottling shift",
  },
  {
    id: "exp-5",
    voucherNumber: "EXP-2026-087",
    category: "STAFF_PETTY",
    title: "Shift evening tea & refreshments",
    amount: 650,
    paidVia: "CASH_DRAWER",
    claimedBy: "Plant Workers",
    approvedBy: "Kamran Akmal",
    timestamp: "Aug 26, 2026",
    receiptNote: "Daily operational refreshment",
  },
];

export default function AdminFinancialReportsPage() {
  const [activeTab, setActiveTab] = useState<"pl_summary" | "expense_ledger">("pl_summary");
  const [expenses, setExpenses] = useState<PlantExpense[]>(MOCK_EXPENSES);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");

  // Modal State for Logging Petty Expense
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    title: "",
    amount: "",
    category: "FLEET_MAINTENANCE" as ExpenseCategory,
    paidVia: "RIDER_BAG_DEDUCTION" as const,
    claimedBy: "Majid Ali (Rider)",
    receiptNote: "",
  });

  // Calculate Aggregated Expense Breakdown
  const fleetExpensesTotal = expenses
    .filter((e) => e.category === "FLEET_MAINTENANCE" || e.category === "FLEET_FUEL")
    .reduce((sum, e) => sum + e.amount, 0);

  const plantMaintenanceTotal = expenses
    .filter((e) => e.category === "RO_MAINTENANCE" || e.category === "PLANT_UTILITIES")
    .reduce((sum, e) => sum + e.amount, 0);

  const staffPettyTotal = expenses
    .filter((e) => e.category === "STAFF_PETTY")
    .reduce((sum, e) => sum + e.amount, 0);

  // Filtered Expenses
  const filteredExpenses = expenses.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.voucherNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.claimedBy && e.claimedBy.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (categoryFilter !== "ALL" && e.category !== categoryFilter) return false;

    return true;
  });

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const newExpense: PlantExpense = {
      id: `exp-${Date.now()}`,
      voucherNumber: `EXP-2026-${Math.floor(100 + Math.random() * 900)}`,
      category: expenseForm.category,
      title: expenseForm.title,
      amount: parseFloat(expenseForm.amount) || 0,
      paidVia: expenseForm.paidVia,
      claimedBy: expenseForm.claimedBy,
      approvedBy: "Shift Manager",
      timestamp: "Today, Just now",
      receiptNote: expenseForm.receiptNote,
    };

    setExpenses([newExpense, ...expenses]);
    setIsExpenseModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1">
            <span>Executive Admin</span>
            <span>/</span>
            <span className="text-slate-700">Financial Reports & P&L</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Plant P&L, Sales & Operational Expenses
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Comprehensive financial statements, petty cash audits, rider expense claims, and net profit margins.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpenseModalOpen(true)}
            className="inline-flex items-center justify-center gap-1.5 h-9 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors shadow-xs"
          >
            <Plus className="h-4 w-4" />
            <span>Log Petty Expense</span>
          </button>
        </div>
      </div>

      {/* Primary Financial Overview Cards (P&L Snapshot) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Gross Revenue */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Gross Water Revenue
            </span>
            <div className="h-7 w-7 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600">
              <Droplet className="h-4 w-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900 font-mono">
              Rs {MOCK_PL.grossSalesRevenue.toLocaleString()}
            </p>
            <p className="text-[11px] text-emerald-600 font-medium mt-0.5 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              <span>+14.2% vs last month</span>
            </p>
          </div>
        </div>

        {/* Cost of Goods Sold (COGS) */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Direct Production COGS
            </span>
            <div className="h-7 w-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <Layers className="h-4 w-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900 font-mono">
              Rs {MOCK_PL.costOfGoodsSold.toLocaleString()}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Caps, shrink sleeves, chemicals
            </p>
          </div>
        </div>

        {/* Operating & Petty Expenses */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Total OPEX & Petty
            </span>
            <div className="h-7 w-7 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
              <TrendingDown className="h-4 w-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-rose-600 font-mono">
              Rs {MOCK_PL.totalOperatingExpenses.toLocaleString()}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Fleet fuel, repairs, electricity, staff
            </p>
          </div>
        </div>

        {/* Net Plant Profit */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Net Plant Profit
            </span>
            <div className="h-7 w-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-emerald-700 font-mono">
              Rs {MOCK_PL.netProfit.toLocaleString()}
            </p>
            <p className="text-[11px] text-emerald-600 font-bold mt-0.5">
              {MOCK_PL.netProfitMargin}% Net Profit Margin
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center border-b border-slate-200 gap-2">
        <button
          onClick={() => setActiveTab("pl_summary")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === "pl_summary"
              ? "border-sky-600 text-sky-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Receipt className="h-4 w-4" />
          <span>Monthly Profit & Loss Statement</span>
        </button>

        <button
          onClick={() => setActiveTab("expense_ledger")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === "expense_ledger"
              ? "border-sky-600 text-sky-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Wrench className="h-4 w-4" />
          <span>Petty Cash & Expense Ledger</span>
          <span className="px-1.5 py-0.2 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">
            {expenses.length}
          </span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: P&L STATEMENT */}
      {/* ========================================================= */}
      {activeTab === "pl_summary" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Detailed Statement Table */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/90 shadow-xs p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  August 2026 Statement of Profit & Loss
                </h3>
                <p className="text-[11px] text-slate-400">
                  Accrual basis financial reporting for Sahiwal Central RO Plant
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Audited & Balanced
              </span>
            </div>

            <div className="space-y-3 text-xs">
              {/* Section 1: Revenue */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-bold text-slate-900 bg-slate-50 p-2.5 rounded-xl">
                  <span>1. Gross Sahiwal Water Sales</span>
                  <span className="font-mono">Rs 1,420,500</span>
                </div>
                <div className="pl-4 pr-2.5 space-y-1 text-slate-600">
                  <div className="flex justify-between">
                    <span>Route Delivery Orders (Residential / Commercial)</span>
                    <span className="font-mono">Rs 1,080,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Gate POS Walk-in Counter Sales</span>
                    <span className="font-mono">Rs 340,500</span>
                  </div>
                </div>
              </div>

              {/* Section 2: COGS */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-bold text-slate-900 bg-slate-50 p-2.5 rounded-xl">
                  <span>2. Cost of Goods Sold (Direct Consumables)</span>
                  <span className="font-mono text-rose-600">-Rs 284,000</span>
                </div>
                <div className="pl-4 pr-2.5 space-y-1 text-slate-600">
                  <div className="flex justify-between">
                    <span>55mm Smart Non-Spill Caps</span>
                    <span className="font-mono">Rs 145,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tamper-evident Heat Shrink Sleeves</span>
                    <span className="font-mono">Rs 32,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>RO Minerals & Anti-scalant Chemical Treatment</span>
                    <span className="font-mono">Rs 107,000</span>
                  </div>
                </div>
              </div>

              {/* Section 3: Gross Profit */}
              <div className="flex justify-between font-bold text-slate-900 bg-sky-50/70 p-3 rounded-xl border border-sky-100">
                <span className="text-sky-950">GROSS PROFIT</span>
                <span className="font-mono text-sm text-sky-950">Rs 1,136,500</span>
              </div>

              {/* Section 4: Operating Expenses */}
              <div className="space-y-1.5">
                <div className="flex justify-between font-bold text-slate-900 bg-slate-50 p-2.5 rounded-xl">
                  <span>3. Operating & Petty Expenses (OPEX)</span>
                  <span className="font-mono text-rose-600">-Rs 348,200</span>
                </div>
                <div className="pl-4 pr-2.5 space-y-1 text-slate-600">
                  <div className="flex justify-between">
                    <span>Fleet Fuel & Delivery Petrol</span>
                    <span className="font-mono">Rs 62,400</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fleet Repairs & Rider Bike Punctures</span>
                    <span className="font-mono">Rs 14,800</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Plant Electricity (WAPDA) & Generator Fuel</span>
                    <span className="font-mono">Rs 112,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Plant Rent & Staff Basic Salaries</span>
                    <span className="font-mono">Rs 150,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Staff Refreshments & Petty Cash</span>
                    <span className="font-mono">Rs 9,000</span>
                  </div>
                </div>
              </div>

              {/* Section 5: Net Profit */}
              <div className="flex justify-between font-bold text-emerald-950 bg-emerald-50/90 p-3 rounded-xl border border-emerald-200">
                <span className="text-sm">NET OPERATING PROFIT</span>
                <span className="font-mono text-base text-emerald-700">Rs 788,300</span>
              </div>
            </div>
          </div>

          {/* Expense Allocation Analytics Sidebar */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs p-5 space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2.5 mb-3">
                Expense Breakdown
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-600">Electricity & Power:</span>
                    <span className="font-bold text-slate-900">32%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full w-[32%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-600">Salaries & Labor:</span>
                    <span className="font-bold text-slate-900">43%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full w-[43%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-600">Delivery Fleet & Fuel:</span>
                    <span className="font-bold text-slate-900">22%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-sky-600 h-full w-[22%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-600">Petty Cash & Refreshments:</span>
                    <span className="font-bold text-slate-900">3%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full w-[3%]" />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-[11px] text-slate-500 space-y-1">
              <span className="font-bold text-slate-700 block text-xs">Sahiwal Plant Audit:</span>
              <p>
                Rider petty expenses (punctures, urgent oil top-ups) are automatically deducted from their end-of-shift cash deposits to avoid out-of-pocket delays.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: EXPENSE LEDGER & PETTY CASH AUDIT */}
      {/* ========================================================= */}
      {activeTab === "expense_ledger" && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
          {/* Filters */}
          <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Search expense description, rider, voucher #..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-3 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="h-9 px-3 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
              >
                <option value="ALL">All Expense Categories</option>
                <option value="FLEET_MAINTENANCE">Fleet Repairs & Punctures</option>
                <option value="FLEET_FUEL">Fleet Petrol / Fuel</option>
                <option value="PLANT_UTILITIES">Electricity & Generator</option>
                <option value="RO_MAINTENANCE">RO Filters & Spares</option>
                <option value="STAFF_PETTY">Staff Tea & Petty Cash</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                  <th className="py-3 px-4">Voucher # & Date</th>
                  <th className="py-3 px-4">Expense Title & Details</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Payment Method / Claimed By</th>
                  <th className="py-3 px-4 text-right">Amount (PKR)</th>
                  <th className="py-3 px-4 text-center">Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Voucher & Date */}
                    <td className="py-3 px-4 font-mono">
                      <span className="font-bold text-slate-900 block">{exp.voucherNumber}</span>
                      <span className="text-[10px] font-sans text-slate-400">{exp.timestamp}</span>
                    </td>

                    {/* Title & Notes */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{exp.title}</div>
                      {exp.receiptNote && (
                        <div className="text-[11px] text-slate-400 mt-0.5">{exp.receiptNote}</div>
                      )}
                    </td>

                    {/* Category Badge */}
                    <td className="py-3 px-4">
                      {exp.category === "FLEET_MAINTENANCE" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200/60">
                          <Bike className="h-3 w-3" />
                          <span>Tyre / Puncture</span>
                        </span>
                      ) : exp.category === "FLEET_FUEL" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
                          <Fuel className="h-3 w-3" />
                          <span>Bike Petrol</span>
                        </span>
                      ) : exp.category === "RO_MAINTENANCE" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                          <Wrench className="h-3 w-3" />
                          <span>RO Filter Change</span>
                        </span>
                      ) : exp.category === "PLANT_UTILITIES" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200/60">
                          <Zap className="h-3 w-3" />
                          <span>Generator Fuel</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700">
                          <Coffee className="h-3 w-3" />
                          <span>Staff Tea</span>
                        </span>
                      )}
                    </td>

                    {/* Payment Mode / Claimed by */}
                    <td className="py-3 px-4">
                      {exp.paidVia === "RIDER_BAG_DEDUCTION" ? (
                        <div>
                          <span className="font-semibold text-rose-600 block">
                            Deducted from Shift Cash Bag
                          </span>
                          <span className="text-[10px] text-slate-400">{exp.claimedBy}</span>
                        </div>
                      ) : exp.paidVia === "CASH_DRAWER" ? (
                        <div>
                          <span className="font-semibold text-slate-800 block">Plant Cash Safe</span>
                          {exp.claimedBy && (
                            <span className="text-[10px] text-slate-400">{exp.claimedBy}</span>
                          )}
                        </div>
                      ) : (
                        <span className="font-semibold text-sky-700">Bank Transfer</span>
                      )}
                    </td>

                    {/* Amount */}
                    <td className="py-3 px-4 text-right font-mono font-bold text-sm text-rose-600">
                      -Rs {exp.amount.toLocaleString()}
                    </td>

                    {/* Approved by */}
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Approved</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: LOG PETTY / TRANSIT EXPENSE */}
      {/* ========================================================= */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                  <Receipt className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Record Operational / Petty Expense</h2>
                  <p className="text-[11px] text-slate-400">Log bike repairs, fuel, or plant maintenance</p>
                </div>
              </div>
              <button
                onClick={() => setIsExpenseModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateExpense} className="space-y-3">
              {/* Category */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Expense Category *</label>
                <select
                  value={expenseForm.category}
                  onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value as any })}
                  className="w-full h-9 rounded-xl border border-slate-300 px-3 text-xs bg-white"
                >
                  <option value="FLEET_MAINTENANCE">Fleet Maintenance (Tyre puncture, oil)</option>
                  <option value="FLEET_FUEL">Fleet Petrol / Fuel</option>
                  <option value="RO_MAINTENANCE">RO Plant Filter Cartridge / Spares</option>
                  <option value="PLANT_UTILITIES">Generator Diesel / Electricity</option>
                  <option value="STAFF_PETTY">Staff Tea / Lunch / Mobile Data</option>
                </select>
              </div>

              {/* Title / Description */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Expense Description *</label>
                <input
                  type="text"
                  placeholder="e.g. Majid bike puncture repair"
                  value={expenseForm.title}
                  onChange={(e) => setExpenseForm({ ...expenseForm, title: e.target.value })}
                  className="w-full h-9 rounded-xl border border-slate-300 px-3 text-xs outline-none focus:ring-2 focus:ring-rose-500/20"
                  required
                />
              </div>

              {/* Amount */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Amount Spent (Rs) *</label>
                <input
                  type="number"
                  placeholder="350"
                  value={expenseForm.amount}
                  onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                  className="w-full h-10 rounded-xl border border-slate-300 px-3 text-sm font-mono font-bold text-slate-900 bg-rose-50/30 border-rose-300 outline-none"
                  required
                />
              </div>

              {/* Payment Channel */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Payment Source</label>
                  <select
                    value={expenseForm.paidVia}
                    onChange={(e) => setExpenseForm({ ...expenseForm, paidVia: e.target.value as any })}
                    className="w-full h-9 rounded-xl border border-slate-300 px-2 text-xs bg-white"
                  >
                    <option value="RIDER_BAG_DEDUCTION">Deduct from Rider Bag</option>
                    <option value="CASH_DRAWER">Plant Cash Safe</option>
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Claimed By (Rider/Staff)</label>
                  <input
                    type="text"
                    value={expenseForm.claimedBy}
                    onChange={(e) => setExpenseForm({ ...expenseForm, claimedBy: e.target.value })}
                    className="w-full h-9 rounded-xl border border-slate-300 px-3 text-xs outline-none"
                  />
                </div>
              </div>

              {/* Receipt Note */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Receipt / Location Note</label>
                <input
                  type="text"
                  placeholder="e.g. Tyre shop at College Chowk"
                  value={expenseForm.receiptNote}
                  onChange={(e) => setExpenseForm({ ...expenseForm, receiptNote: e.target.value })}
                  className="w-full h-9 rounded-xl border border-slate-300 px-3 text-xs outline-none"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsExpenseModalOpen(false)}
                  className="h-9 px-4 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-9 px-5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold transition-colors shadow-xs"
                >
                  Log Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}