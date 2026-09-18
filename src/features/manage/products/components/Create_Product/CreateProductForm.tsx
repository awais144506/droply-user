/* eslint-disable react-hooks/incompatible-library */
"use client";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { createItemSchema, CreateItemFormData } from "@/features/manage/products/schema/create-item.schema";
import { useRole } from "@/lib/hooks/use-role";
import { useProducts } from "@/features/manage/products/api/use-products";
import { ProductRecipeSection } from "./product-recipe-section";
import ProductPriceCard from "./product-price-card";
import ProductDetailCard from "./product-detail-card";
import FormCTAFooter from "@/lib/utils/components/FormCTAFooter";

interface ProductFormProps {
    initialValues?: CreateItemFormData;
    onSubmit: (data: CreateItemFormData) => void;
    isPending?: boolean;
}

export function ProductForm({ initialValues, onSubmit, isPending = false }: ProductFormProps) {
    const { branchId } = useRole();
    const { data, isLoading: isProductsLoading } = useProducts(branchId);
    const isEditMode = !!initialValues;

    const dynamicRawMaterialOptions = data?.bomOptions;

    const form = useForm<CreateItemFormData>({
        resolver: yupResolver(createItemSchema),
        mode: "onChange",
        defaultValues: initialValues || {
            category: "FINISHED_GOOD",
            trackingType: "OUTRIGHT",
            name: "",
            unitCost: 0,
            salePrice: 0,
            openingStock: 0,
            lowStockThreshold: 3,
            hasRecipe: false,
            securityDeposit: 0,
            recipeItems: [],
        },
    });
    
    const { handleSubmit, watch } = form;
    const hasRecipe = watch("hasRecipe");
    const unitCost = watch("unitCost") || 0;
    const salePrice = watch("salePrice") || 0;
    const itemType = watch("trackingType");
    const profitMargin = salePrice > 0 ? (((salePrice - unitCost) / salePrice) * 100).toFixed(1) : "0.0";

    return (
        <FormProvider {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ProductDetailCard />
                    <ProductPriceCard
                        itemType={itemType}
                        profitMargin={profitMargin}
                        isEditMode={isEditMode}
                    />
                </div>
                <ProductRecipeSection
                    hasRecipe={hasRecipe}
                    dynamicRawMaterialOptions={dynamicRawMaterialOptions || []}
                    isProductsLoading={isProductsLoading}
                />

                <FormCTAFooter
                    isPending={isPending}
                    isValid={form.formState.isValid}
                    isDirty={form.formState.isDirty}
                    isEditMode={isEditMode}
                    href="/manage/products"
                />
            </form>
        </FormProvider>
    );
}