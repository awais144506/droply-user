import { CreateOrderPayload, OrderResponse } from "../types/order";
import { apiClient } from "@/lib/api-client";

export const orderService = {
    createOrder: async (payload: CreateOrderPayload): Promise<OrderResponse> => {
        return await apiClient.post('/orders', payload);
    },
    getTodaysOrders: async (branchId: string): Promise<OrderResponse[]> => {
        return await apiClient.get(`/orders/all/${branchId}`);
    }
};