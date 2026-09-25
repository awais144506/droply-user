// ReturnTable.tsx
"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import DataTable from "@/lib/utils/components/TableCreateMachine";
import TablePagination from "@/lib/utils/components/TablePagination";
import ConfirmDeleteDialog from "@/lib/utils/components/ConfirmDeleteItemDialog";
import { usePagination } from "@/lib/utils/functions/pagination-calculation";
import { PurchaseReturn } from "../../types/returns";
import { getReturnColumns } from "./return-columns";
import { useDeleteReturn, useResolveReturn } from "../../api/use-mutate-returns";
import { useBranchSettings } from "@/features/admin/settings/api/use-branch-settings";
import { sendReturnWhatsApp } from "@/lib/utils/functions/whatsapp/whatsapp-utils";
import { useRole } from "@/lib/hooks/use-role";
import { generateReturnPdf } from "@/lib/utils/functions/generatePdfs/generate-return-pdf";
import ResolveReturnDialog, { ResolveFormValues } from "./ResolveReturnDialog";

interface ReturnTableProps {
    returns?: PurchaseReturn[];
}

export const ReturnTable = ({ returns = [] }: ReturnTableProps) => {
    const router = useRouter();
    const { branchId } = useRole();
    
    // Mutations
    const { mutate: deleteReturn, isPending: isDeleting } = useDeleteReturn();
    const { mutate: resolveReturn, isPending: isResolving } = useResolveReturn(branchId);
    
    // Settings
    const { fetchBranchSettings } = useBranchSettings(branchId);
    const branchSettings = fetchBranchSettings.data;
    
    // Dialog States
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isResolveDialogOpen, setIsResolveDialogOpen] = useState(false);
    const [selectedReturn, setSelectedReturn] = useState<PurchaseReturn | null>(null);

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
            setSelectedReturn(returnRecord);
            setIsResolveDialogOpen(true);
        },
        onPrint: (returnRecord: PurchaseReturn) => {
            toast.info(`Generating PDF for ${returnRecord.debitNoteNumber}...`);
            generateReturnPdf(returnRecord, branchSettings);
        },
        onWhatsApp: (returnRecord: PurchaseReturn) => {
            if (!branchSettings) {
                toast.error("Branch settings are still loading. Please wait a second.");
                return;
            }
            sendReturnWhatsApp(returnRecord, branchSettings);
        },
        onDelete: (returnRecord: PurchaseReturn) => {
            setSelectedReturn(returnRecord);
            setIsDeleteDialogOpen(true);
        },
    }), [branchSettings]);

    const handleDeleteConfirm = () => {
        if (selectedReturn) {
            deleteReturn(selectedReturn.id, {
                onSuccess: () => {
                    setIsDeleteDialogOpen(false);
                    setSelectedReturn(null);
                }
            });
        }
    };

    const handleResolveConfirm = (id: string, data: ResolveFormValues) => {
        resolveReturn(
            { id, payload: data },
            {
                onSuccess: () => {
                    setIsResolveDialogOpen(false);
                    setSelectedReturn(null);
                }
            }
        );
    };

    const columns = useMemo(() => getReturnColumns(router, handlers), [router, handlers]);

    return (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">

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

            <ConfirmDeleteDialog
                title="Delete Purchase Return?"
                description={`Are you sure you want to delete debit note ${selectedReturn?.debitNoteNumber}? This will permanently remove the record and restore the inventory quantities.`}
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDeleteConfirm}
                isLoading={isDeleting}
            />
            <ResolveReturnDialog
                isOpen={isResolveDialogOpen}
                onClose={() => setIsResolveDialogOpen(false)}
                returnRecord={selectedReturn}
                onConfirm={handleResolveConfirm}
                isLoading={isResolving}
            />
        </div>
    );
};