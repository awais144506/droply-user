import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateDynamicReportPdf = (
  reportTitle: string,
  dateRange: string,
  columns: string[],
  rows: (string | number)[][],
  summaryTotal?: string
) => {
  const doc = new jsPDF();
  const colors = {
    primary: [2, 132, 199] as [number, number, number], // sky-600
    slate900: [15, 23, 42] as [number, number, number],
    slate500: [100, 116, 139] as [number, number, number],
    sky50: [240, 249, 255] as [number, number, number],
  };

  // Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(...colors.slate900);
  doc.text("DROPLY BUSINESS REPORT", 14, 22);

  doc.setFontSize(12);
  doc.setTextColor(...colors.primary);
  doc.text(reportTitle.toUpperCase(), 14, 30);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...colors.slate500);
  doc.text(`Reporting Period: ${dateRange}`, 14, 36);
  doc.text(`Generated On: ${new Date().toLocaleString()}`, 14, 41);

  // Table
  autoTable(doc, {
    startY: 50,
    head: [columns],
    body: rows,
    theme: "striped",
    headStyles: {
      fillColor: colors.slate900,
      textColor: 255,
      fontStyle: "bold",
    },
    styles: { fontSize: 9, cellPadding: 4 },
  });

  // Footer Totals
  if (summaryTotal) {
    const finalY = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...colors.slate900);
    doc.text(`Total Amount: ${summaryTotal}`, 196, finalY, { align: "right" });
  }

  doc.save(`${reportTitle.replace(/\s+/g, "_")}_${Date.now()}.pdf`);
};