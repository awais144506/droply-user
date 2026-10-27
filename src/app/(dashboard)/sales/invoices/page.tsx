"use client";
import MainPageHeader from "@/lib/utils/components/MainPageHeader";
import InvoiceTable from "@/features/sales/invoices/components/table/tables/InvoiceTable";
import { useQuotaions } from "@/features/sales/invoices/api/use-quote";
import { useRole } from "@/lib/hooks/use-role";
import Loading from "@/app/loading";
import ErrorBoundary from "@/app/error";
import { useSearchParams } from "next/navigation";

export default function InvoicesPage() {
    const { branchId } = useRole();
    const searchParams = useSearchParams();
    const search = searchParams.get("search") || undefined;
    const type = searchParams.get("type") || undefined;
    const { data, isLoading, isError, error, refetch, isRefetching } = useQuotaions(branchId, search, type);

    const quotations = data?.quotations;
    console.log(data?.quotations)
    if (isLoading) return <Loading text="Loading Quotations..." />
    if (isError) return <ErrorBoundary error={error.message} />

    return (
        <div className="space-y-8 p-6">

            <MainPageHeader
                href="/sales/invoices/create-new"
                btnText="Create New Quotation"
                heading="Invoices & Quotations"
                onRefresh={refetch}
                isRefreshing={isRefetching}
                description="Manage B2B quotations, convert them to invoices, and download official PDF statements."
            />

            <InvoiceTable
                docs={quotations}
                branchId={branchId}
            />

        </div>
    );
}