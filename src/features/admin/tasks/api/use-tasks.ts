import { useQuery } from "@tanstack/react-query";
import { tasksService } from "./tasks.service";
import { tasksKeys } from "./tasks-keys";

interface UseTasksParams {
  branchId: string;
  assignedToId?: string;
  assignedById?: string;
}

export const useTasks = ({ branchId, assignedToId, assignedById }: UseTasksParams) => {
  return useQuery({
    queryKey: tasksKeys.listFilter(branchId, { assignedToId, assignedById }),
    queryFn: () => tasksService.getAll(branchId, assignedToId, assignedById),
    enabled: !!branchId,
  });
};