"use client";
import { useRouter, useParams } from "next/navigation";
import { ProductForm } from "@/features/manage/products/components/Create_Product/CreateProductForm";
import { CreateItemFormData } from "@/features/manage/products/schema/create-item.schema";
import { useProduct } from "@/features/manage/products/api/use-products";
import { useUpdateProduct } from "@/features/manage/products/api/use-mutate-product";
import CreateFormHeader from "@/lib/utils/components/FormHeaderNavigation";
import Loading from "@/app/loading";
import { formatProductPayload } from "@/features/manage/products/utils/format-product-payload";
import ErrorBoundary from "@/app/error";
import { mappedProductData } from "@/features/manage/products/utils/editProductInitialValues";

export default function EditItemPage() {
    const router = useRouter();
    const params = useParams();
    const productId = params.id as string;

    const { data: product, isLoading, error } = useProduct(productId);
    const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();

    const onSubmit = (data: CreateItemFormData) => {
        const payload = formatProductPayload(data);
        updateProduct({ id: productId, data: payload }, {
            onSuccess: () => router.back(),
        });
    };

    if (isLoading) return <Loading text="Loading Product..." />
    if (!product) return <ErrorBoundary error={error?.message} />



    return (
        <div className="max-w-5xl mx-auto space-y-6 p-6">
            <CreateFormHeader
                href="/manage/products"
                title={`Edit Product ${product.name}`}
            />
            <ProductForm
                initialValues={mappedProductData(product)}
                onSubmit={onSubmit}
                isPending={isUpdating}
            />
        </div>
    );
}