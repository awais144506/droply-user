import { CustomerDetails, NewCustomerRequest } from "@/features/manage/customers/types/customer";
import { BranchSettingData } from "@/features/admin/settings/types/settings";
import { formatPhoneNumber } from "react-phone-number-input";

export const sendWhatsAppMessage = (phone: string, message: string) => {
    if (!phone) return;

    // Remove all non-numeric characters for the wa.me link
    const cleanPhone = phone.replace(/\D/g, "");
    const encodedMessage = encodeURIComponent(message);

    window.open(`https://wa.me/${cleanPhone}?text=${encodedMessage}`, '_blank');
};
export const sendCustomerCreatedMessage = (
    customer: CustomerDetails,
    settings?: BranchSettingData
) => {
    if (!customer?.phone) return;

    const branchName = (settings?.name || "Droply").trim();
    const customerName = (customer.name || "Customer").trim();
    const portalUrl = customer.magicLink
        ? `${window.location.origin}/order/${customer.magicLink}`
        : null;

    const formattedPhone = formatPhoneNumber(customer.phone) || customer.phone;
    const credit = customer.customerCredit || 0;
    const advance = customer.customerAdvance > 0 ? customer.customerAdvance : 0;
    const deposit = customer.securityDeposit > 0 ? customer.securityDeposit : 0;
    const returnables = customer.returnablesLength > 0 ? customer.returnablesLength : 0;
    const zoneName = customer.zone?.name?.trim();
    const address = customer.address?.trim() || "No Address Provided";

    // Use Unicode bullet (•) instead of "- " to prevent WhatsApp's asterisk-shift bug
    let message =
        `Hi *${customerName}*, your ledger account has been created in *${branchName}*.\n\n` +
        `*Account Details:*\n` +
        `• *Phone*: ${formattedPhone}\n` +
        `${customer.email ? `• *Email*: ${customer.email.trim()}\n` : ""}` +
        `• *Customer Credit*: Rs. ${credit}\n` +
        `• *Advance*: Rs. ${advance}\n` +
        `• *Security Deposit*: Rs. ${deposit}\n` +
        `• *Returnable Items*: ${returnables}\n` +
        `${zoneName ? `• *Zone*: ${zoneName}\n` : ""}` +
        `• *Address*: ${address}`;

    if (portalUrl) {
        message +=
            `\n\n*Your Personal Branch Ordering Link:*\n` +
            `You can use this secure link anytime to place orders directly with *${branchName}* without needing a password:\n` +
            `${portalUrl}\n\n` +
            `آپ اس لنک کے ذریعے بغیر کسی پاسورڈ کے کسی بھی وقت براہِ راست اپنا آرڈر بک کروا سکتے ہیں۔ براہِ کرم یہ لنک کسی اور کے ساتھ شیئر نہ کریں۔\n\n` +
            `*Please do not share this link with anyone*, as it gives direct access to place orders from your account.`;
    }

    // Append Branch Footer Details
    const branchPhone = settings?.phone
        ? formatPhoneNumber(settings.phone) || settings.phone
        : null;
    const branchAddress = settings?.address?.trim();

    message +=
        `\n\n━━━━━━━━━━━━━━\n` +
        `*${branchName}*` +
        `${branchPhone ? `\n• *Complaints / Suggestions*: ${branchPhone}` : ""}` +
        `${branchAddress ? `\n• *Address*: ${branchAddress}` : ""}`;

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