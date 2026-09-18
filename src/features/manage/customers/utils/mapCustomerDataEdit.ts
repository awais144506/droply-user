/* eslint-disable @typescript-eslint/no-explicit-any */
import { CustomerDetails } from "../types/customer";

export const mappedCustomerData = (customerData: CustomerDetails | undefined) => {
    if (!customerData) return undefined;
    const mappedInitialData = {
        partyType: customerData.partyType,
        customerCategory: customerData.category,
        name: customerData.name,
        phone: customerData.phone || "",
        email: customerData.email || "",
        zoneId: customerData.zoneId || "",
        address: customerData.address || "",
        latitude: customerData.latitude ?? 31.5411,
        longitude: customerData.longitude ?? 74.3591,
        customerCredit: customerData.customerCredit,
        customerAdvance: customerData.customerAdvance,
        securityDeposit: customerData.securityDeposit,
        openingReturnables: customerData.returnables?.map((r: any) => ({
            productId: r.productId,
            quantity: r.openingBalance
        })),
    };

    return mappedInitialData;
}