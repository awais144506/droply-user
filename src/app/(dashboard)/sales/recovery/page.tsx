/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import MainPageHeader from "@/lib/utils/components/MainPageHeader";
import ActivityLogsCard from "@/lib/utils/components/ActivityLogsMainPage";
import RecoveryTable from "@/features/sales/recovery/components/RecoveryTable";
import { useRecoveries } from "@/features/sales/recovery/api/use-recovery";
import { useRole } from "@/lib/hooks/use-role";
import Loading from "@/app/loading";
import ErrorBoundary from "@/app/error";
import { useSearchParams } from "next/navigation";

export default function AssetRecoveryPage() {
    const { branchId } = useRole();
    const searchParams = useSearchParams();
    const search = searchParams.get("search") || undefined;
    const date = searchParams.get("date") || undefined;
    const customerId = searchParams.get("customerId") || undefined;

    const { data, isLoading, isError, error, refetch, isRefetching } = useRecoveries(
        branchId,
        { search, date, customerId }
    );

    if (isLoading) return <Loading text="Loading Recoveries & Sale Returns..." />;
    if (isError) return <ErrorBoundary error={error?.message || "Failed to load recovery records."} />;

    const recoveries = data?.recoveries || [];
    const saleReturns = data?.saleReturns || [];
    const logs = data?.logs || [];

    return (
        <div className="space-y-8 p-6">
            <MainPageHeader
                heading="Sale Return & Recovery"
                description="Manage customer balance recoveries, empty container returns, and completed order refunds efficiently."
                href="/sales/recovery/create"
                btnText="Create Recovery"
                onRefresh={refetch}
                isRefreshing={isRefetching}
            />

            <RecoveryTable
                recoveries={recoveries}
                saleReturns={saleReturns}
                branchId={branchId}
            />

            <ActivityLogsCard
                title="Recovery & Sale Return Activity"
                logs={logs}
            />
        </div>
    );
}