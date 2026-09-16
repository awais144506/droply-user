/* eslint-disable @typescript-eslint/no-explicit-any */
// app/manage/customers/[customerId]/edit/page.tsx
"use client";
import { useRole } from "@/lib/hooks/use-role";
import { useZones } from "@/features/manage/zones/api/use-zones";
import { useProducts } from "@/features/manage/products/api/use-products";
import { useCustomer } from "@/features/manage/customers/api/use-customer";
import CustomerForm from "@/features/manage/customers/components/create_update/CreateCustomerForm";
import CreateFormHeader from "@/lib/utils/components/FormHeaderNavigation";
import { useParams } from "next/navigation";
import Loading from "@/app/loading";

export default function EditCustomerPage() {
    const { customerId } = useParams() as { customerId: string };
    const { branchId } = useRole();
    const { data: { zoneOptions = [] } = {}, isLoading: LoadingZones } = useZones(branchId);
    const { data, isLoading: LoadingProducts } = useProducts(branchId);
    const productOptions = data?.productOptions;
    const { data: customerData, isLoading: isLoadingCustomer } = useCustomer(customerId);

    const mappedInitialData = customerData ? {
        partyType: customerData.partyType,
        customerCategory: customerData.category,
        name: customerData.name,
        phone: customerData.phone || "",
        email: customerData.email || "",
        zoneId: customerData.zoneId || "",
        address: customerData.address || "",
        latitude: customerData.latitude ?? 31.5411,
        longitude: customerData.longitude ?? 74.3591,
        customerCredit: customerData.customerCredit,
        customerAdvance: customerData.customerAdvance,
        securityDeposit: customerData.securityDeposit,
        // Map the returnables back to what your dynamic form array expects
        openingReturnables: customerData.returnables?.map((r: any) => ({
            productId: r.productId,
            quantity: r.openingBalance
        })) || [],
    } : undefined;

    if (isLoadingCustomer) return <Loading />;
    
    return (
        <div className="max-w-5xl mx-auto space-y-6 p-6">
            <CreateFormHeader
                href={`/manage/customers/${customerId}`}
                text="Edit Customer"
            />
            <CustomerForm
                branchId={branchId}
                isLoadingZones={LoadingZones}
                isLoadingProducts={LoadingProducts}
                zoneOptions={zoneOptions}
                productOptions={productOptions}
                initialData={mappedInitialData}
                customerId={customerId}
            />
        </div>
    );
}