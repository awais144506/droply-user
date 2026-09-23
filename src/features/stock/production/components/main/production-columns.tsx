import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { ColumnDef } from "@/lib/utils/components/TableCreateMachine";
import { Button } from "@/components/ui/button";
import { ProductionBatch } from "../../types/production";
import { Printer, RotateCcw } from "lucide-react";
import { format } from "date-fns";

interface ProductionActionHandlers {
    onUndo: (batch: ProductionBatch) => void;
    onPrint: (batch: ProductionBatch) => void;
}

export const getProductionColumns = (
    router: AppRouterInstance,
    handlers: ProductionActionHandlers,
    isOwner: boolean,
): ColumnDef<ProductionBatch>[] => [
        {
            header: "Batch # & Date",
            render: (batch) => (
                <div>
                    <p className="font-bold text-slate-900 text-sm mb-1">{batch.batchCode}</p>
                    <p className="text-xs text-slate-500 font-medium">
                        {format(new Date(batch.productionDate), "MMM d, yyyy")}
                    </p>
                </div>
            ),
        },
        {
            header: "Item Produced",
            render: (batch) => (
                <div>
                    <p className="font-bold text-slate-900 text-sm mb-1">
                        {batch.product?.name || "Unknown Product"}
                    </p>
                </div>
            ),
        },
        {
            header: "Raw Materials Consumed",
            render: (batch) => (
                <div className="space-y-1">
                    {batch.consumedItems?.map((item, idx) => (
                        <p key={item.id || idx} className="text-xs text-slate-600 font-medium">
                            <span className="font-bold text-slate-900">{item.quantityUsed.toLocaleString()}x</span> {item.rawMaterial?.name || "Item"}
                        </p>
                    ))}
                </div>
            ),
        },
        {
            header: "Supervisor",
            render: (batch) => (
                <div className="text-slate-700 text-sm font-medium">
                    {batch.supervisorName}
                </div>
            ),
        },
        {
            header: "Yield Quantity",
            render: (batch) => (
                <div className="flex flex-col">
                    <span className="font-bold text-sky-600 text-base">
                        +{batch.yieldQuantity.toLocaleString()}
                    </span>
                </div>
            ),
        },
        {
            header: "Actions",
            className: "text-right",
            render: (batch) => {
                return (
                    <div className="flex justify-end items-center gap-1">
                        {/* UNDO LOGIC: Exclusively for Owners */}
                        {isOwner && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => { e.stopPropagation(); handlers.onUndo(batch); }}
                                className="h-8 text-amber-600 hover:text-rose-600 hover:bg-rose-50 mr-2"
                            >
                                <RotateCcw className="h-4 w-4 mr-1.5" /> Undo
                            </Button>
                        )}

                        {/* Standard Utilities */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => { e.stopPropagation(); handlers.onPrint(batch); }}
                            className="h-8 w-8 text-slate-400 hover:text-slate-600"
                        >
                            <Printer className="h-4 w-4" />
                        </Button>
                    </div>
                );
            },
        }
    ];