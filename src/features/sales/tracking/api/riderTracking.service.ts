import { apiClient } from '@/lib/api-client';
import { FleetRiderOverview, RiderHistoryResponse } from '../types/tracking';

export const riderTrackingService = {
    /**
     * 1. Fetch all branch riders, their active orders, presence, and today's stats
     */
    getFleetOverview: async (): Promise<FleetRiderOverview[]> => {
        return await apiClient.get('/tracking/overview');
    },

    /**
     * 2. Fetch historical GPS pings and stop logs for a specific rider & date (YYYY-MM-DD)
     */
    getRiderHistory: async (
        riderId: string,
        date: string,
    ): Promise<RiderHistoryResponse> => {
        return await apiClient.get('/tracking/history', {
            params: { riderId, date },
        });
    },
};