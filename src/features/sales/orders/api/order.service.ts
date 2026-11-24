import { OrderResponse, ApiResponse, OrderStatus } from "../types/order";
import { apiClient } from "@/lib/api-client";
import { OrderFilterParams } from "./use-order";
import { OrderFormValues } from "../schema/create-order-schema";

const API = '/order/user';

export interface DeleteOrderResponse {
    deleted: boolean;
    orderId: string;
    orderCode: string;
}

export const orderService = {
    createOrder: async (payload: OrderFormValues): Promise<OrderResponse> => {
        return await apiClient.post(API, payload);
    },
    updateOrder: async ({ id, ...payload }: { id: string } & OrderFormValues): Promise<OrderResponse> => {
        return await apiClient.put(`${API}/${id}`, payload);
    },
    cancelOrder: async (id: string): Promise<OrderResponse> => {
        return await apiClient.patch(`${API}/${id}/cancel`);
    },
    deleteOrder: async (id: string): Promise<DeleteOrderResponse> => {
        return await apiClient.delete(`${API}/${id}`);
    },
    updateOrderStatus: async ({ id, status }: { id: string; status: OrderStatus }): Promise<OrderResponse> => {
        return await apiClient.patch(`${API}/${id}/status`, { status });
    },
    getTodaysOrders: async (filters?: OrderFilterParams): Promise<ApiResponse> => {
        return await apiClient.get(`${API}`, {
            params: {
                search: filters?.search || undefined,
                category: filters?.category && filters.category !== "ALL" ? filters.category : undefined,
                status: filters?.status && filters.status !== "ALL" ? filters.status : undefined,
                date: filters?.date || undefined,
                page: filters?.page || 1,
            },
        });
    },
};