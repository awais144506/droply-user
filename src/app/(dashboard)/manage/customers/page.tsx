"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  UserPlus,
  Search,
  MapPin,
  Phone,
  Wallet,
  RotateCcw,
  ShieldCheck,
  ExternalLink,
  Pencil,
  Trash2,
  X,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Building2,
  DollarSign,
  Plus,
} from "lucide-react";

// --- TYPES ---
export type CustomerStatus = "ACTIVE" | "INACTIVE" | "BLOCKED";

export interface BranchCustomer {
  id: string;
  name: string;
  phone: string;
  address: string;
  zoneId: string;
  zoneName: string;
  ledgerBalance: number; // Outstanding Udhaar (PKR)
  returnablesHeld: number; // 19L Bottles currently in customer custody
  securityDeposit: number; // Security deposit held (PKR)
  bottleRateOverride?: number; // Custom rate if different from zone default (PKR)
  status: CustomerStatus;
  createdAt: string;
}

// --- DUMMY DATA (Sahiwal Sectors) ---
const MOCK_ZONES = [
  { id: "z-1", name: "Farid Town (Block Y & Z)" },
  { id: "z-2", name: "Tariq Bin Ziad Colony" },
  { id: "z-3", name: "Fateh Sher Colony" },
  { id: "z-4", name: "High Street Commercial" },
  { id: "z-5", name: "Scheme No. 3" },
];

const MOCK_CUSTOMERS: BranchCustomer[] = [
  {
    id: "c-101",
    name: "Tariq Mahmood",
    phone: "+92 321 4455667",
    address: "House 14, Block Y, Street 4",
    zoneId: "z-1",
    zoneName: "Farid Town (Block Y & Z)",
    ledgerBalance: 1200,
    returnablesHeld: 4,
    securityDeposit: 4000,
    bottleRateOverride: 200,
    status: "ACTIVE",
    createdAt: "Jan 12, 2026",
  },
  {
    id: "c-102",
    name: "Al-Madina Sweets & Bakers",
    phone: "+92 300 7788990",
    address: "Shop 12-14, Main Bazar",
    zoneId: "z-2",
    zoneName: "Tariq Bin Ziad Colony",
    ledgerBalance: 0,
    returnablesHeld: 12,
    securityDeposit: 12000,
    bottleRateOverride: 190,
    status: "ACTIVE",
    createdAt: "Jan 18, 2026",
  },
  {
    id: "c-103",
    name: "Dr. Shahida Parveen",
    phone: "+92 333 1122334",
    address: "House 18, Near Girls College",
    zoneId: "z-3",
    zoneName: "Fateh Sher Colony",
    ledgerBalance: 450,
    returnablesHeld: 2,
    securityDeposit: 2000,
    status: "ACTIVE",
    createdAt: "Feb 01, 2026",
  },
  {
    id: "c-104",
    name: "Muhammad Bilal",
    phone: "+92 304 9988776",
    address: "Shop 4, High Street Market",
    zoneId: "z-4",
    zoneName: "High Street Commercial",
    ledgerBalance: 3200,
    returnablesHeld: 6,
    securityDeposit: 3000,
    status: "ACTIVE",
    createdAt: "Mar 10, 2026",
  },
  {
    id: "c-105",
    name: "Farhan Zafar",
    phone: "+92 312 3344556",
    address: "House 5, Street 2, Scheme No. 3",
    zoneId: "z-5",
    zoneName: "Scheme No. 3",
    ledgerBalance: 0,
    returnablesHeld: 0,
    securityDeposit: 1000,
    status: "INACTIVE",
    createdAt: "Apr 05, 2026",
  },
];

export default function CustomersPage() {
  const [customers, setCustomers] = useState<BranchCustomer[]>(MOCK_CUSTOMERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [zoneFilter, setZoneFilter] = useState("ALL");
  const [khataFilter, setKhataFilter] = useState<"ALL" | "WITH_DEBT" | "CLEAN">("ALL");
  const [bottleFilter, setBottleFilter] = useState<"ALL" | "HOLDS_BOTTLES">("ALL");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<BranchCustomer | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    zoneId: MOCK_ZONES[0].id,
    openingBalance: 0,
    openingBottles: 2,
    securityDeposit: 2000,
    customBottleRate: 200,
  });

  // Calculate Metrics
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter((c) => c.status === "ACTIVE").length;
  const totalOutstandingKhata = customers.reduce((sum, c) => sum + c.ledgerBalance, 0);
  const totalBottlesInMarket = customers.reduce((sum, c) => sum + c.returnablesHeld, 0);
  const totalSecurityHeld = customers.reduce((sum, c) => sum + c.securityDeposit, 0);

  // Filter Logic
  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.address.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (zoneFilter !== "ALL" && c.zoneId !== zoneFilter) return false;
    if (khataFilter === "WITH_DEBT" && c.ledgerBalance <= 0) return false;
    if (khataFilter === "CLEAN" && c.ledgerBalance > 0) return false;
    if (bottleFilter === "HOLDS_BOTTLES" && c.returnablesHeld <= 0) return false;

    return true;
  });

  const handleOpenAddModal = () => {
    setEditingCustomer(null);
    setFormData({
      name: "",
      phone: "",
      address: "",
      zoneId: MOCK_ZONES[0].id,
      openingBalance: 0,
      openingBottles: 2,
      securityDeposit: 2000,
      customBottleRate: 200,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (customer: BranchCustomer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      phone: customer.phone,
      address: customer.address,
      zoneId: customer.zoneId,
      openingBalance: customer.ledgerBalance,
      openingBottles: customer.returnablesHeld,
      securityDeposit: customer.securityDeposit,
      customBottleRate: customer.bottleRateOverride || 200,
    });
    setIsModalOpen(true);
  };

  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) return;

    const selectedZone = MOCK_ZONES.find((z) => z.id === formData.zoneId);

    if (editingCustomer) {
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === editingCustomer.id
            ? {
                ...c,
                name: formData.name,
                phone: formData.phone,
                address: formData.address,
                zoneId: formData.zoneId,
                zoneName: selectedZone?.name || c.zoneName,
                securityDeposit: Number(formData.securityDeposit),
                bottleRateOverride: Number(formData.customBottleRate),
              }
            : c
        )
      );
    } else {
      const newCustomer: BranchCustomer = {
        id: `c-${Date.now()}`,
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        zoneId: formData.zoneId,
        zoneName: selectedZone?.name || MOCK_ZONES[0].name,
        ledgerBalance: Number(formData.openingBalance),
        returnablesHeld: Number(formData.openingBottles),
        securityDeposit: Number(formData.securityDeposit),
        bottleRateOverride: Number(formData.customBottleRate),
        status: "ACTIVE",
        createdAt: "Just now",
      };
      setCustomers((prev) => [newCustomer, ...prev]);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Customer Directory & Khata
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage customer accounts, sector routes, outstanding balances, and returnable 19L bottle liabilities.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="inline-flex items-center justify-center gap-1.5 h-9 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold transition-colors shadow-xs"
        >
          <UserPlus className="h-4 w-4" />
          <span>Add New Customer</span>
        </button>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Metric 1: Total Customers */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Total Accounts
            </span>
            <div className="h-7 w-7 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {totalCustomers}{" "}
            <span className="text-xs text-emerald-600 font-normal">({activeCustomers} Active)</span>
          </p>
        </div>

        {/* Metric 2: Total Outstanding Udhaar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Total Outstanding Khata
            </span>
            <div className="h-7 w-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <Wallet className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-amber-600 font-mono">
            Rs {totalOutstandingKhata.toLocaleString()}
          </p>
        </div>

        {/* Metric 3: Bottles in Customer Custody */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Bottles in Market
            </span>
            <div className="h-7 w-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <RotateCcw className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 font-mono">
            {totalBottlesInMarket}{" "}
            <span className="text-xs font-normal text-slate-400 font-sans">units</span>
          </p>
        </div>

        {/* Metric 4: Security Deposits Held */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Security Cash Held
            </span>
            <div className="h-7 w-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 font-mono">
            Rs {totalSecurityHeld.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Main Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Table Filters & Search */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* High Contrast Search Bar */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search customer by name, phone, or street..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Sector/Zone */}
            <select
              value={zoneFilter}
              onChange={(e) => setZoneFilter(e.target.value)}
              className="h-9 px-3 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
            >
              <option value="ALL">All Delivery Zones</option>
              {MOCK_ZONES.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.name}
                </option>
              ))}
            </select>

            {/* Khata Debt Toggle */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-medium text-slate-600">
              <button
                onClick={() => setKhataFilter("ALL")}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  khataFilter === "ALL" ? "bg-white text-slate-900 shadow-2xs font-semibold" : ""
                }`}
              >
                All Khata
              </button>
              <button
                onClick={() => setKhataFilter("WITH_DEBT")}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  khataFilter === "WITH_DEBT" ? "bg-white text-amber-700 shadow-2xs font-semibold" : ""
                }`}
              >
                Has Debt
              </button>
              <button
                onClick={() => setKhataFilter("CLEAN")}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  khataFilter === "CLEAN" ? "bg-white text-emerald-700 shadow-2xs font-semibold" : ""
                }`}
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Directory Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                <th className="py-3 px-4">Customer & Address</th>
                <th className="py-3 px-4">Sector / Zone</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4 text-right">Khata Balance</th>
                <th className="py-3 px-4 text-center">Bottles Held</th>
                <th className="py-3 px-4 text-right">Security Deposit</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Name & Address */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{customer.name}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="h-2.5 w-2.5 shrink-0 text-slate-400" />
                        <span className="truncate max-w-xs">{customer.address}</span>
                      </div>
                    </td>

                    {/* Zone Badge */}
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-sky-50 text-sky-700 border border-sky-200/60">
                        {customer.zoneName}
                      </span>
                    </td>

                    {/* Phone */}
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {customer.phone}
                    </td>

                    {/* Khata Balance */}
                    <td className="py-3 px-4 text-right font-medium">
                      {customer.ledgerBalance > 0 ? (
                        <span className="text-amber-600 font-bold font-mono">
                          Rs {customer.ledgerBalance.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-emerald-600 font-semibold font-mono">
                          Rs 0 (Clear)
                        </span>
                      )}
                    </td>

                    {/* Bottles Held */}
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md font-bold font-mono text-xs bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                        {customer.returnablesHeld}
                      </span>
                    </td>

                    {/* Security Deposit */}
                    <td className="py-3 px-4 text-right font-mono text-slate-800 font-semibold">
                      Rs {customer.securityDeposit.toLocaleString()}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEditModal(customer)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                          title="Edit Customer Info"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>

                        <Link
                          href={`/customers/${customer.id}`}
                          className="inline-flex items-center gap-1 text-sky-600 font-semibold hover:text-sky-700 text-xs hover:underline"
                        >
                          <span>Ledger</span>
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No customers match the selected filters or search keyword.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Customer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900">
                {editingCustomer ? "Edit Customer Details" : "Add New Customer Account"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCustomer} className="space-y-3">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Customer Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Tariq Mahmood"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full h-9 rounded-xl border border-slate-300 px-3 text-xs outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  required
                />
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Phone Number *</label>
                <input
                  type="text"
                  placeholder="+92 300 0000000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full h-9 rounded-xl border border-slate-300 px-3 text-xs outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  required
                />
              </div>

              {/* Street Address */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Street Address *</label>
                <input
                  type="text"
                  placeholder="House #, Street, Block"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full h-9 rounded-xl border border-slate-300 px-3 text-xs outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  required
                />
              </div>

              {/* Zone / Sector Assignment */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Sector / Zone Assignment *</label>
                <select
                  value={formData.zoneId}
                  onChange={(e) => setFormData({ ...formData, zoneId: e.target.value })}
                  className="w-full h-9 rounded-xl border border-slate-300 px-2 text-xs bg-white focus:ring-2 focus:ring-sky-500/20"
                >
                  {MOCK_ZONES.map((z) => (
                    <option key={z.id} value={z.id}>
                      {z.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Opening Balances (Only for New Customers) */}
              {!editingCustomer && (
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Opening Debt (Rs)</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={formData.openingBalance}
                      onChange={(e) => setFormData({ ...formData, openingBalance: Number(e.target.value) })}
                      className="w-full h-9 rounded-xl border border-slate-300 px-3 text-xs font-mono outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Opening Empties Held</label>
                    <input
                      type="number"
                      placeholder="2"
                      value={formData.openingBottles}
                      onChange={(e) => setFormData({ ...formData, openingBottles: Number(e.target.value) })}
                      className="w-full h-9 rounded-xl border border-slate-300 px-3 text-xs font-mono outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Rates & Security */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Security Deposit (Rs)</label>
                  <input
                    type="number"
                    placeholder="2000"
                    value={formData.securityDeposit}
                    onChange={(e) => setFormData({ ...formData, securityDeposit: Number(e.target.value) })}
                    className="w-full h-9 rounded-xl border border-slate-300 px-3 text-xs font-mono outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Rate per Bottle (Rs)</label>
                  <input
                    type="number"
                    placeholder="200"
                    value={formData.customBottleRate}
                    onChange={(e) => setFormData({ ...formData, customBottleRate: Number(e.target.value) })}
                    className="w-full h-9 rounded-xl border border-slate-300 px-3 text-xs font-mono outline-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="h-8 px-3 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-8 px-4 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold transition-colors"
                >
                  {editingCustomer ? "Save Changes" : "Create Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}