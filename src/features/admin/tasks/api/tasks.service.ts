import { apiClient } from "@/lib/api-client";
import { Task, UpdateTaskPayload } from "../types/task";
import { CreateTaskFormValues } from "../schema/tasks-schema";

export const tasksService = {
  getAll: async (branchId: string): Promise<Task[]> => {
    // Backend automatically handles role-based filtering via Clerk token
    return await apiClient.get(`/tasks/branch/${branchId}`);
  },

  create: async (payload: CreateTaskFormValues): Promise<Task> => {
    return await apiClient.post("/tasks", payload);
  },

  update: async ({ id, payload }: { id: string; payload: UpdateTaskPayload }): Promise<Task> => {
    return apiClient.patch(`/tasks/${id}`, payload);
  },

  delete: async (id: string) => {
    return apiClient.delete(`/tasks/${id}`);
  }
};