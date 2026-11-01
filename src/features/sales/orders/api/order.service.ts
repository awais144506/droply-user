import { CreateOrderPayload, OrderResponse } from "../types/order";
import { apiClient } from "@/lib/api-client";
import { OrderFilterParams } from "./use-order";

const API = '/order/user'

export const orderService = {
    createOrder: async (payload: CreateOrderPayload): Promise<OrderResponse> => {
        return await apiClient.post(API, payload);
    },
    getTodaysOrders: async (filters?: OrderFilterParams): Promise<OrderResponse[]> => {
        return await apiClient.get(`${API}`, {
            params: {
                search: filters?.search || undefined,
                category: filters?.category && filters.category !== "ALL" ? filters.category : undefined,
                status: filters?.status && filters.status !== "ALL" ? filters.status : undefined,
                date: filters?.date || undefined,
            },
        });
    },
};