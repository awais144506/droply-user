"use client";

import { useState, useEffect } from "react";
import { Search, Pencil, Trash2, CheckCircle, Circle, AlertCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import { Task, TaskStatus } from "../api/use-tasks";
import { Button } from "@/components/ui/button";

type FilterType = "ALL" | TaskStatus;

export function TaskTable({ tasks, onEdit }: { tasks: Task[], onEdit: (t: Task) => void }) {
  const [localTasks, setLocalTasks] = useState<Task[]>([]);
  useEffect(() => { setLocalTasks(tasks); }, [tasks]);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<FilterType>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => { setCurrentPage(1); }, [searchQuery, statusFilter]);

  const filteredTasks = localTasks.filter((t) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = t.description.toLowerCase().includes(searchLower) || t.assignedToName.toLowerCase().includes(searchLower);
    if (statusFilter !== "ALL") return matchesSearch && t.status === statusFilter;
    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTasks = filteredTasks.slice(startIndex, startIndex + itemsPerPage);

  const formatDateTime = (isoString: string) => {
    return new Date(isoString).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
  };

  const toggleStatus = (task: Task) => {
    const newStatus = task.status === "COMPLETED" ? "INCOMPLETE" : "COMPLETED";
    setLocalTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: newStatus } : t));
    toast.success(newStatus === "COMPLETED" ? "Task marked complete." : "Task marked incomplete.");
  };

  const handleDelete = (id: string) => {
    setLocalTasks(prev => prev.filter(t => t.id !== id));
    toast.success("Task deleted.");
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
      <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search tasks or assignees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
          />
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button onClick={() => setStatusFilter("ALL")} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${statusFilter === "ALL" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>All</button>
          <button onClick={() => setStatusFilter("INCOMPLETE")} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${statusFilter === "INCOMPLETE" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>Incomplete</button>
          <button onClick={() => setStatusFilter("COMPLETED")} className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${statusFilter === "COMPLETED" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>Completed</button>
        </div>
      </div>

      <div className="overflow-x-auto min-h-[300px]">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50/50 text-[10px] uppercase font-bold text-slate-400 tracking-wider border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 whitespace-nowrap w-12"></th>
              <th className="px-6 py-4 whitespace-nowrap">Task Description</th>
              <th className="px-6 py-4 whitespace-nowrap">Assigned To</th>
              <th className="px-6 py-4 whitespace-nowrap">Priority</th>
              <th className="px-6 py-4 whitespace-nowrap">Due Date</th>
              <th className="px-6 py-4 whitespace-nowrap text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedTasks.length > 0 ? (
              paginatedTasks.map((task) => (
                <tr key={task.id} className={`hover:bg-slate-50/50 transition-colors group ${task.status === "COMPLETED" ? "opacity-60" : ""}`}>
                  <td className="px-6 py-4">
                    <button onClick={() => toggleStatus(task)} className="text-slate-400 hover:text-emerald-500 transition-colors">
                      {task.status === "COMPLETED" ? <CheckCircle className="h-5 w-5 text-emerald-500" /> : <Circle className="h-5 w-5" />}
                    </button>
                  </td>
                  <td className={`px-6 py-4 font-medium ${task.status === "COMPLETED" ? "line-through text-slate-400" : "text-slate-900"}`}>
                    {task.description}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-slate-700">{task.assignedToName}</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-0.5">{task.assignedToRole}</p>
                  </td>
                  <td className="px-6 py-4">
                    {task.type === "URGENT" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 text-[10px] font-bold border border-rose-100">
                        <AlertCircle className="h-3 w-3" /> Urgent
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold border border-slate-200">
                        <Clock className="h-3 w-3" /> Normal
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-xs font-semibold text-slate-500">
                    {formatDateTime(task.dueDate)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon-sm" onClick={() => onEdit(task)} className="text-slate-400 hover:text-sky-600 h-8 w-8 rounded-lg cursor-pointer">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(task.id)} className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 h-8 w-8 rounded-lg cursor-pointer">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-500 text-sm">No tasks match your filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-1.5 ml-auto">
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="h-8 rounded-lg text-xs bg-white cursor-pointer">Prev</Button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button key={i} onClick={() => setCurrentPage(i + 1)} className={`h-8 w-8 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center ${currentPage === i + 1 ? "bg-sky-600 text-white shadow-sm" : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"}`}>
                {i + 1}
              </button>
            ))}
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="h-8 rounded-lg text-xs bg-white cursor-pointer">Next</Button>
          </div>
        </div>
      )}
    </div>
  );
}