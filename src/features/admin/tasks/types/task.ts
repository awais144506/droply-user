export type TaskStatus = "INCOMPLETE" | "COMPLETED";
export type AssigneeRole = "MANAGER" | "RIDER";

export interface Task {
  id: string;
  branchId: string;
  description: string;
  status: TaskStatus;
  assignedById: string;
  assignedByName: string;
  assignedByRole: string;
  assignedToId: string;
  assignedToName: string;
  assignedToRole: AssigneeRole;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

export interface UpdateTaskPayload {
  status?: TaskStatus;
  description?: string;
}