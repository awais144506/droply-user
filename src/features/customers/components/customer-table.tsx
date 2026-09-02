"use client";

import { useState } from "react";
import { Search, MapPin, MoreHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { CustomerItem } from "../api/use-customers";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface CustomersTableProps {
  customers: CustomerItem[];
  onEdit: (customer: CustomerItem) => void;
}

export function CustomersTable({ customers, onEdit }: CustomersTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDebt, setFilterDebt] = useState<"ALL" | "DEBT" | "CLEAR">("ALL");

  const formatCurrency = (amount: number | string) => {
    return Number(amount).toLocaleString("en-PK", { maximumFractionDigits: 0 });
  };

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.phone.includes(searchQuery) || 
      c.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    if (filterDebt === "DEBT") return Number(c.customerCredit) > 0;
    if (filterDebt === "CLEAR") return Number(c.customerCredit) <= 0;
    
    return true;
  });

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
      {/* Table Toolbar */}
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search customer by name, phone, or street..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-full border border-slate-200 bg-white text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
          />
        </div>

        <div className="flex items-center bg-slate-50 p-1 rounded-lg border border-slate-200">
          <button 
            onClick={() => setFilterDebt("ALL")}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${filterDebt === "ALL" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            All Khata
          </button>
          <button 
            onClick={() => setFilterDebt("DEBT")}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${filterDebt === "DEBT" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            Has Debt
          </button>
          <button 
            onClick={() => setFilterDebt("CLEAR")}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${filterDebt === "CLEAR" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
          >
            Clear
          </button>
        </div>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-white text-[10px] uppercase font-bold text-slate-400 tracking-wider border-b border-slate-100">
            <tr>
              <th className="px-4 py-4 w-12 text-center">S.No</th>
              <th className="px-4 py-4 whitespace-nowrap">Customer & Address</th>
              <th className="px-4 py-4 whitespace-nowrap">Sector / Zone</th>
              <th className="px-4 py-4 whitespace-nowrap">Contact</th>
              <th className="px-4 py-4 whitespace-nowrap">Khata Balance</th>
              <th className="px-4 py-4 text-center whitespace-nowrap">Assets Held</th>
              <th className="px-4 py-4 whitespace-nowrap">Security Deposit</th>
              <th className="px-4 py-4 w-12"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer, index) => {
                const debtAmount = Number(customer.customerCredit);
                const hasDebt = debtAmount > 0;

                return (
                  <tr key={customer.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-4 text-center font-mono text-xs text-slate-400">
                      {index + 1}
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-bold text-slate-900">{customer.name}</p>
                      <div className="flex items-start gap-1 mt-1">
                        <MapPin className="h-3 w-3 text-slate-400 shrink-0 mt-0.5" />
                        <span className="text-xs text-slate-500 max-w-[200px] truncate">{customer.address}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 text-[10px] font-bold border border-sky-100">
                        {customer.zone?.name || "Unassigned"}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-medium text-slate-600">
                      {customer.phone}
                    </td>
                    <td className="px-4 py-4 font-bold">
                      {hasDebt ? (
                        <span className="text-amber-600">Rs {formatCurrency(debtAmount)}</span>
                      ) : (
                        <span className="text-emerald-600">Rs 0 <span className="font-medium text-xs opacity-80">(Clear)</span></span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="inline-flex items-center justify-center h-6 min-w-[24px] px-2 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs">
                        {customer.openingReturnables}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-bold text-slate-700">
                      Rs {formatCurrency(customer.securityHeld)}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="h-8 w-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 outline-none">
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40 rounded-xl">
                          <DropdownMenuItem onClick={() => onEdit(customer)}>
                            Edit Customer
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-sky-600">
                            View Ledger
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-slate-500 text-sm">
                  No customers found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Placeholder */}
      <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-white mt-auto">
        <p className="text-xs text-slate-500 font-medium">
          Showing 1 to {filteredCustomers.length} of {customers.length} results
        </p>
        <div className="flex items-center gap-2">
          <button className="h-8 w-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-slate-600 disabled:opacity-50">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button className="h-8 px-3 rounded-lg bg-sky-50 text-sky-700 text-xs font-bold">1</button>
          <button className="h-8 px-3 rounded-lg text-slate-600 hover:bg-slate-50 text-xs font-bold">2</button>
          <button className="h-8 px-3 rounded-lg text-slate-600 hover:bg-slate-50 text-xs font-bold">3</button>
          <button className="h-8 w-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-slate-600 disabled:opacity-50">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}