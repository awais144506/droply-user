export const fleetKeys = {
    all: ["fleet"] as const,

    vehicles: {
        all: () => [...fleetKeys.all, "vehicles"] as const,
        lists: () => [...fleetKeys.vehicles.all(), "lists"] as const,
        list: (filters: { branchId: string; status?: string }) =>
            [...fleetKeys.vehicles.lists(), { filters }] as const,
        details: () => [...fleetKeys.vehicles.all(), "detail"] as const,
        detail: (id: string) => [...fleetKeys.vehicles.details(), id] as const
    },
    fuel: {
        all: () => [...fleetKeys.all, "fuel"] as const,
        lists: () => [...fleetKeys.fuel.all(), "list"] as const,
        list: (filters: { vehicleId: string }) =>
            [...fleetKeys.fuel.lists(), { filters }] as const,
    }
}