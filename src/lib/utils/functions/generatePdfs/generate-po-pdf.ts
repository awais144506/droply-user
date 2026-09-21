/* eslint-disable @typescript-eslint/no-explicit-any */
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { PurchaseOrder } from "@/features/supply/order/types/po"; // Adjust path if needed
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

export const generatePOPdf = async (po: PurchaseOrder, branch: BranchSettingData) => {
  const doc = new jsPDF();

  const formatCurrency = (val: number) => `Rs ${val.toLocaleString("en-PK")}`;
  const formatDate = (date: string | Date) => new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const colors = {
    primary: [2, 132, 199] as [number, number, number],
    slate900: [15, 23, 42] as [number, number, number],
    slate500: [100, 116, 139] as [number, number, number],
    slate200: [226, 232, 240] as [number, number, number],
    sky50: [240, 249, 255] as [number, number, number],
  };

  let textStartX = 14;

  if (branch.logoUrl) {
    try {
      const base64Logo = await getBase64ImageFromUrl(branch.logoUrl);
      doc.addImage(base64Logo, 'PNG', 14, 15, 20, 20);
      textStartX = 38;
    } catch (error) {
      console.warn("Failed to load logo", error);
    }
  }

  // Header (Fixed optional chaining on toUpperCase)
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
  doc.text("PURCHASE ORDER", 196, 25, { align: "right" });

  doc.setFontSize(10);
  doc.setTextColor(...colors.slate500);
  doc.text(`PO Number:`, 135, 32);
  doc.text(`Date Issued:`, 135, 37);
  doc.text(`Order Status:`, 135, 42);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(...colors.slate900);
  doc.text(po.poNumber, 196, 32, { align: "right" });
  doc.text(formatDate(po.orderDate), 196, 37, { align: "right" });
  doc.setTextColor(...colors.primary);
  doc.text(po.status.replace("_", " ").toUpperCase(), 196, 42, { align: "right" });

  doc.setDrawColor(...colors.slate200);
  doc.line(14, 48, 196, 48);

  // Vendor Section
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...colors.slate500);
  doc.text("ISSUED TO:", 14, 58);

  doc.setFontSize(12);
  doc.setTextColor(...colors.slate900);
  doc.text(po.supplier?.firmName || "Unknown Supplier", 14, 65);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...colors.slate500);
  doc.text(`Phone: ${po.supplier?.phone || "N/A"}`, 14, 70);

  // Table Data Mapping
  const tableData = po.items.map(item => [
    item.supplierItemName,
    `${item.quantity}x`,
    formatCurrency(item.unitCost),
    formatCurrency(item.quantity * item.unitCost)
  ]);

  autoTable(doc, {
    startY: 80,
    head: [['Item Description', 'Qty', 'Unit Cost', 'Total Amount']],
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
      0: { cellWidth: 'auto', fontStyle: 'bold' },
      1: { cellWidth: 20, halign: 'center' },
      2: { cellWidth: 35, halign: 'right' },
      3: { cellWidth: 40, halign: 'right', fontStyle: 'bold' }
    }
  });

  // Financials
  const finalY = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...colors.slate500);
  doc.text("Notes & Instructions:", 14, finalY);

  const splitNotes = doc.splitTextToSize(po.notes || "No additional notes provided.", 110);
  doc.text(splitNotes, 14, finalY + 5);

  const labelX = 145;
  const valueX = 196;

  doc.setFontSize(10);
  doc.setTextColor(...colors.slate500);
  doc.text("Subtotal:", labelX, finalY);
  doc.text("Advance Paid:", labelX, finalY + 7);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(...colors.slate900);
  doc.text(formatCurrency(po.totalAmount), valueX, finalY, { align: "right" });

  doc.setTextColor(16, 185, 129);
  doc.text(`- ${formatCurrency(po.advancePaid || 0)}`, valueX, finalY + 7, { align: "right" });

  doc.setFillColor(...colors.sky50);
  doc.roundedRect(labelX - 5, finalY + 12, 60, 10, 1, 1, "F");

  doc.setFontSize(11);
  doc.setTextColor(...colors.primary);
  doc.text("Balance Due:", labelX, finalY + 19);
  doc.text(formatCurrency(po.balanceDue || 0), valueX, finalY + 19, { align: "right" });

  // Pagination Footer (Fixed TypeScript bypass for getting page count)
  const pageCount = (doc as any).internal.getNumberOfPages(); // Cast as any to bypass TS complaints
  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    const pageHeight = doc.internal.pageSize.height;
    
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(...colors.slate500);
    
    // Left side: Timestamp
    doc.text(`Generated by Droply Procurement System • ${new Date().toLocaleString()}`, 14, pageHeight - 10);
    
    // Right side: Page X of Y
    doc.text(`Page ${i} of ${pageCount}`, 196, pageHeight - 10, { align: "right" });
  }

  doc.save(`${po.poNumber}-Purchase-Order.pdf`);
};