import { CustomerDetails, NewCustomerRequest } from "@/features/manage/customers/types/customer";
import { BranchSettingData } from "@/features/admin/settings/types/settings";
import { formatPhoneNumber } from "react-phone-number-input";

export const sendWhatsAppMessage = (phone: string, message: string) => {
    if (!phone) return;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
};

export const sendCustomerCreatedMessage = (customer: CustomerDetails, settings?: BranchSettingData) => {
    if (!customer?.phone) return;

    const branchName = settings?.name || "Droply";

    // Build the formatted details list
    const message =
        `Hi *${customer.name}*, your ledger account has been created in *${branchName}*.

Here are your account details:
• *Phone:* ${formatPhoneNumber(customer.phone)}
${customer.email ? `• *Email:* ${customer.email}\n` : ''}• *Customer Credit:* ${customer.customerCredit}
• *Advance:* ${customer.customerAdvance > 0 ? customer.customerAdvance : 0}
• *Security Deposit:* ${customer.securityDeposit > 0 ? customer.securityDeposit : 0}
• *Returnables Items:* ${customer.returnablesLength > 0 ? customer.returnablesLength : 0}
${customer.zone?.name ? `• *Zone:* ${customer.zone.name}\n` : ''}• *Address:* ${customer.address || "No Address Provided"}`;

    sendWhatsAppMessage(customer.phone, message);
};

export const getCustomerDetailsMessage = (customer: NewCustomerRequest, settings?: BranchSettingData) => {
    const branchName = settings?.name || "Droply";
    const riderName = customer.requestedBy || `${settings?.name} Rider` || "Rider";

    const message =
        `Hi *${customer.name}*, we received your request for account creation submitted by *${riderName}* at *${branchName}*.

Here are your registered details:
• *Name:* ${customer.name}
• *Phone:* ${customer.phone}
• *Address:* ${customer.address || "No address provided"}

*Pin Location Required (Please dont send live location we need pin location):*
To ensure smooth deliveries, we kindly request you to please share your **Pin Location** right here on this chat so our team can pin your exact coordinates for route planning.

Thank you for choosing *${branchName}*!`;

    sendWhatsAppMessage(customer.phone, message)
}