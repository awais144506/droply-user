import { CreateCustomerFormData } from "@/features/customers/schema/create-customer.schema";
import { formatPakistaniPhone } from "@/utils/setFormat";

export function formatCustomerPayload(data: CreateCustomerFormData, branchId: string) {
    return {
        branchId: branchId,
        partyType: data.partyType,
        category: data.customerCategory,
        name: data.name,
        phone: formatPakistaniPhone(data.phone),
        email: data.email || undefined,
        address: data.address,
        zoneId: data.zoneId || undefined,
        latitude: data.latitude,
        longitude: data.longitude,
        customerCredit: data.customerCredit,
        customerAdvance: data.customerAdvance,
        securityDeposit: data.securityDeposit,
        returnables: data.openingReturnables,
    };
}