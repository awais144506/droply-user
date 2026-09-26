export const expensesKeys = {
  all: ["expenses"] as const,
  lists: () => [...expensesKeys.all, "list"] as const,
  list: (branchId: string) => [...expensesKeys.lists(), { branchId }] as const,
};