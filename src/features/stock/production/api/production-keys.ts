export const productionKeys = {
  all: ["production"] as const,
  lists: (branchId: string) => [...productionKeys.all, "list", branchId] as const,
  batch: (id: string) => [...productionKeys.all, "detail", id] as const,
};