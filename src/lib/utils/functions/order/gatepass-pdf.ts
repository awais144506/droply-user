/* eslint-disable @typescript-eslint/no-explicit-any */
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { BranchSettingData } from "@/features/admin/settings/types/settings";
import { formatPhoneNumber } from "react-phone-number-input";
import { getBase64ImageFromUrl } from "../generatePdfs/getBase64Image";

export const generateGatePassPdf = async (
    order: any,
    branch?: BranchSettingData & Record<string, any>
) => {
    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
    });

    // Formatting helpers
    const formatDateDMY = (dateStr: string | Date) => {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return "N/A";
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const colors = {
        primary: [3, 105, 161] as [number, number, number],      // Sky/Primary Navy
        brandAccent: [2, 132, 199] as [number, number, number],  // Sky 600
        slate900: [15, 23, 42] as [number, number, number],
        slate700: [51, 65, 85] as [number, number, number],
        slate500: [100, 116, 139] as [number, number, number],
        slate200: [226, 232, 240] as [number, number, number],
        slate100: [241, 245, 249] as [number, number, number],
        amberBg: [254, 243, 199] as [number, number, number],
    };

    // Branch Details Fallbacks
    const companyName = branch?.name || branch?.displayName || "Company Name";
    const companyNtn = branch?.ntn || branch?.displayNtn || "";
    const companyStrn = branch?.strn || branch?.displayStrn || "";
    const companyAddress = branch?.address || branch?.displayAddress || "";
    const companyPhone = branch?.phone || branch?.displayPhone || "";
    const companyEmail = branch?.email || branch?.displayEmail || "";

    // Order Details Resolution
    const orderCode = order.orderCode || order.orderId || "N/A";
    const customer = order.customer || {};
    const externalDelivery = order.externalDelivery;
    const rider = order.rider;
    const isThirdParty = Boolean(externalDelivery);
    const items = order.lineItems || order.items || [];
    const assetExchanges = order.assetExchanges || [];

    // =========================================================================
    // 1. TOP HEADER: Company Details (Left) & Logo (Right)
    // =========================================================================
    let leftY = 18;
    const leftX = 14;
    const rightColX = 196;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(...colors.slate900);
    const companyNameLines = doc.splitTextToSize(companyName, 115);
    doc.text(companyNameLines, leftX, leftY);
    leftY += companyNameLines.length * 5.5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(...colors.slate700);

    if (companyNtn) {
        doc.text(`NTN: (${companyNtn})`, leftX, leftY);
        leftY += 4.5;
    }
    if (companyStrn) {
        doc.text(`STRN: ${companyStrn}`, leftX, leftY);
        leftY += 4.5;
    }
    if (companyAddress) {
        const addressLines = doc.splitTextToSize(companyAddress, 115);
        doc.text(addressLines, leftX, leftY);
        leftY += addressLines.length * 4.5;
    }
    if (companyEmail) {
        doc.text(`Email: ${companyEmail}`, leftX, leftY);
        leftY += 4.5;
    }
    if (companyPhone) {
        const formattedPhone = formatPhoneNumber(companyPhone) || companyPhone;
        doc.text(`Phone No: ${formattedPhone}`, leftX, leftY);
        leftY += 4.5;
    }

    if (branch?.logoUrl) {
        try {
            const base64Logo = await getBase64ImageFromUrl(branch.logoUrl);
            doc.addImage(base64Logo, 'PNG', 170, 15, 20, 18);
        } catch (error) {
            console.warn("Failed to load logo", error);
        }
    }

    // =========================================================================
    // 2. CENTER TITLE ("GATE PASS / DISPATCH SLIP") & DIVIDER
    // =========================================================================
    const titleY = Math.max(leftY + 6, 52);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(...colors.primary);
    doc.text("GATE PASS / DISPATCH SLIP", 105, titleY, { align: "center" });

    doc.setDrawColor(...colors.slate200);
    doc.setLineWidth(0.4);
    doc.line(14, titleY + 3, 196, titleY + 3);

    // =========================================================================
    // 3. CUSTOMER (Left) & DRIVER / DISPATCH DETAILS (Right)
    // =========================================================================
    let billY = titleY + 10;
    const detailsStartY = billY;

    // Left: Customer / Delivery Destination
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...colors.slate900);
    doc.text("Deliver To Customer", leftX, billY);
    billY += 5;

    doc.text(`M/S: ${customer.name || "-"}`, leftX, billY);
    billY += 4.8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(...colors.slate700);

    if (customer.address) {
        const addrLines = doc.splitTextToSize(`Address: ${customer.address} (${customer.zone?.name || "N/A"})`, 100);
        doc.text(addrLines, leftX, billY);
        billY += addrLines.length * 4.5;
    }
    if (customer.phone) {
        doc.text(`Contact: ${customer.phone}`, leftX, billY);
        billY += 4.5;
    }

    // Right: Gate Pass & Driver Meta
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...colors.slate900);
    doc.text("Dispatch Details", rightColX, detailsStartY, { align: "right" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(...colors.slate700);

    doc.text(`Order Code: #${orderCode}`, rightColX, detailsStartY + 5, { align: "right" });
    doc.text(`Date: ${formatDateDMY(order.createdAt || Date.now())}`, rightColX, detailsStartY + 10, { align: "right" });

    let rightMetaY = detailsStartY + 15;
    if (isThirdParty) {
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...colors.primary);
        doc.text("3rd Party Transporter", rightColX, rightMetaY, { align: "right" });
        rightMetaY += 4.5;

        doc.setFont("helvetica", "normal");
        doc.setTextColor(...colors.slate700);
        doc.text(`Driver: ${externalDelivery.driverName}`, rightColX, rightMetaY, { align: "right" });
        rightMetaY += 4.5;
        doc.text(`Phone: ${externalDelivery.driverPhone || "-"}`, rightColX, rightMetaY, { align: "right" });
        rightMetaY += 4.5;
        if (externalDelivery.vehiclePlate) {
            doc.text(`Vehicle: ${externalDelivery.vehiclePlate}`, rightColX, rightMetaY, { align: "right" });
            rightMetaY += 4.5;
        }
    } else if (rider) {
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...colors.primary);
        doc.text("Branch Rider Delivery", rightColX, rightMetaY, { align: "right" });
        rightMetaY += 4.5;

        doc.setFont("helvetica", "normal");
        doc.setTextColor(...colors.slate700);
        doc.text(`Rider Name: ${rider.name}`, rightColX, rightMetaY, { align: "right" });
        rightMetaY += 4.5;
        doc.text(`Phone: ${rider.phone || "-"}`, rightColX, rightMetaY, { align: "right" });
        rightMetaY += 4.5;
    } else {
        doc.text(`Dispatch Type: Walk-In / Counter`, rightColX, rightMetaY, { align: "right" });
        rightMetaY += 4.5;
    }

    // =========================================================================
    // 4. LINE ITEMS TABLE (Products & Dispatched Quantities)
    // =========================================================================
    const tableStartY = Math.max(billY + 4, rightMetaY + 4);

    const totalQty = items.reduce((sum: number, item: any) => {
        const qty = (item.paidQuantity ?? 0) + (item.freeQuantity ?? 0) || item.quantity || 0;
        return sum + Number(qty);
    }, 0);

    const tableBody: any[] = items.map((item: any, idx: number) => {
        const paidQty = item.paidQuantity ?? item.quantity ?? 0;
        const freeQty = item.freeQuantity ?? 0;
        const combinedQty = paidQty + freeQty;
        const productName = item.product?.name || item.name || "Product";

        return [
            String(idx + 1),
            productName,
            String(paidQty),
            String(freeQty > 0 ? `+${freeQty} FOC` : "-"),
            String(combinedQty),
        ];
    });

    // Total Row
    tableBody.push([
        "",
        { content: "Total Dispatched Units", styles: { fontStyle: "bold" } },
        "",
        "",
        { content: String(totalQty), styles: { fontStyle: "bold", halign: "right" } },
    ]);

    autoTable(doc, {
        startY: tableStartY,
        margin: { left: 14, right: 14 },
        head: [["#", "Item Description / Product", "Paid Qty", "Free (FOC)", "Total Dispatched"]],
        body: tableBody,
        theme: "grid",
        headStyles: {
            fillColor: colors.primary,
            textColor: [255, 255, 255],
            fontStyle: "bold",
            fontSize: 9.5,
            cellPadding: 3,
        },
        bodyStyles: {
            textColor: colors.slate900,
            fontSize: 9.5,
            cellPadding: 3,
            lineColor: colors.slate200,
            lineWidth: 0.2,
        },
        columnStyles: {
            0: { cellWidth: 12, halign: "left" },
            1: { cellWidth: "auto", halign: "left" },
            2: { cellWidth: 26, halign: "center" },
            3: { cellWidth: 28, halign: "center" },
            4: { cellWidth: 36, halign: "right" },
        },
    });

    // =========================================================================
    // 5. CONTAINER / RETURNABLE ASSET SUMMARY BOX
    // =========================================================================
    let finalY = (doc as any).lastAutoTable.finalY + 8;

    if (assetExchanges.length > 0) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(...colors.slate900);
        doc.text("Container & Returnable Asset Log", leftX, finalY);
        finalY += 5;

        const assetBody = assetExchanges.map((ex: any) => [
            "Returnable Bottles / Containers",
            String(ex.outboundQuantity || 0),
            String(ex.inboundQuantity || 0),
            String((ex.outboundQuantity || 0) - (ex.inboundQuantity || 0)),
        ]);

        autoTable(doc, {
            startY: finalY,
            margin: { left: 14, right: 14 },
            head: [["Asset Type", "Outbound Issued", "Inbound Received (Empties)", "Net Balance Deficit"]],
            body: assetBody,
            theme: "grid",
            headStyles: {
                fillColor: colors.slate700,
                textColor: [255, 255, 255],
                fontSize: 9,
                cellPadding: 2.5,
            },
            bodyStyles: {
                fontSize: 9,
                cellPadding: 2.5,
            },
        });

        finalY = (doc as any).lastAutoTable.finalY + 10;
    } else {
        finalY += 6;
    }

    // =========================================================================
    // 6. CHECKLIST & REMARKS BOX
    // =========================================================================
    doc.setDrawColor(...colors.slate200 ? colors.slate200 : colors.slate500);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(14, finalY, 182, 22, 2, 2, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...colors.slate900);
    doc.text("Gate Security / Dispatch Instructions:", 18, finalY + 6);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(...colors.slate700);
    doc.text("1. Verify physical stock count against gate pass quantities before vehicle departure.", 18, finalY + 11);
    doc.text("2. Ensure empty bottle returns/deficits are duly acknowledged by the driver/customer.", 18, finalY + 16);

    finalY += 30;

    // =========================================================================
    // 7. DUAL SIGNATURE SECTION (Driver Sign & Manager Sign)
    // =========================================================================
    if (finalY > 245) {
        doc.addPage();
        finalY = 40;
    }

    // Left Signature: Driver / Transporter
    doc.setDrawColor(...colors.slate500);
    doc.setLineWidth(0.3);
    doc.line(14, finalY + 12, 85, finalY + 12);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(...colors.slate900);
    doc.text("Driver / Transporter Signature", 14, finalY + 17);

    // Right Signature: Authorized Branch Manager
    doc.line(125, finalY + 12, 196, finalY + 12);
    doc.text("Authorized Manager / Dispatcher", 196, finalY + 17, { align: "right" });

    // =========================================================================
    // 8. PAGE FOOTER
    // =========================================================================
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        const pageHeight = doc.internal.pageSize.height;

        doc.setFont("helvetica", "italic");
        doc.setFontSize(8);
        doc.setTextColor(...colors.slate500);

        doc.text(`Gate Pass • Generated via Droply System • ${new Date().toLocaleString()}`, 14, pageHeight - 10);
        doc.text(`Page ${i} of ${pageCount}`, 196, pageHeight - 10, { align: "right" });
    }

    // Save PDF
    const fileName = `GatePass_${orderCode}_${formatDateDMY(order.createdAt || Date.now())}.pdf`;
    doc.save(fileName);
};