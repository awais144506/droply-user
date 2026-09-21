"use client"
import { useRouter } from "next/navigation";
import POForm from "@/features/supply/order/components/create_update/POForm";
import { useProducts } from "@/features/manage/products/api/use-products";
import { useRole } from "@/lib/hooks/use-role";
import { useSuppliers } from "@/features/supply/suppliers/api/use-suppliers";
import { CreatePOFormData } from "@/features/supply/order/schema/create-po-schema";
import { useCreatePO } from "@/features/supply/order/api/use-mutate-po";

const CreatePoOrder = () => {
    const { branchId } = useRole();
    const router = useRouter();

    const { data: productsData, isLoading: isLoadingProducts } = useProducts(branchId);
    const { data: suppliersData, isLoading: isLoadingSuppliers } = useSuppliers(branchId);
    const { mutate: createPO, isPending } = useCreatePO(branchId);
    const productOptions = productsData?.bomOptions || [];
    const supplierOptions = suppliersData?.supplierOptions || [];

    const handleSubmit = (data: CreatePOFormData) => {
        const payload = {
            ...data,
            branchId
        }
        createPO(
            payload,
            {
                onSuccess: () => {
                    router.push("/supply/order");
                }
            }
        );
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Create Purchase Order</h1>
                <p className="text-sm text-slate-500">Issue a new PO to restock branch inventory.</p>
            </div>

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