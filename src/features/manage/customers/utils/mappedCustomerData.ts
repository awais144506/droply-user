/* eslint-disable @typescript-eslint/no-explicit-any */
import { CustomerDetails } from "../types/customer";
import { CreateCustomerFormData } from "../schema/create-customer.schema"; // Import your Yup type

export const mappedCustomerData = (customerData: CustomerDetails | undefined): Partial<CreateCustomerFormData> | undefined => {
    if (!customerData) return undefined;

    return {
        partyType: customerData.partyType,
        category: customerData.category,
        name: customerData.name,
        phone: customerData.phone || "",
        email: customerData.email ||"",
        zoneId: customerData.zoneId || "",
        address: customerData.address || "",
        latitude: customerData.latitude ?? 31.5411,
        longitude: customerData.longitude ?? 74.3591,
        customerCredit: customerData.customerCredit ?? 0,
        customerAdvance: customerData.customerAdvance ?? 0,
        securityDeposit: customerData.securityDeposit ?? 0,
        returnables: customerData.returnables?.map((r: any) => ({
            productId: r.productId,
            quantity: r.openingBalance ?? 0
        })),
    } as Partial<CreateCustomerFormData>;
}