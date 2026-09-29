/* eslint-disable @typescript-eslint/no-explicit-any */
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// --- Dummy Data Interfaces ---
interface InvoiceData {
    invoiceNo: string;
    date: string;
    subTotal: number;
    gstPercent: number;
    gstAmount: number;
    total: number;
    received: number;
    balance: number;
    amountInWords: string;
    items: {
        id: number;
        name: string;
        quantity: number;
        price: number;
        amount: number;
    }[];
}

interface CompanyInfo {
    name: string;
    ntn: string;
    strn: string;
    address: string;
    phone: string;
    email: string;
}

interface CustomerInfo {
    name: string;
    ntn: string;
    strn: string;
    address: string;
    phone: string;
}

export const generateSalesInvoicePdf = async () => {
    // --- 1. Dummy Data from Reference PDF ---
    const company: CompanyInfo = {
        name: "Power Bridge Engineering Services Pvt LTD",
        ntn: "9630761-5",
        strn: "3277876296251",
        address: "al- Jannat street main Jan MUHAMMAD road Near Madina\nCorporation/al- Hamra Town Raiwind road Lahore",
        phone: "03216903582",
        email: "pbes786@gmail.com",
    };

    const customer: CustomerInfo = {
        name: "MS: Beacon Energy (Pvt) Limited",
        ntn: "6528870-0",
        strn: "3277876181126",
        address: "789, Capital View Road Mohra Noor, Banigala, Islamabad\nPakistan",
        phone: "+923168156762",
    };

    const invoice: InvoiceData = {
        invoiceNo: "58",
        date: "29-12-2025",
        subTotal: 575000,
        gstPercent: 18.0,
        gstAmount: 103500,
        total: 678500,
        received: 0,
        balance: 678500,
        amountInWords: "Six Lakh Seventy Eight Thousand Five Hundred Rupees\nonly",
        items: [
            { id: 1, name: "Aluminum L3 Structure (C Type) 2.6 mm", quantity: 50, price: 11500, amount: 575000 }
        ]
    };

    const doc = new jsPDF();

    // --- 2. Color Palette (Dark Blue Theme) ---
    const colors = {
        darkBlue: [30, 58, 138] as [number, number, number], // Beautiful corporate Navy/Dark Blue
        slate900: [15, 23, 42] as [number, number, number],
        slate600: [71, 85, 105] as [number, number, number],
        slate300: [203, 213, 225] as [number, number, number],
        slate50: [248, 250, 252] as [number, number, number],
        white: [255, 255, 255] as [number, number, number],
    };

    const formatCurrency = (val: number) => `Rs ${val.toLocaleString("en-PK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    // --- 3. Header Section ---

    // Left side: Company Details
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(...colors.darkBlue);
    doc.text(company.name.toUpperCase(), 14, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...colors.slate600);
    doc.text(`NTN: (${company.ntn})`, 14, 26);
    doc.text(`STRN: ${company.strn}`, 14, 31);

    // Address (handles multiline)
    const splitAddress = doc.splitTextToSize(company.address, 100);
    doc.text(splitAddress, 14, 36);

    const addressOffset = 36 + (splitAddress.length * 4);
    doc.text(`Phone no.: ${company.phone}`, 14, addressOffset + 2);
    doc.text(`Email: ${company.email}`, 14, addressOffset + 7);

    // Right side: Invoice Title & Meta
    doc.setFont("helvetica", "bold");
    doc.setFontSize(28);
    doc.setTextColor(...colors.darkBlue);
    doc.text("INVOICE", 196, 22, { align: "right" });

    doc.setFontSize(11);
    doc.setTextColor(...colors.slate900);
    doc.text("Invoice Details", 196, 32, { align: "right" });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...colors.slate600);
    doc.text(`Invoice No.: ${invoice.invoiceNo}`, 196, 38, { align: "right" });
    doc.text(`Date: ${invoice.date}`, 196, 43, { align: "right" });

    // Divider Line
    doc.setDrawColor(...colors.slate300);
    doc.setLineWidth(0.5);
    doc.line(14, 60, 196, 60);

    // --- 4. Bill To Section ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...colors.darkBlue);
    doc.text("Bill To", 14, 68);

    doc.setFontSize(10);
    doc.setTextColor(...colors.slate900);
    doc.text(customer.name, 14, 74);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...colors.slate600);
    doc.text(`NTN No. ${customer.ntn}`, 14, 79);
    doc.text(`STRN No. ${customer.strn}`, 14, 84);

    const splitCustomerAddress = doc.splitTextToSize(customer.address, 100);
    doc.text(splitCustomerAddress, 14, 89);

    const custAddressOffset = 89 + (splitCustomerAddress.length * 4);
    doc.text(`Contact No.: ${customer.phone}`, 14, custAddressOffset + 1);

    // --- 5. Items Table ---
    const tableData = invoice.items.map((item) => [
        item.id,
        item.name,
        item.quantity.toString(),
        formatCurrency(item.price),
        formatCurrency(item.amount),
    ]);

    // Calculate total quantity for footer
    const totalQty = invoice.items.reduce((sum, item) => sum + item.quantity, 0);

    autoTable(doc, {
        startY: 110,
        head: [['#', 'Item name', 'Quantity', 'Price/ unit', 'Amount']],
        body: tableData,
        foot: [['', 'Total', totalQty.toString(), '', formatCurrency(invoice.subTotal)]],
        theme: 'plain',
        headStyles: {
            fillColor: colors.darkBlue,
            textColor: colors.white,
            fontStyle: 'bold',
            halign: 'left',
        },
        bodyStyles: {
            textColor: colors.slate900,
            lineColor: colors.slate300,
            lineWidth: { bottom: 0.1 },
        },
        footStyles: {
            fillColor: colors.slate50,
            textColor: colors.slate900,
            fontStyle: 'bold',
            lineColor: colors.slate300,
            lineWidth: { top: 0.5, bottom: 0.5 }
        },
        styles: { fontSize: 9, cellPadding: 4 },
        columnStyles: {
            0: { cellWidth: 15 },
            1: { cellWidth: 'auto' },
            2: { cellWidth: 25, halign: 'center' },
            3: { cellWidth: 35, halign: 'right' },
            4: { cellWidth: 40, halign: 'right', fontStyle: 'bold' }
        }
    });

    const finalY = (doc as any).lastAutoTable.finalY + 15;

    // --- 6. Footer Layout (Split into Left and Right Columns) ---

    // LEFT COLUMN (Words & Terms)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...colors.darkBlue);
    doc.text("Invoice Amount In Words", 14, finalY);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...colors.slate900);
    const splitWords = doc.splitTextToSize(invoice.amountInWords, 90);
    doc.text(splitWords, 14, finalY + 6);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...colors.darkBlue);
    doc.text("Terms And Conditions", 14, finalY + 25);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...colors.slate600);
    doc.text("Thank you for doing business with us.", 14, finalY + 31);

    // RIGHT COLUMN (Calculations)
    const labelX = 135;
    const valueX = 196;
    let currentY = finalY;

    // Sub Total
    doc.setTextColor(...colors.slate600);
    doc.text("Sub Total", labelX, currentY);
    doc.setTextColor(...colors.slate900);
    doc.text(formatCurrency(invoice.subTotal), valueX, currentY, { align: "right" });
    currentY += 7;

    // GST
    doc.setTextColor(...colors.slate600);
    doc.text(`GST@${invoice.gstPercent.toFixed(1)}%`, labelX, currentY);
    doc.setTextColor(...colors.slate900);
    doc.text(formatCurrency(invoice.gstAmount), valueX, currentY, { align: "right" });
    currentY += 9;

    // Total (Dark Blue Highlight Box)
    doc.setFillColor(...colors.darkBlue);
    doc.rect(labelX - 5, currentY - 6, 75, 10, "F");
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...colors.white);
    doc.text("Total", labelX, currentY);
    doc.text(formatCurrency(invoice.total), valueX, currentY, { align: "right" });
    currentY += 10;

    // Received
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...colors.slate600);
    doc.text("Received", labelX, currentY);
    doc.setTextColor(...colors.slate900);
    doc.text(formatCurrency(invoice.received), valueX, currentY, { align: "right" });
    currentY += 7;

    // Balance
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...colors.darkBlue);
    doc.text("Balance", labelX, currentY);
    doc.text(formatCurrency(invoice.balance), valueX, currentY, { align: "right" });

    // --- 7. Signature Area ---
    const pageHeight = doc.internal.pageSize.height;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...colors.slate900);
    doc.text(`For: ${company.name}`, 196, pageHeight - 30, { align: "right" });

    doc.setDrawColor(...colors.slate300);
    doc.line(136, pageHeight - 15, 196, pageHeight - 15);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(...colors.slate600);
    doc.text("Authorized Signatory", 196, pageHeight - 10, { align: "right" });

    // --- 8. Save Document ---
    doc.save(`Invoice_${invoice.invoiceNo}_${invoice.date}.pdf`);
};