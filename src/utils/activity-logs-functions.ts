import { ActivityLog } from "@/types/ActivityLog";
import { Plus, Pen, Trash2, PackagePlus, Info } from "lucide-react";
export const getActionText = (action: ActivityLog["action"], type: string) => {
    const lowerType = type.toLowerCase();
    switch (action) {
        case "CREATED": return `created a new ${lowerType}`;
        case "UPDATED": return `updated ${lowerType} details for`;
        case "DELETED": return `deleted ${lowerType}`;
        case "RESTOCKED": return `restocked inventory for`;
        default: return `modified ${lowerType}`;
    }
};

export const getActionBadge = (action: ActivityLog["action"]) => {
    switch (action) {
        case "CREATED": return { icon: Plus, classes: "bg-emerald-50 text-emerald-600 border-emerald-100" };
        case "UPDATED": return { icon: Pen, classes: "bg-sky-50 text-sky-600 border-sky-100" };
        case "DELETED": return { icon: Trash2, classes: "bg-rose-50 text-rose-600 border-rose-100" };
        case "RESTOCKED": return { icon: PackagePlus, classes: "bg-indigo-50 text-indigo-600 border-indigo-100" };
        default: return { icon: Info, classes: "bg-slate-50 text-slate-600 border-slate-200" };
    }
};