export const staffKeys = {
  all: ["staff"] as const,
  branchList: (branchId: string) => [...staffKeys.all, "branch", branchId] as const,
  detail: (id: string) => [...staffKeys.all, "detail", id] as const,
  logs: (branchId: string) => [...staffKeys.all, "logs", branchId] as const,
};
