import { Plus, Pen, Trash2, PackagePlus, Info, History } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ActivityLog } from "@/types/ActivityLog";

interface ActivityLogsCardProps {
    title?: string;
    logs: ActivityLog[];
}

export default function ActivityLogsCard({ title = "Recent Activity", logs }: ActivityLogsCardProps) {
    
    const getActionText = (action: ActivityLog["action"]) => {
        switch (action) {
            case "CREATED": return "created a new record";
            case "UPDATED": return "updated a record";
            case "DELETED": return "deleted a record";
            case "RESTOCKED": return "restocked inventory";
            default: return "performed an action";
        }
    };

    const getActionBadge = (action: ActivityLog["action"]) => {
        switch (action) {
            case "CREATED": return { icon: Plus, classes: "bg-emerald-50 text-emerald-600 border-emerald-100" };
            case "UPDATED": return { icon: Pen, classes: "bg-sky-50 text-sky-600 border-sky-100" };
            case "DELETED": return { icon: Trash2, classes: "bg-rose-50 text-rose-600 border-rose-100" };
            case "RESTOCKED": return { icon: PackagePlus, classes: "bg-indigo-50 text-indigo-600 border-indigo-100" };
            default: return { icon: Info, classes: "bg-slate-50 text-slate-600 border-slate-200" };
        }
    };

    return (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-slate-100 flex items-center gap-2">
                <History className="h-4 w-4 text-slate-400" />
                <h3 className="text-sm font-bold text-slate-900">{title}</h3>
            </div>
            
            {logs.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">
                    No recent activity found.
                </div>
            ) : (
                <div className="max-h-96 overflow-y-auto custom-scrollbar p-4 space-y-4">
                    {logs.map((log) => {
                        const { icon: Icon, classes } = getActionBadge(log.action);
                        
                        return (
                            <div key={log.id} className="flex gap-4 group">
                                <div className="flex flex-col items-center">
                                    <div className={`h-8 w-8 rounded-full border flex items-center justify-center shrink-0 ${classes}`}>
                                        <Icon className="h-3.5 w-3.5" />
                                    </div>
                                    <div className="w-px h-full bg-slate-100 mt-2 group-last:hidden" />
                                </div>
                                
                                <div className="pb-4">
                                    <p className="text-sm text-slate-700 leading-tight">
                                        <span className="font-bold text-slate-900">
                                            {log.userName || "System User"}
                                        </span>{" "}
                                        {getActionText(log.action)}.
                                    </p>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1">
                                        {log.createdAt && !isNaN(new Date(log.createdAt).getTime())
                                            ? formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })
                                            : "Recently"}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}