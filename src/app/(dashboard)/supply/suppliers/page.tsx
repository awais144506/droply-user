"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Building2,
  Plus,
  Search,
  Phone,
  MapPin,
  Wallet,
  CreditCard,
  FileText,
  ExternalLink,
  Pencil,
  Archive,
  CheckCircle2,
  AlertCircle,
  X,
  Package,
  ArrowDownRight,
  TrendingDown,
  Filter,
} from "lucide-react";

// --- TYPES ---
export type SupplierCategory =
  | "BOTTLES_PREFORMS"
  | "CAPS_SEALS"
  | "CHEMICALS_MINERALS"
  | "MACHINERY_SPARES"
  | "GENERAL";

export interface VendorSupplier {
  id: string;
  firmName: string;
  contactPerson: string;
  phone: string;
  email?: string;
  city: string;
  address: string;
  category: SupplierCategory;
  payableBalance: number; // Total amount owed by plant to supplier (PKR)
  totalPurchasesToDate: number;
  lastPurchaseDate: string;
  isArchived: boolean;
}

// --- DUMMY DATA (RO Plant Supply Chain) ---
const MOCK_SUPPLIERS: VendorSupplier[] = [
  {
    id: "sup-1",
    firmName: "Al-Sharq Plastics & Polymers",
    contactPerson: "Haji Abdul Rehman",
    phone: "+92 323 0010950",
    email: "sales@alsharqplastic.com",
    city: "Lahore",
    address: "Plot 14-B, Sundar Industrial Estate, Lahore",
    category: "BOTTLES_PREFORMS",
    payableBalance: 36000,
    totalPurchasesToDate: 485000,
    lastPurchaseDate: "Aug 24, 2026",
    isArchived: false,
  },
  {
    id: "sup-2",
    firmName: "SES Group Packaging",
    contactPerson: "Muhammad Tariq",
    phone: "+92 301 1117883",
    email: "tariq@sesgroup.pk",
    city: "Gujranwala",
    address: "Small Industrial Estate 2, Gujranwala",
    category: "CAPS_SEALS",
    payableBalance: 126282,
    totalPurchasesToDate: 890000,
    lastPurchaseDate: "Aug 18, 2026",
    isArchived: false,
  },
  {
    id: "sup-3",
    firmName: "Indus RO Filtration & Chemicals",
    contactPerson: "Engr. Salman Qureshi",
    phone: "+92 300 4545678",
    email: "salman@indusfiltration.com",
    city: "Multan",
    address: "Industrial Area, Vehari Road, Multan",
    category: "CHEMICALS_MINERALS",
    payableBalance: 0,
    totalPurchasesToDate: 260000,
    lastPurchaseDate: "Aug 10, 2026",
    isArchived: false,
  },
  {
    id: "sup-4",
    firmName: "Pak Pump Dispenser Importers",
    contactPerson: "Zubair Ahmad",
    phone: "+92 333 8989123",
    city: "Lahore",
    address: "Brandreth Road Wholesale Market, Lahore",
    category: "MACHINERY_SPARES",
    payableBalance: 18500,
    totalPurchasesToDate: 145000,
    lastPurchaseDate: "Jul 28, 2026",
    isArchived: false,
  },
  {
    id: "sup-5",
    firmName: "Prime Polycarbonate Bottles (Old)",
    contactPerson: "Khurram Shah",
    phone: "+92 321 7766554",
    city: "Faisalabad",
    address: "Millat Industrial Estate, Faisalabad",
    category: "BOTTLES_PREFORMS",
    payableBalance: 0,
    totalPurchasesToDate: 120000,
    lastPurchaseDate: "May 12, 2026",
    isArchived: true,
  },
];

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<VendorSupplier[]>(MOCK_SUPPLIERS);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
  const [showArchived, setShowArchived] = useState(false);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<VendorSupplier | null>(null);

  // Add / Edit Form State
  const [formData, setFormData] = useState({
    firmName: "",
    contactPerson: "",
    phone: "",
    email: "",
    city: "Lahore",
    address: "",
    category: "BOTTLES_PREFORMS" as SupplierCategory,
    openingBalance: 0,
  });

  // Payment Out Form State
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("BANK_TRANSFER");
  const [paymentRef, setPaymentRef] = useState("");

  // Aggregate Metrics
  const activeSuppliers = suppliers.filter((s) => !s.isArchived);
  const totalPayableBalance = activeSuppliers.reduce(
    (sum, s) => sum + s.payableBalance,
    0
  );
  const totalProcurementVolume = activeSuppliers.reduce(
    (sum, s) => sum + s.totalPurchasesToDate,
    0
  );
  const vendorsWithPendingDebt = activeSuppliers.filter(
    (s) => s.payableBalance > 0
  ).length;

  // Filtered List
  const filteredSuppliers = suppliers.filter((s) => {
    if (!showArchived && s.isArchived) return false;
    if (showArchived && !s.isArchived) return false;

    const matchesSearch =
      s.firmName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.phone.includes(searchQuery) ||
      s.city.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (categoryFilter !== "ALL" && s.category !== categoryFilter) return false;

    return true;
  });

  const handleOpenAddModal = (supplier?: VendorSupplier) => {
    if (supplier) {
      setSelectedSupplier(supplier);
      setFormData({
        firmName: supplier.firmName,
        contactPerson: supplier.contactPerson,
        phone: supplier.phone,
        email: supplier.email || "",
        city: supplier.city,
        address: supplier.address,
        category: supplier.category,
        openingBalance: supplier.payableBalance,
      });
    } else {
      setSelectedSupplier(null);
      setFormData({
        firmName: "",
        contactPerson: "",
        phone: "",
        email: "",
        city: "Lahore",
        address: "",
        category: "BOTTLES_PREFORMS",
        openingBalance: 0,
      });
    }
    setIsAddModalOpen(true);
  };

  const handleSaveSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firmName || !formData.phone) return;

    if (selectedSupplier) {
      setSuppliers((prev) =>
        prev.map((s) =>
          s.id === selectedSupplier.id
            ? {
                ...s,
                firmName: formData.firmName,
                contactPerson: formData.contactPerson,
                phone: formData.phone,
                email: formData.email,
                city: formData.city,
                address: formData.address,
                category: formData.category,
              }
            : s
        )
      );
    } else {
      const newSup: VendorSupplier = {
        id: `sup-${Date.now()}`,
        firmName: formData.firmName,
        contactPerson: formData.contactPerson,
        phone: formData.phone,
        email: formData.email,
        city: formData.city,
        address: formData.address,
        category: formData.category,
        payableBalance: Number(formData.openingBalance),
        totalPurchasesToDate: Number(formData.openingBalance),
        lastPurchaseDate: "Just added",
        isArchived: false,
      };
      setSuppliers([newSup, ...suppliers]);
    }

    setIsAddModalOpen(false);
  };

  const handleOpenPaymentModal = (supplier: VendorSupplier) => {
    setSelectedSupplier(supplier);
    setPaymentAmount(String(supplier.payableBalance));
    setPaymentRef("");
    setIsPayModalOpen(true);
  };

  const handleRecordPaymentOut = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSupplier) return;

    const paid = parseFloat(paymentAmount) || 0;
    setSuppliers((prev) =>
      prev.map((s) =>
        s.id === selectedSupplier.id
          ? {
              ...s,
              payableBalance: Math.max(0, s.payableBalance - paid),
            }
          : s
      )
    );

    setIsPayModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1">
            <span>Purchases</span>
            <span>/</span>
            <span className="text-slate-700">Vendor Management</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Suppliers & Vendor Accounts
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Vendors you buy raw bottles, smart caps, RO chemicals, and plant equipment from.
          </p>
        </div>

        <button
          onClick={() => handleOpenAddModal()}
          className="inline-flex items-center justify-center gap-1.5 h-9 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold transition-colors shadow-xs"
        >
          <Plus className="h-4 w-4" />
          <span>New Supplier</span>
        </button>
      </div>

      {/* KPI Cards: Accounts Payable & Procurement */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Total Accounts Payable */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Total Accounts Payable
            </span>
            <div className="h-7 w-7 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
              <Wallet className="h-4 w-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-rose-600 font-mono">
              Rs {totalPayableBalance.toLocaleString()}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Outstanding supplier bills to settle
            </p>
          </div>
        </div>

        {/* Vendors with Payable Balance */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Suppliers with Dues
            </span>
            <div className="h-7 w-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <AlertCircle className="h-4 w-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900 font-mono">
              {vendorsWithPendingDebt}{" "}
              <span className="text-xs text-slate-400 font-sans font-normal">
                / {activeSuppliers.length} Active Firms
              </span>
            </p>
            <p className="text-[11px] text-amber-600 font-medium mt-0.5">
              Payment terms active
            </p>
          </div>
        </div>

        {/* Cumulative Procurement */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Total Sourcing Volume
            </span>
            <div className="h-7 w-7 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600">
              <Building2 className="h-4 w-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900 font-mono">
              Rs {totalProcurementVolume.toLocaleString()}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Lifetime purchases logged
            </p>
          </div>
        </div>

        {/* Direct Order Quick Action */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Purchase Orders
            </span>
            <div className="h-7 w-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <FileText className="h-4 w-4" />
            </div>
          </div>
          <div>
            <Link
              href="/purchases/orders"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-700 hover:underline"
            >
              <span>Create Purchase Order</span>
              <ArrowDownRight className="h-3.5 w-3.5" />
            </Link>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Order new caps, bottles, or salt
            </p>
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Table Filters & Search */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search by supplier name, contact person, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
            />
          </div>

          {/* Filters & Archive Toggle */}
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-9 px-3 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
            >
              <option value="ALL">All Supply Categories</option>
              <option value="BOTTLES_PREFORMS">Bottles & Preforms</option>
              <option value="CAPS_SEALS">Caps & Sleeves</option>
              <option value="CHEMICALS_MINERALS">RO Chemicals & Minerals</option>
              <option value="MACHINERY_SPARES">Machinery & Pumps</option>
            </select>

            {/* Show Archived Toggle */}
            <label className="flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showArchived}
                onChange={(e) => setShowArchived(e.target.checked)}
                className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
              />
              <span>Show archived</span>
            </label>
          </div>
        </div>

        {/* Directory Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                <th className="py-3 px-4">Supplier / Firm Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Phone / City</th>
                <th className="py-3 px-4 text-right">Payable Balance</th>
                <th className="py-3 px-4 text-right">Total Purchases</th>
                <th className="py-3 px-4 text-right">Last Purchase</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredSuppliers.length > 0 ? (
                filteredSuppliers.map((supplier) => (
                  <tr
                    key={supplier.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    {/* Firm Name & Contact Person */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">
                        {supplier.firmName}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Attn: {supplier.contactPerson}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4">
                      {supplier.category === "BOTTLES_PREFORMS" ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-sky-50 text-sky-700 border border-sky-200/60">
                          Bottles & Preforms
                        </span>
                      ) : supplier.category === "CAPS_SEALS" ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
                          Caps & Seals
                        </span>
                      ) : supplier.category === "CHEMICALS_MINERALS" ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                          Chemicals & Minerals
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200/60">
                          Pumps & Equipment
                        </span>
                      )}
                    </td>

                    {/* Phone & City */}
                    <td className="py-3 px-4">
                      <div className="font-mono text-slate-800 font-semibold">
                        {supplier.phone}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="h-2.5 w-2.5 shrink-0" />
                        <span>{supplier.city}</span>
                      </div>
                    </td>

                    {/* Payable Balance (Highlighted) */}
                    <td className="py-3 px-4 text-right font-mono font-bold">
                      {supplier.payableBalance > 0 ? (
                        <span className="text-rose-600">
                          Rs {supplier.payableBalance.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-emerald-600 font-semibold font-mono">
                          Rs 0 (Settled)
                        </span>
                      )}
                    </td>

                    {/* Total Purchases Volume */}
                    <td className="py-3 px-4 text-right font-mono text-slate-700">
                      Rs {supplier.totalPurchasesToDate.toLocaleString()}
                    </td>

                    {/* Last Purchase Date */}
                    <td className="py-3 px-4 text-right font-mono text-slate-500">
                      {supplier.lastPurchaseDate}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        {supplier.payableBalance > 0 && (
                          <button
                            onClick={() => handleOpenPaymentModal(supplier)}
                            className="h-7 px-2.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/80 text-[11px] font-bold inline-flex items-center gap-1 transition-colors shadow-2xs"
                            title="Pay Supplier"
                          >
                            <CreditCard className="h-3 w-3" />
                            <span>Pay Out</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleOpenAddModal(supplier)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                          title="Edit Supplier"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No suppliers match the selected search or category filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: ADD / EDIT SUPPLIER */}
      {/* ========================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                  <Building2 className="h-4 w-4" />
                </div>
                <h2 className="text-sm font-bold text-slate-900">
                  {selectedSupplier ? "Edit Supplier Firm" : "Add New Supplier"}
                </h2>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSupplier} className="space-y-3">
              {/* Firm Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  Company / Firm Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Al-Sharq Plastics"
                  value={formData.firmName}
                  onChange={(e) =>
                    setFormData({ ...formData, firmName: e.target.value })
                  }
                  className="w-full h-9 rounded-xl border border-slate-300 px-3 text-xs outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  required
                />
              </div>

              {/* Contact Person & Phone */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Haji Tariq"
                    value={formData.contactPerson}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contactPerson: e.target.value,
                      })
                    }
                    className="w-full h-9 rounded-xl border border-slate-300 px-3 text-xs outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    placeholder="+92 300..."
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full h-9 rounded-xl border border-slate-300 px-3 text-xs outline-none"
                    required
                  />
                </div>
              </div>

              {/* Category & City */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Supply Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as any,
                      })
                    }
                    className="w-full h-9 rounded-xl border border-slate-300 px-2 text-xs bg-white"
                  >
                    <option value="BOTTLES_PREFORMS">Bottles & Preforms</option>
                    <option value="CAPS_SEALS">Caps & Seals</option>
                    <option value="CHEMICALS_MINERALS">RO Chemicals / Salt</option>
                    <option value="MACHINERY_SPARES">Machinery & Spares</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">
                    City / Market
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Lahore / Sahiwal"
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    className="w-full h-9 rounded-xl border border-slate-300 px-3 text-xs outline-none"
                  />
                </div>
              </div>

              {/* Street Address */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  Factory / Office Address
                </label>
                <input
                  type="text"
                  placeholder="Plot #, Industrial Estate"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full h-9 rounded-xl border border-slate-300 px-3 text-xs outline-none"
                />
              </div>

              {/* Opening Balance (New Only) */}
              {!selectedSupplier && (
                <div className="space-y-1 pt-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Opening Payable Balance (Rs)
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={formData.openingBalance}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        openingBalance: Number(e.target.value),
                      })
                    }
                    className="w-full h-9 rounded-xl border border-slate-300 px-3 text-xs font-mono outline-none"
                  />
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="h-8 px-3 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-8 px-4 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold transition-colors shadow-xs"
                >
                  {selectedSupplier ? "Save Changes" : "Create Supplier"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: RECORD PAYMENT OUT (PAY SUPPLIER) */}
      {/* ========================================================= */}
      {isPayModalOpen && selectedSupplier && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-5 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CreditCard className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">
                    Record Supplier Payment Out
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    {selectedSupplier.firmName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsPayModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleRecordPaymentOut} className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Current Outstanding Payable:</span>
                  <span className="font-mono font-bold text-rose-600">
                    Rs {selectedSupplier.payableBalance.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  Amount Paid Out (Rs) *
                </label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full h-10 rounded-xl border border-slate-300 px-3 text-sm font-mono font-bold text-slate-900 bg-emerald-50/30 border-emerald-300 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Payment Mode
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full h-9 rounded-xl border border-slate-300 px-3 text-xs bg-white"
                  >
                    <option value="BANK_TRANSFER">Bank Transfer</option>
                    <option value="CASH">Cash Voucher</option>
                    <option value="CHEQUE">Bank Cheque</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Ref / Cheque #
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. HBL-9812"
                    value={paymentRef}
                    onChange={(e) => setPaymentRef(e.target.value)}
                    className="w-full h-9 rounded-xl border border-slate-300 px-3 text-xs outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPayModalOpen(false)}
                  className="h-8 px-3 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-8 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors shadow-xs"
                >
                  Save Payment & Reduce Payable
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}