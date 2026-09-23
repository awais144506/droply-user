export const productionKeys = {
  all: ["production"] as const,
  lists: (branchId: string) => [...productionKeys.all, "list", branchId] as const,
};