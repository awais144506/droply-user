/* eslint-disable @typescript-eslint/no-explicit-any */
import { CustomerDetails } from "@/features/manage/customers/types/customer";
import { BranchSettingData } from "@/features/admin/settings/types/settings";

interface ExportCustomersPdfOptions {
  customers: CustomerDetails[];
  branchSettings?: BranchSettingData;
  filters: {
    search?: string;
    debt?: string;
    schedule?: string;
  };
}

function escapeHtml(value: any): string {
  if (value === null || value === undefined) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatSchedule(customer: any): string {
  const type = customer.deliveryScheduleType || "ON_DEMAND";
  if (type === "EVERYDAY") return "Everyday";
  if (type === "ON_DEMAND") return "On-Demand";
  if (Array.isArray(customer.deliveryDays) && customer.deliveryDays.length > 0) {
    return customer.deliveryDays
      .map((d: string) => d.slice(0, 3).charAt(0) + d.slice(1, 3).toLowerCase())
      .join(", ");
  }
  return type;
}

function formatLastVisit(dateString?: string | null): {
  dateText: string;
  agoText: string;
} {
  if (!dateString) return { dateText: "Never", agoText: "" };
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return { dateText: "Never", agoText: "" };

  const dateText = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const visitDay = new Date(date);
  visitDay.setHours(0, 0, 0, 0);

  const diffDays = Math.floor(
    (today.getTime() - visitDay.getTime()) / (1000 * 60 * 60 * 24)
  );

  const agoText =
    diffDays === 0
      ? "Today"
      : diffDays === 1
      ? "Yesterday"
      : diffDays > 1
      ? `${diffDays}d ago`
      : "";

  return { dateText, agoText };
}

export function exportCustomersToBwPdf({
  customers,
  branchSettings,
  filters,
}: ExportCustomersPdfOptions) {
  const bSettings = branchSettings as any;
  const branchName =
    bSettings?.name ||
    bSettings?.branchName ||
    bSettings?.businessName ||
    "Branch Customer Directory";
  const branchPhone =
    bSettings?.phone || bSettings?.contactPhone || bSettings?.phoneNumber || "N/A";
  const branchAddress =
    bSettings?.address || bSettings?.branchAddress || bSettings?.location || "N/A";
  const currency = bSettings?.currency || "Rs.";

  // Build readable "Filter Applied" summary string
  const activeFilters: string[] = [];
  if (filters.search) activeFilters.push(`Search: "${filters.search}"`);
  if (filters.debt && filters.debt !== "all") {
    activeFilters.push(`Account Filter: ${filters.debt.toUpperCase()}`);
  }
  if (filters.schedule && filters.schedule !== "all") {
    activeFilters.push(`Schedule: ${filters.schedule.replace("_", " ")}`);
  }
  const filterAppliedText =
    activeFilters.length > 0 ? activeFilters.join("  |  ") : "All Customers (No Filter)";

  // Calculate Summary Totals across filtered list
  const totalCredit = customers.reduce(
    (sum, c: any) => sum + (Number(c.customerCredit) || 0),
    0
  );
  const totalAdvance = customers.reduce(
    (sum, c: any) => sum + (Number(c.customerAdvance) || 0),
    0
  );
  const totalDeposit = customers.reduce(
    (sum, c: any) => sum + (Number(c.securityDeposit) || 0),
    0
  );
  const totalBottles = customers.reduce(
    (sum, c: any) => sum + (Number(c.returnablesLength) || 0),
    0
  );

  const generatedAt = new Date().toLocaleString("en-PK", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const rowsHtml = customers
    .map((c: any, idx) => {
      const code = c.customerCode ? c.customerCode.replace("CUS-", "#") : "-";
      const zoneName = c.zone?.name || "Unassigned Zone";
      const schedule = formatSchedule(c);
      const { dateText, agoText } = formatLastVisit(c.lastVisitDate);
      const credit = Number(c.customerCredit) || 0;
      const advance = Number(c.customerAdvance) || 0;
      const deposit = Number(c.securityDeposit) || 0;
      const bottles = Number(c.returnablesLength) || 0;

      return `
        <tr>
          <td class="center bold">${idx + 1}</td>
          <td>
            <div class="bold">${escapeHtml(c.name)}</div>
            <div class="sub">${escapeHtml(code)} • ${escapeHtml(c.category || "DOMESTIC")}</div>
          </td>
          <td class="mono">${escapeHtml(c.phone || "-")}</td>
          <td>
            <div>${escapeHtml(c.address || "-")}</div>
            <div class="sub">Zone: <b>${escapeHtml(zoneName)}</b></div>
          </td>
          <td>${escapeHtml(schedule)}</td>
          <td>
            <div class="bold">${escapeHtml(dateText)}</div>
            ${agoText ? `<div class="sub">${escapeHtml(agoText)}</div>` : ""}
          </td>
          <td class="center bold">${bottles}</td>
          <td class="right">
            ${credit > 0 ? `<div class="bold">Due: ${currency} ${credit.toLocaleString()}</div>` : ""}
            ${advance > 0 ? `<div>Adv: ${currency} ${advance.toLocaleString()}</div>` : ""}
            ${credit === 0 && advance === 0 ? `<span>-</span>` : ""}
            ${deposit > 0 ? `<div class="sub">Dep: ${currency} ${deposit.toLocaleString()}</div>` : ""}
          </td>
        </tr>
      `;
    })
    .join("");

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${escapeHtml(branchName)} - Customers List</title>
        <style>
          @page {
            size: A4 landscape;
            margin: 14mm 15mm;
          }
          * {
            box-sizing: border-box;
            color: #000 !important;
            background: transparent !important;
          }
          html, body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
            font-size: 10px;
            line-height: 1.4;
            margin: 0;
            padding: 0;
            color: #000;
          }
          .page-container {
            padding: 28px 36px;
            width: 100%;
          }
          @media print {
            .page-container {
              padding: 4mm 6mm;
            }
          }
          .header {
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
            margin-bottom: 12px;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 20px;
          }
          .branch-title {
            font-size: 20px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin: 0 0 4px 0;
          }
          .branch-meta {
            font-size: 10.5px;
            margin: 2px 0;
          }
          .doc-meta {
            text-align: right;
            font-size: 10px;
            shrink: 0;
          }
          .doc-badge {
            display: inline-block;
            border: 1.5px solid #000;
            padding: 3px 10px;
            font-weight: 800;
            font-size: 11px;
            text-transform: uppercase;
            margin-bottom: 5px;
          }
          .filter-box {
            border: 1px solid #000;
            padding: 7px 12px;
            margin-bottom: 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 10px;
          }
          .summary-grid {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            border: 1px solid #000;
            margin-bottom: 14px;
          }
          .summary-cell {
            padding: 6px 10px;
            border-right: 1px solid #000;
          }
          .summary-cell:last-child {
            border-right: none;
          }
          .summary-label {
            font-size: 8.5px;
            text-transform: uppercase;
            font-weight: 700;
          }
          .summary-val {
            font-size: 13px;
            font-weight: 900;
            margin-top: 2px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          thead {
            display: table-header-group;
          }
          th {
            border: 1px solid #000;
            border-bottom: 2px solid #000;
            padding: 7px 8px;
            text-align: left;
            font-size: 9.5px;
            font-weight: 900;
            text-transform: uppercase;
          }
          td {
            border: 1px solid #000;
            padding: 6px 8px;
            vertical-align: top;
            font-size: 10px;
          }
          tr {
            page-break-inside: avoid;
          }
          .center { text-align: center; }
          .right { text-align: right; }
          .bold { font-weight: 700; }
          .mono { font-family: monospace; font-size: 10px; }
          .sub { font-size: 8.5px; margin-top: 2px; }
          .footer {
            margin-top: 14px;
            border-top: 1px solid #000;
            padding-top: 8px;
            display: flex;
            justify-content: space-between;
            font-size: 9px;
          }
        </style>
      </head>
      <body>
        <div class="page-container">
          <!-- 1. Branch Info Header -->
          <div class="header">
            <div>
              <div class="branch-title">${escapeHtml(branchName)}</div>
              <div class="branch-meta"><b>Phone:</b> ${escapeHtml(branchPhone)}</div>
              <div class="branch-meta"><b>Address:</b> ${escapeHtml(branchAddress)}</div>
            </div>
            <div class="doc-meta">
              <div class="doc-badge">Customer Directory</div>
              <div><b>Generated:</b> ${escapeHtml(generatedAt)}</div>
              <div><b>Total Records:</b> ${customers.length}</div>
            </div>
          </div>

          <!-- 2. Filter Applied Bar -->
          <div class="filter-box">
            <div><b>FILTER APPLIED:</b> ${escapeHtml(filterAppliedText)}</div>
            <div><b>Showing:</b> ${customers.length} Customer(s)</div>
          </div>

          <!-- 3. Totals Summary Strip -->
          <div class="summary-grid">
            <div class="summary-cell">
              <div class="summary-label">Total Customers</div>
              <div class="summary-val">${customers.length}</div>
            </div>
            <div class="summary-cell">
              <div class="summary-label">Total Credit (Receivable)</div>
              <div class="summary-val">${currency} ${totalCredit.toLocaleString()}</div>
            </div>
            <div class="summary-cell">
              <div class="summary-label">Total Advance</div>
              <div class="summary-val">${currency} ${totalAdvance.toLocaleString()}</div>
            </div>
            <div class="summary-cell">
              <div class="summary-label">Security Deposits</div>
              <div class="summary-val">${currency} ${totalDeposit.toLocaleString()}</div>
            </div>
            <div class="summary-cell">
              <div class="summary-label">Items Held</div>
              <div class="summary-val">${totalBottles}</div>
            </div>
          </div>

          <!-- 4. Customers Table -->
          <table>
            <thead>
              <tr>
                <th style="width: 4%; text-align: center;">#</th>
                <th style="width: 17%;">Customer</th>
                <th style="width: 12%;">Phone</th>
                <th style="width: 28%;">Address & Zone</th>
                <th style="width: 10%;">Schedule</th>
                <th style="width: 10%;">Last Visit</th>
                <th style="width: 6%; text-align: center;">Items Held</th>
                <th style="width: 13%; text-align: right;">Balance / Deposit</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>

          <div class="footer">
            <span>${escapeHtml(branchName)} — Official Customer Report</span>
            <span>Printed via Droply</span>
          </div>
        </div>

        <script>
          window.onload = function () {
            setTimeout(function () {
              window.focus();
              window.print();
            }, 150);
          };
        </script>
      </body>
    </html>
  `;

  const printWindow = window.open("", "_blank", "width=1150,height=800");
  if (!printWindow) {
    alert("Please allow popups in your browser to download/print the PDF.");
    return;
  }
  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}