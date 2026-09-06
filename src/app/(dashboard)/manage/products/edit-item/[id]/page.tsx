"use client";

import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { ProductForm } from "@/features/products/components/product-form";
import { CreateItemFormData } from "@/features/products/schema/create-item.schema";
import { useProduct, useUpdateProduct } from "@/features/products/api/use-products";

export default function EditItemPage() {
    const router = useRouter();
    const params = useParams();
    const productId = params.id as string;

    // Fetch the specific product details
    const { data: product, isLoading: isFetching } = useProduct(productId);
    
    // Setup the update mutation
    const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();

    const onSubmit = (data: CreateItemFormData) => {
        // Map frontend form fields back to the DTO structure
        const payload = {
            category: data.category,
            trackingType: data.trackingType,
            name: data.name,
            sku: data.sku,
            unitCost: data.unitCost,
            salePrice: data.salePrice,
            lowStockThreshold: data.lowStockThreshold,
            hasRecipe: data.hasRecipe,
            recipeIngredients: data.hasRecipe && data.recipeItems 
                ? data.recipeItems.map((item) => ({
                    childItemId: item.rawMaterialId, 
                    quantity: item.quantityRequired
                }))
                : []
        };

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

    if (isFetching) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
                <Loader2 className="h-8 w-8 animate-spin mb-4" />
                <p className="text-sm font-medium">Loading item details...</p>
            </div>
        );
    }

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
        openingStock: product.stockOnHand, // Binds current stock to the form input
        lowStockThreshold: product.lowStockThreshold,
        hasRecipe: product.hasRecipe,
        recipeItems: product.recipeIngredients?.map(recipe => ({
            // Use childItemId (or fallback to id if Prisma nested include varies)
            rawMaterialId: (recipe as any).childItemId || recipe.childItem?.sku, 
            quantityRequired: recipe.quantity
        })) || []
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 p-6">
            <div className="flex items-center gap-3 border-b pb-4">
                <Link href="/manage/products" className={buttonVariants({ variant: "outline", size: "icon-sm" })}>
                    <ArrowLeft className="h-4 w-4" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Edit Item</h1>
                    <p className="text-xs text-slate-500 mt-0.5">Update pricing, thresholds, and recipe mappings.</p>
                </div>
            </div>

            <ProductForm 
                initialValues={initialValues} 
                onSubmit={onSubmit} 
                isPending={isUpdating} 
                submitText="Save Changes"
            />
        </div>
    );
}