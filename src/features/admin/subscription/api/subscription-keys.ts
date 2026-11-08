export const subscriptionKeys = {
    all: ["subscription"] as const,
    details: (branchId: string) => [...subscriptionKeys.all, branchId] as const,
}