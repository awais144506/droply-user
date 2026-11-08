/* eslint-disable @typescript-eslint/no-explicit-any */
import { CustomerDetails } from "../types/customer";
import { CreateCustomerFormData } from "../schema/create-customer.schema";

export const mappedCustomerData = (
  customerData: CustomerDetails | undefined,
): Partial<CreateCustomerFormData> | undefined => {
  if (!customerData) return undefined;

  return {
    partyType: customerData.partyType || "CUSTOMER",
    category: customerData.category || "DOMESTIC",
    status: customerData.status || "ACTIVE",
    name: customerData.name || "",
    phone: customerData.phone || "",
    email: customerData.email || "",
    zoneId: customerData.zoneId ?? null,
    address: customerData.address || "",
    ntn: customerData.ntn || "",
    strn: customerData.strn || "",
    deliveryScheduleType: customerData.deliveryScheduleType || "ON_DEMAND",
    deliveryDays: customerData.deliveryDays || [],
    latitude: customerData.latitude ?? 30.5411,
    longitude: customerData.longitude ?? 74.3591,
    customerCredit: customerData.customerCredit ?? 0,
    customerAdvance: customerData.customerAdvance ?? 0,
    securityDeposit: customerData.securityDeposit ?? 0,
    returnables:
      customerData.returnables?.map((r: any) => ({
        productId: r.productId,
        quantity: r.currentBalance ?? r.openingBalance ?? 1,
      })) || [],
  };
};