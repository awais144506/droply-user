/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useRouter, useParams } from "next/navigation";
import { useState } from "react";
import { Trash2 } from "lucide-react";

import Loading from "@/app/loading";
import POForm from "@/features/supply/order/components/create_update/POForm";
import { useProducts } from "@/features/manage/products/api/use-products";
import { useSuppliers } from "@/features/supply/suppliers/api/use-suppliers";
import { useRole } from "@/lib/hooks/use-role";
import { usePurchaseOrder } from "@/features/supply/order/api/use-po";
import { useUpdatePO, useDeletePO } from "@/features/supply/order/api/use-mutate-po";
import { CreatePOFormData } from "@/features/supply/order/schema/create-po-schema";
import NotFoundPage from "@/app/not-found";
import ConfirmDeleteDialog from "@/lib/utils/components/ConfirmDeleteItemDialog";
import { Button } from "@/components/ui/button";

const EditPoOrder = () => {
    const { branchId } = useRole();
    const router = useRouter();
    const params = useParams();
    const poId = params.poId as string;
    const isEditing = !!poId;

    // Dialog state
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    // Fetch dependent data
    const { data: productsData, isLoading: isLoadingProducts } = useProducts(branchId);
    const { data: suppliersData, isLoading: isLoadingSuppliers } = useSuppliers(branchId);

    // Mutations
    const { mutate: updatePO, isPending: isUpdating } = useUpdatePO(branchId);
    const { mutate: deletePO, isPending: isDeleting } = useDeletePO(branchId);

    // Fetch the target PO
    const { data: currentPO, isLoading: isLoadingPO } = usePurchaseOrder(poId);

    const productOptions = productsData?.bomOptions || [];
    const supplierOptions = suppliersData?.supplierOptions || [];

    if (isLoadingProducts || isLoadingSuppliers || isLoadingPO) return <Loading text="Loading PO details..." />;

    if (!currentPO) return <NotFoundPage />;

    const defaultValues: CreatePOFormData = {
        supplierId: currentPO.supplierId,
        notes: currentPO.notes || "",
        advancePaid: currentPO.advancePaid || 0,
        items: currentPO.items.map(item => ({
            productId: item.branchProduct?.id || (item as any).productId,
            supplierItemName: item.supplierItemName,
            quantity: item.quantity,
            unitCost: item.unitCost,
        }))
    };

    const handleSubmit = (data: CreatePOFormData) => {
        updatePO(
            {
                id: poId,
                payload: { ...data, branchId } as CreatePOFormData & { branchId: string }
            },
            {
                onSuccess: () => {
                    router.push("/supply/order");
                }
            }
        );
    };

    const handleDelete = () => {
        deletePO(poId, {
            onSuccess: () => {
                setIsDeleteDialogOpen(false);
                router.push("/supply/order");
            }
        });
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Edit Purchase Order</h1>
                    <p className="text-sm text-slate-500">Update details for {currentPO.poNumber}</p>
                </div>

                {/* Delete Button */}
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDeleteDialogOpen(true)}
                    className="text-rose-600 border-rose-200 hover:bg-rose-50 hover:text-rose-700"
                >
                    <Trash2 className="h-4 w-4 mr-2" /> Delete Order
                </Button>
            </div>

            <POForm
                supplierOptions={supplierOptions}
                productOptions={productOptions}
                onSubmit={handleSubmit}
                isPending={isUpdating}
                isLoadingProducts={isLoadingProducts}
                isLoadingSuppliers={isLoadingSuppliers}
                initalValues={defaultValues}
                isEditing={isEditing}
            />

            {/* Confirmation Dialog */}
            <ConfirmDeleteDialog
                title="Are you sure?"
                description={`Purchase Order ${currentPO.poNumber}`}
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDelete}
                isLoading={isDeleting}
            />
        </div>
    );
};

export default EditPoOrder;