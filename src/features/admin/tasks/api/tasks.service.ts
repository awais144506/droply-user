import { apiClient } from "@/lib/api-client";
import { Task, CreateTaskPayload, UpdateTaskPayload } from "../types/task";

export const tasksService = {
  getAll: async (branchId: string, assignedToId?: string, assignedById?: string): Promise<Task[]> => {
    const params = new URLSearchParams();
    params.append("branchId", branchId);
    if (assignedToId) params.append("assignedToId", assignedToId);
    if (assignedById) params.append("assignedById", assignedById);
    return await apiClient.get(`/tasks?${params.toString()}`);
  },

  create: async (payload: CreateTaskPayload): Promise<Task> => {
    return await apiClient.post("/tasks", payload);
  },

  update: async ({ id, payload }: { id: string; payload: UpdateTaskPayload }): Promise<Task> => {
    return apiClient.patch(`/tasks/${id}`, payload);
  },
};