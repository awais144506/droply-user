"use client";

import { useMemo, useCallback } from "react";
import { usePagination } from "@/lib/utils/functions/pagination-calculation";
import DataTable from "@/lib/utils/components/TableCreateMachine";
import TablePagination from "@/lib/utils/components/TablePagination";
import { SubscriptionPayment } from "../../types/subscription";
import { getBillingColumns } from "./billing-columns";
import { useDeletePayment } from "../../api/use-mutate-subscription";
import Loading from "@/app/loading";

type Props = {
    ledger: SubscriptionPayment[];
};

export default function BillingTable({ ledger }: Props) {
    const { mutate: deletePayment, isPending } = useDeletePayment();
    // 1. Initialize your custom pagination hook
    const {
        currentPage, setCurrentPage, paginatedData, totalPages, totalItems, itemsPerPage
    } = usePagination(ledger);

    // Handle Delete Logic (Can wire to React Query here later)
    const handleDeletePayment = useCallback((paymentId: string) => {
        deletePayment(paymentId);
    }, [deletePayment]);
    // Pass the handler into the column generator
    const columns = useMemo(() => getBillingColumns(handleDeletePayment), [handleDeletePayment]);
    if (isPending) return <Loading text="Loading data..." />
    return (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">

            {/* Table Header Section */}
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                    <h3 className="text-lg font-bold text-slate-900">Billing Ledger & Verification Log</h3>
                    <p className="text-sm text-slate-500 mt-1">Track your submitted transfer slips and payment history.</p>
                </div>
            </div>

            {/* Custom Data Table Wrapper */}
            <div className="w-full">
                <DataTable
                    columns={columns}
                    data={paginatedData}
                />
            </div>

            {/* Empty State Fallback (If your DataTable doesn't handle empty arrays natively) */}
            {ledger.length === 0 && (
                <div className="p-12 text-center flex flex-col items-center justify-center">
                    <p className="text-sm font-medium text-slate-500">No payment history found.</p>
                </div>
            )}

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
}