"use client"
import POForm from "@/features/supply/order/components/create_update/POForm";
import { useProducts } from "@/features/manage/products/api/use-products";
import { useRole } from "@/lib/hooks/use-role";
import { useSuppliers } from "@/features/supply/suppliers/api/use-suppliers";
import { CreatePOFormData } from "@/features/supply/order/schema/create-po-schema";
import { useCreatePO } from "@/features/supply/order/api/use-mutate-po";
import CreateFormHeader from "@/lib/utils/components/FormHeaderNavigation";

const CreatePoOrder = () => {
    const { branchId } = useRole();


    const { data: productsData, isLoading: isLoadingProducts } = useProducts(branchId);
    const { data: suppliersData, isLoading: isLoadingSuppliers } = useSuppliers(branchId);
    const { mutate: createPO, isPending } = useCreatePO(branchId);
    const productOptions = productsData?.bomOptions || [];
    const supplierOptions = suppliersData?.supplierOptions || [];

    const handleSubmit = (data: CreatePOFormData) => {
        createPO(data);
    };

    return (
        <div className="min-w-6xl mx-auto space-y-6">
            <CreateFormHeader
                title="Create Purchase Order"
                description="Issue a new PO to restock branch inventory."
                breadcrumbs={[
                    { label: "Purchase Orders", href: "/supply/order" },
                    { label: "Create PO" }
                ]}
            />
            <POForm
                supplierOptions={supplierOptions}
                productOptions={productOptions}
                onSubmit={handleSubmit}
                isPending={isPending}
                isLoadingProducts={isLoadingProducts}
                isLoadingSuppliers={isLoadingSuppliers}
            />
        </div>
    )
}

export default CreatePoOrder;