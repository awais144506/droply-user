/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { Search, Pencil, Trash2, Zap, Wrench, Paperclip, Coffee, Truck, HelpCircle, Landmark, Wallet, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { Expense, ExpenseCategory } from "../api/use-expenses";
import { Button } from "@/components/ui/button";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type FilterType = "ALL" | ExpenseCategory;

export function ExpenseTable({ expenses, onEdit }: { expenses: Expense[], onEdit: (e: Expense) => void }) {
  const [localExpenses, setLocalExpenses] = useState<Expense[]>([]);
  useEffect(() => { setLocalExpenses(expenses); }, [expenses]);

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<FilterType>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

  useEffect(() => { setCurrentPage(1); }, [searchQuery, categoryFilter]);

  const filteredExpenses = localExpenses.filter((e) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = e.description.toLowerCase().includes(searchLower) || e.loggedBy.toLowerCase().includes(searchLower);
    if (categoryFilter !== "ALL") return matchesSearch && e.category === categoryFilter;
    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedExpenses = filteredExpenses.slice(startIndex, startIndex + itemsPerPage);

  const formatCurrency = (val: number) => `Rs ${val.toLocaleString("en-PK")}`;
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const getCategoryMeta = (cat: string) => {
    switch (cat) {
      case "UTILITIES": return { icon: <Zap className="h-3 w-3" />, label: "Utilities", color: "text-amber-600 bg-amber-50 border-amber-100" };
      case "MAINTENANCE": return { icon: <Wrench className="h-3 w-3" />, label: "Maintenance", color: "text-slate-600 bg-slate-100 border-slate-200" };
      case "OFFICE_SUPPLIES": return { icon: <Paperclip className="h-3 w-3" />, label: "Office Supplies", color: "text-sky-600 bg-sky-50 border-sky-100" };
      case "REFRESHMENTS": return { icon: <Coffee className="h-3 w-3" />, label: "Refreshments", color: "text-orange-600 bg-orange-50 border-orange-100" };
      case "LOGISTICS": return { icon: <Truck className="h-3 w-3" />, label: "Logistics & Tolls", color: "text-emerald-600 bg-emerald-50 border-emerald-100" };
      default: return { icon: <HelpCircle className="h-3 w-3" />, label: "Other", color: "text-slate-500 bg-slate-50 border-slate-200" };
    }
  };

  const getPaymentIcon = (method: string) => {
    if (method === "BANK_TRANSFER") return <Landmark className="h-3.5 w-3.5 text-sky-600" />;
    if (method === "MOBILE_WALLET") return <Smartphone className="h-3.5 w-3.5 text-emerald-600" />;
    return <Wallet className="h-3.5 w-3.5 text-amber-600" />;
  };

  const confirmDelete = () => {
    if (!selectedExpense) return;
    setLocalExpenses(prev => prev.filter(e => e.id !== selectedExpense.id));
    toast.success("Expense record deleted.");
    setDeleteModalOpen(false);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
      <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search descriptions or logger..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
          />
        </div>

        <select 
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as FilterType)}
          className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-500/20 cursor-pointer"
        >
          <option value="ALL">All Categories</option>
          <option value="UTILITIES">Utilities</option>
          <option value="MAINTENANCE">Maintenance</option>
          <option value="OFFICE_SUPPLIES">Office Supplies</option>
          <option value="REFRESHMENTS">Refreshments</option>
          <option value="LOGISTICS">Logistics & Tolls</option>
        </select>
      </div>

      <div className="overflow-x-auto min-h-[300px]">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50/50 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 whitespace-nowrap">Date</th>
              <th className="px-6 py-4 whitespace-nowrap">Category</th>
              <th className="px-6 py-4 whitespace-nowrap">Description</th>
              <th className="px-6 py-4 whitespace-nowrap">Payment / Logger</th>
              <th className="px-6 py-4 whitespace-nowrap">Amount</th>
              <th className="px-6 py-4 whitespace-nowrap text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedExpenses.length > 0 ? (
              paginatedExpenses.map((exp) => {
                const meta = getCategoryMeta(exp.category);
                return (
                  <tr key={exp.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {formatDate(exp.date)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${meta.color}`}>
                        {meta.icon} {meta.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate" title={exp.description}>
                      {exp.description}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        {getPaymentIcon(exp.paymentMethod)}
                        <span className="font-bold text-slate-700 text-xs">
                          {exp.paymentMethod.replace("_", " ")}
                        </span>
                      </div>
                      <p className="text-[10px] font-medium text-slate-400">By: {exp.loggedBy}</p>
                    </td>
                    <td className="px-6 py-4 font-bold text-rose-600">
                      {formatCurrency(exp.amount)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="sm" onClick={() => onEdit(exp)} className="text-slate-400 hover:text-sky-600 h-8 w-8 rounded-lg cursor-pointer">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => { setSelectedExpense(exp); setDeleteModalOpen(true); }} className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 h-8 w-8 rounded-lg cursor-pointer">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-500 text-sm">No expenses match your filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <p className="text-xs font-medium text-slate-500 hidden sm:block">
            Showing <span className="font-bold text-slate-900">{startIndex + 1}</span> to <span className="font-bold text-slate-900">{Math.min(startIndex + itemsPerPage, filteredExpenses.length)}</span>
          </p>
          <div className="flex items-center gap-1.5 ml-auto">
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="h-8 rounded-lg text-xs bg-white cursor-pointer">Prev</Button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button key={i} onClick={() => setCurrentPage(i + 1)} className={`h-8 w-8 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center ${currentPage === i + 1 ? "bg-sky-600 text-white shadow-sm" : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"}`}>
                {i + 1}
              </button>
            ))}
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="h-8 rounded-lg text-xs bg-white cursor-pointer">Next</Button>
          </div>
        </div>
      )}

      <AlertDialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <AlertDialogContent className="rounded-3xl max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl text-rose-600">Delete Expense?</AlertDialogTitle>
            <AlertDialogDescription className="text-slate-600">
              Are you sure you want to delete this expense record? This will alter your monthly profit calculations.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel className="rounded-xl border-slate-200 cursor-pointer">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-md cursor-pointer">
              Yes, Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}