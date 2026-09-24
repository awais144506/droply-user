"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useRole } from "@/lib/hooks/use-role";
import { TaskStats } from "@/features/admin/tasks/components/main/task-stats";
import { TaskTable } from "@/features/admin/tasks/components/main/task-table";
import { TaskDialog } from "@/features/admin/tasks/components/create/task-dialog";
import { Button } from "@/components/ui/button";
import { useStaffList } from "@/features/admin/staff/api/use-staff";
import { useTasks } from "@/features/admin/tasks/api/use-tasks";
import Loading from "@/app/loading";
import { Task } from "@/features/admin/tasks/types/task";

export default function AdminTasksPage() {
  const { branchId, isLoading: isTenantLoading } = useRole();
  
  // Fetch Staff for the dropdown
  const { data: staffData, isLoading: isStaffLoading } = useStaffList(branchId);
  
  const staffOptions = staffData?.staffOptions
  console.log(staffOptions)
  const { data: tasks = [], isLoading: isTasksLoading } = useTasks({ branchId });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  if (isTenantLoading || isTasksLoading || isStaffLoading) {
    return <Loading text="Loading tasks..." />;
  }

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    // Slight delay before clearing data to prevent UI flashing during modal exit animation
    setTimeout(() => setEditingTask(null), 200);
  };

  return (
    <div className="space-y-6 max-w-350 mx-auto p-6">
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

      <TaskStats tasks={tasks} />
      
      {/* Ensure you pass your newly fetched tasks down */}
      <TaskTable tasks={tasks} onEdit={handleEdit} />

      {/* The Dialog */}
      <TaskDialog
        isOpen={isModalOpen}
        onClose={handleClose}
        branchId={branchId}
        staffList={staffOptions}
        initialData={editingTask}
      />
    </div>
  );
}