"use client";

import { useSearchParams } from "next/navigation";
import MainPageHeader from "@/lib/utils/components/MainPageHeader";
import { useRole } from "@/lib/hooks/use-role";
import Loading from "@/app/loading";
import ErrorBoundary from "@/app/error";

import OrderTable from "@/features/sales/requests/components/OrderTable";
import { useCustomerRequests } from "@/features/sales/requests/api/use-customerRequests";

export default function NewOrderRequests() {
    const { branchId } = useRole();
    const searchParams = useSearchParams();
    
    const search = searchParams.get("search") || undefined;
    const rawStatus = searchParams.get("status") || "PENDING";
    const status = rawStatus === "ALL" ? undefined : rawStatus;
    const date = searchParams.get("date") || undefined;

    const { data: requests, isLoading, isError, error, refetch, isRefetching } = useCustomerRequests(
        branchId,
        search,
        status,
        date
    );

    if (isLoading) return <Loading text="Loading Order Requests..." />;
    if (isError) return <ErrorBoundary error={(error as Error)?.message || "Failed to load order requests"} />;

    return (
        <div className="space-y-8 p-6">
            <MainPageHeader
                heading="Customer Order Requests"
                description="Review, approve, or reject incoming magic-link orders from your customers."
                onRefresh={refetch}
                isRefreshing={isRefetching}
            />

            <OrderTable requests={requests} />
        </div>
    );
}