"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { ProductForm } from "@/features/products/components/product-form";
import { CreateItemFormData } from "@/features/products/schema/create-item.schema";
import { useCreateProduct } from "@/features/products/api/use-products";
import { useRole } from "@/hooks/use-role";

export default function CreateItemPage() {
    const router = useRouter();
    const { branchId } = useRole();
    const { mutate: createProduct, isPending } = useCreateProduct();

    const onSubmit = (data: CreateItemFormData) => {
        if (!branchId) {
            toast.error("Authentication error: Branch context missing.");
            return;
        }

        // Map frontend form fields to match the backend DTO structure
        const payload = {
            branchId,
            category: data.category,
            trackingType: data.trackingType,
            name: data.name,
            sku: data.sku,
            unitCost: data.unitCost,
            salePrice: data.salePrice,
            openingStock: data.openingStock,
            lowStockThreshold: data.lowStockThreshold,
            hasRecipe: data.hasRecipe,
            recipeIngredients: data.hasRecipe && data.recipeItems 
                ? data.recipeItems.map((item) => ({
                    childItemId: item.rawMaterialId, 
                    quantity: item.quantityRequired
                }))
                : []
        };

        createProduct(payload, {
            onSuccess: () => {
                toast.success("Item created successfully!");
                router.push("/manage/products");
            },
            onError: (err: any) => {
                toast.error(err?.response?.data?.message || "Failed to create item.");
            }
        });
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 p-6">
            <div className="flex items-center gap-3 border-b pb-4">
                <Link href="/manage/products" className={buttonVariants({ variant: "outline", size: "icon-sm" })}>
                    <ArrowLeft className="h-4 w-4" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create New Item</h1>
                </div>
            </div>

            <ProductForm 
                onSubmit={onSubmit} 
                isPending={isPending} 
                submitText="Create Item"
            />
        </div>
    );
}