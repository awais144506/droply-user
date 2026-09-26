import { ColumnDef } from "@/lib/utils/components/TableCreateMachine";
import { Task } from "../../types/task";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Trash2, Edit2, CheckCircle2, Circle } from "lucide-react";

interface TaskActionHandlers {
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onToggleStatus: (task: Task) => void;
}

export const getTaskColumns = (
  handlers: TaskActionHandlers,
  isOwner: boolean
): ColumnDef<Task>[] => [
  {
    header: "DATE",
    render: (task) => (
      <span className="text-sm font-medium text-slate-500 whitespace-nowrap">
        {format(new Date(task.createdAt), "MMM d, yyyy")}
      </span>
    ),
  },
  {
    header: "DESCRIPTION",
    render: (task) => (
      <span className="font-semibold text-slate-900 text-sm">
        {task.description}
      </span>
    ),
  },
  {
    header: "ASSIGNED TO",
    render: (task) => (
      <div className="flex flex-col gap-1">
        <span className="font-bold text-slate-900 text-sm leading-none">
          {task.assignedToName}
        </span>
        <span className="inline-flex items-center w-fit px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider text-sky-700 bg-sky-50 border border-sky-100">
          {task.assignedToRole}
        </span>
      </div>
    ),
  },
  {
    header: "STATUS",
    render: (task) => {
      const isCompleted = task.status === "COMPLETED";
      return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold border ${
          isCompleted ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-amber-50 text-amber-700 border-amber-100"
        }`}>
          {isCompleted ? <CheckCircle2 className="h-3 w-3" /> : <Circle className="h-3 w-3" />}
          {task.status}
        </span>
      );
    },
  },
  {
    header: "ACTIONS",
    className: "text-right",
    render: (task) => (
      <div className="flex justify-end items-center gap-1">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={(e) => { e.stopPropagation(); handlers.onToggleStatus(task); }} 
          className={`h-8 px-2 text-xs font-medium ${task.status === "COMPLETED" ? "text-amber-600 hover:bg-amber-50" : "text-emerald-600 hover:bg-emerald-50"}`}
        >
          {task.status === "COMPLETED" ? "Mark Incomplete" : "Mark Done"}
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={(e) => { e.stopPropagation(); handlers.onEdit(task); }} 
          className="h-8 w-8 text-slate-400 hover:text-sky-600"
        >
          <Edit2 className="h-4 w-4" />
        </Button>

        {isOwner && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={(e) => { e.stopPropagation(); handlers.onDelete(task); }} 
            className="h-8 w-8 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    ),
  },
];