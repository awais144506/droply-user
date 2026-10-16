import { apiClient } from "@/lib/api-client";
import {
    CreateQuickSalePayload,
    UpdateQuickSalePayload,
    QuickSaleRecord,
    QuickSaleListResponse,
    QuickSaleQueryParams,
} from "../types/quicksale";

export const quickSaleService = {
    // 1. Create a Quick Sale & deduct stock
    create: async (payload: CreateQuickSalePayload): Promise<QuickSaleRecord> => {
        return await apiClient.post("/quick", payload);
    },

    // 2. Fetch paginated & filtered Quick Sales by Branch
    getAllByBranch: async (
        branchId: string,
        params?: QuickSaleQueryParams
    ): Promise<QuickSaleListResponse> => {
        return await apiClient.get(
            `/quick/branch/${branchId}`,
            { params }
        );
    },

    // 3. Get a single Quick Sale receipt by ID
    getById: async (id: string): Promise<QuickSaleRecord> => {
        return await apiClient.get(`/quick/${id}`);
    },

    // 4. Update an active Quick Sale (reconciles stock automatically)
    update: async (
        id: string,
        payload: UpdateQuickSalePayload
    ): Promise<QuickSaleRecord> => {
        return await apiClient.patch(
            `/quick/${id}`,
            payload
        );
    },

    // 5. Void a Quick Sale (restores stock & marks VOIDED)
    voidSale: async (id: string): Promise<QuickSaleRecord> => {
        return await apiClient.patch(`/quick/${id}/void`);
    },
};