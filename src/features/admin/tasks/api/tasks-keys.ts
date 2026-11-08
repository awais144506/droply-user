export const tasksKeys = {
  all: ["tasks"] as const,
  lists: (branchId: string) => [...tasksKeys.all, "list", branchId] as const,
};