export const productKeys = {
    all: ["branch-products"] as const,
    lists: () => [...productKeys.all, "list"] as const,
    branchList: (branchId?: string) => [...productKeys.lists(), branchId] as const,
    details: () => [...productKeys.all, "detail"] as const,
    detail: (id: string) => [...productKeys.details(), id] as const,
    logs: () => [...productKeys.all, "logs"] as const,
    branchLogs: (branchId?: string) => [...productKeys.logs(), branchId] as const,
};