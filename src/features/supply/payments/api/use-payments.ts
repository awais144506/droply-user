import { useQuery } from "@tanstack/react-query";
import { paymentApi } from "./payments.service";
import { paymentKeys } from "./payments-keys";

export function usePayments(branchId: string, search?: string, status?: string) {
    return useQuery({
        queryKey: paymentKeys.list(branchId),
        queryFn: () => paymentApi.getAll(branchId),
        select: (allPayments) => {
            // Calculate global stats for the cards
            const totalAmountPaid = allPayments.reduce((acc, p) => acc + p.amountPaid, 0);

            // Filter data for the table
            let filteredPayments = allPayments;

            if (status) {
                filteredPayments = filteredPayments.filter(p => p.status === status);
            }

            if (search) {
                const lower = search.toLowerCase();
                filteredPayments = filteredPayments.filter(p =>
                    p.voucherNumber.toLowerCase().includes(lower) ||
                    p.supplier?.firmName.toLowerCase().includes(lower) ||
                    p.purchaseOrder?.poNumber.toLowerCase().includes(lower)
                );
            }

            return {
                payments: filteredPayments,
                stats: {
                    totalAmountPaid,
                }
            };
        },
        enabled: !!branchId,
    });
}

export function usePayment(id: string) {
    return useQuery({
        queryKey: [...paymentKeys.all, 'detail', id],
        queryFn: () => paymentApi.getById(id),
        enabled: !!id,
    });
}