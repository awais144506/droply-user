import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { ColumnDef } from "@/lib/utils/components/TableCreateMachine";
import { Button } from "@/components/ui/button";
import { ProductionBatch } from "../../types/production";
import { PackagePlus, Pen } from "lucide-react";
import { format } from "date-fns";


export const getProductionColumns = (
    router: AppRouterInstance,
    onFinalize: (batch: ProductionBatch) => void
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
            header: "Yield & Status",
            render: (batch) => {
                const isInProgress = batch.status === "IN_PROGRESS";

                return (
                    <div className="flex flex-col items-start">
                        <span className={`font-bold text-base ${isInProgress ? "text-amber-600" : "text-emerald-600"}`}>
                            {isInProgress
                                ? `Exp: ${batch.expectedYield?.toLocaleString()}`
                                : `+${batch.actualYield?.toLocaleString()}`
                            }
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 mt-1 rounded-full font-bold uppercase tracking-wider ${isInProgress
                            ? "bg-amber-100 text-amber-700"
                            : "bg-emerald-100 text-emerald-700"
                            }`}>
                            {batch.status.replace("_", " ")}
                        </span>
                    </div>
                );
            },
        },
        {
            header: "Actions",
            className: "text-right",
            render: (batch) => {
                const isInProgress = batch.status === "IN_PROGRESS";

                return (
                    <div className="flex justify-end items-center gap-1">
                        {/* WIP FINALIZE BUTTON */}
                        {isInProgress && (
                            <Button
                                variant="default"
                                size="sm"
                                onClick={() => onFinalize(batch)}
                                className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white mr-2 text-xs rounded-lg shadow-sm"
                            >
                                <PackagePlus className="h-3.5 w-3.5 mr-1.5" /> Add to Stock
                            </Button>
                        )}


                        {/* Standard Utilities */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push(`/stock/production/${batch.id}`)}
                            className="h-8 w-8 text-slate-400 hover:text-slate-600"
                        >
                            <Pen className="h-4 w-4" />
                        </Button>
                    </div>
                );
            },
        }
    ];