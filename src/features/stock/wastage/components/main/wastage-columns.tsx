import { ColumnDef } from "@/lib/utils/components/TableCreateMachine";
import { WastageRecord } from "../../types/wastage";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils/functions/setFormat";

export const getWastageColumns = (
    onDelete: (log: WastageRecord) => void
): ColumnDef<WastageRecord>[] => [
        {
            header: "Date",
            render: (log) => (
                <span className="text-sm font-medium text-slate-700">
                    {format(new Date(log.createdAt), "dd MMM yyyy")}
                </span>
            ),
        },
        {
            header: "Item Details",
            render: (log) => (
                <div>
                    <p className="font-bold text-slate-900 text-sm mb-0.5">
                        {log.rawMaterial?.name || "Unknown Item"}
                    </p>
                    <p className={`text-[10px] font-bold uppercase tracking-wider w-fit p-1 ${log.source === "PRODUCTION" ? "text-green-700 bg-green-50" : "text-indigo-700 bg-indigo-50"}`}>
                        {log.source}
                    </p>
                </div>
            ),
        },
        {
            header: "Qty",
            render: (log) => (
                <span className="font-bold text-slate-900">
                    {log.quantityWasted.toLocaleString()}{" "}
                    <span className="text-xs text-slate-500 font-medium">
                        {log.rawMaterial?.unitOfMeasure?.toLowerCase()}
                    </span>
                </span>
            ),
        },
        {
            header: "Value Loss",
            render: (log) => {
                const calculateCost = log.quantityWasted * log.rawMaterial.unitCost;
                return (
                    <span className="font-bold text-rose-600">
                        Rs {formatCurrency(calculateCost)}
                    </span>
                )
            },
        },
        {
            header: "Reason",
            render: (log) => (
                <span className="text-sm text-slate-600 font-bold">{log.reason?.toLocaleLowerCase() || "-"}</span>
            ),
        },
        {
            header: "Action",
            className: "text-right",
            render: (log) => {
                const isProduction = log.source === 'PRODUCTION' || !!log.productionBatchId;
                if (isProduction) {
                    return (
                        <div className="flex justify-end">
                            <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded-md font-bold uppercase tracking-wider cursor-not-allowed">
                                System Locked
                            </span>
                        </div>
                    );
                }
                return (
                    <div className="flex justify-end">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onDelete(log)}
                            className="h-8 w-8 text-rose-400 hover:text-rose-600 hover:bg-rose-50"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                );
            }
        }
    ];