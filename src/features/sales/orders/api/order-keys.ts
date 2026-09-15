export const orderKeys = {
    all: ['orders'] as const,
    lists: () => [...orderKeys.all, 'list'] as const,
    // Uniquely caches today's orders by branch so switching branches doesn't mix data
    todays: (branchId: string) => [...orderKeys.lists(), 'today', branchId] as const,
};