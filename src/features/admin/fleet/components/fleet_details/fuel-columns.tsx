import { ColumnDef } from "@/lib/utils/components/TableCreateMachine";
import { formatCurrency } from "@/lib/utils/functions/setFormat";
import { format } from "date-fns";
import { VehicleExpense } from "../../types/fleet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface ExpenseColumnHandlers {
    onDelete: (record: VehicleExpense) => void;
}

export const getVehicleExpenseColumns = (handlers: ExpenseColumnHandlers): ColumnDef<VehicleExpense>[] => [
    {
        header: "DATE",
        render: (record) => (
            <span className="font-bold text-slate-900 text-sm">
                {format(new Date(record.createdAt), "MMM d, yyyy")}
            </span>
        ),
    },
    {
        header: "CATEGORY",
        render: (record) => {
            const isFuel = record.category === "FUEL";
            return (
                <Badge className={isFuel ? "bg-sky-50 text-sky-700 border-sky-200" : "bg-amber-50 text-amber-700 border-amber-200"}>
                    {isFuel ? "Fuel Refill" : "Maintenance"}
                </Badge>
            );
        }
    },
    {
        header: "DETAILS / REFERENCE",
        render: (record) => {
            if (record.category === "FUEL") {
                return (
                    <span className="text-slate-600 font-medium">
                        {record.liters ? `${record.liters.toLocaleString()} L @ Rs ${formatCurrency(record.costPerLiter || 0)}/L` : "-"}
                    </span>
                );
            }
            return (
                <div>
                    <p className="font-medium text-slate-800">{record.serviceProvider || "General Maintenance"}</p>
                    {record.invoiceNumber && <p className="text-xs text-slate-400">Inv: {record.invoiceNumber}</p>}
                </div>
            );
        },
    },
    {
        header: "ODOMETER",
        render: (record) => (
            <span className="font-medium text-slate-600">
                {record.odometerReading.toLocaleString()} km
            </span>
        ),
    },
    {
        header: "TOTAL COST",
        className: "text-right",
        render: (record) => (
            <span className="font-bold text-rose-600 flex justify-end">
                Rs {formatCurrency(record.totalCost)}
            </span>
        ),
    },
    {
        header: "ACTIONS",
        className: "w-20 text-center",
        render: (record) => (
            <div className="flex items-center justify-center">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                    onClick={() => handlers.onDelete(record)}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        )
    }
];