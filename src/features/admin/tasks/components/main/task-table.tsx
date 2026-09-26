"use client";

import { useMemo, useState } from "react";
import DataTable from "@/lib/utils/components/TableCreateMachine";
import TablePagination from "@/lib/utils/components/TablePagination";
import { usePagination } from "@/lib/utils/functions/pagination-calculation";
import ConfirmActionDialog from "@/lib/utils/components/ConfirmDeleteItemDialog";

import { Task } from "../../types/task";
import { getTaskColumns } from "./task-columns";
import { useRole } from "@/lib/hooks/use-role";
import { useDeleteTask, useUpdateTask } from "../../api/use-mutate-tasks";

interface TaskTableProps {
  tasks?: Task[];
  onEdit: (task: Task) => void;
}

export function TaskTable({ tasks = [], onEdit }: TaskTableProps) {
  const { isOwner, branchId } = useRole();
  const { mutate: deleteTask, isPending: isDeleting } = useDeleteTask(branchId);
  const { mutate: updateTask } = useUpdateTask(branchId);
  
  const [deleteData, setDeleteData] = useState<{ isOpen: boolean; task: Task | null }>({ isOpen: false, task: null });

  const {
    currentPage,
    setCurrentPage,
    paginatedData,
    totalPages,
    totalItems,
    itemsPerPage
  } = usePagination(tasks);

  const handlers = useMemo(() => ({
    onEdit,
    onDelete: (task: Task) => setDeleteData({ isOpen: true, task }),
    onToggleStatus: (task: Task) => {
      const newStatus = task.status === "COMPLETED" ? "INCOMPLETE" : "COMPLETED";
      updateTask({ id: task.id, payload: { status: newStatus } });
    }
  }), [onEdit, updateTask]);

  const columns = useMemo(() => getTaskColumns(handlers, isOwner), [handlers, isOwner]);

  const confirmDelete = () => {
    if (!deleteData.task) return;
    deleteTask(deleteData.task.id, {
      onSuccess: () => setDeleteData({ isOpen: false, task: null })
    });
  };

  return (
    <>
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <DataTable
          data={paginatedData}
          columns={columns}
          emptyMessage="No tasks match your filters."
        />

        {(totalItems || 0) > 0 && (
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      <ConfirmActionDialog
        isOpen={deleteData.isOpen}
        onClose={() => setDeleteData({ isOpen: false, task: null })}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
        title="Delete Task"
        description="Are you sure you want to delete this task? This cannot be undone."
        confirmText="Delete"
        confirmButtonClass="bg-rose-600 hover:bg-rose-700 text-white"
      />
    </>
  );
}