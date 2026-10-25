import { apiClient } from "@/lib/api-client";
import { CustomerDetails, CustomerResponse, CustomerStatus } from "../types/customer";
import { CreateCustomerFormData } from "../schema/create-customer.schema";

const API = "/customer/user";

export const customerApi = {
  getAllCustomers: async (): Promise<CustomerResponse> => {
    return await apiClient.get(`${API}`);
  },
  getCustomer: async (id: string): Promise<CustomerDetails> => {
    return await apiClient.get(`${API}/${id}`);
  },

  // Mutations
  createNewCustomer: async (
    newCustomer: CreateCustomerFormData,
  ): Promise<CustomerDetails> => {
    return await apiClient.post(`${API}`, newCustomer);
  },

  updateCustomer: async (
    id: string,
    updateCustomer: Partial<CreateCustomerFormData>,
  ): Promise<CustomerDetails> => {
    return await apiClient.patch(`${API}/${id}`, updateCustomer);
  },

  toggleCustomerStatus: async (
    id: string,
    status?: CustomerStatus,
  ): Promise<CustomerDetails> => {
    return await apiClient.patch(`${API}/${id}/status`, status ? { status } : {});
  },

  deleteCustomer: async (id: string) => {
    return await apiClient.delete(`${API}/${id}`);
  },

  markRequest: async (id: string) => {
    return await apiClient.patch(`${API}/${id}/new`);
  }
};