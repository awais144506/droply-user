"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import DataTable from "@/lib/utils/components/TableCreateMachine";
import TablePagination from "@/lib/utils/components/TablePagination";
import { usePagination } from "@/lib/utils/functions/pagination-calculation";

import { SupplierPayment } from "../../types/payments";
import { getPaymentColumns } from "./payment-columns";

interface PaymentsTableProps {
    payments?: SupplierPayment[];
}

export const PaymentsTable = ({ payments = [] }: PaymentsTableProps) => {
    const router = useRouter();

    const {
        currentPage,
        setCurrentPage,
        paginatedData,
        totalPages,
        totalItems,
        itemsPerPage
    } = usePagination(payments);

    const handlers = useMemo(() => ({
        onEdit: (payment: SupplierPayment) => {
            router.push(`/supply/payments/${payment.id}`);
        },
        onDelete: (payment: SupplierPayment) => {
            // Setup ConfirmDeleteDialog here later
            console.log("Delete", payment.id);
            toast.info(`Delete flow for ${payment.voucherNumber} pending...`);
        },
        onPrint: (payment: SupplierPayment) => {
            console.log("Print", payment.id);
            toast.info(`Generating voucher PDF for ${payment.voucherNumber}...`);
        },
        onWhatsApp: (payment: SupplierPayment) => {
            toast.info("Opening WhatsApp...");
        }
    }), [router]);

    const columns = useMemo(() => getPaymentColumns(router, handlers), [router, handlers]);

    return (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <DataTable
                data={paginatedData}
                columns={columns}
                emptyMessage="No payments match your current filters."
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