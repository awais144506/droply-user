import { useQuery } from "@tanstack/react-query";

export type TaskType = "URGENT" | "NORMAL";
export type TaskStatus = "INCOMPLETE" | "COMPLETED";
export type AssigneeRole = "MANAGER" | "RIDER";

export interface Task {
  id: string;
  description: string;
  assignedToName: string;
  assignedToRole: AssigneeRole;
  type: TaskType;
  dueDate: string;
  status: TaskStatus;
}

export function useTasks(branchId: string) {
  return useQuery({
    queryKey: ["admin-tasks", branchId],
    queryFn: async (): Promise<Task[]> => {
      return [
        {
          id: "1", description: "Audit daily cash collection from Route A.",
          assignedToName: "Chaudhry Bilal", assignedToRole: "MANAGER",
          type: "URGENT", dueDate: "2026-09-03T18:00:00Z", status: "INCOMPLETE"
        },
        {
          id: "2", description: "Deliver 50 replacement caps to Al-Madina Water.",
          assignedToName: "Rider Ali", assignedToRole: "RIDER",
          type: "NORMAL", dueDate: "2026-09-04T10:00:00Z", status: "INCOMPLETE"
        },
        {
          id: "3", description: "Verify diesel expense receipts for Vehicle LXZ-992.",
          assignedToName: "Chaudhry Bilal", assignedToRole: "MANAGER",
          type: "NORMAL", dueDate: "2026-09-02T15:00:00Z", status: "COMPLETED"
        },
        {
          id: "4", description: "Emergency cylinder drop-off at Sahiwal Hospital.",
          assignedToName: "Rider Usman", assignedToRole: "RIDER",
          type: "URGENT", dueDate: "2026-09-03T14:00:00Z", status: "COMPLETED"
        }
      ];
    },
    enabled: Boolean(branchId),
  });
}