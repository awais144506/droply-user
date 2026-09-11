// 1. Revert zoneKeys.branchList to only require branchId
export const zoneKeys = {
    all: ["branch-zones"] as const,
    lists: () => [...zoneKeys.all, "list"] as const,
    branchList: (branchId?: string) => [...zoneKeys.lists(), branchId] as const,
    details: () => [...zoneKeys.all, "detail"] as const,
    detail: (id: string) => [...zoneKeys.details(), id] as const,
    logs: () => [...zoneKeys.all, "logs"] as const,
    branchLogs: (branchId?: string) => [...zoneKeys.logs(), branchId] as const,
};