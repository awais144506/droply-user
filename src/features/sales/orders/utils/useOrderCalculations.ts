import { useFormContext, useWatch } from "react-hook-form";
import { useMemo } from "react";
import { useProducts } from "@/features/manage/products/api/use-products";
import { OrderFormValues } from "@/features/sales/orders/schema/create-order-schema";

export const useOrderCalculations = (branchId: string, previousKhataBalance: number = 0) => {
    const { control } = useFormContext<OrderFormValues>();
    const { data: productData } = useProducts(branchId);

    // 🔥 Capture raw watched items without creating a new array reference
    const watchedItems = useWatch({ control, name: "items" });
    
    const globalDiscount = Number(useWatch({ control, name: "discount" })) || 0;
    const amountPaid = Number(useWatch({ control, name: "amountPaid" })) || 0;
    const deliveryCharges = Number(useWatch({ control, name: "deliveryCharges" })) || 0;

    return useMemo(() => {
        let grossTotal = 0;
        let totalSecurityDeposit = 0;
        const discountBreakdown: { freeProductId: string; name: string; offerQty: number; }[] = [];
        let scale = "";

        // 🔥 Apply the fallback inside the useMemo so it doesn't trigger re-renders
        const items = watchedItems || [];

        items.forEach((item) => {
            const product = productData?.products.find(p => p.id === item.productId);
            if (!product) return;
            
            scale = product.unitOfMeasure || "piece";
            
            const price = Number(item.unitPrice) || 0;
            const depositRate = Number(product.securityDeposit) || 0;
            const qty = Number(item.paidQty) || 0;
            const offerQty = Number(item.offerQty) || 0;
            const emptiesIn = Number(item.emptiesIn) || 0;
            
            const deficit = Math.max(0, qty - emptiesIn);
            const deposit = item.isDepositCharged ? (deficit * depositRate) : 0;
            
            grossTotal += (qty * price);
            totalSecurityDeposit += deposit;
            
            if (offerQty > 0) {
                const freeProductId = item.freeProductId || item.productId;
                const freeProduct = productData?.products.find(p => p.id === freeProductId) || product;
                
                discountBreakdown.push({ 
                    freeProductId: freeProductId,
                    name: freeProduct.name, 
                    offerQty 
                });
            }
        });

        const totalDue = (grossTotal - globalDiscount) + previousKhataBalance + totalSecurityDeposit + deliveryCharges;
        const remainingBalance = totalDue - amountPaid;

        return { 
            grossTotal, 
            totalSecurityDeposit, 
            deliveryCharges, 
            totalDue, 
            remainingBalance, 
            discountBreakdown, 
            scale 
        };
    }, [watchedItems, globalDiscount, amountPaid, deliveryCharges, previousKhataBalance, productData?.products]);
};