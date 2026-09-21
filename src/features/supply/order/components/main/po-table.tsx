"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import DataTable from "@/lib/utils/components/TableCreateMachine";
import TablePagination from "@/lib/utils/components/TablePagination";
import { usePagination } from "@/lib/utils/functions/pagination-calculation";
import ConfirmActionDialog from "@/lib/utils/components/ConfirmDeleteItemDialog";
import { sendPOWhatsApp } from "@/lib/utils/functions/whatsapp/whatsapp-utils";
import { PurchaseOrder } from "../../types/po";
import { getPOColumns } from "./po-columns";
import { useRole } from "@/lib/hooks/use-role";
import { useReceivePO, useUndoPO } from "../../api/use-mutate-po";
import { useBranchSettings } from "@/features/admin/settings/api/use-branch-settings";
import { generatePOPdf } from "@/lib/utils/functions/generatePdfs/generate-po-pdf";

interface POTableProps {
  orders?: PurchaseOrder[];
}

// Track what action the dialog should perform
type DialogState = {
  isOpen: boolean;
  type: "receive" | "undo" | null;
  po: PurchaseOrder | null;
};

export function POTable({ orders = [] }: POTableProps) {
  const router = useRouter();
  const { isManager, isOwner, branchId } = useRole();

  // Extract isPending to show loading spinners on the dialog
  const { mutate: processReceipt, isPending: isReceiving } = useReceivePO();
  const { mutate: undoReceipt, isPending: isUndoing } = useUndoPO();
  const { fetchBranchSettings } = useBranchSettings(branchId);
  const branchSettings = fetchBranchSettings.data;
  const [dialog, setDialog] = useState<DialogState>({ isOpen: false, type: null, po: null });

  const {
    currentPage,
    setCurrentPage,
    paginatedData,
    totalPages,
    totalItems,
    itemsPerPage
  } = usePagination(orders);

  const handlers = useMemo(() => ({
    onReceive: (po: PurchaseOrder) => {
      setDialog({ isOpen: true, type: "receive", po });
    },
    onUndo: (po: PurchaseOrder) => {
      setDialog({ isOpen: true, type: "undo", po });
    },
    onPrint: async (po: PurchaseOrder) => {
      // 1. Guard clause: Ensure settings have finished loading from the API
      if (!branchSettings) {
        toast.error("Branch settings are still loading. Please wait a second.");
        return;
      }

      toast.loading("Generating PDF...", { id: "pdf-toast" });

      try {
        // 2. Pass the actual data payload (branchSettings), not the hook!
        await generatePOPdf(po, branchSettings);
        toast.success("PDF Downloaded successfully!", { id: "pdf-toast" });
      } catch (error) {
        console.error("PDF Generation Error:", error);
        toast.error("Failed to generate PDF", { id: "pdf-toast" });
      }
    },
    onWhatsApp: (po: PurchaseOrder) => {
      sendPOWhatsApp(po);
    },
    onEdit: (po: PurchaseOrder) => {
      router.push(`/supply/orders/${po.id}/edit`);
    }
  }), [branchSettings, router]);

  const columns = useMemo(() => getPOColumns(router, handlers, isOwner, isManager), [router, handlers, isOwner, isManager]);

  // Handle the actual confirmation execution
  const executeAction = () => {
    if (!dialog.po) return;

    if (dialog.type === "receive") {
      processReceipt(dialog.po.id, {
        onSuccess: () => setDialog({ isOpen: false, type: null, po: null })
      });
    } else if (dialog.type === "undo") {
      undoReceipt(dialog.po.id, {
        onSuccess: () => setDialog({ isOpen: false, type: null, po: null })
      });
    }
  };

  return (
    <>
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <DataTable
          data={paginatedData}
          columns={columns}
          emptyMessage="No purchase orders match your current filters."
        />

        {(totalItems || 0) > 0 && (
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {/* Dynamic Dialog Renderer */}
      <ConfirmActionDialog
        isOpen={dialog.isOpen}
        onClose={() => setDialog({ isOpen: false, type: null, po: null })}
        onConfirm={executeAction}
        isLoading={isReceiving || isUndoing}
        title={dialog.type === "receive" ? "Confirm Stock Receipt" : "Undo Stock Receipt"}
        description={
          dialog.type === "receive" ? (
            <span>
              Are you sure you want to mark <span className="font-bold text-slate-900">{dialog.po?.poNumber}</span> as received?
              {isOwner && " This will permanently increment your live inventory stock levels."}
            </span>
          ) : (
            <span>
              Are you sure you want to reverse the receipt for <span className="font-bold text-slate-900">{dialog.po?.poNumber}</span>?
              This will decrement the physical stock levels that were added previously.
            </span>
          )
        }
        confirmText={dialog.type === "receive" ? "Confirm Receipt" : "Reverse Receipt"}
        confirmButtonClass={
          dialog.type === "receive"
            ? "bg-emerald-600 hover:bg-emerald-700 text-white"
            : "bg-amber-500 hover:bg-amber-600 text-white"
        }
      />
    </>
  );
}