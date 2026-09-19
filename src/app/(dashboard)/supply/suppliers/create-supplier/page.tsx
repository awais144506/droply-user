"use client"

import { useRole } from "@/lib/hooks/use-role";
import SupplierForm from "@/features/supply/suppliers/components/create/SupplierForm"
import { useCreateSupplier } from "@/features/supply/suppliers/api/use-mutate-supplier";
import { SupplierFormData } from "@/features/supply/suppliers/schema/create-supplier-schema";
import { useRouter } from "next/navigation";
import CreateFormHeader from "@/lib/utils/components/FormHeaderNavigation"
import { formatPakistaniPhone } from "@/lib/utils/functions/setFormat";

const CreateSupplier = () => {

    const { branchId } = useRole();
    const router = useRouter();
    const { mutate: createSupplier, isPending } = useCreateSupplier();
    const handleSubmit = (data: SupplierFormData) => {
        const payload = {
            ...data,
            phone: formatPakistaniPhone(data.phone),
            branchId,
        }
        createSupplier(payload, {
            onSuccess: () => {
                router.back();
            }
        });
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 p-6">
            <CreateFormHeader
                title="Create New Supplier"
                href="/supply/suppliers"
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