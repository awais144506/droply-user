import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// 1. Define our Mock Data Interfaces
interface BranchSettings {
  displayName: string;
  displayPhone: string;
  displayEmail: string;
  displayAddress: string;
  logoUrl?: string;
}

interface PurchaseOrder {
  poNumber: string;
  orderDate: string;
  status: string;
  supplierName: string;
  supplierPhone: string;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  subTotal: number;
  advancePaid: number;
  balanceDue: number;
}

// Helper to convert an Image URL to Base64 (Required by jsPDF)
const getBase64ImageFromUrl = async (imageUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous"; // Crucial for CORS
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL("image/png");
        resolve(dataURL);
      } else {
        reject(new Error("Failed to get canvas context"));
      }
    };
    img.onerror = error => reject(error);
    img.src = imageUrl;
  });
};

// 2. The PDF Generator Function (Now Async!)
export const generatePOPdf = async (po: PurchaseOrder, branch: BranchSettings) => {
  const doc = new jsPDF();
  
  const formatCurrency = (val: number) => `Rs ${val.toLocaleString("en-PK")}`;
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  
  const colors = {
    primary: [2, 132, 199] as [number, number, number],   
    slate900: [15, 23, 42] as [number, number, number],   
    slate500: [100, 116, 139] as [number, number, number], 
    slate200: [226, 232, 240] as [number, number, number], 
    sky50: [240, 249, 255] as [number, number, number],    
  };

  // ==========================================
  // HEADER SECTION WITH LOGO
  // ==========================================
  let textStartX = 14;

  // Render Logo if it exists
  if (branch.logoUrl) {
    try {
      const base64Logo = await getBase64ImageFromUrl(branch.logoUrl);
      // addImage(imageData, format, x, y, width, height)
      doc.addImage(base64Logo, 'PNG', 14, 15, 20, 20); 
      textStartX = 38; // Push the text over so it doesn't overlap the logo
    } catch (error) {
      console.warn("Failed to load logo for PDF, skipping image.", error);
      // textStartX remains 14
    }
  }
  
  // Left: Branch Info
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(...colors.primary);
  doc.text(branch.displayName.toUpperCase(), textStartX, 22); // Y adjusted to align with logo
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...colors.slate500);
  doc.text(branch.displayAddress, textStartX, 29);
  doc.text(`Phone: ${branch.displayPhone}`, textStartX, 34);
  doc.text(`Email: ${branch.displayEmail}`, textStartX, 39);

  // Right: Document Meta
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(...colors.slate900);
  doc.text("PURCHASE ORDER", 196, 25, { align: "right" });
  
  doc.setFontSize(10);
  doc.setTextColor(...colors.slate500);
  doc.text(`PO Number:`, 160, 32);
  doc.text(`Date Issued:`, 160, 37);
  doc.text(`Order Status:`, 160, 42);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(...colors.slate900);
  doc.text(po.poNumber, 196, 32, { align: "right" });
  doc.text(formatDate(po.orderDate), 196, 37, { align: "right" });
  doc.setTextColor(...colors.primary);
  doc.text(po.status.toUpperCase(), 196, 42, { align: "right" });

  doc.setDrawColor(...colors.slate200);
  doc.line(14, 48, 196, 48);

  // ==========================================
  // VENDOR SECTION
  // ==========================================
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...colors.slate500);
  doc.text("ISSUED TO:", 14, 58);

  doc.setFontSize(12);
  doc.setTextColor(...colors.slate900);
  doc.text(po.supplierName, 14, 65);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...colors.slate500);
  doc.text(`Phone: ${po.supplierPhone}`, 14, 70);

  // ==========================================
  // ITEMS TABLE
  // ==========================================
  const tableData = po.items.map(item => [
    item.description,
    `${item.quantity}x`,
    formatCurrency(item.unitPrice),
    formatCurrency(item.total)
  ]);
  
  autoTable(doc, {
    startY: 80,
    head: [['Item Description', 'Qty', 'Unit Price', 'Total Amount']],
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
  
  // ==========================================
  // FINANCIALS FOOTER
  // ==========================================
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...colors.slate500);
  doc.text("Notes:", 14, finalY);
  doc.text("1. All goods must match the agreed quality standards.", 14, finalY + 5);
  doc.text("2. Please reference this PO number on your invoice.", 14, finalY + 10);

  const labelX = 145;
  const valueX = 196;

  doc.setFontSize(10);
  doc.setTextColor(...colors.slate500);
  doc.text("Subtotal:", labelX, finalY);
  doc.text("Advance Paid:", labelX, finalY + 7);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(...colors.slate900);
  doc.text(formatCurrency(po.subTotal), valueX, finalY, { align: "right" });
  
  doc.setTextColor(16, 185, 129); 
  doc.text(`- ${formatCurrency(po.advancePaid)}`, valueX, finalY + 7, { align: "right" });

  doc.setFillColor(...colors.sky50);
  doc.roundedRect(labelX - 5, finalY + 12, 60, 10, 1, 1, "F");

  doc.setFontSize(11);
  doc.setTextColor(...colors.primary);
  doc.text("Balance Due:", labelX, finalY + 19);
  doc.text(formatCurrency(po.balanceDue), valueX, finalY + 19, { align: "right" });

  // ==========================================
  // PAGE FOOTER
  // ==========================================
  const pageHeight = doc.internal.pageSize.height;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.setTextColor(...colors.slate500);
  doc.text(`Generated by Droply Procurement System • ${new Date().toLocaleString()}`, 14, pageHeight - 10);

  doc.save(`${po.poNumber}-Purchase-Order.pdf`);
};