export const tasksKeys = {
  all: ["tasks"] as const,
  lists: (branchId: string) => [...tasksKeys.all, "list", branchId] as const,
  // This allows caching different tabs (My Tasks vs Delegated) separately
  listFilter: (branchId: string, filter: { assignedToId?: string; assignedById?: string }) => 
    [...tasksKeys.lists(branchId), filter] as const,
};