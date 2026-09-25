/* eslint-disable @typescript-eslint/no-explicit-any */
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { SupplierPayment } from "@/features/supply/payments/types/payments";
import { BranchSettingData } from "@/features/admin/settings/types/settings";
import { displayPakistaniPhone } from "../setFormat";

const getBase64ImageFromUrl = async (imageUrl: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.drawImage(img, 0, 0);
                resolve(canvas.toDataURL("image/png"));
            } else {
                reject(new Error("Failed to get canvas context"));
            }
        };
        img.onerror = (error) => reject(error);
        img.src = imageUrl;
    });
};

export const generatePaymentPdf = async (payment: SupplierPayment & { purchaseOrder?: { supplierPayments?: SupplierPayment[], totalAmount?: number, advancePaid?: number, balanceDue?: number, poNumber?: string } }, branch?: BranchSettingData) => {
    const doc = new jsPDF();

    const formatCurrency = (val: number) => `Rs ${val.toLocaleString("en-PK")}`;
    const formatDate = (date: string | Date) => new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", });

    const colors = {
        primary: [2, 132, 199] as [number, number, number],
        slate900: [15, 23, 42] as [number, number, number],
        slate500: [100, 116, 139] as [number, number, number],
        slate200: [226, 232, 240] as [number, number, number],
        sky50: [240, 249, 255] as [number, number, number],
        emerald600: [5, 150, 105] as [number, number, number],
        rose50: [255, 241, 242] as [number, number, number],
        rose600: [225, 29, 72] as [number, number, number],
    };

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
    doc.text(`Phone: ${displayPakistaniPhone(branch?.displayPhone) || ""}`, textStartX, 34);
    doc.text(`Email: ${branch?.displayEmail || ""}`, textStartX, 39);

    // Document Meta 
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(...colors.slate900);
    doc.text("PAYMENT RECEIPT", 196, 25, { align: "right" });

    doc.setFontSize(10);
    doc.setTextColor(...colors.slate500);
    doc.text(`Receipt No:`, 135, 32);
    doc.text(`PO Reference:`, 135, 37);
    doc.text(`Date Issued:`, 135, 42);
    doc.text(`PO Status:`, 135, 47);

    // We use the PO details here since the receipt acts as a ledger for the PO
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...colors.slate900);
    doc.text(payment.voucherNumber || "N/A", 196, 32, { align: "right" });
    doc.setTextColor(...colors.slate900);
    doc.text(payment.purchaseOrder?.poNumber || "N/A", 196, 37, { align: "right" });
    doc.text(formatDate(payment.paymentDate), 196, 42, { align: "right" });
    doc.setTextColor(...colors.primary);

    // Determine overall PO status rather than just the single payment status
    const poStatus = (payment.purchaseOrder?.balanceDue || 0) <= 0 ? "CLEARED" : "PARTIAL";
    doc.text(poStatus, 196, 47, { align: "right" });

    doc.setDrawColor(...colors.slate200);
    doc.line(14, 50, 196, 50);

    // Vendor Section
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...colors.slate500);
    doc.text("PAID TO:", 14, 58);

    doc.setFontSize(12);
    doc.setTextColor(...colors.slate900);
    doc.text(payment.supplier?.firmName || "Unknown Supplier", 14, 65);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...colors.slate500);
    doc.text(`Contact: ${payment.supplier?.supplierName || "N/A"}`, 14, 70);
    doc.text(`Phone: ${displayPakistaniPhone(payment.supplier?.phone) || "N/A"}`, 14, 75);

    // Dynamic Table Data Mapping (Historical Ledger)
    let tableData: any[][] = [];

    // Check if the backend included the historical payments array
    if (payment.purchaseOrder?.supplierPayments && payment.purchaseOrder.supplierPayments.length > 0) {
        tableData = payment.purchaseOrder.supplierPayments.map((p) => {
            const methodDisplay = p.paymentMethod.replace("_", " ");
            return [
                formatDate(p.paymentDate),
                methodDisplay.charAt(0).toUpperCase() + methodDisplay.slice(1).toLowerCase(),
                p.referenceNote || "-",
                formatCurrency(p.amountPaid),
                formatCurrency(p.balanceDue) // Balance *after* this specific payment
            ];
        });
    } else {
        // Fallback for single payment if the array isn't populated
        const methodDisplay = payment.paymentMethod.replace("_", " ");
        tableData = [
            [
                formatDate(payment.paymentDate),
                methodDisplay.charAt(0).toUpperCase() + methodDisplay.slice(1).toLowerCase(),
                payment.referenceNote || "-",
                formatCurrency(payment.amountPaid),
                formatCurrency(payment.balanceDue)
            ]
        ];
    }

    autoTable(doc, {
        startY: 85,
        head: [['Date', 'Method', 'Reference Note', 'Amount Paid', 'Remaining']],
        body: tableData,
        theme: 'plain',
        headStyles: {
            fillColor: colors.sky50,
            textColor: colors.primary,
            fontStyle: 'bold',
            lineColor: colors.slate200,
            lineWidth: { bottom: 0.5 }
        },
        bodyStyles: {
            textColor: colors.slate900,
            lineColor: colors.slate200,
            lineWidth: { bottom: 0.1 }
        },
        styles: { fontSize: 9, cellPadding: 5 },
        columnStyles: {
            0: { cellWidth: 25 },
            1: { cellWidth: 30 },
            2: { cellWidth: 'auto' },
            3: { cellWidth: 35, halign: 'right', fontStyle: 'bold' },
            4: { cellWidth: 35, halign: 'right', fontStyle: 'bold', textColor: colors.primary }
        }
    });

    // Global PO Financials Summary
    const finalY = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 15;

    const labelX = 135;
    const valueX = 196;

    // Use absolute truth from the PO level
    const poTotal = payment.purchaseOrder?.totalAmount || 0;
    const totalAdvancePaid = payment.purchaseOrder?.advancePaid || 0;
    const totalPaid = payment.purchaseOrder?.supplierPayments?.reduce((sum, t) => {
        return sum + (t.amountPaid || 0);
    }, 0) || payment.amountPaid;

    const currentBalance = payment.purchaseOrder?.balanceDue || payment.balanceDue;
    const isClear = (payment.purchaseOrder?.balanceDue || payment.balanceDue) <= 0;
    doc.setFontSize(10);
    doc.setTextColor(...colors.slate500);
    doc.text("Purchase Order Total:", labelX, finalY);
    doc.text("Total Advance Paid:", labelX, finalY + 7);
    doc.text("Total Amount Paid:", labelX, finalY + 14);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(...colors.slate900);
    doc.text(formatCurrency(poTotal), valueX, finalY, { align: "right" });

    doc.setTextColor(...colors.emerald600);
    doc.text(`- ${formatCurrency(totalAdvancePaid)}`, valueX, finalY + 7, { align: "right" });
    doc.text(`- ${formatCurrency(totalPaid)}`, valueX, finalY + 14, { align: "right" });

    if (isClear) {
        doc.setFontSize(15);
        doc.setTextColor(...colors.emerald600);
        doc.text("Payment Clear", labelX + 10, finalY + 26);
    }
    else {
        doc.setFillColor(...colors.rose50);
        doc.roundedRect(labelX - 5, finalY + 19, 70, 10, 1, 1, "F");
        doc.setFontSize(11);
        doc.setTextColor(...colors.rose600);
        doc.text("Current Balance Due:", labelX, finalY + 26);
        doc.text(formatCurrency(currentBalance), valueX, finalY + 26, { align: "right" });
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

    doc.save(`PO-${payment.purchaseOrder?.poNumber || payment.voucherNumber}-Payment-Ledger.pdf`);
};