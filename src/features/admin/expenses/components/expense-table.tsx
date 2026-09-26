/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";
import DataTable from "@/lib/utils/components/TableCreateMachine";
import TablePagination from "@/lib/utils/components/TablePagination";
import { usePagination } from "@/lib/utils/functions/pagination-calculation";
import ConfirmActionDialog from "@/lib/utils/components/ConfirmDeleteItemDialog";
import { Expense } from "../types/expenses";
import { getExpenseColumns } from "./expenses-columns";
import { useRole } from "@/lib/hooks/use-role";
import { useDeleteExpense } from "../api/use-mutate-expenses";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface ExpenseTableProps {
  expenses?: Expense[];
}

type DialogState = {
  isOpen: boolean;
  expense: Expense | null;
};

export function ExpenseTable({ expenses = [] }: ExpenseTableProps) {
  const { isOwner } = useRole();
  const { mutate: deleteExpense, isPending: isDeleting } = useDeleteExpense();
  
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [dialog, setDialog] = useState<DialogState>({ isOpen: false, expense: null });

  // 1. Apply Date Filter before Pagination
  const filteredExpenses = useMemo(() => {
    if (!dateFilter) return expenses;
    const filterDateString = format(dateFilter, "yyyy-MM-dd");
    
    return expenses.filter(exp => {
      const expDate = (exp as any).createdAt || new Date(); 
      return format(new Date(expDate), "yyyy-MM-dd") === filterDateString;
    });
  }, [expenses, dateFilter]);

  // 2. Paginate the filtered data (not the raw expenses array)
  const {
    currentPage,
    setCurrentPage,
    paginatedData,
    totalPages,
    totalItems,
    itemsPerPage
  } = usePagination(filteredExpenses);

  const handlers = useMemo(() => ({
    onDelete: (expense: Expense) => {
      setDialog({ isOpen: true, expense });
    }
  }), []);

  const columns = useMemo(() => getExpenseColumns(handlers, isOwner), [handlers, isOwner]);

  const executeDelete = () => {
    if (!dialog.expense) return;

    deleteExpense(dialog.expense.id, {
      onSuccess: () => setDialog({ isOpen: false, expense: null })
    });
  };

  return (
    <>
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        
        {/* Table Header & Filter Bar */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
             Expense Logs
             <span className="bg-sky-50 text-sky-700 px-2 py-0.5 rounded text-[10px]">
                 {totalItems} Records
             </span>
          </h3>

          <div className="flex items-center gap-2">
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-60 justify-start text-left font-normal bg-white",
                    !dateFilter && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateFilter ? format(dateFilter, "PPP") : <span>Filter by date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={dateFilter}
                  onSelect={(date) => {
                    setDateFilter(date);
                    setIsCalendarOpen(false);
                    setCurrentPage(1); // Reset to first page when filtering
                  }}
                />
              </PopoverContent>
            </Popover>

            {dateFilter && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setDateFilter(undefined);
                  setCurrentPage(1); // Reset to first page when clearing filter
                }}
                className="h-9 w-9 text-slate-400 hover:text-slate-700 shrink-0"
                title="Clear date filter"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <DataTable
          data={paginatedData}
          columns={columns}
          emptyMessage={dateFilter 
            ? `No expenses recorded on ${format(dateFilter, "MMM d, yyyy")}.` 
            : "No petty expenses logged yet."
          }
        />

        {(totalItems || 0) > 0 && (
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      <ConfirmActionDialog
        isOpen={dialog.isOpen}
        onClose={() => setDialog({ isOpen: false, expense: null })}
        onConfirm={executeDelete}
        isLoading={isDeleting}
        title="Delete Expense Log"
        description={
          <span>
            Are you sure you want to delete this log for <span className="font-bold text-slate-900">{dialog.expense?.description}</span>?
            This action will permanently remove it from the ledger.
          </span>
        }
        confirmText="Delete Log"
        confirmButtonClass="bg-rose-600 hover:bg-rose-700 text-white"
      />
    </>
  );
}