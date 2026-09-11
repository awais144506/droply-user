
export const branchSettingsKeys = {
    all: ["settings"] as const,
    branch: (branchId: string) => [...branchSettingsKeys.all, "branch", branchId] as const,
};
