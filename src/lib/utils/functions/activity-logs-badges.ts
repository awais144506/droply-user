import { ActivityLog } from "@/types/ActivityLog";
import { Plus, Pen, Trash2, PackagePlus, ToggleLeft, Info } from "lucide-react";

export const getActionBadge = (action: ActivityLog["action"]) => {
    switch (action) {
        case "CREATED": return { icon: Plus, classes: "bg-emerald-50 text-emerald-600 border-emerald-100" };
        case "UPDATED": return { icon: Pen, classes: "bg-sky-50 text-sky-600 border-sky-100" };
        case "STATUS": return { icon: ToggleLeft, classes: "bg-amber-50 text-amber-600 border-amber-100" };
        case "DELETED": return { icon: Trash2, classes: "bg-rose-50 text-rose-600 border-rose-100" };
        case "RESTOCKED": return { icon: PackagePlus, classes: "bg-indigo-50 text-indigo-600 border-indigo-100" };
        default: return { icon: Info, classes: "bg-slate-50 text-slate-600 border-slate-200" };
    }
};