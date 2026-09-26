"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, X } from "lucide-react";
import DataTable from "@/lib/utils/components/TableCreateMachine";
import { usePagination } from "@/lib/utils/functions/pagination-calculation";
import TablePagination from "@/lib/utils/components/TablePagination";
import ConfirmDeleteDialog from "@/lib/utils/components/ConfirmDeleteItemDialog";
import { VehicleExpense } from "../../types/fleet";
import { getVehicleExpenseColumns } from "./fuel-columns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useDeleteExpenseRecord } from "../../api/use-create-fleet";

interface VehicleExpenseTableProps {
    expenses: VehicleExpense[];
    vehicleId: string;
    branchId: string;
}

const VehicleExpenseTable = ({ expenses = [], vehicleId, branchId }: VehicleExpenseTableProps) => {
    const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    const [deleteRecord, setDeleteRecord] = useState<VehicleExpense | null>(null);
    const { mutate: deleteExpense, isPending } = useDeleteExpenseRecord(vehicleId, branchId);

    // 1. Apply Date Filter before Pagination
    const filteredExpenses = useMemo(() => {
        if (!dateFilter) return expenses;
        const filterDateString = format(dateFilter, "yyyy-MM-dd");
        return expenses.filter(exp => format(new Date(exp.createdAt), "yyyy-MM-dd") === filterDateString);
    }, [expenses, dateFilter]);

    // 2. Paginate the filtered data
    const {
        currentPage,
        setCurrentPage,
        paginatedData,
        totalPages,
        totalItems,
        itemsPerPage
    } = usePagination(filteredExpenses);

    // 3. Handlers
    const handlers = useMemo(() => ({
        onDelete: (record: VehicleExpense) => setDeleteRecord(record)
    }), []);

    const columns = useMemo(() => getVehicleExpenseColumns(handlers), [handlers]);

    const confirmDelete = () => {
        if (!deleteRecord) return;
        deleteExpense(deleteRecord.id, {
            onSuccess: () => {
                setDeleteRecord(null);
            }
        });
    };

    return (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                    Expense History
                    <span className="bg-sky-50 text-sky-700 px-2 py-0.5 rounded text-[10px]">
                        {totalItems} Records
                    </span>
                </h3>

                {/* Shadcn Date Filter */}
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
                                    setCurrentPage(1);
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
                                setCurrentPage(1);
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
                    : "No expenses recorded for this vehicle yet."
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

            <ConfirmDeleteDialog
                isOpen={!!deleteRecord}
                onClose={() => setDeleteRecord(null)}
                onConfirm={confirmDelete}
                title="Delete Expense Record?"
                description={`Are you sure you want to delete this ${deleteRecord?.category.toLowerCase()} record? This action cannot be undone.`}
                isLoading={isPending}
            />
        </div>
    );
};

export default VehicleExpenseTable;