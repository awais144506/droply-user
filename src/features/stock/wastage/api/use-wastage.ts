import { useQuery } from "@tanstack/react-query";
import { wastageKeys } from "./wastage-keys";
import { wastageService } from "./wastage.service";

export const useWastage = (branchId: string, search?: string, type?: string) => {
    return useQuery({
        queryKey: wastageKeys.lists(branchId),
        queryFn: () => wastageService.getAll(branchId),
        select: (data) => {
            const totalItemsDamaged = data.wastageLogs.reduce((sum, log) => sum + log.quantityWasted, 0);
            const estimatedLossValue = data.wastageLogs.reduce((sum, log) => {
                const cost = Number(log.rawMaterial?.unitCost || 0);
                const qty = Number(log.quantityWasted || 0);
                return sum + (qty * cost);
            }, 0);


            let filteredLogs = data.wastageLogs || [];
            if (type === "PRODUCTION") {
                filteredLogs = filteredLogs.filter(w => w.source === "PRODUCTION")
            }
            else if (type === "OTHERS") {
                filteredLogs = filteredLogs.filter(w => w.source !== "PRODUCTION")
            }
            if (search) {
                const lowerSearch = search.toLowerCase();
                filteredLogs = filteredLogs.filter(log =>
                    log.rawMaterial?.name.toLowerCase().includes(lowerSearch) ||
                    log.reason?.toLowerCase().includes(lowerSearch)
                );
            }
            return {
                logs: filteredLogs,
                stats: {
                    totalItemsDamaged,
                    estimatedLossValue,
                }
            };
        },
        enabled: !!branchId,
    });
};