import { PurchaseOrder } from "@/features/supply/order/types/po";

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
export const sendPOWhatsApp = (po: PurchaseOrder) => {
    const message = `Hello *${po.supplier?.firmName || 'Supplier'}*,

Please process our new order: *${po.poNumber}*.

*Total Amount:* Rs ${po.totalAmount.toLocaleString()}
*Advance Paid:* Rs ${po.advancePaid?.toLocaleString() || 0}
*Balance Due:* Rs ${po.balanceDue?.toLocaleString() || 0}

${po.notes ? `*Notes:* ${po.notes}\n` : ''}
Thank you!`;

    sendWhatsAppMessage(po.supplier.phone, message);
};