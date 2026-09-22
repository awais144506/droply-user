"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import DataTable from "@/lib/utils/components/TableCreateMachine";
import TablePagination from "@/lib/utils/components/TablePagination";
import { usePagination } from "@/lib/utils/functions/pagination-calculation";

import { PurchaseReturn } from "../../types/returns";
import { getReturnColumns } from "./return-columns";
import { useDeleteReturn } from "../../api/use-mutate-returns"; // For the Undo action

interface ReturnTableProps {
    returns?: PurchaseReturn[];
}

export const ReturnTable = ({ returns = [] }: ReturnTableProps) => {
    const router = useRouter();
    const { mutate: deleteReturn } = useDeleteReturn();

    const {
        currentPage,
        setCurrentPage,
        paginatedData,
        totalPages,
        totalItems,
        itemsPerPage
    } = usePagination(returns);

    const handlers = useMemo(() => ({
        onResolve: (returnRecord: PurchaseReturn) => {
            // We will route this to the resolution modal/page in the next step
            toast.info(`Opening resolution logic for ${returnRecord.debitNoteNumber}`);
            // e.g., router.push(`/supply/returns/${returnRecord.id}/resolve`);
        },
        onUndo: (returnRecord: PurchaseReturn) => {
            if (confirm(`Are you sure you want to undo ${returnRecord.debitNoteNumber}? This will revert any financial credits and stock adjustments.`)) {
                deleteReturn(returnRecord.id);
            }
        },
    }), [deleteReturn]);

    const columns = useMemo(() => getReturnColumns(router, handlers), [router, handlers]);

    return (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            {/* Header/Search bar placeholder based on design */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <input 
                    type="text" 
                    placeholder="Search by debit note # or supplier..."
                    className="w-full max-w-md px-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
                />
                
                {/* Minimal tab filters from the design */}
                <div className="hidden sm:flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                    <button className="px-3 py-1.5 text-xs font-bold bg-white text-slate-800 rounded shadow-sm">All</button>
                    <button className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700">Pending</button>
                    <button className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-700">Replaced</button>
                </div>
            </div>

            <DataTable
                data={paginatedData}
                columns={columns}
                emptyMessage="No purchase returns match your current filters."
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
    );
};