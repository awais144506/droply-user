export const customerKeys = {
  all: ["branch-customers"] as const,
  lists: () => [...customerKeys.all, "list"] as const,
  branchList: (branchId?: string) => [...customerKeys.lists(), branchId] as const,
  details: () => [...customerKeys.all, "detail"] as const,
  detail: (id: string) => [...customerKeys.details(), id] as const,
  logs: () => [...customerKeys.all, "logs"] as const,
  customerLogs: (branchId?: string) => [...customerKeys.logs(), branchId] as const,
};
