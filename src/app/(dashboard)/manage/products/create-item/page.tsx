"use client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ProductForm } from "@/features/manage/products/components/Create_Product/CreateProductForm";
import { CreateItemFormData } from "@/features/manage/products/schema/create-item.schema";
import { useCreateProduct } from "@/features/manage/products/api/use-mutate-product";
import { useRole } from "@/lib/hooks/use-role";
import CreateFormHeader from "@/lib/utils/components/FormHeaderNavigation";
import { formatProductPayload } from "@/features/manage/products/utils/format-product-payload";

export default function CreateItemPage() {
    const router = useRouter();
    const { branchId } = useRole();
    const { mutate: createProduct, isPending } = useCreateProduct();

    const onSubmit = (data: CreateItemFormData) => {
        if (!branchId) {
            toast.error("Authentication error: Branch context missing.");
            return;
        }
        const payload = formatProductPayload(data, branchId);
        createProduct(payload, {
            onSuccess: () => router.back(),
        });
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 p-6">

            <CreateFormHeader
                href="/manage/products"
                title="Create New Item"
            />
            <ProductForm
                onSubmit={onSubmit}
                isPending={isPending}
            />
        </div>
    );
}