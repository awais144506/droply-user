/* eslint-disable @typescript-eslint/no-explicit-any */
import { sendWhatsAppMessage } from "../whatsapp/customerWhatsApp";
import { BranchSettingData } from "@/features/admin/settings/types/settings";

export const sendOrderStatusWhatsApp = (order: any, branchSettings?: BranchSettingData) => {
    const customer = order.customer;
    if (!customer || !customer.phone) {
        console.warn("Cannot send WhatsApp message: Customer phone not found.");
        return;
    }

    const phone = customer.phone;
    const code = order.orderCode || order.orderId || "N/A";
    const status = order.status === "COMPLETED" ? "DONE / COMPLETED" : order.status?.replace("_", " ");
    const category = order.category || order.orderType || "ORDER";
    
    const items = order.lineItems || order.items || [];
    const assetExchanges = order.assetExchanges || [];

    const total = Number(order.totalAmount ?? order.total ?? 0);
    const paid = Number(order.amountPaid ?? order.receivedAmount ?? 0);
    const balance = total - paid;
    
    // Customer Ledger Info
    const customerCredit = Number(customer.customerCredit || 0);

    // Branch Details Fallback
    const branchName = branchSettings?.name || "WATER DISTRIBUTION";
    const branchPhone = branchSettings?.phone ? ` | Tel: ${branchSettings.phone}` : "";

    // Format items list
    const itemsListText = items
        .map((item: any) => {
            const qty = (item.paidQuantity ?? 0) + (item.freeQuantity ?? 0) || item.quantity || 0;
            const name = item.product?.name || item.name || "Product";
            const subtotal = Number(item.subtotal || 0);
            return `• ${name} x${qty} - Rs. ${subtotal.toLocaleString()}`;
        })
        .join("\n");

    // Format container asset exchanges if any
    const assetsText = assetExchanges
        .map((ex: any) => {
            return `• Outbound: ${ex.outboundQuantity} | Empties Received: ${ex.inboundQuantity}`;
        })
        .join("\n");

    // Construct professional WhatsApp message template with Branch Info
    let msg = `*${branchName.toUpperCase()}*${branchPhone}\n`;
    if (branchSettings?.address) {
        msg += `${branchSettings.address}\n`;
    }
    msg += `----------------------------------\n`;
    msg += `Hello *${customer.name}*,\n`;
    msg += `Here is the latest update for your *${category.replace("_", " ")}*.\n\n`;
    
    msg += `*Order Code:* #${code}\n`;
    msg += `*Status:* *${status}*\n`;
    msg += `*Date:* ${new Date(order.createdAt || Date.now()).toLocaleDateString()}\n\n`;

    msg += `*Ordered Items:*\n${itemsListText}\n\n`;

    if (assetsText) {
        msg += `*Container Exchanges:*\n${assetsText}\n\n`;
    }

    msg += `*Billing Summary:*\n`;
    msg += `• Total Bill: Rs. ${total.toLocaleString()}\n`;
    msg += `• Amount Paid: Rs. ${paid.toLocaleString()}\n`;
    if (balance > 0) {
        msg += `• Balance Due (Added to Khata): Rs. ${balance.toLocaleString()}\n`;
    }
    
    msg += `\n*Your Account Ledger:*\n`;
    msg += `• Total Outstanding Credit / Khata: Rs. ${customerCredit.toLocaleString()}\n\n`;

    // Trigger WhatsApp Dispatch
    sendWhatsAppMessage(phone, msg);
};