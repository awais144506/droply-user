"use client"
import SupplierForm from "@/features/supply/suppliers/components/create/SupplierForm"
import { useCreateSupplier } from "@/features/supply/suppliers/api/use-mutate-supplier";
import { SupplierFormData } from "@/features/supply/suppliers/schema/create-supplier-schema";
import CreateFormHeader from "@/lib/utils/components/FormHeaderNavigation"

const CreateSupplier = () => {
    const { mutate: createSupplier, isPending } = useCreateSupplier();
    const handleSubmit = (data: SupplierFormData) => {
        createSupplier(data);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 p-6">
            <CreateFormHeader
                title="Create New Supplier"
                breadcrumbs={[
                    { label: "Suppliers", href: "/supply/suppliers" },
                    { label: "Create Supplier" }
                ]}
            />
            <SupplierForm
                onSubmit={handleSubmit}
                isPending={isPending}
                isEditMode={false}
            />
        </div>
    )
}

export default CreateSupplier