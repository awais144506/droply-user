/* eslint-disable react-hooks/incompatible-library */
"use client";

import Link from "next/link";
import { useForm, FormProvider } from "react-hook-form"; // 🔥 FormProvider imported here
import { yupResolver } from "@hookform/resolvers/yup";
import { Plus, Loader2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";

import { createItemSchema, CreateItemFormData } from "@/features/products/schema/create-item.schema";
import { useRole } from "@/hooks/use-role";
import { useProducts } from "@/features/products/api/use-products";
import { ProductRecipeSection } from "./product-recipe-section";
import ProductPriceCard from "./product-price-card";
import ProductDetailCard from "./product-detail-card";

interface ProductFormProps {
    initialValues?: CreateItemFormData;
    onSubmit: (data: CreateItemFormData) => void;
    isPending?: boolean;
    submitText?: string;
}

export function ProductForm({ initialValues, onSubmit, isPending = false, submitText = "Save Item" }: ProductFormProps) {
    const { branchId } = useRole();
    const { data, isLoading: isProductsLoading } = useProducts(branchId);
    const isEditMode = !!initialValues;

    const products = data?.products;

    const dynamicRawMaterialOptions = products?.map((product) => ({
        value: product.id,
        label: `${product.name} (${product.sku})`
    }));

    const form = useForm<CreateItemFormData>({
        resolver: yupResolver(createItemSchema),
        mode: "onChange",
        defaultValues: initialValues || {
            category: "FINISHED_GOOD",
            trackingType: "OUTRIGHT",
            name: "",
            sku: "",
            unitCost: 0,
            salePrice: 0,
            openingStock: 0,
            lowStockThreshold: 3,
            hasRecipe: false,
            recipeItems: [],
        },
    });

    // Extract what we need for the parent
    const { handleSubmit, watch, formState: { isValid } } = form;

    const hasRecipe = watch("hasRecipe");
    const unitCost = watch("unitCost") || 0;
    const salePrice = watch("salePrice") || 0;
    const profitMargin = salePrice > 0 ? (((salePrice - unitCost) / salePrice) * 100).toFixed(1) : "0.0";

    return (
        <FormProvider {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ProductDetailCard />
                    <ProductPriceCard
                        profitMargin={profitMargin}
                        isEditMode={isEditMode}
                    />
                </div>
                <ProductRecipeSection
                    hasRecipe={hasRecipe}
                    dynamicRawMaterialOptions={dynamicRawMaterialOptions || []}
                    isProductsLoading={isProductsLoading}
                />

                <div className="flex items-center justify-end gap-3 border-t pt-4">
                    <Link
                        href="/manage/products"
                        className={`${buttonVariants({ variant: "outline", size: "sm" })} ${isPending ? "pointer-events-none opacity-50" : ""}`}
                        tabIndex={isPending ? -1 : undefined}
                    >
                        Cancel
                    </Link>
                    <Button type="submit" disabled={!isValid || isPending} variant="create">
                        {isPending ? (
                            <><Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> Saving...</>
                        ) : (
                            <><Plus className="h-4 w-4 mr-1.5" /> {submitText}</>
                        )}
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
}