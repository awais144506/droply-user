/* eslint-disable @typescript-eslint/no-explicit-any */
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { SupplierPayment } from "@/features/supply/payments/types/payments";
import { BranchSettingData } from "@/features/admin/settings/types/settings";
import { formatPhoneNumber } from "react-phone-number-input";
import { getBase64ImageFromUrl } from "./getBase64Image";
import { toWords } from "number-to-words";

export const generatePaymentPdf = async (
    payment: SupplierPayment & {
        purchaseOrder?: {
            supplierPayments?: SupplierPayment[];
            totalAmount?: number;
            advancePaid?: number;
            balanceDue?: number;
            poNumber?: string;
        };
    },
    branch?: BranchSettingData & Record<string, any>
) => {
    const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
    });

    const docTitle = "Payment Receipt";

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
        primary: [3, 105, 161] as [number, number, number],      // Primary/Sky
        brandAccent: [2, 132, 199] as [number, number, number],  // Sky 600
        slate900: [15, 23, 42] as [number, number, number],
        slate700: [51, 65, 85] as [number, number, number],
        slate500: [100, 116, 139] as [number, number, number],
        slate200: [226, 232, 240] as [number, number, number],
        slate100: [241, 245, 249] as [number, number, number],
        emerald600: [5, 150, 105] as [number, number, number],
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
    // 3. PAID TO (Left) & RECEIPT DETAILS (Right)
    // =========================================================================
    let billY = titleY + 10;
    const detailsStartY = billY;

    // Left: Issued To (Supplier)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...colors.slate900);
    doc.text("Issued To", leftX, billY);
    billY += 5;

    doc.text(`MS: ${payment.supplier?.firmName || "Unknown Supplier"}`, leftX, billY);
    billY += 4.8;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(...colors.slate700);

    if (payment.supplier?.ntn) {
        doc.text(`NTN No: ${payment.supplier.ntn}`, leftX, billY);
        billY += 4.5;
    }
    if (payment.supplier?.strn) {
        doc.text(`STRN No: ${payment.supplier.strn}`, leftX, billY);
        billY += 4.5;
    }
    if (payment.supplier?.address) {
        const supplierAddr = `${payment.supplier.address}${payment.supplier.city ? `, ${payment.supplier.city}` : ""}`;
        const addrLines = doc.splitTextToSize(supplierAddr, 110);
        doc.text(addrLines, leftX, billY);
        billY += addrLines.length * 4.5;
    }
    if (payment.supplier?.phone) {
        const supplierPhone = formatPhoneNumber(payment.supplier.phone) || payment.supplier.phone;
        doc.text(`Contact No: ${supplierPhone}`, leftX, billY);
        billY += 4.5;
    }
    if (payment.supplier?.email) {
        doc.text(`Email: ${payment.supplier.email}`, leftX, billY);
        billY += 4.5;
    }

    // Right: Receipt Details
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...colors.slate900);
    doc.text("Receipt Details", rightColX, detailsStartY, { align: "right" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(...colors.slate700);
    doc.text(`Receipt No.: ${payment.voucherNumber || "N/A"}`, rightColX, detailsStartY + 5, { align: "right" });
    doc.text(`PO Reference: ${payment.purchaseOrder?.poNumber || "N/A"}`, rightColX, detailsStartY + 10, { align: "right" });
    doc.text(`Date Issued: ${formatDateDMY(payment.paymentDate)}`, rightColX, detailsStartY + 15, { align: "right" });

    // =========================================================================
    // 4. LINE ITEMS TABLE (Payment Ledger)
    // =========================================================================
    const tableStartY = Math.max(billY + 4, detailsStartY + 22);
    let tableData: any[][] = [];

    if (payment.purchaseOrder?.supplierPayments && payment.purchaseOrder.supplierPayments.length > 0) {
        tableData = payment.purchaseOrder.supplierPayments.map((p, idx) => {
            const methodDisplay = (p.paymentMethod || "CASH").replace("_", " ");
            const formattedMethod = methodDisplay.charAt(0).toUpperCase() + methodDisplay.slice(1).toLowerCase();
            return [
                String(idx + 1),
                formatDateDMY(p.paymentDate),
                formattedMethod,
                p.referenceNote || "-",
                formatCurrency(p.amountPaid),
                formatCurrency(p.balanceDue),
            ];
        });
    } else {
        const methodDisplay = (payment.paymentMethod || "CASH").replace("_", " ");
        const formattedMethod = methodDisplay.charAt(0).toUpperCase() + methodDisplay.slice(1).toLowerCase();
        tableData = [
            [
                "1",
                formatDateDMY(payment.paymentDate),
                formattedMethod,
                payment.referenceNote || "-",
                formatCurrency(payment.amountPaid),
                formatCurrency(payment.balanceDue),
            ]
        ];
    }

    autoTable(doc, {
        startY: tableStartY,
        margin: { left: 14, right: 14 },
        head: [["#", "Date", "Method", "Reference Note", "Amount Paid", "Remaining"]],
        body: tableData,
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
            1: { cellWidth: 25, halign: "left" },
            2: { cellWidth: 28, halign: "left" },
            3: { cellWidth: "auto", halign: "left" },
            4: { cellWidth: 32, halign: "right", fontStyle: "bold" },
            5: { cellWidth: 32, halign: "right", fontStyle: "bold" },
        },
    });

    // =========================================================================
    // 5. BOTTOM SECTION: Amount in Words & Financial Summary Box
    // =========================================================================
    let finalY = (doc as any).lastAutoTable.finalY + 8;

    if (finalY > 230) {
        doc.addPage();
        finalY = 20;
    }

    let bottomLeftY = finalY;

    // Amount in Words
    const totalPaid = payment.purchaseOrder?.supplierPayments?.reduce((sum, t) => sum + (t.amountPaid || 0), 0) || payment.amountPaid;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...colors.slate900);
    doc.text("Payment Amount In Words", leftX, bottomLeftY);
    bottomLeftY += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(...colors.slate700);
    const amountWords = toWords(totalPaid).toUpperCase();
    const wordLines = doc.splitTextToSize(amountWords, 95);
    doc.text(wordLines, leftX, bottomLeftY);
    bottomLeftY += wordLines.length * 4.5 + 5;

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

    const poTotal = payment.purchaseOrder?.totalAmount || 0;
    const totalAdvancePaid = payment.purchaseOrder?.advancePaid || 0;
    const currentBalance = payment.purchaseOrder?.balanceDue ?? payment.balanceDue;

    drawSummaryRow("Purchase Order Total", formatCurrency(poTotal));
    drawSummaryRow("Total Advance Paid", formatCurrency(totalAdvancePaid));
    drawSummaryRow("Total Amount Paid", formatCurrency(totalPaid), { isBold: true });
    drawSummaryRow("Current Balance Due", formatCurrency(currentBalance), {
        isBold: true,
        isHighlighted: true,
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

    doc.save(`Receipt_${payment.voucherNumber || "Payment"}.pdf`);
};