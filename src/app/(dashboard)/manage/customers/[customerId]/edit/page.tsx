"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { useRole } from "@/lib/hooks/use-role";
import { useZones } from "@/features/manage/zones/api/use-zones";
import { useProducts } from "@/features/manage/products/api/use-products";
import { useCustomer } from "@/features/manage/customers/api/use-customer";
import { mappedCustomerData } from "@/features/manage/customers/utils/mappedCustomerData";
import CreateFormHeader from "@/lib/utils/components/FormHeaderNavigation";
import CustomerForm from "@/features/manage/customers/components/create_update/CreateCustomerForm";
import Loading from "@/app/loading";

export default function EditCustomerPage() {
    const { customerId } = useParams() as { customerId: string };
    const { branchId } = useRole();
    const { data: { zoneOptions = [] } = {}, isLoading: LoadingZones } =
        useZones(branchId);
    const { data, isLoading: LoadingProducts } = useProducts(branchId);
    const productOptions = data?.productOptions;
    const { data: customerData, isLoading: isLoadingCustomer } =
        useCustomer(customerId);

    // Memoize initialData so unrelated re-renders don't reset the form while typing
    const initialData = useMemo(
        () => mappedCustomerData(customerData),
        [customerData],
    );

    if (isLoadingCustomer) return <Loading />;

    return (
        <div className="space-y-6 p-6">
            <CreateFormHeader
                title="Edit Customer"
                description="Edit customer with unique phone number to avoid duplicates"
                breadcrumbs={[
                    { label: "Customers", href: "/manage/customers" },
                    {
                        label: `${customerData?.name}`,
                        href: `/manage/customers/${customerData?.id}`,
                    },
                    { label: "Edit Customer" },
                ]}
            />
            <CustomerForm
                branchId={branchId}
                isLoadingZones={LoadingZones}
                isLoadingProducts={LoadingProducts}
                zoneOptions={zoneOptions}
                productOptions={productOptions}
                initialData={initialData}
                customerId={customerId}
            />
        </div>
    );
}