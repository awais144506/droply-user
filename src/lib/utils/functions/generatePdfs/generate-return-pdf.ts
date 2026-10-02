/* eslint-disable @typescript-eslint/no-explicit-any */
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { PurchaseReturn } from "@/features/supply/returns/types/returns";
import { BranchSettingData } from "@/features/admin/settings/types/settings";
import { formatCurrency } from "@/lib/utils/functions/setFormat";
import { getBase64ImageFromUrl } from "./getBase64Image";
import { formatPhoneNumber } from "react-phone-number-input";

const colors = {
    primary: [2, 132, 199] as [number, number, number],
    slate900: [15, 23, 42] as [number, number, number],
    slate500: [100, 116, 139] as [number, number, number],
    slate200: [226, 232, 240] as [number, number, number],
    sky50: [240, 249, 255] as [number, number, number],
    emerald600: [5, 150, 105] as [number, number, number],
    rose50: [255, 241, 242] as [number, number, number],
    rose600: [225, 29, 72] as [number, number, number],
    amber600: [217, 119, 6] as [number, number, number],
};

export const generateReturnPdf = async (returnRecord: PurchaseReturn, branch?: BranchSettingData) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;


    let textStartX = 14;

    if (branch?.logoUrl) {
        try {
            const base64Logo = await getBase64ImageFromUrl(branch.logoUrl);
            doc.addImage(base64Logo, 'PNG', 14, 15, 20, 18);
            textStartX = 40;
        } catch (error) {
            console.warn("Failed to load logo", error);
        }
    }

    // Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.setTextColor(...colors.primary);
    doc.text((branch?.displayName?.toUpperCase() || ""), textStartX, 22);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...colors.slate500);
    doc.text((branch?.displayAddress || ""), textStartX, 29);
    doc.text(`Phone: ${formatPhoneNumber(branch?.displayPhone || "")}`, textStartX, 34);
    doc.text(`Email: ${branch?.displayEmail || ""}`, textStartX, 39);

    // Document Title
  doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(...colors.slate900);
    doc.text("PURCHASE RETURN", 196, 25, { align: "right" });

    // --- 2. META DATA & SUPPLIER SECTION ---
    doc.setDrawColor(...colors.slate200);
    doc.line(14, 38, pageWidth - 14, 38);

    const startY = 46;

    // Supplier (Left)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...colors.slate900);
    doc.text("ISSUED TO (SUPPLIER):", 14, startY);

    doc.setFontSize(11);
    doc.text(returnRecord.supplier?.firmName || "Unknown Supplier", 14, startY + 6);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...colors.slate500);
    doc.text(`Attn: ${returnRecord.supplier?.supplierName || "N/A"}`, 14, startY + 11);
    doc.text(`Phone: ${returnRecord.supplier?.phone || "N/A"}`, 14, startY + 16);

    // Document Details (Right)
    const rightColX = pageWidth - 60;

    doc.setFont("helvetica", "bold");
    doc.setTextColor(...colors.slate900);
    doc.text("Debit Note #:", rightColX, startY);
    doc.text("Date:", rightColX, startY + 6);
    doc.text("Status:", rightColX, startY + 12);
    doc.text("Original PO:", rightColX, startY + 18);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(...colors.slate500);
    doc.text(returnRecord.debitNoteNumber, pageWidth - 14, startY, { align: "right" });
    doc.text(format(new Date(returnRecord.returnDate), "MMM dd, yyyy"), pageWidth - 14, startY + 6, { align: "right" });

    // Status formatting
    const statusText = returnRecord.status.replace("_", " ");
    let statusColor = colors.slate500;
    if (returnRecord.status === "PENDING_RESOLUTION") statusColor = colors.amber600;
    if (returnRecord.status === "CREDIT_APPLIED" || returnRecord.status === "REPLACED") statusColor = colors.emerald600;

    doc.setTextColor(...statusColor);
    doc.setFont("helvetica", "bold");
    doc.text(statusText, pageWidth - 14, startY + 12, { align: "right" });

    doc.setFont("helvetica", "normal");
    doc.setTextColor(...colors.slate500);
    doc.text(returnRecord.purchaseOrder?.poNumber || "N/A", pageWidth - 14, startY + 18, { align: "right" });

    // --- 3. ITEMS TABLE ---
    const tableData = returnRecord.items.map((item, index) => [
        index + 1,
        item.branchProduct?.name || "Unknown Product",
        item.supplierItemName || "-",
        item.quantityReturned.toString(),
        `Rs ${formatCurrency(item.unitCost)}`,
        `Rs ${formatCurrency(item.quantityReturned * item.unitCost)}`
    ]);

    autoTable(doc, {
        startY: startY + 28,
        head: [['#', 'Inventory Product', 'Supplier Ref', 'Return Qty', 'Unit Cost', 'Total Value']],
        body: tableData,
        theme: 'grid',
        headStyles: {
            fillColor: colors.slate900,
            textColor: 255,
            fontSize: 9,
            fontStyle: 'bold',
            halign: 'center',
        },
        bodyStyles: {
            fontSize: 9,
            textColor: colors.slate900,
        },
        columnStyles: {
            0: { halign: 'center', cellWidth: 10 },
            1: { halign: 'left' },
            2: { halign: 'left' },
            3: { halign: 'center', cellWidth: 25 },
            4: { halign: 'right', cellWidth: 30 },
            5: { halign: 'right', cellWidth: 35 },
        },
        alternateRowStyles: {
            fillColor: colors.slate200,
        },
    });

    // --- 4. FINANCIAL SUMMARY ---
    // @ts-expect-error - autoTable adds finalY to doc
    const finalY = doc.lastAutoTable.finalY + 10;
    const labelX = pageWidth - 60;
    const valueX = pageWidth - 14;

    const remainingToResolve = returnRecord.totalValue - (returnRecord.creditRecovered || 0);

    doc.setFontSize(10);
    doc.setTextColor(...colors.slate500);
    doc.text("Total Return Value:", labelX, finalY, { align: "right" });
    doc.text("Credit Recovered:", labelX, finalY + 7, { align: "right" });

    doc.setFont("helvetica", "bold");
    doc.setTextColor(...colors.slate900);
    doc.text(`Rs ${formatCurrency(returnRecord.totalValue)}`, valueX, finalY, { align: "right" });

    doc.setTextColor(...colors.emerald600);
    doc.text(`- Rs ${formatCurrency(returnRecord.creditRecovered || 0)}`, valueX, finalY + 7, { align: "right" });

    // Highlight box for the final remaining balance
    doc.setFillColor(...colors.rose50);
    doc.roundedRect(pageWidth - 75, finalY + 12, 61, 10, 1, 1, "F");

    doc.setFontSize(11);
    doc.setTextColor(...colors.rose600);
    doc.text("Value to Resolve:", labelX, finalY + 19, { align: "right" });
    doc.text(`Rs ${formatCurrency(remainingToResolve)}`, valueX, finalY + 19, { align: "right" });

    // --- 5. NOTES & FOOTER ---
    if (returnRecord.notes) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(...colors.slate900);
        doc.text("Notes / Reason:", 14, finalY);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(...colors.slate500);

        const splitNotes = doc.splitTextToSize(returnRecord.notes, 120);
        doc.text(splitNotes, 14, finalY + 5);
    }

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

    // --- 6. SAVE/OPEN ---
    doc.save(`${returnRecord.debitNoteNumber}.pdf`);
};