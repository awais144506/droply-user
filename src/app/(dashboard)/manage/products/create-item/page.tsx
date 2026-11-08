"use client";
import { ProductForm } from "@/features/manage/products/components/Create_Product/CreateProductForm";
import { CreateItemFormData } from "@/features/manage/products/schema/create-item.schema";
import { useCreateProduct } from "@/features/manage/products/api/use-mutate-product";
import CreateFormHeader from "@/lib/utils/components/FormHeaderNavigation";

export default function CreateItemPage() {
    const { mutate: createProduct, isPending } = useCreateProduct();

    const onSubmit = (data: CreateItemFormData) => {
        createProduct(data);
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6 p-6">

            <CreateFormHeader
                title="Create New Product"
                description="Create your branch products"
                breadcrumbs={[
                    {label:"Products",href:"/manage/products"},
                    {label:"Create Product"}
                ]}
            />
            <ProductForm
                onSubmit={onSubmit}
                isPending={isPending}
            />
        </div>
    );
}