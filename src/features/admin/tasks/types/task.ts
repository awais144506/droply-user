export type TaskStatus = "INCOMPLETE" | "COMPLETED";
export type AssigneeRole = "MANAGER" | "RIDER";

export interface Task {
  id: string;
  branchId: string;
  description: string;
  status: TaskStatus;
  
  assignedById: string;
  assignedByName: string;
  
  assignedToId: string;
  assignedToName: string;
  assignedToRole: AssigneeRole;
  
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

export interface CreateTaskPayload {
  branchId: string;
  description: string;
  assignedToId: string;
  assignedToName: string;
  assignedToRole: AssigneeRole;
}

export interface UpdateTaskPayload {
  description?: string;
  status?: TaskStatus;
}