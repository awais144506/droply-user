/* eslint-disable @typescript-eslint/no-explicit-any */
import { BranchSettingData } from "@/features/admin/settings/types/settings";
import { formatPhoneNumber } from "react-phone-number-input";
interface ZoneStatsData {
    totalZones: number;
    totalCustomers: number;
    totalLedger: number;
    totalReturnables: number;
}

interface ExportZonesPdfOptions {
    zones: any[];
    stats?: ZoneStatsData;
    branchSettings?: BranchSettingData;
    search?: string;
}

function escapeHtml(value: any): string {
    if (value === null || value === undefined) return "";
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function getZoneCustomersCount(z: any): number {
    return Number(
        z.totalCustomers ??
        z.customersCount ??
        z.customerCount ??
        z._count?.customers ??
        (Array.isArray(z.customers) ? z.customers.length : 0)
    );
}

function getZoneLedger(z: any): number {
    return Number(
        z.calculatedLedger ?? 0
    );
}

function getZoneReturnables(z: any): number {
    return Number(
        z.totalReturnables ??
        z.returnablesCount ??
        z.returnablesLength ??
        z.bottlesHeld ??
        0
    );
}

function getZoneRiders(z: any): string {
    if (Array.isArray(z.riders) && z.riders.length > 0) {
        return z.riders
            .map((r: any) => r?.name || r?.staff?.name || r?.rider?.name)
            .filter(Boolean)
            .join(", ");
    }
    if (z.rider?.name) return z.rider.name;
    if (z.assignedRider?.name) return z.assignedRider.name;
    if (typeof z.riderName === "string" && z.riderName.trim()) return z.riderName;
    return "Unassigned";
}

export function exportZonesToBwPdf({
    zones,
    stats,
    branchSettings,
    search,
}: ExportZonesPdfOptions) {
    const bSettings = branchSettings as any;
    const branchName =
        bSettings?.name ||
        bSettings?.branchName ||
        bSettings?.businessName ||
        "Branch Delivery Zones";
    const branchPhone =
        formatPhoneNumber(bSettings?.phone || bSettings?.contactPhone || bSettings?.phoneNumber || "N/A");
    const branchAddress =
        bSettings?.address || bSettings?.branchAddress || bSettings?.location || "N/A";
    const currency = bSettings?.currency || "Rs.";

    const scopeText = search
        ? `Search: "${search}"`
        : "All Delivery Zones (Complete List)";

    // Use calculated totals across the exported zones (falls back to stats if needed)
    const totalZones = zones.length;
    const totalCustomers =
        zones.reduce((sum, z) => sum + getZoneCustomersCount(z), 0) ||
        stats?.totalCustomers ||
        0;
    const totalLedger =
        zones.reduce((sum, z) => sum + getZoneLedger(z), 0) ||
        stats?.totalLedger ||
        0;
    const totalReturnables =
        zones.reduce((sum, z) => sum + getZoneReturnables(z), 0) ||
        stats?.totalReturnables ||
        0;

    const generatedAt = new Date().toLocaleString("en-PK", {
        dateStyle: "medium",
        timeStyle: "short",
    });

    const rowsHtml = zones
        .map((z: any, idx) => {
            const zoneName = z.name || "Unnamed Zone";
            const zoneCode = z.code || z.zoneCode || "";
            const ridersText = getZoneRiders(z);
            const customersCount = getZoneCustomersCount(z);
            const returnables = getZoneReturnables(z);
            const ledger = getZoneLedger(z);
            const statusText =
                z.isActive === false
                    ? "INACTIVE"
                    : z.status
                        ? String(z.status).toUpperCase()
                        : "ACTIVE";

            return `
        <tr>
          <td class="center bold">${idx + 1}</td>
          <td>
            <div class="bold">${escapeHtml(zoneName)}</div>
            ${zoneCode ? `<div class="sub mono">${escapeHtml(zoneCode)}</div>` : ""}
          </td>
          <td>${escapeHtml(ridersText)}</td>
          <td class="center bold">${customersCount}</td>
          <td class="center bold">${returnables}</td>
          <td class="right bold">
            ${ledger !== 0 ? `${currency} ${ledger.toLocaleString()}` : "-"}
          </td>
          <td class="center bold">${escapeHtml(statusText)}</td>
        </tr>
      `;
        })
        .join("");

    const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>${escapeHtml(branchName)} - Delivery Zones List</title>
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
            flex-shrink: 0;
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
            grid-template-columns: repeat(4, 1fr);
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
          .mono { font-family: monospace; font-size: 9.5px; }
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
              <div class="doc-badge">Delivery Zones Directory</div>
              <div><b>Generated:</b> ${escapeHtml(generatedAt)}</div>
              <div><b>Total Zones:</b> ${totalZones}</div>
            </div>
          </div>

          <!-- 2. Scope Bar -->
          <div class="filter-box">
            <div><b>REPORT SCOPE:</b> ${escapeHtml(scopeText)}</div>
            <div><b>Showing:</b> ${totalZones} Zone(s)</div>
          </div>

          <!-- 3. Totals Summary Strip -->
          <div class="summary-grid">
            <div class="summary-cell">
              <div class="summary-label">Total Zones</div>
              <div class="summary-val">${totalZones}</div>
            </div>
            <div class="summary-cell">
              <div class="summary-label">Total Customers</div>
              <div class="summary-val">${totalCustomers.toLocaleString()}</div>
            </div>
            <div class="summary-cell">
              <div class="summary-label">Total Ledger (Receivable)</div>
              <div class="summary-val">${currency} ${totalLedger.toLocaleString()}</div>
            </div>
            <div class="summary-cell">
              <div class="summary-label">Returnables Held</div>
              <div class="summary-val">${totalReturnables.toLocaleString()}</div>
            </div>
          </div>

          <!-- 4. Zones Table -->
          <table>
            <thead>
              <tr>
                <th style="width: 5%; text-align: center;">#</th>
                <th style="width: 19%;">Zone Name</th>
                <th style="width: 16%;">Assigned Rider(s)</th>
                <th style="width: 9%; text-align: center;">Customers</th>
                <th style="width: 9%; text-align: center;">Returnable Items</th>
                <th style="width: 11%; text-align: right;">Total Ledger</th>
                <th style="width: 7%; text-align: center;">Status</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>

          <div class="footer">
            <span>${escapeHtml(branchName)} — Official Delivery Zones Report</span>
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