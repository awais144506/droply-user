import { apiClient } from "@/lib/api-client";
import { SupplierPayment ,SupplierPaymentResponse} from "../types/payments";
import { CreatePaymentFormValues } from "../schema/payment-schema";

const API = "/supply/payment/user"

export const paymentApi = {
    getAll: async (): Promise<SupplierPaymentResponse> => {
        return await apiClient.get(`${API}`);
    },

    create: async (payload: CreatePaymentFormValues): Promise<SupplierPayment> => {
        return await apiClient.post(`${API}`, payload);
    },
    getById: async (id: string): Promise<SupplierPayment> => {
        return apiClient.get(`${API}/${id}`);
    },
    update: async ({ id, payload }: { id: string, payload: Partial<CreatePaymentFormValues> }) => {
        return await apiClient.patch(`${API}/${id}`, payload);
    }
};