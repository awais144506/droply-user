/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";

import { ProductForm } from "@/features/products/components/product-form";
import { CreateItemFormData } from "@/features/products/schema/create-item.schema";
import { useProduct, useUpdateProduct } from "@/features/products/api/use-products";
import CreateFormHeader from "@/utils/create-formHeader";
import Loading from "@/app/loading";
import { formatProductPayload } from "@/features/products/utils/format-product-payload";

export default function EditItemPage() {
    const router = useRouter();
    const params = useParams();
    const productId = params.id as string;

    const { data: product, isLoading: isFetching } = useProduct(productId);
    const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();

    const onSubmit = (data: CreateItemFormData) => {
        const payload = formatProductPayload(data);
        updateProduct({ id: productId, data: payload }, {
            onSuccess: () => {
                toast.success("Item updated successfully!");
                router.push("/manage/products");
            },
            onError: (err: any) => {
                toast.error(err?.response?.data?.message || "Failed to update item.");
            }
        });
    };

    if (isFetching) return <Loading />

    if (!product) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-500">
                <p>Product not found.</p>
                <Link href="/manage/products" className="text-sky-600 mt-2 hover:underline">Return to Inventory</Link>
            </div>
        );
    }

    // Transform the backend product data to exactly match the Yup Form Schema
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
        // Cleaned up the rawMaterialId mapping to directly use childItemId
        recipeItems: product.recipeIngredients?.map(recipe => ({
            rawMaterialId: recipe.childItemId,
            quantityRequired: recipe.quantity
        })) || []
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 p-6">
            <CreateFormHeader
                href="/manage/products"
                text="Edit Product"
            />
            <ProductForm
                initialValues={initialValues}
                onSubmit={onSubmit}
                isPending={isUpdating}
                submitText="Save Changes" // Tweaked text for better UX
            />
        </div>
    );
}