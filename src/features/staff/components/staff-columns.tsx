import { Phone, Mail, Calendar } from "lucide-react";
import { ColumnDef } from "@/lib/utils/data-table";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getStaffColumns = (): ColumnDef<any>[] => [
    {
        header: "Staff Code",
        className: "text-center text-xs font-bold text-slate-500 w-24",
        render: (staff) => staff.staffCode || "N/A",
    },
    {
        header: "Staff & Contact",
        render: (staff) => (
            <div>
                <div className="flex flex-row items-center mb-1">
                    <p className="font-bold text-slate-900 text-sm mr-2">{staff.name}</p>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[8px] font-bold ${
                        staff.status === 'ACTIVE'
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                            : "bg-rose-50 text-rose-600 border border-rose-100"
                    }`}>
                        {staff.status}
                    </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3 text-slate-400" />
                        {staff.phone}
                    </span>
                    {staff.email && (
                        <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3 text-slate-400" />
                            {staff.email}
                        </span>
                    )}
                </div>
            </div>
        ),
    },
    {
        header: "Role & Territory",
        render: (staff) => {
            // Prisma schema uses 'designation' for StaffRole
            const role = staff.designation || staff.role; 
            return (
                <div>
                    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                        role === "MANAGER"
                            ? "bg-sky-50 text-sky-700 border border-sky-100"
                            : "bg-amber-50 text-amber-700 border border-amber-100"
                    }`}>
                        {role}
                    </span>
                    {staff.zones && staff.zones.length > 0 && (
                        <p className="text-[10px] font-medium text-slate-500 mt-1 line-clamp-1">
                            {staff.zones.map((z: any) => z.name).join(", ")}
                        </p>
                    )}
                </div>
            );
        },
    },
    {
        header: "Joining Date",
        render: (staff) => {
            if (!staff.joiningDate) {
                return <span className="text-xs text-slate-400 italic">Not specified</span>;
            }

            const date = new Date(staff.joiningDate).toLocaleDateString('en-PK', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });

            return (
                <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    {date}
                </div>
            );
        },
    }
];