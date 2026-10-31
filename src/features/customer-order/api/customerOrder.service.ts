import { apiClient } from "@/lib/api-client";
import { CustomerDataResponse, CustomerOrderRequest } from "../types/customerOrder";
import { CustomerOrderFormValues } from "../schema/order.schema";

const API = '/customer/order'; // 🔥 Fixed typo

export const customerOrderRequest = {
    getAllOrders: async (token: string): Promise<CustomerDataResponse> => {
        return await apiClient.get(`${API}/${token}`);
    },
    createNewOrder: async (token: string, payload: CustomerOrderFormValues): Promise<CustomerOrderRequest> => {
        return await apiClient.post(`${API}/${token}/request`, payload);
    }
};