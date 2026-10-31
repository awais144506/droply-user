/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState } from "react";
import DataTable from "@/lib/utils/components/TableCreateMachine";
import { DataTableFilterBar } from "@/components/ui/data-table-filter-bar";
import { usePagination } from "@/lib/utils/functions/pagination-calculation";
import TablePagination from "@/lib/utils/components/TablePagination";
import ConfirmActionDialog from "@/lib/utils/components/ConfirmDialog";

import { getOrderColumns } from "./orderColumns";
import { CustomerOrderRequest } from "../types/requests";
import { useApproveCustomerRequest, useRejectCustomerRequest } from "../api/use-customerRequests";

type Props = {
    requests: CustomerOrderRequest[] | undefined;
};

const OrderTable = ({ requests = [] }: Props) => {
    // 1. Mutations (Toasts are handled inside the hooks)
    const { mutate: approveOrder, isPending: isApproving } = useApproveCustomerRequest();
    const { mutate: rejectOrder, isPending: isRejecting } = useRejectCustomerRequest();

    // 2. Dialog States
    const [selectedToApprove, setSelectedToApprove] = useState<CustomerOrderRequest | null>(null);
    const [selectedToReject, setSelectedToReject] = useState<CustomerOrderRequest | null>(null);

    // 3. Pagination Hook
    const { currentPage, setCurrentPage, paginatedData, totalPages, totalItems, itemsPerPage } = usePagination(requests);

    // 4. Action Handlers
    const handleConfirmApprove = () => {
        if (!selectedToApprove) return;
        approveOrder(selectedToApprove.id, {
            onSuccess: () => setSelectedToApprove(null),
        });
    };

    const handleConfirmReject = () => {
        if (!selectedToReject) return;
        rejectOrder(selectedToReject.id, {
            onSuccess: () => setSelectedToReject(null),
        });
    };

    // 5. Build Columns
    const columns = useMemo(
        () =>
            getOrderColumns({
                onApprove: (req) => setSelectedToApprove(req),
                onReject: (req) => setSelectedToReject(req),
            }),
        []
    );

    return (
        <div className="space-y-4">
            {/* Search, Status Tabs & Date Filter Bar */}
            <DataTableFilterBar
                searchParamName="search"
                searchPlaceholder="Search by Request ID, Customer Name, Phone..."
                tabParamName="status"
                tabs={[
                    { label: "All Requests", value: "ALL" },
                    { label: "Pending", value: "PENDING" },
                    { label: "Accepted", value: "ACCEPTED" },
                    { label: "Cancelled", value: "CANCELLED" },
                ]}
                showDateFilter={true}
                dateParamName="date"
                datePlaceholder="Schedule Date"
            />

            {/* Main Data Table */}
            <div className="rounded-2xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
                <DataTable
                    columns={columns as any}
                    data={paginatedData}
                    emptyMessage="No customer order requests found matching your filters."
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

            {/* Confirmation Dialog: Approve */}
            <ConfirmActionDialog
                isOpen={Boolean(selectedToApprove)}
                onClose={() => setSelectedToApprove(null)}
                onConfirm={handleConfirmApprove}
                isLoading={isApproving}
                title="Approve Order Request"
                description={
                    <span>
                        Are you sure you want to approve request{" "}
                        <span className="font-bold text-slate-900">
                            {selectedToApprove?.orderId}
                        </span>{" "}
                        for <span className="font-bold text-slate-900">{selectedToApprove?.customer?.name}</span>? 
                        This will move the order into your active delivery queue.
                    </span>
                }
                confirmText="Approve Order"
                confirmButtonClass="bg-emerald-600 hover:bg-emerald-700 text-white"
            />

            {/* Confirmation Dialog: Reject */}
            <ConfirmActionDialog
                isOpen={Boolean(selectedToReject)}
                onClose={() => setSelectedToReject(null)}
                onConfirm={handleConfirmReject}
                isLoading={isRejecting}
                title="Reject Order Request"
                description={
                    <span>
                        Are you sure you want to reject request{" "}
                        <span className="font-bold text-slate-900">
                            {selectedToReject?.orderId}
                        </span>? The customer will see this as cancelled.
                    </span>
                }
                confirmText="Reject Order"
                confirmButtonClass="bg-rose-600 hover:bg-rose-700 text-white"
            />
        </div>
    );
};

export default OrderTable;