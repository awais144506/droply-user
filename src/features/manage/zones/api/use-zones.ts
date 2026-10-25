import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { zoneKeys } from "./zone-keys";
import { zoneApi } from "./zone.service";
import { formatCurrency } from "@/lib/utils/functions/setFormat";

// 1. Fetch All Zones for a Branch
export function useZones(branchId: string, searchFilter?: string) {
    const selectZones = useCallback(
        (payload: Awaited<ReturnType<typeof zoneApi.getAllZone>>) => {
            const rawZones = payload?.zones || [];
            const logs = payload?.logs || [];
            
            const enrichedZones = rawZones.map((zone) => {
                const calculatedLedger = (zone.customers || []).reduce(
                    (sum, c) => sum + Number(c.customerCredit || 0),
                    0
                );
                const calculatedReturnables = (zone.customers || []).reduce(
                    (sum, c) => sum + Number(c.returnablesLength || 0),
                    0
                );

                return {
                    ...zone,
                    calculatedLedger,
                    calculatedReturnables,
                };
            });

            const normalizedSearch = searchFilter?.toLowerCase().trim();
            const filteredZones = normalizedSearch
                ? enrichedZones.filter((zone) =>
                    zone.name.toLowerCase().includes(normalizedSearch)
                )
                : enrichedZones;

            const totalZones = enrichedZones.length;
            const totalCustomers = filteredZones.reduce((acc, z) => acc + (z.customers?.length || 0), 0);
            const totalLedger = filteredZones.reduce((acc, z) => acc + z.calculatedLedger, 0);
            const totalReturnables = filteredZones.reduce((acc, z) => acc + z.calculatedReturnables, 0);
            const zoneOptions = rawZones.map(z => ({ value: z.id, label: z.name }));

            return {
                zones: filteredZones,
                zoneOptions,
                stats: {
                    totalZones,
                    totalCustomers,
                    totalLedger,
                    totalReturnables,
                },
                logs,
            };
        },
        [searchFilter]
    );

    return useQuery({
        queryKey: zoneKeys.branchList(branchId || ""),
        queryFn: () => zoneApi.getAllZone(),
        select: selectZones,
        enabled: Boolean(branchId),
    });
}

// 2. Fetch Single Zone (for Edit Page)
export function useZone(id: string, searchFilter?: string) {
    const selectZoneDetail = useCallback(
        (zone: Awaited<ReturnType<typeof zoneApi.getZone>>) => {
            const calculatedLedger = zone.customers.reduce((sum, l) => sum + Number(l.customerCredit || 0), 0);
            const calculatedReturnables = zone.customers.reduce((sum, l) => sum + Number(l.returnablesLength || 0), 0);
            
            const normalizedSearch = searchFilter?.toLowerCase().trim();
            const filterCustomer = normalizedSearch 
                ? zone.customers.filter((c) => c.name.toLowerCase().includes(normalizedSearch)) 
                : zone.customers;

            return {
                zone,
                filterCustomer,
                stats: {
                    calculatedLedger: formatCurrency(calculatedLedger),
                    calculatedReturnables,
                },
                hasCustomers: (zone.customers?.length || 0) > 0,
                hasLedger: calculatedLedger > 0,          // Fixed reference bug here
                hasReturnables: calculatedReturnables > 0, // Fixed reference bug here
                hasRiders: (zone.riders?.length || 0) > 0,
            };
        },
        [searchFilter]
    );

    return useQuery({
        queryKey: zoneKeys.detail(id || ""),
        queryFn: () => zoneApi.getZone(id),
        select: selectZoneDetail,
        enabled: Boolean(id),
    });
}