export const returnKeys = {
    all: ['purchase-returns'] as const,
    lists: () => [...returnKeys.all, 'list'] as const,
    list: (branchId: string) => [...returnKeys.lists(), branchId] as const,
    details: () => [...returnKeys.all, 'detail'] as const,
    detail: (id: string) => [...returnKeys.details(), id] as const,
};