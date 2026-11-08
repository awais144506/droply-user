import { apiClient } from "@/lib/api-client";
import { DailySalesResponse } from "../types/daily";

export const dailySalesService = {
    async getDailySales(date?: string): Promise<DailySalesResponse> {
        const params = date ? { date } : {};
        return await apiClient.get("/daily/sales", {
            params,
        });
    },
};