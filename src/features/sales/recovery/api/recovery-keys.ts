export const recoveryKeys = {
  all: ["recovery"] as const,
  lists: () => [...recoveryKeys.all, "list"] as const,
  branchList: (
    branchId: string,
    filters?: { search?: string; date?: string; customerId?: string }
  ) =>
    [
      ...recoveryKeys.lists(),
      branchId,
      filters?.search || "",
      filters?.date || "",
      filters?.customerId || "",
    ] as const,
  completedOrders: (customerId: string) =>
    [...recoveryKeys.all, "completed-orders", customerId] as const,
};