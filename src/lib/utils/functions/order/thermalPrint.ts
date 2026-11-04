/* eslint-disable @typescript-eslint/no-explicit-any */
import { format } from "date-fns";
import { BranchSettingData } from "@/features/admin/settings/types/settings";

export const handleThermalPrint = (order: any, branchSettings?: BranchSettingData) => {
    if (!order) return;

    const customer = order.customer;
    const items = order.lineItems || order.items || [];
    const assetExchanges = order.assetExchanges || [];

    const code = order.orderCode || order.orderId || "N/A";
    const dateStr = order.createdAt ? format(new Date(order.createdAt), "PP, hh:mm p") : format(new Date(), "PP, hh:mm p");

    const total = Number(order.totalAmount ?? order.total ?? 0);
    const paid = Number(order.amountPaid ?? order.receivedAmount ?? 0);
    const balance = total - paid;
    const type = order.type;

    // Fallback branch defaults if settings aren't loaded yet
    const branchName = branchSettings?.name || "DISTRIBUTION";
    const branchAddress = branchSettings?.address || "";
    const branchPhone = branchSettings?.phone || "";
    const ntn = branchSettings?.ntn;
    const strn = branchSettings?.strn;

    // Construct clean thermal receipt HTML template optimized for 80mm / 58mm POS printers
    const printWindow = window.open("", "_blank", "width=400,height=600");
    if (!printWindow) {
        alert("Please allow popups to print the thermal receipt.");
        return;
    }

    const htmlContent = `
        <!DOCTYPE html>
        <html>
            <head>
                <title>Thermal Receipt - #${code}</title>
                <style>
                    body {
                        font-family: 'Courier New', Courier, monospace;
                        font-size: 12px;
                        color: #000;
                        width: 72mm;
                        margin: 0 auto;
                        padding: 10px;
                        background: #fff;
                    }
                    .text-center { text-align: center; }
                    .text-right { text-align: right; }
                    .font-bold { font-weight: bold; }
                    .uppercase { text-transform: uppercase; }
                    .flex { display: flex; justify-content: space-between; }
                    .divider {
                        border-top: 1px dashed #000;
                        margin: 8px 0;
                    }
                    .header {
                        text-align: center;
                        margin-bottom: 10px;
                    }
                    .header h2 {
                        font-size: 16px;
                        margin: 0 0 4px 0;
                    }
                    .header p {
                        margin: 2px 0;
                        font-size: 11px;
                        color: #333;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 6px;
                    }
                    th, td {
                        font-size: 11px;
                        padding: 4px 0;
                        vertical-align: top;
                    }
                    .item-row td {
                        padding-bottom: 2px;
                    }
                    .item-subtext {
                        font-size: 10px;
                        color: #555;
                        margin-bottom: 4px;
                    }
                    .totals div {
                        display: flex;
                        justify-content: space-between;
                        margin: 3px 0;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 15px;
                        font-size: 10px;
                        color: #555;
                    }
                </style>
            </head>
            <body>
                <!-- Branch Header -->
                <div class="header">
                    <h2>${branchName}</h2>
                    ${branchAddress ? `<p>${branchAddress}</p>` : ""}
                    ${branchPhone ? `<p>Tel: ${branchPhone}</p>` : ""}
                    ${ntn ? `<p>NTN: ${ntn}</p>` : ""}
                    ${strn ? `<p>STRN: ${strn}</p>` : ""}
                </div>

                <div class="divider"></div>

                <!-- Receipt Meta -->
                <div>
                    <div class="flex">
                        <span>Receipt #:</span>
                        <span class="font-bold">${code}</span>
                    </div>
                          <div class="flex">
                        <span>Type:</span>
                        <span class="font-bold">${type}</span>
                    </div>
                    <div class="flex">
                        <span>Date:</span>
                        <span>${dateStr}</span>
                    </div>
                    <div class="flex">
                        <span>Customer:</span>
                        <span class="font-bold">${customer?.name || "Walk-In Customer"}</span>
                    </div>
                    <div class="flex">
                        <span>Phone:</span>
                        <span>${customer?.phone || "-"}</span>
                    </div>
                    <div class="flex">
                        <span>Payment:</span>
                        <span class="font-bold">${order.paymentMethod || "CASH"}</span>
                    </div>
                </div>

                <div class="divider"></div>

                <!-- Items Table -->
                <table>
                    <thead>
                        <tr>
                            <th align="left">Item</th>
                            <th align="center">Qty</th>
                            <th align="right">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${items
            .map((item: any) => {
                const qty = (item.paidQuantity ?? 0) + (item.freeQuantity ?? 0) || item.quantity || 0;
                const unitPrice = Number(item.unitPrice || 0);
                const subtotal = Number(item.subtotal || 0);
                const productName = item.product?.name || item.name || "Product";
                return `
                                    <tr class="item-row">
                                        <td colspan="3" class="font-bold">${productName}</td>
                                    </tr>
                                    <tr class="item-row">
                                        <td class="item-subtext">@ Rs. ${unitPrice.toLocaleString()}</td>
                                        <td align="center">${qty}</td>
                                        <td align="right" class="font-bold">Rs. ${subtotal.toLocaleString()}</td>
                                    </tr>
                                `;
            })
            .join("")}
                    </tbody>
                </table>

                <!-- Asset / Container Exchanges if any -->
                ${assetExchanges.length > 0
            ? `
                    <div class="divider"></div>
                    <div style="font-size: 10px;">
                        <div class="font-bold">Container Exchange:</div>
                        ${assetExchanges
                .map(
                    (ex: any) => `
                            <div class="flex">
                                <span>Outbound Bottles:</span>
                                <span>${ex.outboundQuantity}</span>
                            </div>
                            <div class="flex">
                                <span>Empties In:</span>
                                <span>${ex.inboundQuantity}</span>
                            </div>
                        `
                )
                .join("")}
                    </div>
                `
            : ""
        }

                <div class="divider"></div>

                <!-- Financial Totals -->
                <div class="totals">
                    <div class="flex">
                        <span>Subtotal:</span>
                        <span>Rs. ${total.toLocaleString()}</span>
                    </div>
                    <div class="flex">
                        <span>Amount Paid:</span>
                        <span>Rs. ${paid.toLocaleString()}</span>
                    </div>
                    ${balance > 0
            ? `
                        <div class="flex" style="color: #b45309; font-weight: bold;">
                            <span>Balance / Khata:</span>
                            <span>Rs. ${balance.toLocaleString()}</span>
                        </div>
                    `
            : ""
        }
                    <div class="divider"></div>
                    <div class="flex font-bold" style="font-size: 14px;">
                        <span>TOTAL:</span>
                        <span>Rs. ${total.toLocaleString()}</span>
                    </div>
                </div>

                <div class="divider"></div>

                <!-- Footer -->
                <div class="footer">
                    <p>Software Powered by Droply</p>
                </div>

                <script>
                    window.onload = function() {
                        window.print();
                        window.close();
                    };
                </script>
            </body>
        </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
};