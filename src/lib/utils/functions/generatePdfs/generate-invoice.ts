/* eslint-disable @typescript-eslint/no-explicit-any */
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { BillingDocument } from "@/features/sales/invoices/types/quotation";
import { BranchSettingData } from "@/features/admin/settings/types/settings";
import { formatPhoneNumber } from "react-phone-number-input";
import { getBase64ImageFromUrl } from "./getBase64Image";
import { toWords } from "number-to-words";

export const generateInvoicePdf = async (
    billingDoc: BillingDocument,
    branch?: BranchSettingData & Record<string, any>
) => {
    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
    });

    const isInvoice = billingDoc.type === "INVOICE";
    const docTitle = isInvoice ? "Invoice" : "Quotation";

    // Formatting helpers matching your PDF: "Rs 5,75,000.00" and "29-12-2025"
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
        primary: [3, 105, 161] as [number, number, number],       // Deep Charcoal / Navy header
        brandAccent: [2, 132, 199] as [number, number, number],  // Sky 600
        slate900: [15, 23, 42] as [number, number, number],
        slate700: [51, 65, 85] as [number, number, number],
        slate500: [100, 116, 139] as [number, number, number],
        slate200: [226, 232, 240] as [number, number, number],
        slate100: [241, 245, 249] as [number, number, number],
    };

    // Safely resolve branch fields (supports both raw API fields and display* fields)
    const companyName = branch?.name || branch?.displayName || "Company Name";
    const companyNtn = branch?.ntn || branch?.displayNtn || "";
    const companyStrn = branch?.strn || branch?.displayStrn || "";
    const companyAddress = branch?.address || branch?.displayAddress || "";
    const companyPhone = branch?.phone || branch?.displayPhone || "";
    const companyEmail = branch?.email || branch?.displayEmail || "";

    // =========================================================================
    // 1. TOP HEADER: Company Details (Left) & Logo / Brand Box (Right)
    // =========================================================================
    let leftY = 18;
    const leftX = 14;
    const rightColX = 196;

    // Company Name (Bold, Wrapped if long)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(...colors.slate900);
    const companyNameLines = doc.splitTextToSize(companyName, 115);
    doc.text(companyNameLines, leftX, leftY);
    leftY += companyNameLines.length * 5.5;

    // Company NTN, STRN, Address, Phone, Email
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
        doc.text(`Phone No: ${formattedPhone}`, leftX, leftY);
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
    // 2. CENTER TITLE ("Invoice" or "Quotation") & DIVIDER
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
    // 3. BILL TO (Left) & INVOICE DETAILS (Right)
    // =========================================================================
    let billY = titleY + 10;
    const detailsStartY = billY;

    // Left: Bill To
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...colors.slate900);
    doc.text("Bill To", leftX, billY);
    billY += 5;

    doc.text(`MS: ${billingDoc.partyName || "-"}`, leftX, billY);
    billY += 4.8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(...colors.slate700);

    if (billingDoc.partyNtn) {
        doc.text(`NTN No.${billingDoc.partyNtn}`, leftX, billY);
        billY += 4.5;
    }
    if (billingDoc.partyStrn) {
        doc.text(`STRN No.${billingDoc.partyStrn}`, leftX, billY);
        billY += 4.5;
    }
    if (billingDoc.partyAddress) {
        const partyAddrLines = doc.splitTextToSize(billingDoc.partyAddress, 110);
        doc.text(partyAddrLines, leftX, billY);
        billY += partyAddrLines.length * 4.5;
    }
    if (billingDoc.partyPhone) {
        doc.text(`Contact No.: ${billingDoc.partyPhone}`, leftX, billY);
        billY += 4.5;
    }
    if (billingDoc.partyEmail) {
        doc.text(`Email: ${billingDoc.partyEmail}`, leftX, billY);
        billY += 4.5;
    }

    // Right: Invoice / Quotation Details
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...colors.slate900);
    doc.text(`${docTitle} Details`, rightColX, detailsStartY, { align: "right" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(...colors.slate700);
    doc.text(
        `${docTitle} No.: ${billingDoc.documentNumber}`,
        rightColX,
        detailsStartY + 5,
        { align: "right" }
    );
    doc.text(
        `Date: ${formatDateDMY(billingDoc.issueDate)}`,
        rightColX,
        detailsStartY + 10,
        { align: "right" }
    );

    // =========================================================================
    // 4. LINE ITEMS TABLE (#, Item name, Quantity, Price/ unit, Amount)
    // =========================================================================
    const tableStartY = Math.max(billY + 4, detailsStartY + 18);
    const items = billingDoc.items || [];

    const totalQty = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
    const subTotal = Number(billingDoc.subTotal || 0);

    const tableBody: any[] = items.map((item, idx) => [
        String(idx + 1),
        item.unitOfMeasure
            ? `${item.itemName} (${item.unitOfMeasure})`
            : item.itemName,
        String(item.quantity),
        formatCurrency(item.unitPrice),
        formatCurrency(item.amount),
    ]);

    // Bottom "Total" row inside table matching your PDF
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
        head: [["#", "Item name", "Quantity", "Price/ unit", "Amount"]],
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
    // 5. BOTTOM SECTION: Amount In Words & Terms (Left) + Totals Box (Right)
    // =========================================================================
    let finalY = (doc as any).lastAutoTable.finalY + 8;

    // Prevent page overflow if table is very long
    if (finalY > 230) {
        doc.addPage();
        finalY = 20;
    }

    let bottomLeftY = finalY;

    // Left: Invoice Amount In Words
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...colors.slate900);
    doc.text(`${docTitle} Amount In Words`, leftX, bottomLeftY);
    bottomLeftY += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(...colors.slate700);
    const amountWords = toWords(billingDoc.totalAmount).toUpperCase();
    const wordLines = doc.splitTextToSize(amountWords, 95);
    doc.text(wordLines, leftX, bottomLeftY);
    bottomLeftY += wordLines.length * 4.5 + 5;

    // Left: Terms And Conditions
    if (billingDoc.termsAndConditions) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(...colors.slate900);
        doc.text("Terms And Conditions", leftX, bottomLeftY);
        bottomLeftY += 5;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9.5);
        doc.setTextColor(...colors.slate700);
        const termLines = doc.splitTextToSize(billingDoc.termsAndConditions, 95);
        doc.text(termLines, leftX, bottomLeftY);
        bottomLeftY += termLines.length * 4.5 + 4;
    }

    // Optional Notes
    if (billingDoc.notes) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.setTextColor(...colors.slate900);
        doc.text("Notes:", leftX, bottomLeftY);
        bottomLeftY += 4.5;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(...colors.slate700);
        const noteLines = doc.splitTextToSize(billingDoc.notes, 95);
        doc.text(noteLines, leftX, bottomLeftY);
        bottomLeftY += noteLines.length * 4.5;
    }

    // Right: Financial Summary (Sub Total, GST, Discount, Total, Received, Balance)
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

    drawSummaryRow("Sub Total", formatCurrency(billingDoc.subTotal));

    if (Number(billingDoc.gstPercent || 0) > 0 || Number(billingDoc.gstAmount || 0) > 0) {
        drawSummaryRow(
            `GST@${Number(billingDoc.gstPercent || 0).toFixed(1)}%`,
            formatCurrency(billingDoc.gstAmount)
        );
    }

    if (Number(billingDoc.discount || 0) > 0) {
        drawSummaryRow("Discount", `- ${formatCurrency(billingDoc.discount)}`);
    }

    drawSummaryRow("Total", formatCurrency(billingDoc.totalAmount), {
        isBold: true,
        isHighlighted: true,
    });
    drawSummaryRow("Received", formatCurrency(billingDoc.advanceAmount || 0));
    drawSummaryRow("Balance", formatCurrency(billingDoc.balanceDue ?? billingDoc.totalAmount), {
        isBold: true,
    });

    // =========================================================================
    // 6. AUTHORIZED SIGNATORY FOOTER (Bottom Right, Matches PDF)
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

    // Save with clean filename e.g. Quotation_DOC-603787794707_13-10-2026.pdf
    const fileName = `${docTitle}_${billingDoc.documentNumber}_${formatDateDMY(
        billingDoc.issueDate
    )}.pdf`;
    doc.save(fileName);
};