"use client";
import { useRouter, useParams } from "next/navigation";
import { ProductForm } from "@/features/manage/products/components/Create_Product/CreateProductForm";
import { CreateItemFormData } from "@/features/manage/products/schema/create-item.schema";
import { useProduct } from "@/features/manage/products/api/use-products";
import { useUpdateProduct } from "@/features/manage/products/api/use-mutate-product";
import CreateFormHeader from "@/lib/utils/components/FormHeaderNavigation";
import Loading from "@/app/loading";
import ErrorBoundary from "@/app/error";
import { mappedProductData } from "@/features/manage/products/utils/editProductInitialValues";

export default function EditItemPage() {
    const router = useRouter();
    const params = useParams();
    const productId = params.id as string;

    const { data: product, isLoading, error } = useProduct(productId);
    const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();

    const onSubmit = (data: CreateItemFormData) => {
        updateProduct({ id: productId, data }, {
            onSuccess: () => router.back(),
        });
    };

    if (isLoading) return <Loading text="Loading Product..." />
    if (!product) return <ErrorBoundary error={error?.message} />



    return (
        <div className="max-w-5xl mx-auto space-y-6 p-6">
            <CreateFormHeader
                title={`Edit Product: ${product.name}`}
                breadcrumbs={[
                    { label: "Products", href: "/manage/products" },
                    { label: "Edit Product" }
                ]}
            />
            <ProductForm
                initialValues={mappedProductData(product)}
                onSubmit={onSubmit}
                isPending={isUpdating}
            />
        </div>
    );
}