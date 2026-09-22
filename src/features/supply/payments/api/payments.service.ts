import { apiClient } from "@/lib/api-client";
import { SupplierPayment } from "../types/payments";
import { CreatePaymentFormValues } from "../schema/payment-schema";

export const paymentApi = {
    getAll: async (branchId: string): Promise<SupplierPayment[]> => {
        return await apiClient.get(`/supply/payments/branch/${branchId}`);
    },

    create: async (payload: CreatePaymentFormValues): Promise<SupplierPayment> => {
        return await apiClient.post('/supply/payments', payload);
    },
    getById: async (id: string): Promise<SupplierPayment> => {
       return apiClient.get(`/supply/payments/${id}`);
    },
    update: async ({ id, payload }: { id: string, payload: Partial<CreatePaymentFormValues> }) => {
        return await apiClient.patch(`/supply/payments/${id}`, payload);
    }
};