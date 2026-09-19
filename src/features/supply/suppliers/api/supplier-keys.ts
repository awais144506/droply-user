export const supplierKeys = {
    all: ["suppliers"] as const,
    lists: (branchId: string) => [...supplierKeys.all, "list", branchId] as const,
    detail: (id: string) => [...supplierKeys.all, "detail", id] as const,
};