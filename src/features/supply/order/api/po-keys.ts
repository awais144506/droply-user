export const poKeys = {
    all: ["purchase-orders"] as const,
    lists: () => [...poKeys.all, "list"] as const,
    list: (branchId: string) => [...poKeys.lists(), { branchId }] as const,
    details: () => [...poKeys.all, "detail"] as const,
    detail: (id: string) => [...poKeys.details(), id] as const,
    logs: () => [...poKeys.all, "logs"] as const,
};