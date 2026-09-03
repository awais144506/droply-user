import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { PurchaseOrder } from "@/features/purchases/api/use-purchase-orders";

export const generatePOPdf = (po: PurchaseOrder) => {
  const doc = new jsPDF();
  
  const formatCurrency = (val: number) => `Rs ${val.toLocaleString("en-PK")}`;
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  
  // Header
  doc.setFontSize(22);
  doc.setTextColor(2, 132, 199); // Tailwind sky-600
  doc.text("Droply Procurement", 14, 22);
  
  doc.setFontSize(16);
  doc.setTextColor(15, 23, 42); // Tailwind slate-900
  doc.text("PURCHASE ORDER", 14, 32);
  
  // Meta Info
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139); // Tailwind slate-500
  doc.text(`PO Number: ${po.poNumber}`, 14, 42);
  doc.text(`Date Issued: ${formatDate(po.orderDate)}`, 14, 47);
  doc.text(`Status: ${po.status}`, 14, 52);
  
  // Supplier Info
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text("Supplier Details:", 14, 65);
  
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text(`Firm Name: ${po.supplierName}`, 14, 72);
  doc.text(`Contact: ${po.supplierPhone}`, 14, 77);
  
  // Items Table
  const tableData = po.items.map(item => [
    `${item.quantity}x`,
    item.description
  ]);
  
  autoTable(doc, {
    startY: 85,
    head: [['Qty', 'Item Description']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [2, 132, 199], textColor: [255, 255, 255], fontStyle: 'bold' },
    styles: { fontSize: 10, cellPadding: 5 },
    columnStyles: {
      0: { cellWidth: 20, fontStyle: 'bold' },
      1: { cellWidth: 'auto' }
    }
  });
  
  // Financials Footer
  const finalY = (doc as any).lastAutoTable.finalY || 85;
  doc.setFontSize(14);
  doc.setTextColor(15, 23, 42);
  doc.text(`Total Amount: ${formatCurrency(po.totalAmount)}`, 14, finalY + 15);
  
  // Save the file
  doc.save(`${po.poNumber}-Invoice.pdf`);
};