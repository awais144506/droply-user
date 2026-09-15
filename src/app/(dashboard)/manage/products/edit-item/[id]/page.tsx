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

export default function EditItemPage() {
    const router = useRouter();
    const params = useParams();
    const productId = params.id as string;

    const { data: product, isLoading: isFetching, error } = useProduct(productId);
    const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();

    const onSubmit = (data: CreateItemFormData) => {
        const payload = formatProductPayload(data);
        updateProduct({ id: productId, data: payload }, {
            onSuccess: () => router.back(),
        });
    };

    if (isFetching) return <Loading />
    if (!product) return <ErrorBoundary error={error?.message} />

    const initialValues: CreateItemFormData = {
        name: product.name,
        sku: product.sku,
        category: product.category,
        trackingType: product.trackingType,
        unitCost: product.unitCost,
        salePrice: product.salePrice,
        openingStock: product.stockOnHand,
        lowStockThreshold: product.lowStockThreshold,
        hasRecipe: product.hasRecipe,
        recipeItems: product.recipeIngredients?.map(recipe => ({
            rawMaterialId: recipe.childItemId,
            quantityRequired: recipe.quantity
        })) || []
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 p-6">
            <CreateFormHeader
                href="/manage/products"
                text={`Edit Product ${product.name}`}
            />
            <ProductForm
                initialValues={initialValues}
                onSubmit={onSubmit}
                isPending={isUpdating}
                submitText="Save Changes"
            />
        </div>
    );
}