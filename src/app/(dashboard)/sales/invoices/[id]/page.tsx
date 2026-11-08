"use client";
import { PenLine } from "lucide-react";
import MainPageHeader from "@/lib/utils/components/MainPageHeader";
import QuotationForm from "@/features/sales/invoices/components/form/QuotationForm";
import { useParams } from "next/navigation";
import { useRole } from "@/lib/hooks/use-role";
import { useQuotation } from "@/features/sales/invoices/api/use-quote";
import Loading from "@/app/loading";
import ErrorBoundary from "@/app/error";

const EditQuotation = () => {
    const params = useParams();
    const id = params.id as string;
    const { branchId } = useRole();

    const { data: quotation, isLoading, isError, error } = useQuotation(branchId, id);

    if (isLoading) return <Loading text="Loading Quotation Details..." />;
    if (isError) return <ErrorBoundary error={error?.message || "Failed to load quotation"} />;

    return (
        <div className="space-y-6 p-6">
            <MainPageHeader
                heading="Edit Quotation"
                description="Modify B2B quotation details, line items, or tax percentages without affecting warehouse stock."
                icon={PenLine}
                badge={quotation?.type === "INVOICE" ? "Official Tax Invoice" : "Draft Quotation"}
                breadcrumbs={[
                    { label: "Invoices & Quotations", href: "/sales/invoices" },
                    { label: `Edit #${quotation?.documentNumber || id}` },
                ]}
            />

            <QuotationForm
                documentId={id}
                initialData={quotation}
            />
        </div>
    );
};

export default EditQuotation;