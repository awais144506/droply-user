import { apiClient } from "@/lib/api-client";
import { CustomerList, CustomerDetails } from "../types/customer";
import { ActivityLog } from "@/types/ActivityLog";
import { CreateCustomerFormData } from "../schema/create-customer.schema";
import { formatCustomerPayload } from "../utils/formatCustomerPayload";
type CreateCustomerPayload = ReturnType<typeof formatCustomerPayload>;
export const customerApi = {
    getAllCustomers: async (branchId: string): Promise<CustomerList[]> => {
        return await apiClient.get(`/customer/branch/${branchId}`);
    },
    getCustomer: async (id: string): Promise<CustomerDetails> => {
        return await apiClient.get(`/customer/${id}`)
    },
    getCustomerLogs: async (branchId: string): Promise<ActivityLog[]> => {
        return await apiClient.get(`/customer/logs/${branchId}`)
    },

    //Mutaion
    createNewCustomer: async (newCustomer: CreateCustomerPayload): Promise<CustomerDetails> => {
        return await apiClient.post('/customer', newCustomer);
    },

    updateCustomer: async (id: string, updateCustomer: Partial<CreateCustomerFormData>): Promise<CustomerDetails> => {
        return await apiClient.patch(`/customer/${id}`, updateCustomer);
    },

    deleteCustomer: async (id: string) => {
        return await apiClient.delete(`/customer/${id}`);
    }
}