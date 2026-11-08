/* eslint-disable @typescript-eslint/no-explicit-any */
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { PurchaseReturn } from "@/features/supply/returns/types/returns";
import { BranchSettingData } from "@/features/admin/settings/types/settings";
import { getBase64ImageFromUrl } from "./getBase64Image";
import { formatPhoneNumber } from "react-phone-number-input";
import { toWords } from "number-to-words";

export const generateReturnPdf = async (
    returnRecord: PurchaseReturn & {
        supplier?: Record<string, any>;
    },
    branch?: BranchSettingData & Record<string, any>
) => {
    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
    });

    const docTitle = "Purchase Return (Debit Note)";

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
        primary: [3, 105, 161] as [number, number, number],      // Deep Sky/Navy Header
        brandAccent: [2, 132, 199] as [number, number, number],  // Sky 600
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
            doc.addImage(base64Logo, "PNG", 170, 15, 20, 18);
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
    // 3. ISSUED TO (Full Supplier Details) & RETURN DETAILS
    // =========================================================================
    let billY = titleY + 10;
    const detailsStartY = billY;

    // Left: Issued To (Supplier)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...colors.slate900);
    doc.text("Issued To (Supplier)", leftX, billY);
    billY += 5;

    doc.text(`MS: ${returnRecord.supplier?.firmName || "Unknown Supplier"}`, leftX, billY);
    billY += 4.8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(...colors.slate700);

    const contactPerson = returnRecord.supplier?.name || returnRecord.supplier?.supplierName;
    if (contactPerson) {
        doc.text(`Contact Person: ${contactPerson}`, leftX, billY);
        billY += 4.5;
    }
    if (returnRecord.supplier?.ntn) {
        doc.text(`NTN No.${returnRecord.supplier.ntn}`, leftX, billY);
        billY += 4.5;
    }
    if (returnRecord.supplier?.strn) {
        doc.text(`STRN No.${returnRecord.supplier.strn}`, leftX, billY);
        billY += 4.5;
    }
    if (returnRecord.supplier?.address) {
        const supplierAddr = `${returnRecord.supplier.address}${returnRecord.supplier.city ? `, ${returnRecord.supplier.city}` : ""
            }`;
        const addrLines = doc.splitTextToSize(supplierAddr, 110);
        doc.text(addrLines, leftX, billY);
        billY += addrLines.length * 4.5;
    }
    if (returnRecord.supplier?.phone) {
        const supplierPhone =
            formatPhoneNumber(returnRecord.supplier.phone) || returnRecord.supplier.phone;
        doc.text(`Contact No.: ${supplierPhone}`, leftX, billY);
        billY += 4.5;
    }
    if (returnRecord.supplier?.email) {
        doc.text(`Email: ${returnRecord.supplier.email}`, leftX, billY);
        billY += 4.5;
    }

    // Right: Return Details
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...colors.slate900);
    doc.text("Return Details", rightColX, detailsStartY, { align: "right" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(...colors.slate700);
    doc.text(
        `Debit Note No.: ${returnRecord.debitNoteNumber}`,
        rightColX,
        detailsStartY + 5,
        { align: "right" }
    );
    doc.text(
        `Original PO: ${returnRecord.purchaseOrder?.poNumber || "N/A"}`,
        rightColX,
        detailsStartY + 10,
        { align: "right" }
    );
    doc.text(
        `Return Date: ${formatDateDMY(returnRecord.returnDate)}`,
        rightColX,
        detailsStartY + 15,
        { align: "right" }
    );

    const statusText = (returnRecord.status || "PENDING").replace(/_/g, " ");
    doc.text(
        `Status: ${statusText}`,
        rightColX,
        detailsStartY + 20,
        { align: "right" }
    );

    // =========================================================================
    // 4. LINE ITEMS TABLE
    // =========================================================================
    const tableStartY = Math.max(billY + 4, detailsStartY + 26);
    const items = returnRecord.items || [];

    const totalQty = items.reduce(
        (sum, item) => sum + Number(item.quantityReturned || 0),
        0
    );
    const totalReturnVal = Number(returnRecord.totalValue || 0);

    const tableBody: any[] = items.map((item, idx) => [
        String(idx + 1),
        item.branchProduct?.name || "Unknown Product",
        item.supplierItemName || "-",
        String(item.quantityReturned),
        formatCurrency(item.unitCost),
        formatCurrency(item.quantityReturned * item.unitCost),
    ]);

    // Bottom Total Row
    tableBody.push([
        "",
        { content: "Total", styles: { fontStyle: "bold" } },
        "",
        { content: String(totalQty), styles: { fontStyle: "bold", halign: "right" } },
        "",
        { content: formatCurrency(totalReturnVal), styles: { fontStyle: "bold", halign: "right" } },
    ]);

    autoTable(doc, {
        startY: tableStartY,
        margin: { left: 14, right: 14 },
        head: [["#", "Inventory Product", "Supplier Ref", "Return Qty", "Unit Cost", "Total Value"]],
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
            0: { cellWidth: 10, halign: "left" },
            1: { cellWidth: "auto", halign: "left" },
            2: { cellWidth: 35, halign: "left" },
            3: { cellWidth: 24, halign: "right" },
            4: { cellWidth: 32, halign: "right" },
            5: { cellWidth: 35, halign: "right" },
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

    // Left: Return Value in Words
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...colors.slate900);
    doc.text("Return Value In Words", leftX, bottomLeftY);
    bottomLeftY += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(...colors.slate700);
    const amountWords = toWords(totalReturnVal).toUpperCase();
    const wordLines = doc.splitTextToSize(amountWords, 95);
    doc.text(wordLines, leftX, bottomLeftY);
    bottomLeftY += wordLines.length * 4.5 + 5;

    // Left: Notes / Reason
    if (returnRecord.notes) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(...colors.slate900);
        doc.text("Notes / Return Reason", leftX, bottomLeftY);
        bottomLeftY += 5;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9.5);
        doc.setTextColor(...colors.slate700);
        const noteLines = doc.splitTextToSize(returnRecord.notes, 95);
        doc.text(noteLines, leftX, bottomLeftY);
        bottomLeftY += noteLines.length * 4.5 + 4;
    }

    // Right: Financial Summary Box
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

    const creditRecovered = Number(returnRecord.creditRecovered || 0);
    const totalReplacedUnits = items.reduce(
        (sum, item) => sum + Number((item as any).quantityReplaced || 0),
        0
    );
    const totalRejectedUnits = items.reduce(
        (sum, item) => sum + Number((item as any).quantityRejected || 0),
        0
    );
    const remainingToResolve = Math.max(0, totalReturnVal - creditRecovered);

    drawSummaryRow("Total Return Value", formatCurrency(totalReturnVal), {
        isBold: true,
        isHighlighted: true,
    });
    drawSummaryRow("Credit Recovered", formatCurrency(creditRecovered));
    if (totalReplacedUnits > 0) {
        drawSummaryRow("Units Replaced", `${totalReplacedUnits} Units`);
    }
    if (totalRejectedUnits > 0) {
        drawSummaryRow("Units Rejected", `${totalRejectedUnits} Units`);
    }
    drawSummaryRow("Value to Resolve", formatCurrency(remainingToResolve), {
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

        doc.text(
            `Generated by Droply System • ${new Date().toLocaleString()}`,
            14,
            pageHeight - 10
        );
        doc.text(`Page ${i} of ${pageCount}`, 196, pageHeight - 10, {
            align: "right",
        });
    }

    doc.save(`Return_${returnRecord.debitNoteNumber}.pdf`);
};