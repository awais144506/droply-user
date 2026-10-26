import { apiClient } from "@/lib/api-client";
import { Task, UpdateTaskPayload } from "../types/task";
import { CreateTaskFormValues } from "../schema/tasks-schema";

const API = '/tasks/user'
export const tasksService = {
  getAll: async (): Promise<Task[]> => {
    // Backend automatically handles role-based filtering via Clerk token
    return await apiClient.get(`${API}`);
  },

  create: async (payload: CreateTaskFormValues): Promise<Task> => {
    return await apiClient.post(`${API}`, payload);
  },

  update: async ({ id, payload }: { id: string; payload: UpdateTaskPayload }): Promise<Task> => {
    return apiClient.patch(`${API}/${id}`, payload);
  },

  delete: async (id: string) => {
    return apiClient.delete(`${API}/${id}`);
  }
};