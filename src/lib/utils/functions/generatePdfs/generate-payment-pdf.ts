/* eslint-disable @typescript-eslint/no-explicit-any */
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { SupplierPayment } from "@/features/supply/payments/types/payments";
import { BranchSettingData } from "@/features/admin/settings/types/settings";

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

export const generatePaymentPdf = async (payment: SupplierPayment, branch?: BranchSettingData) => {
    const doc = new jsPDF();

    const formatCurrency = (val: number) => `Rs ${val.toLocaleString("en-PK")}`;
    const formatDate = (date: string | Date) => new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

    const colors = {
        primary: [2, 132, 199] as [number, number, number], // sky-600
        slate900: [15, 23, 42] as [number, number, number],
        slate500: [100, 116, 139] as [number, number, number],
        slate200: [226, 232, 240] as [number, number, number],
        sky50: [240, 249, 255] as [number, number, number],
        emerald600: [5, 150, 105] as [number, number, number],
    };

    let textStartX = 14;

    if (branch?.logoUrl) {
        try {
            const base64Logo = await getBase64ImageFromUrl(branch.logoUrl);
            doc.addImage(base64Logo, 'PNG', 14, 15, 20, 20);
            textStartX = 38;
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
    doc.text(`Phone: ${branch?.displayPhone || ""}`, textStartX, 34);
    doc.text(`Email: ${branch?.displayEmail || ""}`, textStartX, 39);

    // Document Meta 
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(...colors.slate900);
    doc.text("PAYMENT RECEIPT", 196, 25, { align: "right" });

    doc.setFontSize(10);
    doc.setTextColor(...colors.slate500);
    doc.text(`Voucher No:`, 135, 32);
    doc.text(`Date:`, 135, 37);
    doc.text(`Payment Status:`, 135, 42);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(...colors.slate900);
    doc.text(payment.voucherNumber, 196, 32, { align: "right" });
    doc.text(formatDate(payment.paymentDate), 196, 37, { align: "right" });
    doc.setTextColor(...colors.primary);
    doc.text(payment.status.toUpperCase(), 196, 42, { align: "right" });

    doc.setDrawColor(...colors.slate200);
    doc.line(14, 48, 196, 48);

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
    doc.text(`Phone: ${payment.supplier?.phone || "N/A"}`, 14, 75);

    // Table Data Mapping
    const methodDisplay = payment.paymentMethod.replace("_", " ");
    const tableData = [
        [
            payment.purchaseOrder?.poNumber || "N/A",
            methodDisplay.charAt(0).toUpperCase() + methodDisplay.slice(1).toLowerCase(),
            payment.referenceNote || "-",
            formatCurrency(payment.amountPaid)
        ]
    ];

    autoTable(doc, {
        startY: 85,
        head: [['Applied To PO', 'Payment Method', 'Reference Note', 'Amount Paid']],
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
        styles: { fontSize: 10, cellPadding: 6 },
        columnStyles: {
            0: { cellWidth: 35, fontStyle: 'bold' },
            1: { cellWidth: 35 },
            2: { cellWidth: 'auto' },
            3: { cellWidth: 40, halign: 'right', fontStyle: 'bold' }
        }
    });

    // Financials
    const finalY = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 15;

    const labelX = 135;
    const valueX = 196;

    doc.setFontSize(10);
    doc.setTextColor(...colors.slate500);
    doc.text("Purchase Order Total:", labelX, finalY);
    doc.text("Payment Applied:", labelX, finalY + 7);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(...colors.slate900);
    doc.text(formatCurrency(payment.purchaseOrder?.totalAmount || 0), valueX, finalY, { align: "right" });

    // Highlight the payment amount
    doc.setTextColor(...colors.emerald600);
    doc.text(`- ${formatCurrency(payment.amountPaid)}`, valueX, finalY + 7, { align: "right" });

    // Highlight box for remaining balance
    doc.setFillColor(...colors.sky50);
    doc.roundedRect(labelX - 5, finalY + 12, 70, 10, 1, 1, "F");

    doc.setFontSize(11);
    doc.setTextColor(...colors.primary);
    doc.text("Remaining Balance:", labelX, finalY + 19);
    doc.text(formatCurrency(payment.purchaseOrder?.balanceDue || 0), valueX, finalY + 19, { align: "right" });

    // Pagination Footer
    const pageCount = (doc as any).internal.getNumberOfPages();

    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        const pageHeight = doc.internal.pageSize.height;

        doc.setFont("helvetica", "italic");
        doc.setFontSize(8);
        doc.setTextColor(...colors.slate500);

        // Left side: Timestamp
        doc.text(`Generated by Droply System • ${new Date().toLocaleString()}`, 14, pageHeight - 10);

        // Right side: Page X of Y
        doc.text(`Page ${i} of ${pageCount}`, 196, pageHeight - 10, { align: "right" });
    }

    doc.save(`${payment.voucherNumber}-Payment-Receipt.pdf`);
};