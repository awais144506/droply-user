// --- 1. QUERY KEYS ---
export const customerRequestKeys = {
    all: ["manager-customer-requests"] as const,
    lists: () => [...customerRequestKeys.all, "list"] as const,
    list: (branchId?: string, search?: string, status?: string, date?: string) =>
        [...customerRequestKeys.lists(), branchId, search, status, date] as const,
};