import { PurchaseOrder } from "@/features/supply/order/types/po";
import { BranchSettingData } from "@/features/admin/settings/types/settings";
/**
 * Base utility to sanitize a phone number and open the WhatsApp web link.
 */
export const sendWhatsAppMessage = (phone: string, message: string) => {
    if (!phone) return;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
};

/**
 * Specifically formats a message for a New Purchase Order.
 */
export const sendPOWhatsApp = (po: PurchaseOrder, settings?: BranchSettingData) => {
    // 1. Map items with a clear space after the 'x' to prevent WhatsApp markdown bugs
    const itemsList = po.items?.length
        ? `\n*Order Items:*\n${po.items.map(item => `- ${item.quantity}x${item.supplierItemName}`).join('\n')}\n`
        : '';

    // 2. Extract Branch details (fallback gracefully if some are missing)
    const branchName = settings?.displayName || "Our Company";
    const addressDetails = settings?.displayAddress ? `\n*Delivery Address:* ${settings.displayAddress}` : '';

    const historicalBalance = po.totalAmount - (po.advancePaid || 0);

    const message = `*${po.supplier?.firmName || 'Supplier'}*,

Please process our new order: *${po.poNumber}*.
${itemsList}
*Order Total:* Rs ${po.totalAmount.toLocaleString()}
*Initial Advance:* Rs ${po.advancePaid?.toLocaleString() || 0}
*Balance at Order:* Rs ${historicalBalance.toLocaleString()}

${po.notes ? `*Notes:* ${po.notes}\n` : ''}${addressDetails}

Thank you,
*${branchName}*`;

    // 4. Send
    sendWhatsAppMessage(po.supplier?.phone || '', message);
};