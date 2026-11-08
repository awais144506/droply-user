import { apiClient } from "@/lib/api-client";
import {
  CreateRecoveryPayload,
  UpdateRecoveryPayload,
  CreateSaleReturnPayload,
  UpdateSaleReturnPayload,
  GetRecoveryAllResponse,
  CustomerCompletedOrder,
  CustomerRecoveryRecord,
  SaleReturnRecord,
} from "../types/recovery.types";

export const recoveryApi = {
  // 0. Get All Recoveries, Sale Returns & Logs
  getAll: async (params?: {
    search?: string;
    date?: string;
    customerId?: string;
  }): Promise<GetRecoveryAllResponse> => {
    const query = new URLSearchParams();
    if (params?.search) query.append("search", params.search);
    if (params?.date) query.append("date", params.date);
    if (params?.customerId) query.append("customerId", params.customerId);

    const queryString = query.toString();
    const url = queryString ? `/recovery?${queryString}` : `/recovery`;
    return await apiClient.get(url);
  },

  // Get Completed Orders for a Specific Customer (with Recipe Ingredients)
  getCustomerCompletedOrders: async (
    customerId: string
  ): Promise<CustomerCompletedOrder[]> => {
    return await apiClient.get(
      `/recovery/customer/${customerId}/completed-orders`
    );
  },

  // 1. Customer Recovery CRUD
  createRecovery: async (
    payload: CreateRecoveryPayload
  ): Promise<CustomerRecoveryRecord> => {
    return await apiClient.post(
      "/recovery/customer-recovery",
      payload
    );
  },

  updateRecovery: async ({
    id,
    payload,
  }: {
    id: string;
    payload: UpdateRecoveryPayload;
  }): Promise<CustomerRecoveryRecord> => {
    return await apiClient.patch(
      `/recovery/customer-recovery/${id}`,
      payload
    );
  },

  deleteRecovery: async (id: string): Promise<{ message: string }> => {
    return await apiClient.delete(
      `/recovery/customer-recovery/${id}`
    );
  },

  // 2. Sale Return CRUD
  createSaleReturn: async (
    payload: CreateSaleReturnPayload
  ): Promise<SaleReturnRecord> => {
    return await apiClient.post("/recovery/sale-return", payload);
  },

  updateSaleReturn: async ({
    id,
    payload,
  }: {
    id: string;
    payload: UpdateSaleReturnPayload;
  }): Promise<SaleReturnRecord> => {
    return await apiClient.patch(
      `/recovery/sale-return/${id}`,
      payload
    );
  },

  deleteSaleReturn: async (id: string): Promise<{ message: string }> => {
   return await apiClient.delete(`/recovery/sale-return/${id}`);
  },
};