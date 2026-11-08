/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { FormProvider } from "react-hook-form";
import { createItemSchema, CreateItemFormData } from "@/features/manage/products/schema/create-item.schema";
import { useRole } from "@/lib/hooks/use-role";
import { useProducts } from "@/features/manage/products/api/use-products";
import { ProductRecipeSection } from "./product-recipe-section";
import ProductPriceCard from "./product-price-card";
import ProductDetailCard from "./product-detail-card";
import FormCTAFooter from "@/lib/utils/components/FormCTAFooter";
import { useAppForm } from "@/lib/hooks/use-app-form";
import { LayersPlus } from "lucide-react";

interface ProductFormProps {
    initialValues?: any;
    onSubmit: (data: CreateItemFormData) => void;
    isPending?: boolean;
}

export function ProductForm({ initialValues, onSubmit, isPending = false }: ProductFormProps) {
    const { branchId } = useRole();
    const { data, isLoading: isProductsLoading } = useProducts(branchId);
    const isEditMode = Boolean(initialValues);

    const dynamicRawMaterialOptions = data?.bomOptions || [];

    // Cleanly map initial priceTiers (strip profitMargin, productId, createdAt, updatedAt)
    const defaultPriceTiers =
        initialValues?.priceTiers && initialValues.priceTiers.length > 0
            ? initialValues.priceTiers.map((t: any) => ({
                ...(t.id ? { id: t.id } : {}),
                title: t.title || "Standard",
                unitCost: Number(t.unitCost ?? 0),
                salePrice: Number(t.salePrice ?? 0),
                isDefault: Boolean(t.isDefault),
                isActive: t.isActive ?? true,
            }))
            : [
                {
                    title: "Standard",
                    unitCost: Number(initialValues?.unitCost ?? 0),
                    salePrice: Number(initialValues?.salePrice ?? 0),
                    isDefault: true,
                    isActive: true,
                },
            ];

    // Cleanly map initial recipeIngredients (strip childItem relation object & parentItemId)
    const defaultRecipeIngredients =
        initialValues?.recipeIngredients && initialValues.recipeIngredients.length > 0
            ? initialValues.recipeIngredients.map((ri: any) => ({
                childItemId: ri.childItemId,
                quantity: Number(ri.quantity ?? 1),
            }))
            : [];

    // Initialize ONLY valid form fields (never spread raw initialValues)
    const form = useAppForm(createItemSchema, {
        name: initialValues?.name || "",
        category: initialValues?.category || "FINISHED_GOOD",
        trackingType: initialValues?.trackingType || "OUTRIGHT",
        unitOfMeasure: initialValues?.unitOfMeasure || "PIECE",
        openingStock: Number(initialValues?.currentStock ?? initialValues?.openingStock ?? 0),
        lowStockThreshold: Number(initialValues?.lowStockThreshold ?? 10),
        hasRecipe: Boolean(initialValues?.hasRecipe),
        securityDeposit: Number(initialValues?.securityDeposit ?? 0),
        isPublic: Boolean(initialValues?.isPublic ?? false),
        priceTiers: defaultPriceTiers,
        recipeIngredients: defaultRecipeIngredients,
    });

    const { handleSubmit, watch } = form;
    const hasRecipe = Boolean(watch("hasRecipe"));
    const itemType = (watch("trackingType") || "OUTRIGHT") as "RETURNABLE" | "OUTRIGHT";

    const handleFormSubmit = (formData: CreateItemFormData) => {
        const cleanPayload = {
            name: formData.name.trim(),
            category: formData.category,
            trackingType: formData.trackingType,
            unitOfMeasure: formData.unitOfMeasure,
            openingStock: Number(formData.openingStock ?? 0),
            lowStockThreshold: Number(formData.lowStockThreshold ?? 10),
            securityDeposit: formData.trackingType === "RETURNABLE" ? Number(formData.securityDeposit ?? 0) : 0,
            hasRecipe: Boolean(formData.hasRecipe),
            isPublic: Boolean(formData.isPublic),
            priceTiers: (formData.priceTiers || []).map((t) => ({
                ...(t.id ? { id: t.id } : {}),
                title: t.title?.trim() || "Standard",
                unitCost: Number(t.unitCost ?? 0),
                salePrice: Number(t.salePrice ?? 0),
                isDefault: Boolean(t.isDefault),
                isActive: t.isActive ?? true,
            })),
            // recipeItems is replaced entirely by recipeIngredients
            recipeIngredients: formData.hasRecipe
                ? (formData.recipeIngredients || []).map((ri) => ({
                    childItemId: ri.childItemId,
                    quantity: Number(ri.quantity),
                }))
                : [],
        };

        onSubmit(cleanPayload as any);
    };

    return (
        <FormProvider {...form}>
            <form onSubmit={handleSubmit(handleFormSubmit)

            } className="space-y-6">
                <div className="grid grid-cols-1 gap-6 items-start">
                    <ProductDetailCard />
                    <ProductPriceCard
                        itemType={itemType}
                        isEditMode={isEditMode}
                    />
                </div>
                <ProductRecipeSection
                    hasRecipe={hasRecipe}
                    dynamicRawMaterialOptions={dynamicRawMaterialOptions}
                    isProductsLoading={isProductsLoading}
                />

                <FormCTAFooter
                    ctaText={isEditMode ? "Update Product" : "Create Product"}
                    isPending={isPending}
                    isValid={form.formState.isValid}
                    isDirty={form.formState.isDirty}
                    isEditMode={isEditMode}
                    href="/manage/products"
                    icon={LayersPlus}
                />
            </form>
        </FormProvider>
    );
}