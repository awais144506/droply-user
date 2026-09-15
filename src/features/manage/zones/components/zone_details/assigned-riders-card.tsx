import Link from "next/link";
import { BikeIcon, Phone } from "lucide-react";

interface AssignedRider {
    id: string;
    name: string;
    phone?: string | null;
}

interface AssignedRidersCardProps {
    riders?: AssignedRider[];
}

export function AssignedRidersCard({ riders = [] }: AssignedRidersCardProps) {
    return (
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col">
            <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <BikeIcon className="h-5 w-5" />
                </div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Assigned Riders ({riders.length})</h3>
            </div>

            {/* Scrollable list in case a zone has multiple riders */}
            <div className="flex-1 flex gap-5 pr-1">
                {riders.length > 0 ? (
                    riders.map((rider) => (
                        <Link
                            key={rider.id}
                            href={`/admin/staff/${rider.id}`}
                            className="block p-2.5 -mx-2 bg-slate-50 border border-slate-300 rounded-xl hover:bg-emerald-50 hover:border-emerald-100 transition-all group"
                        >
                            <p className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                                {rider.name}
                            </p>
                            <div className="flex items-center gap-1.5 mt-1 text-xs font-medium text-slate-500 group-hover:text-emerald-600 transition-colors">
                                <Phone className="h-3 w-3" />
                                {rider.phone || "No phone"}
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="flex items-center h-full">
                        <p className="text-sm font-medium text-slate-400 italic">No riders assigned</p>
                    </div>
                )}
            </div>
        </div>
    );
}