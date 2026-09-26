"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Plus, ClipboardList, CheckCircle2 } from "lucide-react";
import { useRole } from "@/lib/hooks/use-role";
import { TaskStats } from "@/features/admin/tasks/components/main/task-stats";
import { TaskTable } from "@/features/admin/tasks/components/main/task-table";
import { TaskDialog } from "@/features/admin/tasks/components/create/task-dialog";
import { Button } from "@/components/ui/button";
import { useStaffList } from "@/features/admin/staff/api/use-staff";
import { useTasks } from "@/features/admin/tasks/api/use-tasks";
import Loading from "@/app/loading";
import { Task } from "@/features/admin/tasks/types/task";
import { useUpdateTask } from "@/features/admin/tasks/api/use-mutate-tasks";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { DataTableFilterBar } from "@/components/ui/data-table-filter-bar";

export default function AdminTasksPage() {
  const searchParams = useSearchParams();
  const search = searchParams.get('search') || undefined;
  const status = searchParams.get('status') || undefined;

  const { branchId, userId, isLoading: isTenantLoading } = useRole();

  const { data: staffData, isLoading: isStaffLoading } = useStaffList(branchId);
  const staffOptions = staffData?.taskStaffOptions;

  const { data, isLoading: isTasksLoading } = useTasks(branchId, search, status);
  const { mutate: updateTask } = useUpdateTask(branchId);

  const stats = data?.stats || { pending: 0, completed: 0 };
  const tasks = data?.tasks || [];
  const rawTasks = data?.rawTasks || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  if (isTenantLoading || isTasksLoading || isStaffLoading) {
    return <Loading text="Loading tasks..." />;
  }

  // Use rawTasks so the badge count doesn't disappear when the user searches/filters the main table
  const myPendingTasks = rawTasks.filter(t => t.assignedToId === userId && t.status === "INCOMPLETE");

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setTimeout(() => setEditingTask(null), 200);
  };

  const markTaskDone = (id: string) => {
    updateTask({ id, payload: { status: "COMPLETED" } });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-6 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Task Delegation</h1>
          <p className="text-sm text-slate-500 mt-1">
            Assign and track daily operations for managers and riders.
          </p>
        </div>
        <Button
          onClick={() => { setEditingTask(null); setIsModalOpen(true); }}
          className="bg-sky-600 hover:bg-sky-700 text-white h-10 px-4 rounded-xl shadow-sm cursor-pointer"
        >
          <Plus className="h-4 w-4 mr-2" /> New Task
        </Button>
      </div>

      <TaskStats pending={stats.pending} completed={stats.completed} />

      <DataTableFilterBar
        searchParamName="search"
        searchPlaceholder="Search tasks or assignees..."
        tabParamName="status"
        tabs={[
          { label: "All", value: "" },
          { label: "Incomplete", value: "INCOMPLETE" },
          { label: "Completed", value: "COMPLETED" }
        ]}
      />

      <TaskTable tasks={tasks} onEdit={handleEdit} />

      <TaskDialog
        isOpen={isModalOpen}
        onClose={handleClose}
        branchId={branchId}
        staffList={staffOptions}
        initialData={editingTask}
      />

      {/* Floating Action Button for "My Tasks" */}
      {myPendingTasks.length > 0 && (
        <button
          onClick={() => setIsSheetOpen(true)}
          className="fixed bottom-8 right-8 z-40 bg-slate-900 hover:bg-slate-800 text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 flex items-center justify-center group"
        >
          <ClipboardList className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-white">
            {myPendingTasks.length}
          </span>
        </button>
      )}

      {/* Shadcn Sheet to display "My Tasks" */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="bg-slate-50 overflow-y-auto sm:max-w-md">
          <SheetHeader className="pb-6 border-b border-slate-200">
            <SheetTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-sky-600" />
              My Pending Tasks
            </SheetTitle>
          </SheetHeader>
          <div className="py-6 space-y-4">
            {myPendingTasks.map(task => (
              <div key={task.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-3">
                <span className="text-sm font-semibold text-slate-900 leading-snug">
                  {task.description}
                </span>
                <div className="flex items-center justify-between mt-2 pt-3 border-t border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    Assigned by: {task.assignedByName}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => markTaskDone(task.id)}
                    className="h-8 text-xs font-bold text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-1.5" /> Mark Done
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}