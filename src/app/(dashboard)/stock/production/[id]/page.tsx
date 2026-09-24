"use client"
import { ProductionBatchForm } from "@/features/stock/production/components/create/ProductionBatchForm"
import CreateFormHeader from "@/lib/utils/components/FormHeaderNavigation"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useState } from "react"
import ConfirmDeleteDialog from "@/lib/utils/components/ConfirmDeleteItemDialog";
import { useBatch } from "@/features/stock/production/api/use-production"
import { useDeleteProduction } from "@/features/stock/production/api/use-mutate-production"
import { useParams } from "next/navigation"
import Loading from "@/app/loading"
import { useRole } from "@/lib/hooks/use-role"

const EditProductionBatch = () => {
    const { branchId } = useRole();
    const params = useParams();
    const batchId = params.id as string;
    const isEdit = !!branchId;

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const { data, isLoading } = useBatch(batchId);
    const { mutateAsync: deleteBatch, isPending: isDeleting } = useDeleteProduction(branchId);

    const handleDelete = async () => {
        deleteBatch(batchId);
        setIsDeleteDialogOpen(false);
    }

    if (isLoading) return <Loading text="Loading Batch..." />

    const isCompleted = data?.status === 'COMPLETED';

    return (
        <>
            <div className="min-w-5xl mx-auto py-6">
                <div className="flex flex-row justify-between">
                    <CreateFormHeader
                        title="Edit Production Batch"
                        description="Update batch details. Yields and materials cannot be edited to preserve inventory integrity."
                        href="/stock/production"
                    />

                    {/* Hide delete button if already completed */}
                    {!isCompleted && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsDeleteDialogOpen(true)}
                            className="text-rose-600 border-rose-200 hover:bg-rose-50 hover:text-rose-700"
                        >
                            <Trash2 className="h-4 w-4 mr-2" /> Delete Batch
                        </Button>
                    )}
                </div>

                <ProductionBatchForm
                    branchId={branchId}
                    initialData={data}
                    isEdit={isEdit}
                />
            </div>

            <ConfirmDeleteDialog
                title="Delete Batch & Refund Materials?"
                description="This will permanently delete this WIP batch and instantly return all deducted raw materials back to inventory stock. This action cannot be undone."
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDelete}
                isLoading={isDeleting}
                confirmButtonClass="bg-rose-600 hover:bg-rose-700"
                confirmText="Delete & Restock"
            />
        </>
    )
}

export default EditProductionBatch