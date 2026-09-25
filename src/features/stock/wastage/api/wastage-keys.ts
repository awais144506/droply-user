export const wastageKeys = {
  all: ['wastage'] as const,
  lists: (branchId: string) => [...wastageKeys.all, 'list', branchId] as const,
  detail: (id: string) => [...wastageKeys.all, 'detail', id] as const,
};