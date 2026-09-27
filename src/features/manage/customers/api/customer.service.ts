import { apiClient } from "@/lib/api-client";
import { CustomerDetails, CustomerResponse } from "../types/customer";
import { CreateCustomerFormData } from "../schema/create-customer.schema";

export const customerApi = {
    getAllCustomers: async (branchId: string): Promise<CustomerResponse> => {
        return await apiClient.get(`/customer/branch/${branchId}`);
    },
    getCustomer: async (id: string): Promise<CustomerDetails> => {
        return await apiClient.get(`/customer/${id}`)
    },

    //Mutaion
    createNewCustomer: async (newCustomer: CreateCustomerFormData): Promise<CustomerDetails> => {
        return await apiClient.post('/customer', newCustomer);
    },

    updateCustomer: async (id: string, updateCustomer: Partial<CreateCustomerFormData>): Promise<CustomerDetails> => {
        return await apiClient.patch(`/customer/${id}`, updateCustomer);
    },

    deleteCustomer: async (id: string) => {
        return await apiClient.delete(`/customer/${id}`);
    }
}