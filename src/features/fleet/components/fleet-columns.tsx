import { Vehicle, VehicleStatus } from "../types/fleet";
import { ColumnDef } from "@/utils/data-table";
import { Phone } from "lucide-react";
export const getFleetColumns = (): ColumnDef<Vehicle>[] => [
    {
        header: "Registration",
        render: (v) => (
            <span className="font-mono font-bold text-slate-900 text-xs bg-slate-100 px-2 py-1 rounded">
                {v.registration}
            </span>
        ),
    },

    {
        header: "Vehicle Info & Status",
        render: (v) => {


            return (
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-slate-900 text-sm">{v.modelInfo}</span>

                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="font-semibold text-sky-600">{v.type}</span>
                        <span>•</span>
                        <span className="uppercase font-bold">{v.fuelType}</span>
                    </div>
                </div>
            );
        },
    },
    {
        header: "Status",
        render: (v) => {
            const getStatusBadge = (status: VehicleStatus) => {
                switch (status) {
                    case "ACTIVE":
                        return "bg-emerald-50 text-emerald-600 border-emerald-100";
                    case "MAINTENANCE":
                        return "bg-amber-50 text-amber-600 border-amber-100";
                    case "RETIRED":
                        return "bg-rose-50 text-rose-600 border-rose-100";
                    default:
                        return "bg-slate-50 text-slate-600 border-slate-100";
                }
            };
            return (
                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold border ${getStatusBadge(v.status)}`}>
                    {v.status}
                </span>
            )},
    },
    {
        header: "Odometer",
        render: (v) => `${(v.currentOdometer || 0).toLocaleString()} km`,
    },
    {
        header: "Driver & Contact",
        render: (v) => (
            <div>
                <div className="text-sm font-bold text-slate-800">
                    {v.assignedTo?.name || "Unassigned"}
                </div>
                {v.assignedTo?.phone && (
                    <div className="text-[11px] text-slate-600 flex items-center gap-1 mt-0.5 font-mono">
                        <Phone className="h-3 w-3 text-slate-600" />
                        {v.assignedTo.phone}
                    </div>
                )}
            </div>
        ),
    },
];