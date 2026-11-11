import { useMutation, useQueryClient } from '@tanstack/react-query';
import { riderTrackingService } from './riderTracking.service';
import { toast } from "sonner"
import { TRACKING_QUERY_KEYS } from './user-riderTracking';
export function useSetRiderOffline(branchId?: string | null) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (riderId: string) => riderTrackingService.setRiderStatus(riderId),
        onSuccess: () => {
            toast.success('Rider successfully set offline.');
            if (branchId) {
                queryClient.invalidateQueries({
                    queryKey: TRACKING_QUERY_KEYS.overview(branchId),
                });
            }
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
}