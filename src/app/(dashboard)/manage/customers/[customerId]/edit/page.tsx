"use client";
import { useRole } from "@/lib/hooks/use-role";
import { useZones } from "@/features/manage/zones/api/use-zones";
import { useProducts } from "@/features/manage/products/api/use-products";
import { useCustomer } from "@/features/manage/customers/api/use-customer";
import CustomerForm from "@/features/manage/customers/components/create_update/CreateCustomerForm";
import CreateFormHeader from "@/lib/utils/components/FormHeaderNavigation";
import { useParams } from "next/navigation";
import Loading from "@/app/loading";
import { mappedCustomerData } from "@/features/manage/customers/utils/mapCustomerDataEdit";

export default function EditCustomerPage() {
    const { customerId } = useParams() as { customerId: string };
    const { branchId } = useRole();
    const { data: { zoneOptions = [] } = {}, isLoading: LoadingZones } = useZones(branchId);
    const { data, isLoading: LoadingProducts } = useProducts(branchId);
    const productOptions = data?.productOptions;
    const { data: customerData, isLoading: isLoadingCustomer } = useCustomer(customerId);
    
    if (isLoadingCustomer) return <Loading />;
    return (
        <div className="max-w-5xl mx-auto space-y-6 p-6">
            <CreateFormHeader
                href={`/manage/customers/${customerId}`}
                title="Edit Customer"
            />
            <CustomerForm
                branchId={branchId}
                isLoadingZones={LoadingZones}
                isLoadingProducts={LoadingProducts}
                zoneOptions={zoneOptions}
                productOptions={productOptions}
                initialData={mappedCustomerData(customerData)}
                customerId={customerId}
            />
        </div>
    );
}