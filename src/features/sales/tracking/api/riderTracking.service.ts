/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from '@/lib/api-client';
import { FleetRiderOverview, RiderHistoryResponse } from '../types/tracking';

export const riderTrackingService = {
    getFleetOverview: async (): Promise<FleetRiderOverview[]> => {
        return await apiClient.get('/tracking/overview');
    },
    getRiderHistory: async (
        riderId: string,
        date: string,
    ): Promise<RiderHistoryResponse> => {
        return await apiClient.get('/tracking/history', {
            params: { riderId, date },
        });
    },
    setRiderStatus: async (riderId: string): Promise<any> => {
        return await apiClient.patch(`/tracking/offline?riderId=${encodeURIComponent(riderId)}`, {});
    },
};