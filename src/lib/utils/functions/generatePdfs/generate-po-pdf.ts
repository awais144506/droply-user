/* eslint-disable @typescript-eslint/no-explicit-any */
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { PurchaseOrder } from "@/features/supply/order/types/po";
import { BranchSettingData } from "@/features/admin/settings/types/settings";
import { formatPhoneNumber } from "react-phone-number-input";
import { getBase64ImageFromUrl } from "./getBase64Image";
import { toWords } from "number-to-words";

export const generatePOPdf = async (
    po: PurchaseOrder,
    branch?: BranchSettingData & Record<string, any>
) => {
    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
    });

    const docTitle = "Purchase Order";

    const formatCurrency = (val: number) =>
        `Rs ${Number(val || 0).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;

    const formatDateDMY = (dateStr: string | Date) => {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return "N/A";
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const colors = {
        primary: [3, 105, 161] as [number, number, number],
        brandAccent: [2, 132, 199] as [number, number, number],
        slate900: [15, 23, 42] as [number, number, number],
        slate700: [51, 65, 85] as [number, number, number],
        slate500: [100, 116, 139] as [number, number, number],
        slate200: [226, 232, 240] as [number, number, number],
        slate100: [241, 245, 249] as [number, number, number],
    };

    const companyName = branch?.name || branch?.displayName || "Company Name";
    const companyNtn = branch?.ntn || branch?.displayNtn || "";
    const companyStrn = branch?.strn || branch?.displayStrn || "";
    const companyAddress = branch?.address || branch?.displayAddress || "";
    const companyPhone = branch?.phone || branch?.displayPhone || "";
    const companyEmail = branch?.email || branch?.displayEmail || "";

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
    if (companyPhone) {
        const formattedPhone = formatPhoneNumber(companyPhone) || companyPhone;
        doc.text(`Phone no.: ${formattedPhone}`, leftX, leftY);
        leftY += 4.5;
    }
    if (companyEmail) {
        doc.text(`Email: ${companyEmail}`, leftX, leftY);
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
    // 2. CENTER TITLE & DIVIDER
    // =========================================================================
    const titleY = Math.max(leftY + 6, 52);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(...colors.primary);
    doc.text(docTitle, 105, titleY, { align: "center" });

    doc.setDrawColor(...colors.slate200);
    doc.setLineWidth(0.4);
    doc.line(14, titleY + 3, 196, titleY + 3);

    // =========================================================================
    // 3. ISSUED TO (Full Supplier Details) & PO DETAILS
    // =========================================================================
    let billY = titleY + 10;
    const detailsStartY = billY;

    // Left: Issued To (Supplier)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...colors.slate900);
    doc.text("Issued To", leftX, billY);
    billY += 5;

    doc.text(`MS: ${po.supplier?.firmName || "Unknown Supplier"}`, leftX, billY);
    billY += 4.8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(...colors.slate700);

    if (po.supplier?.ntn) {
        doc.text(`NTN No: ${po.supplier.ntn}`, leftX, billY);
        billY += 4.5;
    }
    if (po.supplier?.strn) {
        doc.text(`STRN No: ${po.supplier.strn}`, leftX, billY);
        billY += 4.5;
    }
    if (po.supplier?.address) {
        const supplierAddr = `${po.supplier.address}${po.supplier.city ? `, ${po.supplier.city}` : ""}`;
        const addrLines = doc.splitTextToSize(supplierAddr, 110);
        doc.text(addrLines, leftX, billY);
        billY += addrLines.length * 4.5;
    }
    if (po.supplier?.phone) {
        const supplierPhone = formatPhoneNumber(po.supplier.phone) || po.supplier.phone;
        doc.text(`Contact No: ${supplierPhone}`, leftX, billY);
        billY += 4.5;
    }
    if (po.supplier?.email) {
        doc.text(`Email: ${po.supplier.email}`, leftX, billY);
        billY += 4.5;
    }

    // Right: PO Details
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...colors.slate900);
    doc.text("Order Details", rightColX, detailsStartY, { align: "right" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(...colors.slate700);
    doc.text(`PO Number: ${po.poNumber}`, rightColX, detailsStartY + 5, { align: "right" });
    doc.text(`Date Issued: ${formatDateDMY(po.orderDate)}`, rightColX, detailsStartY + 10, { align: "right" });

    // =========================================================================
    // 4. LINE ITEMS TABLE
    // =========================================================================
    const tableStartY = Math.max(billY + 4, detailsStartY + 22);
    const items = po.items || [];

    const totalQty = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
    const subTotal = Number(po.subTotal || po.totalAmount || 0);

    const tableBody: any[] = items.map((item, idx) => [
        String(idx + 1),
        item.supplierItemName || item.branchProduct?.name || "Item",
        String(item.quantity),
        formatCurrency(item.unitCost),
        formatCurrency(item.total || item.quantity * item.unitCost),
    ]);

    tableBody.push([
        "",
        { content: "Total", styles: { fontStyle: "bold" } },
        { content: String(totalQty), styles: { fontStyle: "bold", halign: "right" } },
        "",
        { content: formatCurrency(subTotal), styles: { fontStyle: "bold", halign: "right" } },
    ]);

    autoTable(doc, {
        startY: tableStartY,
        margin: { left: 14, right: 14 },
        head: [["#", "Item Description", "Quantity", "Unit Cost", "Total Amount"]],
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
            2: { cellWidth: 24, halign: "right" },
            3: { cellWidth: 36, halign: "right" },
            4: { cellWidth: 38, halign: "right" },
        },
    });

    // =========================================================================
    // 5. BOTTOM SECTION: Amount in Words, Notes & Financial Summary Box
    // =========================================================================
    let finalY = (doc as any).lastAutoTable.finalY + 8;

    if (finalY > 230) {
        doc.addPage();
        finalY = 20;
    }

    let bottomLeftY = finalY;

    // Amount in Words
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...colors.slate900);
    doc.text("Order Amount In Words", leftX, bottomLeftY);
    bottomLeftY += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(...colors.slate700);
    const amountWords = toWords(po.totalAmount).toUpperCase();
    const wordLines = doc.splitTextToSize(amountWords, 95);
    doc.text(wordLines, leftX, bottomLeftY);
    bottomLeftY += wordLines.length * 4.5 + 5;

    // Notes & Instructions
    if (po.notes) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(...colors.slate900);
        doc.text("Notes & Instructions", leftX, bottomLeftY);
        bottomLeftY += 5;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9.5);
        doc.setTextColor(...colors.slate700);
        const noteLines = doc.splitTextToSize(po.notes, 95);
        doc.text(noteLines, leftX, bottomLeftY);
        bottomLeftY += noteLines.length * 4.5 + 4;
    }

    // Right: Financial Summary
    let summaryY = finalY;
    const summaryLabelX = 120;
    const summaryValX = 196;

    const drawSummaryRow = (
        label: string,
        val: string,
        options?: { isBold?: boolean; isHighlighted?: boolean }
    ) => {
        if (options?.isHighlighted) {
            doc.setFillColor(...colors.primary);
            doc.rect(summaryLabelX - 2, summaryY - 4.2, 78, 6.5, "F");
        }
        doc.setFont("helvetica", options?.isBold ? "bold" : "normal");
        doc.setFontSize(9.5);
        if (options?.isHighlighted) {
            doc.setTextColor(...colors.slate100);
        } else {
            doc.setTextColor(...colors.slate900);
        }
        doc.text(label, summaryLabelX, summaryY);
        doc.text(val, summaryValX, summaryY, { align: "right" });
        summaryY += 6.5;
    };

    drawSummaryRow("Order Total", formatCurrency(po.totalAmount), {
        isBold: true,
        isHighlighted: true,
    });
    drawSummaryRow("Initial Advance", formatCurrency(po.advancePaid || 0));

    const historicalBalance = po.totalAmount - (po.advancePaid || 0);
    drawSummaryRow("Balance at Order", formatCurrency(historicalBalance), {
        isBold: true,
    });

    // =========================================================================
    // 6. AUTHORIZED SIGNATORY FOOTER
    // =========================================================================
    let sigY = Math.max(bottomLeftY, summaryY) + 12;

    // If signature block would cross the bottom page margin, push it to a new page
    if (sigY > 265) {
        doc.addPage();
        sigY = 40;
    }

    doc.setDrawColor(...colors.slate500);
    doc.setLineWidth(0.3);
    doc.line(145, sigY + 12, rightColX, sigY + 12);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...colors.slate900);
    doc.text("Authorized Signatory", rightColX, sigY + 17, { align: "right" });

    // Pagination Footer
    const pageCount = (doc as any).internal.getNumberOfPages();

    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        const pageHeight = doc.internal.pageSize.height;

        doc.setFont("helvetica", "italic");
        doc.setFontSize(8);
        doc.setTextColor(...colors.slate500);

        doc.text(`Generated by Droply System • ${new Date().toLocaleString()}`, 14, pageHeight - 10);
        doc.text(`Page ${i} of ${pageCount}`, 196, pageHeight - 10, { align: "right" });
    }

    doc.save(`${po.poNumber}-Purchase-Order.pdf`);
};