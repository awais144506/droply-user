import { useQuery } from "@tanstack/react-query";
import { tasksService } from "./tasks.service";
import { tasksKeys } from "./tasks-keys";

export const useTasks = (branchId: string, search?: string, status?: string) => {
  return useQuery({
    queryKey: tasksKeys.lists(branchId),
    queryFn: () => tasksService.getAll(branchId),
    select: (allTasks) => {
      // 1. Calculate stats on ALL tasks so top cards remain accurate regardless of filters
      const pendingTasks = allTasks.filter(t => t.status === "INCOMPLETE").length;
      const completedTasks = allTasks.filter(t => t.status === "COMPLETED").length;

      let filteredTasks = allTasks;

      // 2. Filter by Status Tab
      if (status) {
        filteredTasks = filteredTasks.filter(t => t.status === status);
      }

      // 3. Filter by Search String (checks description and assignee names)
      if (search) {
        const lowerSearch = search.toLowerCase();
        filteredTasks = filteredTasks.filter(t =>
          t.description.toLowerCase().includes(lowerSearch) ||
          t.assignedToName.toLowerCase().includes(lowerSearch) ||
          t.assignedByName.toLowerCase().includes(lowerSearch)
        );
      }

      return {
        tasks: filteredTasks,
        rawTasks: allTasks,
        stats: {
          pending: pendingTasks,
          completed: completedTasks
        }
      };
    },
    enabled: !!branchId,
  });
};