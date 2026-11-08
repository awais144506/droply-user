export const fleetKeys = {
    all: ["fleet"] as const,

    vehicles: {
        all: () => [...fleetKeys.all, "vehicles"] as const,
        lists: (branchId: string) => [...fleetKeys.vehicles.all(), "lists", branchId] as const,
        details: () => [...fleetKeys.vehicles.all(), "detail"] as const,
        detail: (id: string) => [...fleetKeys.vehicles.details(), id] as const
    },
    fuel: {
        all: () => [...fleetKeys.all, "fuel"] as const,
        lists: () => [...fleetKeys.fuel.all(), "list"] as const,
    }
}