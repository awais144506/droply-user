export type DailySalesCategoryType = 'WALK_IN' | 'DELIVERY' | 'RETURN' | 'RECOVERY' | 'QUICK_SALE';

export interface DailySalesCategory {
    id: string;
    type: DailySalesCategoryType;
    title: string;
    subtitle: string;
    count: number;
    amount: number;
    itemsCount?: number;
    isNegative: boolean;
}

export interface InventoryAlertItem {
    id: string;
    name: string;
    category: string;
    remaining: number;
    threshold: number;
    status: 'OUT_OF_STOCK' | 'LOW_STOCK';
}

export interface DailySalesResponse {
    branchId: string;
    branchName: string;
    selectedDate: string;
    dateRange: {
        start: string;
        end: string;
    };
    kpis: {
        totalCashInflow: number;
        totalOrdersHandled: number;
        netStockOut: number;
        stockSentOut: number;
        stockReturned: number;
    };
    categories: DailySalesCategory[];
    alerts: {
        criticalCount: number;
        items: InventoryAlertItem[];
    };
}