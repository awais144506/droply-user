export const orderKeys = {
    all: ['orders'] as const,
    lists: () => [...orderKeys.all, 'list'] as const,
    todays: (branchId: string) => [...orderKeys.lists(), 'today', branchId] as const,
};