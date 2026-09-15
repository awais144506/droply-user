"use client";

import { useState, useEffect } from "react";
import { Search, MapPin, Phone, Pencil } from "lucide-react";
import { Supplier } from "../api/use-suppliers";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export function SupplierTable({ suppliers, onEdit }: { suppliers: Supplier[], onEdit: (s: Supplier) => void }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PAYABLE" | "CLEARED">("ALL");
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Reset pagination to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  // 1. Filter Data
  const filteredSuppliers = suppliers.filter((s) => {
    const matchesSearch = s.firmName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.contactPerson.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (statusFilter === "PAYABLE") return matchesSearch && s.payableBalance > 0;
    if (statusFilter === "CLEARED") return matchesSearch && s.payableBalance === 0;
    return matchesSearch;
  });

  // 2. Paginate Data
  const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSuppliers = filteredSuppliers.slice(startIndex, startIndex + itemsPerPage);

  const formatCurrency = (val: number) => `Rs ${val.toLocaleString("en-PK")}`;
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—";
    return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
      
      {/* Search & Filters */}
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by supplier name or contact..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:bg-white"
          />
        </div>

        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 cursor-pointer"
        >
          <option value="ALL">All Account Statuses</option>
          <option value="PAYABLE">Accounts Payable</option>
          <option value="CLEARED">Cleared Accounts</option>
        </select>
      </div>

      {/* Table Data */}
      <div className="overflow-x-auto min-h-[400px]">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50/50 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 whitespace-nowrap">Supplier / Firm Name</th>
              <th className="px-6 py-4 whitespace-nowrap">Product Name</th>
              <th className="px-6 py-4 whitespace-nowrap">Phone / City</th>
              <th className="px-6 py-4 whitespace-nowrap">Payable Balance</th>
              <th className="px-6 py-4 whitespace-nowrap">Total Purchases</th>
              <th className="px-6 py-4 whitespace-nowrap">Last Purchase</th>
              <th className="px-6 py-4 whitespace-nowrap text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedSuppliers.length > 0 ? (
              paginatedSuppliers.map((supplier) => (
                <tr key={supplier.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-900">{supplier.firmName}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Attn: {supplier.contactPerson}</p>
                  </td>
                  
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200">
                      {supplier.mainProductName}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-slate-900 font-medium">
                      <Phone className="h-3 w-3 text-slate-400" /> {supplier.phone}
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-1">
                      <MapPin className="h-3 w-3" /> {supplier.city}
                    </div>
                  </td>

                  <td className="px-6 py-4 font-bold">
                    {supplier.payableBalance > 0 ? (
                      <span className="text-rose-600">{formatCurrency(supplier.payableBalance)}</span>
                    ) : (
                      <span className="text-emerald-600">Rs 0 <span className="font-medium text-[10px]">(Settled)</span></span>
                    )}
                  </td>

                  <td className="px-6 py-4 font-medium text-slate-500">
                    {formatCurrency(supplier.totalPurchases)}
                  </td>

                  <td className="px-6 py-4 text-slate-500 text-xs">
                    {formatDate(supplier.lastPurchaseDate)}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <Button 
                      variant="ghost" 
                      size="icon-sm" 
                      onClick={() => onEdit(supplier)}
                      className="text-slate-400 hover:text-sky-600 h-8 w-8 rounded-lg"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-slate-500 text-sm">
                  No suppliers match your current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- Shadcn Pagination Footer --- */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50 gap-4">
          <p className="text-xs font-medium text-slate-500">
            Showing <span className="font-bold text-slate-900">{startIndex + 1}</span> to <span className="font-bold text-slate-900">{Math.min(startIndex + itemsPerPage, filteredSuppliers.length)}</span> of <span className="font-bold text-slate-900">{filteredSuppliers.length}</span> suppliers
          </p>
          
          <Pagination className="justify-end">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(p => Math.max(1, p - 1));
                  }} 
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNumber = i + 1;
                // Simple logic to show only relevant pages if you have many pages
                if (pageNumber === 1 || pageNumber === totalPages || (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)) {
                  return (
                    <PaginationItem key={i}>
                      <PaginationLink 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(pageNumber);
                        }}
                        isActive={currentPage === pageNumber}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
                
                // Show ellipsis if there are skipped numbers
                if (pageNumber === 2 || pageNumber === totalPages - 1) {
                  return (
                    <PaginationItem key={i}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }
                
                return null;
              })}

              <PaginationItem>
                <PaginationNext 
                  href="#" 
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage(p => Math.min(totalPages, p + 1));
                  }} 
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}