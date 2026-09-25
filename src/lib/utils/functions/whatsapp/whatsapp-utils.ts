import { PurchaseOrder } from "@/features/supply/order/types/po";
import { BranchSettingData } from "@/features/admin/settings/types/settings";
import { SupplierPayment } from "@/features/supply/payments/types/payments";
import { PurchaseReturn } from "@/features/supply/returns/types/returns";
import { format } from "date-fns";


export const sendWhatsAppMessage = (phone: string, message: string) => {
    if (!phone) return;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
};


export const sendPOWhatsApp = (po: PurchaseOrder, settings?: BranchSettingData) => {
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




export const sendPOPaymentMessage = (payment: SupplierPayment, settings?: BranchSettingData) => {
    // 1. Extract Branch details
    const branchName = settings?.displayName || "Our Company";

    // 2. Format payment properties
    const formattedDate = format(new Date(payment.paymentDate), "MMM d, yyyy");

    const methodMap: Record<string, string> = {
        CASH: "Cash",
        BANK_TRANSFER: "Bank Transfer",
        CHEQUE: "Cheque"
    };
    const paymentMethodDisplay = methodMap[payment.paymentMethod] || payment.paymentMethod;

    // 3. Construct the message
    const message = `*${payment.supplier?.firmName || 'Supplier'}*,

We have processed a payment towards Purchase Order: *${payment.purchaseOrder?.poNumber || 'N/A'}*.

*Payment Details:*
- *Voucher No:* ${payment.voucherNumber}
- *Date:* ${formattedDate}
- *Amount Paid:* Rs ${payment.amountPaid.toLocaleString()}
- *Method:* ${paymentMethodDisplay}

*Account Summary:*
- *PO Total:* Rs ${payment.purchaseOrder?.totalAmount?.toLocaleString() || 0}
- *Remaining Balance:* Rs ${payment.purchaseOrder?.balanceDue?.toLocaleString() || 0}
- *Status:* ${payment.status === 'CLEARED' ? 'Cleared in Full' : 'Partial Payment'}

${payment.referenceNote ? `*Reference Note:* ${payment.referenceNote}\n\n` : ''}Thank you,
*${branchName}*`;

    // 4. Send
    sendWhatsAppMessage(payment.supplier?.phone || '', message);
};

export const sendReturnWhatsApp = (returnRecord: PurchaseReturn, settings?: BranchSettingData) => {
    // 1. Extract Items
    const itemsList = returnRecord.items?.length
        ? `\n*Returned Items:*\n${returnRecord.items.map(item => `- ${item.quantityReturned}x ${item.supplierItemName} @ Rs ${item.unitCost}`).join('\n')}\n`
        : '';

    // 2. Extract Branch details
    const branchName = settings?.displayName || "Our Company";

    // 3. Format References
    const formattedDate = format(new Date(returnRecord.returnDate), "MMM d, yyyy");
    const poRef = returnRecord.purchaseOrder?.poNumber
        ? `\n*Original PO:* ${returnRecord.purchaseOrder.poNumber}`
        : '';

    // 4. Construct the message
    const message = `*${returnRecord.supplier?.firmName || 'Supplier'}*,

We have initiated a Purchase Return (Debit Note) for defective or rejected items.

*Debit Note No:* ${returnRecord.debitNoteNumber}
*Date:* ${formattedDate}${poRef}
${itemsList}
*Total Value to Resolve:* Rs ${returnRecord.totalValue?.toLocaleString() || 0}

${returnRecord.notes ? `*Reason / Notes:* ${returnRecord.notes}\n\n` : ''}Please review and advise on replacement or credit application.

Thank you,
*${branchName}*`;

    // 5. Send
    sendWhatsAppMessage(returnRecord.supplier?.phone || '', message);
};