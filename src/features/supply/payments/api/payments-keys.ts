export const paymentKeys = {
    all: ['supplier-payments'] as const,
    lists: () => [...paymentKeys.all, 'list'] as const,
    list: (branchId: string) => [...paymentKeys.lists(), branchId] as const,
};