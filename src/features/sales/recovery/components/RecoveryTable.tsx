/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import DataTable from "@/lib/utils/components/TableCreateMachine";
import { DataTableFilterBar } from "@/components/ui/data-table-filter-bar";
import { usePagination } from "@/lib/utils/functions/pagination-calculation";
import TablePagination from "@/lib/utils/components/TablePagination";
import ConfirmActionDialog from "@/lib/utils/components/ConfirmDialog";
import { CustomerRecoveryRecord, SaleReturnRecord } from "../types/recovery.types";
import { getRecoveryColumns,RecoveryTableRecord } from "./RecoveryColumns";
import { useMutateRecovery } from "../api/use-mutate-recovery";

type Props = {
    recoveries: CustomerRecoveryRecord[];
    saleReturns: SaleReturnRecord[];
    branchId: string;
};

const RecoveryTable = ({ recoveries = [], saleReturns = [], branchId }: Props) => {
    const searchParams = useSearchParams();
    const typeFilter = searchParams.get("type") || "";

    const { deleteRecovery, deleteSaleReturn } = useMutateRecovery();

    const [recoveryToDelete, setRecoveryToDelete] = useState<CustomerRecoveryRecord | null>(null);
    const [saleReturnToDelete, setSaleReturnToDelete] = useState<SaleReturnRecord | null>(null);

    // 1. Merge and sort both lists by date descending
    const unifiedData: RecoveryTableRecord[] = useMemo(() => {
        const mappedRecoveries: RecoveryTableRecord[] = recoveries.map((r) => ({
            ...r,
            recordType: "RECOVERY" as const,
        }));

        const mappedSaleReturns: RecoveryTableRecord[] = saleReturns.map((s) => ({
            ...s,
            recordType: "SALE_RETURN" as const,
        }));

        const combined = [...mappedRecoveries, ...mappedSaleReturns];

        // Filter by tab type if active ("RECOVERY" or "SALE_RETURN")
        const filtered = typeFilter
            ? combined.filter((item) => item.recordType === typeFilter)
            : combined;

        // Sort by newest created date first
        return filtered.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }, [recoveries, saleReturns, typeFilter]);

    const { currentPage, setCurrentPage, paginatedData, totalPages, totalItems, itemsPerPage } =
        usePagination(unifiedData);

    // 2. Handlers
    const handleConfirmDeleteRecovery = () => {
        if (!recoveryToDelete) return;
        deleteRecovery.mutate(recoveryToDelete.id, {
            onSuccess: () => setRecoveryToDelete(null),
        });
    };

    const handleConfirmDeleteSaleReturn = () => {
        if (!saleReturnToDelete) return;
        deleteSaleReturn.mutate(saleReturnToDelete.id, {
            onSuccess: () => setSaleReturnToDelete(null),
        });
    };

    // 3. Columns
    const columns = useMemo(
        () =>
            getRecoveryColumns({
                onDeleteRecovery: (rec) => setRecoveryToDelete(rec),
                onDeleteSaleReturn: (sr) => setSaleReturnToDelete(sr),
            }),
        []
    );

    return (
        <div className="space-y-4">
            {/* Filter & Tab Bar */}
            <DataTableFilterBar
                searchParamName="search"
                searchPlaceholder="Search by code, customer name or phone..."
                tabParamName="type"
                tabs={[
                    { label: "All Records", value: "" },
                    { label: "Customer Recoveries", value: "RECOVERY" },
                    { label: "Sale Returns", value: "SALE_RETURN" },
                ]}
            />

            {/* Table Card */}
            <div className="rounded-2xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
                <DataTable
                    columns={columns as any}
                    data={paginatedData}
                    emptyMessage="No customer recoveries or sale returns found matching your filters."
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

            {/* Delete Recovery Dialog */}
            <ConfirmActionDialog
                isOpen={Boolean(recoveryToDelete)}
                onClose={() => setRecoveryToDelete(null)}
                onConfirm={handleConfirmDeleteRecovery}
                isLoading={deleteRecovery.isPending}
                title="Delete Customer Recovery"
                description={
                    <span>
                        Are you sure you want to delete recovery record{" "}
                        <span className="font-bold text-slate-900">
                            #{recoveryToDelete?.recoveryCode}
                        </span>{" "}
                        for <span className="font-bold text-slate-900">{recoveryToDelete?.customer?.name}</span>? This will reverse all Khata and asset changes.
                    </span>
                }
                confirmText="Delete Recovery"
                confirmButtonClass="bg-rose-600 hover:bg-rose-700 text-white"
            />

            {/* Delete Sale Return Dialog */}
            <ConfirmActionDialog
                isOpen={Boolean(saleReturnToDelete)}
                onClose={() => setSaleReturnToDelete(null)}
                onConfirm={handleConfirmDeleteSaleReturn}
                isLoading={deleteSaleReturn.isPending}
                title="Delete Sale Return"
                description={
                    <span>
                        Are you sure you want to delete sale return{" "}
                        <span className="font-bold text-slate-900">
                            #{saleReturnToDelete?.returnCode}
                        </span>{" "}
                        for <span className="font-bold text-slate-900">{saleReturnToDelete?.customer?.name}</span>? This will reverse stock and ledger updates.
                    </span>
                }
                confirmText="Delete Sale Return"
                confirmButtonClass="bg-rose-600 hover:bg-rose-700 text-white"
            />
        </div>
    );
};

export default RecoveryTable;