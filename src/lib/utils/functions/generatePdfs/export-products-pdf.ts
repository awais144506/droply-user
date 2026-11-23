/* eslint-disable @typescript-eslint/no-explicit-any */
import { ProductList } from "@/features/manage/products/types/product";
import { BranchSettingData } from "@/features/admin/settings/types/settings";
import { formatPhoneNumber } from "react-phone-number-input";

interface ExportProductsPdfOptions {
    products: ProductList[];
    branchSettings?: BranchSettingData;
    filters: {
        searchQuery?: string;
        showLowStockOnly?: boolean;
        showPublicOnly?: boolean;
        categoryFilter?: string;
        trackingFilter?: string;
        statusFilter?: string;
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

function formatEnumLabel(value?: string | null): string {
    if (!value) return "-";
    return value
        .toLowerCase()
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

function getDefaultTier(p: any) {
    if (!Array.isArray(p.priceTiers) || p.priceTiers.length === 0) return null;
    return (
        p.priceTiers.find((t: any) => t.isDefault && t.isActive !== false) ||
        p.priceTiers.find((t: any) => t.isActive !== false) ||
        p.priceTiers[0]
    );
}

function getPricing(p: any) {
    const defaultTier = getDefaultTier(p);
    const unitCost = Number(p.unitCost ?? defaultTier?.unitCost ?? 0);
    const salePrice = Number(p.salePrice ?? defaultTier?.salePrice ?? 0);
    const profitMargin = Number(
        p.profitMargin ?? defaultTier?.profitMargin ?? salePrice - unitCost
    );
    const marginPct =
        salePrice > 0 ? Math.round((profitMargin / salePrice) * 100) : 0;

    const extraTiersCount = Array.isArray(p.priceTiers)
        ? p.priceTiers.filter((t: any) => t.isActive !== false && !t.isDefault).length
        : 0;

    return { unitCost, salePrice, profitMargin, marginPct, extraTiersCount };
}

export function exportProductsToBwPdf({
    products,
    branchSettings,
    filters,
}: ExportProductsPdfOptions) {
    const bSettings = branchSettings as any;
    const branchName =
        bSettings?.name ||
        bSettings?.branchName ||
        bSettings?.businessName ||
        "Branch Product Inventory";
    const branchPhone =
        formatPhoneNumber(bSettings?.phone || bSettings?.contactPhone || bSettings?.phoneNumber || "N/A");
    const branchAddress =
        bSettings?.address || bSettings?.branchAddress || bSettings?.location || "N/A";
    const currency = bSettings?.currency || "Rs.";

    // Build readable "Filter Applied" summary string
    const activeFilters: string[] = [];
    if (filters.searchQuery?.trim()) {
        activeFilters.push(`Search: "${filters.searchQuery.trim()}"`);
    }
    if (filters.showLowStockOnly) activeFilters.push("Low Stock Only");
    if (filters.showPublicOnly) activeFilters.push("Public Only");
    if (filters.statusFilter && filters.statusFilter !== "ALL") {
        activeFilters.push(`Status: ${filters.statusFilter}`);
    }
    if (filters.categoryFilter && filters.categoryFilter !== "ALL") {
        activeFilters.push(`Category: ${formatEnumLabel(filters.categoryFilter)}`);
    }
    if (filters.trackingFilter && filters.trackingFilter !== "ALL") {
        activeFilters.push(`Tracking: ${formatEnumLabel(filters.trackingFilter)}`);
    }

    const filterAppliedText =
        activeFilters.length > 0
            ? activeFilters.join("  |  ")
            : "All Products (No Filter)";

    // Summary metrics across filtered list
    const totalProducts = products.length;
    const totalStockUnits = products.reduce(
        (sum, p: any) => sum + (Number(p.currentStock) || 0),
        0
    );
    const totalStockCostValue = products.reduce((sum, p: any) => {
        const { unitCost } = getPricing(p);
        return sum + (Number(p.currentStock) || 0) * unitCost;
    }, 0);
    const totalStockSaleValue = products.reduce((sum, p: any) => {
        const { salePrice } = getPricing(p);
        return sum + (Number(p.currentStock) || 0) * salePrice;
    }, 0);
    const lowStockCount = products.filter(
        (p: any) => Number(p.currentStock ?? 0) <= Number(p.lowStockThreshold ?? 0)
    ).length;
    const activeCount = products.filter((p: any) => p.isActive === true).length;

    const generatedAt = new Date().toLocaleString("en-PK", {
        dateStyle: "medium",
        timeStyle: "short",
    });

    const rowsHtml = products
        .map((p: any, idx) => {
            const code = p.productCode ? p.productCode.replace("PROD-", "#") : "-";
            const unitOfMeasure = formatEnumLabel(p.unitOfMeasure);
            const category = formatEnumLabel(p.category);
            const tracking = formatEnumLabel(p.trackingType);
            const currentStock = Number(p.currentStock) || 0;
            const openingStock = Number(p.openingStock) || 0;
            const threshold = Number(p.lowStockThreshold) || 0;
            const isLowStock = currentStock <= threshold;
            const deposit = Number(p.securityDeposit) || 0;

            const { unitCost, salePrice, profitMargin, marginPct, extraTiersCount } =
                getPricing(p);

            const visibility = p.isPublic ? "Public" : "Private";
            const status = p.isActive ? "ACTIVE" : "INACTIVE";

            return `
        <tr>
          <td class="center bold">${idx + 1}</td>
          <td>
            <div class="bold">${escapeHtml(p.name)}</div>
            <div class="sub mono">${escapeHtml(code)} • ${escapeHtml(unitOfMeasure)}</div>
          </td>
          <td>
            <div>${escapeHtml(category)}</div>
            <div class="sub">${escapeHtml(tracking)}${p.hasRecipe ? " • Recipe" : ""}</div>
          </td>
          <td class="right">
            <div class="bold">${currency} ${unitCost.toLocaleString()}</div>
            ${deposit > 0 ? `<div class="sub">Dep: ${currency} ${deposit.toLocaleString()}</div>` : ""}
          </td>
          <td class="right">
            <div class="bold">${currency} ${salePrice.toLocaleString()}</div>
            ${extraTiersCount > 0 ? `<div class="sub">+${extraTiersCount} tier(s)</div>` : ""}
          </td>
          <td class="right">
            <div class="bold">${currency} ${profitMargin.toLocaleString()}</div>
            <div class="sub">${marginPct}% margin</div>
          </td>
          <td class="center">
            <div class="bold">${currentStock.toLocaleString()}</div>
            <div class="sub">${isLowStock ? `<b>LOW</b> (≤ ${threshold})` : `Open: ${openingStock} | Min: ${threshold}`}</div>
          </td>
          <td class="center">
            <div class="bold">${escapeHtml(status)}</div>
            <div class="sub">${escapeHtml(visibility)}</div>
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
        <title>${escapeHtml(branchName)} - Products List</title>
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
          .summary-sub {
            font-size: 8.5px;
            margin-top: 1px;
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
              <div class="doc-badge">Product Inventory</div>
              <div><b>Generated:</b> ${escapeHtml(generatedAt)}</div>
              <div><b>Active Items:</b> ${activeCount} / ${totalProducts}</div>
            </div>
          </div>

          <!-- 2. Filter Applied Bar -->
          <div class="filter-box">
            <div><b>FILTER APPLIED:</b> ${escapeHtml(filterAppliedText)}</div>
            <div><b>Showing:</b> ${totalProducts} Product(s)</div>
          </div>

          <!-- 3. Totals Summary Strip -->
          <div class="summary-grid">
            <div class="summary-cell">
              <div class="summary-label">Total Products</div>
              <div class="summary-val">${totalProducts}</div>
            </div>
            <div class="summary-cell">
              <div class="summary-label">Total Stock Units</div>
              <div class="summary-val">${totalStockUnits.toLocaleString()}</div>
            </div>
            <div class="summary-cell">
              <div class="summary-label">Low Stock Alerts</div>
              <div class="summary-val">${lowStockCount}</div>
            </div>
            <div class="summary-cell">
              <div class="summary-label">Stock Value (Cost)</div>
              <div class="summary-val">${currency} ${totalStockCostValue.toLocaleString()}</div>
            </div>
            <div class="summary-cell">
              <div class="summary-label">Stock Value (Sale)</div>
              <div class="summary-val">${currency} ${totalStockSaleValue.toLocaleString()}</div>
            </div>
          </div>

          <!-- 4. Products Table -->
          <table>
            <thead>
              <tr>
                <th style="width: 4%; text-align: center;">#</th>
                <th style="width: 23%;">Product / Code / Unit</th>
                <th style="width: 15%;">Category & Tracking</th>
                <th style="width: 11%; text-align: right;">Unit Cost</th>
                <th style="width: 11%; text-align: right;">Sale Price</th>
                <th style="width: 11%; text-align: right;">Profit Margin</th>
                <th style="width: 15%; text-align: center;">Stock</th>
                <th style="width: 10%; text-align: center;">Status</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>

          <div class="footer">
            <span>${escapeHtml(branchName)} — Official Product Inventory Report</span>
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