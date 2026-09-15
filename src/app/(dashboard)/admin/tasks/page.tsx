"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { useRole } from "@/lib/hooks/use-role";
import { useTasks, Task } from "@/features/admin/tasks/api/use-tasks";
import { TaskStats } from "@/features/admin/tasks/components/task-stats";
import { TaskTable } from "@/features/admin/tasks/components/task-table";
import { Button } from "@/components/ui/button";

export default function AdminTasksPage() {
  const { branchId, isLoading: isTenantLoading } = useRole();
  const { data: tasks = [], isLoading } = useTasks(branchId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  if (isTenantLoading || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin mb-4 text-sky-600" />
        <p className="text-sm font-medium">Loading task data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto p-6">
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
      
      <TaskTable 
        tasks={tasks} 
        onEdit={(task) => {
          setEditingTask(task);
          setIsModalOpen(true);
        }}
      />
    </div>
  );
}