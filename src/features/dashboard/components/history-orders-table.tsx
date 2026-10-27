"use client";
import { useState, useEffect } from "react";
import {
  ReceiptText,
  Printer,
  FileEdit,
  Ban,
  Search,
  CheckCircle2,
  XCircle,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Loader2,
  X,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ThermalReceiptDialog, {
  ReceiptOrderData,
} from "./thermal-receipt-dialog";
import { useQuickSales } from "../api/use-quicksale";
import { useVoidQuickSale } from "../api/use-mutate-quicksale";
import { QuickSaleRecord, QuickSaleStatus } from "../types/quicksale";
import { BranchSettingData } from "@/features/admin/settings/types/settings";
import ConfirmActionDialog from "@/lib/utils/components/ConfirmDialog";

type Props = {
  branchId: string;
  branchDetails?: BranchSettingData;
  onEditSale?: (sale: QuickSaleRecord) => void;
};

const QuickSaleHistory = ({ branchId, branchDetails, onEditSale }: Props) => {
  // Server-Side Filter & Pagination State
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<QuickSaleStatus | "ALL">("ALL");
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return new Date().toISOString().split("T")[0]; // Defaults to today's YYYY-MM-DD
  });

  // Thermal Receipt Reprint Modal State
  const [reprintOrder, setReprintOrder] = useState<ReceiptOrderData | null>(null);
  const [voidingId, setVoidingId] = useState<string | null>(null);

  // 🔥 State for ConfirmActionDialog modal
  const [saleToVoid, setSaleToVoid] = useState<QuickSaleRecord | null>(null);

  // Debounce search input by 350ms so we don't spam the backend on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
      setPage(1); // Reset to page 1 when search changes
    }, 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Fetch Paginated & Filtered Sales from NestJS Backend
  const { data, isLoading, isFetching } = useQuickSales(branchId, {
    page,
    limit,
    date: selectedDate || undefined,
    search: debouncedSearch || undefined,
    status: statusFilter === "ALL" ? undefined : statusFilter,
  });

  const voidMutation = useVoidQuickSale();

  const sales = data?.data || [];
  const meta = data?.meta || { totalCount: 0, page: 1, limit: 20, totalPages: 1 };

  // Convert Database Record -> Thermal Receipt Format for Reprinting
  const handleOpenReprint = (sale: QuickSaleRecord) => {
    const formatted: ReceiptOrderData = {
      receiptNumber: sale.receiptNumber,
      createdAt: new Date(sale.createdAt).toLocaleTimeString([], {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
      customerName: sale.customerName,
      paymentMethod: sale.paymentMethod,
      items: sale.items.map((i) => ({
        id: i.id,
        name: i.itemName,
        qty: i.quantity,
        price: i.unitPrice,
        unit: i.unit,
      })),
      discount: sale.discount,
      subTotal: sale.subTotal,
      grandTotal: sale.totalAmount,
      cashReceived: sale.cashReceived ?? sale.totalAmount,
      changeDue: sale.changeDue ?? 0,
      customerPhone: ""
    };
    setReprintOrder(formatted);
  };

  // 🔥 Execute Void Mutation after confirmation
  const confirmVoidReceipt = async () => {
    if (!saleToVoid) return;

    try {
      setVoidingId(saleToVoid.id);
      await voidMutation.mutateAsync(saleToVoid.id);
    } finally {
      setVoidingId(null);
      setSaleToVoid(null);
    }
  };

  // Reset All Filters
  const handleResetFilters = () => {
    setSearchInput("");
    setDebouncedSearch("");
    setStatusFilter("ALL");
    setSelectedDate(new Date().toISOString().split("T")[0]);
    setPage(1);
  };

  return (
    <div className="space-y-4">
      <Card className="border-slate-200/90 shadow-xs rounded-2xl overflow-hidden">
        {/* Card Header: Title + Daily KPI Summary Pills */}
        <CardHeader className="pb-4 border-b border-slate-100 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs shrink-0">
                <ReceiptText className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-base font-bold text-slate-900">
                    Quick Sale History
                  </CardTitle>
                  {isFetching && !isLoading && (
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-sky-600" />
                  )}
                </div>
                <p className="text-xs text-slate-500">
                  Server-side filtered receipts — reprint slips, edit active orders, or void to restore stock
                </p>
              </div>
            </div>

          </div>

          {/* Filter Bar: Search + Date Picker + Status Pills */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
            {/* Search by Receipt #, Customer Name, or Phone */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search receipt # (QS-...), customer name, or phone..."
                className="pl-9 pr-8 h-9 text-xs bg-slate-50/70 border-slate-200 focus:bg-white"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Right Controls: Date Filter + Status Tabs + Reset */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setPage(1);
                  }}
                  className="h-9 text-xs bg-white border-slate-200 w-38"
                />
              </div>

              {/* Status Filter Pills */}
              <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-100/70">
                {(["ALL", "COMPLETED", "VOIDED"] as const).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => {
                      setStatusFilter(status);
                      setPage(1);
                    }}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                      statusFilter === status
                        ? "bg-white text-slate-900 shadow-2xs"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="h-9 px-2.5 text-xs text-slate-500 hover:text-slate-800"
                title="Reset filters to today"
              >
                <RotateCcw className="h-3.5 w-3.5 mr-1" /> Reset
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Data Table */}
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/80">
                <TableRow>
                  <TableHead className="text-xs font-bold text-slate-700 py-3 pl-6">
                    Receipt #
                  </TableHead>
                  <TableHead className="text-xs font-bold text-slate-700 py-3">
                    Customer Name
                  </TableHead>
                  <TableHead className="text-xs font-bold text-slate-700 py-3">
                    Items Summary
                  </TableHead>
                  <TableHead className="text-xs font-bold text-slate-700 py-3">
                    Payment
                  </TableHead>
                  <TableHead className="text-xs font-bold text-slate-700 py-3">
                    Total Amount
                  </TableHead>
                  <TableHead className="text-xs font-bold text-slate-700 py-3">
                    Status
                  </TableHead>
                  <TableHead className="text-xs font-bold text-slate-700 py-3">
                    Time
                  </TableHead>
                  <TableHead className="text-xs font-bold text-slate-700 py-3 text-right pr-6">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-slate-100">
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-40 text-center">
                      <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                        <Loader2 className="h-6 w-6 animate-spin text-sky-600" />
                        <span className="text-xs font-medium">
                          Loading quick sale receipts...
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : sales.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="h-36 text-center text-xs text-slate-400"
                    >
                      No quick sale receipts found for the selected filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  sales.map((sale) => {
                    const isVoided = sale.status === "VOIDED";
                    const isVoidingThis = voidingId === sale.id;

                    return (
                      <TableRow
                        key={sale.id}
                        className={
                          isVoided
                            ? "bg-rose-50/20 opacity-65"
                            : "hover:bg-slate-50/50"
                        }
                      >
                        <TableCell className="py-3.5 pl-6 font-mono text-xs font-bold text-slate-900">
                          {sale.receiptNumber}
                        </TableCell>

                        <TableCell className="py-3.5 text-xs">
                          <div className="font-semibold text-slate-800">
                            {sale.customerName}
                          </div>
                          {sale.processedBy && (
                            <span className="text-[10px] text-slate-400">
                              By: {sale.processedBy}
                            </span>
                          )}
                        </TableCell>

                        <TableCell className="py-3.5 text-xs text-slate-600 max-w-56">
                          <div className="truncate font-medium text-slate-700">
                            {sale.items
                              .map((i) => `${i.itemName} (x${i.quantity})`)
                              .join(", ")}
                          </div>
                          <span className="text-[10px] text-slate-400">
                            {sale.items.length} item(s)
                            {sale.discount > 0 &&
                              ` • Disc: Rs. ${sale.discount.toLocaleString()}`}
                          </span>
                        </TableCell>

                        <TableCell className="py-3.5 text-xs">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded-md font-bold text-[10px] ${
                              sale.paymentMethod === "ONLINE"
                                ? "bg-sky-50 text-sky-700 border border-sky-200/60"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {sale.paymentMethod}
                          </span>
                        </TableCell>

                        <TableCell
                          className={`py-3.5 text-xs font-extrabold ${
                            isVoided
                              ? "line-through text-slate-400"
                              : "text-sky-700"
                          }`}
                        >
                          Rs. {Number(sale.totalAmount).toLocaleString()}
                        </TableCell>

                        <TableCell className="py-3.5 text-xs">
                          {isVoided ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold">
                              <XCircle className="h-3 w-3" /> VOIDED
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                              <CheckCircle2 className="h-3 w-3" /> COMPLETED
                            </span>
                          )}
                        </TableCell>

                        <TableCell className="py-3.5 text-xs text-slate-500 whitespace-nowrap">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <Calendar className="h-3 w-3 text-slate-400" />
                              {new Date(sale.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                            <span>By: {sale.processedBy}</span>
                          </div>
                        </TableCell>

                        <TableCell className="py-3.5 pr-6 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* 1. Print Thermal Slip */}
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenReprint(sale)}
                              className="h-8 px-2.5 text-xs border-slate-200 text-sky-700 hover:bg-sky-50"
                              title="Print Thermal Receipt"
                            >
                              <Printer className="h-3.5 w-3.5 mr-1" /> Print
                            </Button>

                            {/* 2. Edit Receipt (Loads into ProductCart above) */}
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              disabled={isVoided}
                              onClick={() => onEditSale && onEditSale(sale)}
                              className="h-8 px-2.5 text-xs border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40"
                              title="Edit Receipt"
                            >
                              <FileEdit className="h-3.5 w-3.5" />
                            </Button>

                            {/* 3. Void Receipt (Restores Stock; No Deletion Allowed) */}
                            {!isVoided && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                disabled={isVoidingThis}
                                onClick={() => setSaleToVoid(sale)}
                                className="h-8 px-2.5 text-xs border-rose-200 text-rose-600 hover:bg-rose-50 hover:border-rose-300"
                                title="Void Receipt & Restore Stock"
                              >
                                {isVoidingThis ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                  <Ban className="h-3.5 w-3.5" />
                                )}
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Footer */}
          <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/40 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-slate-500">
              Showing{" "}
              <span className="font-bold text-slate-800">
                {sales.length === 0 ? 0 : (meta.page - 1) * meta.limit + 1}
              </span>{" "}
              to{" "}
              <span className="font-bold text-slate-800">
                {Math.min(meta.page * meta.limit, meta.totalCount)}
              </span>{" "}
              of{" "}
              <span className="font-bold text-slate-800">
                {meta.totalCount.toLocaleString()}
              </span>{" "}
              receipts
            </span>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={meta.page <= 1 || isLoading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="h-8 px-2.5 text-xs border-slate-200"
              >
                <ChevronLeft className="h-3.5 w-3.5 mr-1" /> Previous
              </Button>

              <span className="text-xs font-semibold text-slate-700 px-2">
                Page {meta.page} of {Math.max(1, meta.totalPages)}
              </span>

              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={meta.page >= meta.totalPages || isLoading}
                onClick={() => setPage((p) => p + 1)}
                className="h-8 px-2.5 text-xs border-slate-200"
              >
                Next <ChevronRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Thermal Receipt Modal for Reprinting */}
      <ThermalReceiptDialog
        isOpen={Boolean(reprintOrder)}
        onClose={() => setReprintOrder(null)}
        order={reprintOrder}
        branchDetails={branchDetails}
      />

      <ConfirmActionDialog
        isOpen={Boolean(saleToVoid)}
        onClose={() => setSaleToVoid(null)}
        onConfirm={confirmVoidReceipt}
        title="Void Receipt"
        description={`Are you sure you want to VOID Receipt #${saleToVoid?.receiptNumber}? This will restore all tracked product stock back to inventory and cannot be undone.`}
        confirmText="Yes, Void Receipt"
        confirmButtonVariant="destructive"
        isLoading={voidMutation.isPending}
      />
    </div>
  );
};

export default QuickSaleHistory;