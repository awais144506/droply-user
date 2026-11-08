"use client";
import { FilePlus2 } from "lucide-react";
import MainPageHeader from "@/lib/utils/components/MainPageHeader";
import QuotationForm from "@/features/sales/invoices/components/form/QuotationForm";

const CreateNewQuotaion = () => {
    return (
        <div className="space-y-6">
            <MainPageHeader
                heading="Create Quotation"
                description="Draft a standalone B2B quotation or official tax invoice. Auto-fill from your customer & product catalog or enter custom details without affecting warehouse stock."
                icon={FilePlus2}
                badge="Zero Stock Impact"
                breadcrumbs={[
                    { label: "Invoices & Quotaions", href: "/sales/invoices" },
                    { label: "Create New" },
                ]}
            />

            <QuotationForm />
        </div>
    );
};

export default CreateNewQuotaion;