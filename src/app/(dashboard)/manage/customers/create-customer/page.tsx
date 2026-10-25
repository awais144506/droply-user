"use client";
import { useRole } from "@/lib/hooks/use-role";
import { useZones } from "@/features/manage/zones/api/use-zones";
import { useProducts } from "@/features/manage/products/api/use-products";
import CreateCustomerForm from "@/features/manage/customers/components/create_update/CreateCustomerForm";
import CreateFormHeader from "@/lib/utils/components/FormHeaderNavigation";


export default function CreateCustomerPage() {
    const { branchId } = useRole();
    const { data: { zoneOptions = [] } = {}, isLoading: LoadingZones } = useZones(branchId);
    const { data, isLoading: LoadingProducts } = useProducts(branchId);
    const productOptions = data?.productOptions;
    return (
        <div className="space-y-6 p-6">
            <CreateFormHeader
                title="Create New Customer"
                description="Create new customer with unique phone number to avoid duplicates"
                breadcrumbs={[
                    { label: "Customers", href: "/manage/customers" },
                    { label: "Create Customer" }
                ]}
            />
            <CreateCustomerForm
                branchId={branchId}
                isLoadingZones={LoadingZones}
                isLoadingProducts={LoadingProducts}
                zoneOptions={zoneOptions}
                productOptions={productOptions}
            />
        </div>
    );
}




