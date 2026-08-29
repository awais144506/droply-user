"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Search,
  Plus,
  Phone,
  MapPin,
  RotateCcw,
  Wallet,
  Users,
  Bike,
  Pencil,
  Trash2,
  AlertTriangle,
  ExternalLink,
  ChevronDown,
  UserCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
// --- DUMMY DATA CONTRACTS ---
interface CustomerRow {
  id: string;
  name: string;
  phone: string;
  address: string;
  ledgerBalance: number; // Udhaar / Outstanding (PKR)
  returnablesHeld: number; // 19L bottles or cylinders currently with customer
  securityHeld: number;
  status: "ACTIVE" | "INACTIVE" | "BLOCKED";
  lastDelivery: string;
}

interface ZoneDetail {
  id: string;
  name: string;
  description: string;
  riders: {
    id: string;
    name: string;
    phone: string;
    isActive: boolean;
  }[];
  customers: CustomerRow[];
}

const MOCK_ZONE_DETAIL: ZoneDetail = {
  id: "z-1",
  name: "Airline Housing Society",
  description: "Primary distribution route covering Blocks A through E and Main Boulevard Commercial area.",
  riders: [
    {
      id: "r1",
      name: "Majid Ali",
      phone: "+92 300 1234567",
      isActive: true,
    },
    {
      id: "r2",
      name: "Usman Tariq",
      phone: "+92 301 9876543",
      isActive: true,
    },
  ],
  customers: [
    {
      id: "c-101",
      name: "Tariq Mahmood",
      phone: "+92 321 4455667",
      address: "House 42, Block B, Street 4",
      ledgerBalance: 2400,
      returnablesHeld: 4,
      securityHeld: 4000,
      status: "ACTIVE",
      lastDelivery: "Today, 10:30 AM",
    },
    {
      id: "c-102",
      name: "Al-Madina Bakers & Sweets",
      phone: "+92 300 7788990",
      address: "Shop 12-14, Commercial Market",
      ledgerBalance: 0,
      returnablesHeld: 12,
      securityHeld: 12000,
      status: "ACTIVE",
      lastDelivery: "Yesterday",
    },
    {
      id: "c-103",
      name: "Dr. Shahida Parveen",
      phone: "+92 333 1122334",
      address: "House 18, Block A, Main Blvd",
      ledgerBalance: 850,
      returnablesHeld: 2,
      securityHeld: 2000,
      status: "ACTIVE",
      lastDelivery: "2 days ago",
    },
    {
      id: "c-104",
      name: "Muhammad Bilal",
      phone: "+92 304 9988776",
      address: "House 112, Block C, Street 9",
      ledgerBalance: 3200,
      returnablesHeld: 6,
      securityHeld: 3000,
      status: "ACTIVE",
      lastDelivery: "Aug 24, 2026",
    },
    {
      id: "c-105",
      name: "Farhan Zafar",
      phone: "+92 312 3344556",
      address: "House 5, Block E, Near Water Tank",
      ledgerBalance: 0,
      returnablesHeld: 0,
      securityHeld: 1000,
      status: "INACTIVE",
      lastDelivery: "Aug 10, 2026",
    },
  ],
};

export default function ZoneDetailPage() {
  const params = useParams();
  const zoneId = params?.zoneId as string;

  const [zone] = useState<ZoneDetail>(MOCK_ZONE_DETAIL);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "WITH_DEBT" | "WITH_BOTTLES">("ALL");

  // Zone Aggregate Calculations
  const totalCustomers = zone.customers.length;
  const totalOutstanding = zone.customers.reduce((sum, c) => sum + c.ledgerBalance, 0);
  const totalReturnables = zone.customers.reduce((sum, c) => sum + c.returnablesHeld, 0);
  const totalSecurity = zone.customers.reduce((sum, c) => sum + c.securityHeld, 0);

  // Filter & Search Logic
  const filteredCustomers = zone.customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone.includes(searchQuery) ||
      customer.address.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterType === "WITH_DEBT") return customer.ledgerBalance > 0;
    if (filterType === "WITH_BOTTLES") return customer.returnablesHeld > 0;
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      {/* Top Navigation & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div className="flex items-center gap-3">
          <Link
            href="/manage/zones"
            className="h-9 w-9 rounded-xl border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors shadow-xs"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>

          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                {zone.name}
              </h1>
              <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                Active Zone
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={"editOutline"}
          >
            <Pencil />
            Edit
          </Button>

          <Button
            variant={"destructiveOutline"}
          >
            <Trash2 />
            Delete
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Total Customers
            </span>
            <div className="h-7 w-7 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">{totalCustomers}</p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Outstanding (KHATA)
            </span>
            <div className="h-7 w-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <Wallet className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-amber-600">
            Rs {totalOutstanding.toLocaleString()}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Returnable Items 
            </span>
            <div className="h-7 w-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <RotateCcw className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900">
            {totalReturnables}{" "}
            <span className="text-xs font-normal text-slate-400">items</span>
          </p>
        </div>

      </div>

      {/* Assigned Riders Section */}
      <div className="bg-slate-50/80 rounded-2xl border border-slate-200/80 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Bike className="h-4 w-4 text-sky-600" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Assigned Riders ({zone.riders.length})
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {zone.riders.map((rider) => (
            <div
              key={rider.id}
              className="bg-white p-3 rounded-xl border border-slate-200/90 flex items-center justify-between shadow-2xs"
            >
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-sky-100/70 text-sky-700 font-bold text-xs flex items-center justify-center">
                  {rider.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">{rider.name}</p>
                  <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <Phone className="h-2.5 w-2.5" />
                    {rider.phone}
                  </p>
                </div>
              </div>
              <span className="h-2 w-2 rounded-full bg-emerald-500" title="Active on duty" />
            </div>
          ))}
        </div>
      </div>

      {/* Customer Directory Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {/* Table Filters & Search */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search customer, phone, or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-8 pr-3 rounded-xl border border-slate-200 bg-slate-50/50 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-1.5 self-start md:self-auto">
            <button
              onClick={() => setFilterType("ALL")}
              className={`h-8 px-3 rounded-lg text-xs font-medium transition-colors ${filterType === "ALL"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
            >
              All ({zone.customers.length})
            </button>
            <button
              onClick={() => setFilterType("WITH_DEBT")}
              className={`h-8 px-3 rounded-lg text-xs font-medium transition-colors ${filterType === "WITH_DEBT"
                ? "bg-amber-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
            >
              Has Outstanding
            </button>
            <button
              onClick={() => setFilterType("WITH_BOTTLES")}
              className={`h-8 px-3 rounded-lg text-xs font-medium transition-colors ${filterType === "WITH_BOTTLES"
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
            >
              Holds Items
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                <th className="py-3 px-4">Customer & Address</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4 text-right">Outstanding (Khata)</th>
                <th className="py-3 px-4 text-center">Items Held</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{c.name}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="h-2.5 w-2.5 shrink-0" />
                        <span className="truncate max-w-xs">{c.address}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-600">
                      {c.phone}
                    </td>

                    <td className="py-3 px-4 text-right font-medium">
                      {c.ledgerBalance > 0 ? (
                        <span className="text-amber-600 font-bold font-mono">
                          Rs {c.ledgerBalance.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-emerald-600 font-semibold font-mono">
                          Cleared
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md font-bold font-mono text-xs ${c.returnablesHeld > 0
                        ? "bg-indigo-50 text-indigo-700 border border-indigo-200/60"
                        : "text-slate-400 bg-slate-50"
                        }`}>
                        {c.returnablesHeld}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No customers match your filter or search query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}