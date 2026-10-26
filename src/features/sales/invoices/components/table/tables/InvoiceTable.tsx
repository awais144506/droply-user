/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useMemo, useCallback, useState } from "react";
import { toast } from "sonner";
import DataTable from "@/lib/utils/components/TableCreateMachine";
import { DataTableFilterBar } from "@/components/ui/data-table-filter-bar";
import { usePagination } from "@/lib/utils/functions/pagination-calculation";
import TablePagination from "@/lib/utils/components/TablePagination";
import { BillingDocument } from "../../../types/quotation";
import { getInvoiceColumns } from "../columns/invoice-table-columns";
import { useBranchSettings } from "@/features/admin/settings/api/use-branch-settings";
import { generateInvoicePdf } from "@/lib/utils/functions/generatePdfs/generate-invoice";
import { useDeleteQuotation, useUpdateInvoiceType } from "../../../api/use-mutate-quote";
import ConfirmActionDialog from "@/lib/utils/components/ConfirmDialog";

type Props = {
    docs: BillingDocument[] | undefined;
    branchId: string;
};

const InvoiceTable = ({ docs = [], branchId }: Props) => {
    // 1. Mutations & Confirmation Dialog States
    const { mutate: deleteQuotation, isPending: isDeleting } = useDeleteQuotation();
    const { mutate: updateInvoiceType, isPending: isUpdatingType } = useUpdateInvoiceType();

    const [selectedDocToDelete, setSelectedDocToDelete] = useState<BillingDocument | null>(null);
    const [selectedDocToToggle, setSelectedDocToToggle] = useState<BillingDocument | null>(null);

    const { fetchBranchSettings } = useBranchSettings(branchId);
    const branchSettings = fetchBranchSettings.data;

    const { currentPage, setCurrentPage, paginatedData, totalPages, totalItems, itemsPerPage } = usePagination(docs);

    // 2. Action Handlers & Triggers
    const handleToggleClick = (doc: BillingDocument) => {
        setSelectedDocToToggle(doc); // Opens confirmation dialog for type toggle
    };

    const handleConfirmToggleType = () => {
        if (!selectedDocToToggle) return;
        const nextType = selectedDocToToggle.type === "QUOTATION" ? "INVOICE" : "QUOTATION";

        updateInvoiceType(
            { id: selectedDocToToggle.id, type: nextType },
            {
                onSuccess: () => {
                    setSelectedDocToToggle(null);
                },
            }
        );
    };

    const handleDeleteClick = (doc: BillingDocument) => {
        if (doc.type === "INVOICE") {
            toast.error("Cannot delete a locked Tax Invoice. Revert to Quotation first.");
            return;
        }
        setSelectedDocToDelete(doc); // Opens confirmation dialog for deletion
    };

    const handleConfirmDelete = () => {
        if (!selectedDocToDelete) return;
        deleteQuotation(selectedDocToDelete.id, {
            onSuccess: () => {
                setSelectedDocToDelete(null);
            },
        });
    };

    const handleDownloadPdf = useCallback((doc: BillingDocument) => {
        generateInvoicePdf(doc, branchSettings);
    }, [branchSettings]);

    // 3. Build Columns
    const columns = useMemo(
        () =>
            getInvoiceColumns({
                onToggleType: handleToggleClick,
                onDelete: handleDeleteClick,
                onDownloadPdf: handleDownloadPdf,
            }),
        [handleDownloadPdf]
    );

    const isTargetingInvoice = selectedDocToToggle?.type === "QUOTATION";

    return (
        <div className="space-y-4">
            {/* Search & Type Filter Bar */}
            <DataTableFilterBar
                searchParamName="search"
                searchPlaceholder="Search by doc #, client name..."
                tabParamName="type"
                tabs={[
                    { label: "All", value: "" },
                    { label: "Quotations", value: "QUOTATION" },
                    { label: "Invoices", value: "INVOICE" },
                ]}
            />

            {/* Main Data Table */}
            <div className="rounded-2xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
                <DataTable
                    columns={columns as any}
                    data={paginatedData}
                    emptyMessage="No quotations or tax invoices found matching your filters."
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

            {/* 🔥 Confirmation Dialog for Deletion */}
            <ConfirmActionDialog
                isOpen={Boolean(selectedDocToDelete)}
                onClose={() => setSelectedDocToDelete(null)}
                onConfirm={handleConfirmDelete}
                isLoading={isDeleting}
                title="Delete Quotation"
                description={
                    <span>
                        Are you sure you want to delete quotation{" "}
                        <span className="font-bold text-slate-900">
                            #{selectedDocToDelete?.documentNumber}
                        </span>{" "}
                        for <span className="font-bold text-slate-900">{selectedDocToDelete?.partyName}</span>? This action cannot be undone.
                    </span>
                }
                confirmText="Delete Quotation"
                confirmButtonClass="bg-rose-600 hover:bg-rose-700 text-white"
            />

            {/* 🔥 Confirmation Dialog for Type Toggle (Quotation <-> Invoice) */}
            <ConfirmActionDialog
                isOpen={Boolean(selectedDocToToggle)}
                onClose={() => setSelectedDocToToggle(null)}
                onConfirm={handleConfirmToggleType}
                isLoading={isUpdatingType}
                title={isTargetingInvoice ? "Convert to Official Tax Invoice" : "Revert to Quotation"}
                description={
                    isTargetingInvoice ? (
                        <span>
                            Are you sure you want to convert quotation{" "}
                            <span className="font-bold text-slate-900">
                                #{selectedDocToToggle?.documentNumber}
                            </span>{" "}
                            to an official Tax Invoice? This will <span className="text-amber-600 font-bold">lock editing and deletion</span> until reverted.
                        </span>
                    ) : (
                        <span>
                            Are you sure you want to revert invoice{" "}
                            <span className="font-bold text-slate-900">
                                #{selectedDocToToggle?.documentNumber}
                            </span>{" "}
                            back into a Quotation? This will <span className="text-sky-600 font-bold">unlock editing and deletion</span>.
                        </span>
                    )
                }
                confirmText={isTargetingInvoice ? "Convert to Invoice" : "Revert to Quotation"}
                confirmButtonClass={
                    isTargetingInvoice
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                        : "bg-amber-600 hover:bg-amber-700 text-white"
                }
            />
        </div>
    );
};

export default InvoiceTable;