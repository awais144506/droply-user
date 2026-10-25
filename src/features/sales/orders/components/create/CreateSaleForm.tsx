/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect } from "react";
import { FormProvider } from "react-hook-form";
import { toast } from "sonner";
import FormHeader from "./form-header";
import { orderSchema, OrderFormValues } from "../../schema/create-order-schema";
import CustomerSelection from "./customer-selection";
import DeliveryRider from "./delivery-rider";
import SelectProduct from "./select-product";
import RecoveryItems from "./recovery-items";
import CheckoutSale from "./checkout-sale";
import SubmitActionPanel from "./submit-action-panel";
import SaleReturnItems from "./sale-return-items";
import { useProducts } from "@/features/manage/products/api/use-products";
import { useCreateOrder } from "../../api/use-mutate-order";
import { useAppForm } from "@/lib/hooks/use-app-form";
import { OrderCategory, OrderType } from "../../types/order";

interface Props {
  branchId: string;
  category: OrderCategory;
  orderType: OrderType;
  onBack: () => void;
}

export default function CreateSaleForm({
  branchId,
  category,
  orderType,
  onBack
}: Props) {
  const { data: productData } = useProducts(branchId);
  const { mutateAsync } = useCreateOrder();

  const methods = useAppForm(orderSchema, {
    category: category,
    orderType: orderType,
    customerId: "",
    items: [{
      id: crypto.randomUUID(),
      productId: "",
      paidQty: 1,
      emptiesIn: 0,
      hasOffer: false,
      offerQty: 0,
      chargedDeposit: 0,
      isDepositCharged: false
    }],
    discount: 0,
    paymentMethod: "CASH",
    amountPaid: 0,
    deliveryCharges: 0,
  });

  useEffect(() => {
    methods.setValue("category", category, { shouldValidate: true });
    methods.setValue("orderType", orderType, { shouldValidate: true });
  }, [category, orderType, methods]);

  const onSubmit = async (data: OrderFormValues) => {
    toast.success("FORM SUBMITTED")
    const products = productData?.products || [];

    const filteredItems = data.items.filter(item => {
      if (data.category === "SALE_RETURN") {
        return (Number(item.returnedToStoreQty) > 0 || Number(item.wastageQuantity) > 0);
      }
      return Number(item.paidQty) > 0;
    });

    // Block submission if cart/return bucket is empty
    if (filteredItems.length === 0) {
      toast.error(`Please add at least one item to process this ${data.category.replace("_", " ").toLowerCase()}.`);
      return;
    }

    // Block standard sales if cart is completely empty
    if ((category === "WALK_IN" || category === "DELIVERY") && filteredItems.length === 0) {
      toast.error("Please add at least one item to the order.");
      return;
    }

    if (category === "WALK_IN" || category === "DELIVERY") {
      for (const item of filteredItems) {
        const product = products.find(p => p.id === item.productId);
        const requestedQty = Number(item.paidQty) + Number(item.offerQty);
        if (product && requestedQty > product.currentStock) {
          toast.error(`Not enough stock for ${product.name}. Only ${product.currentStock} left.`);
          return;
        }
      }
    }

    try {
      const payload = {
        ...data,
        items: filteredItems,
        branchId,
      };
      await mutateAsync(payload);
      methods.reset();
      onBack();
    } catch (error) {
      console.error("Order submission failed", error);
    }
  };

  const isDelivery = orderType === "DELIVERY";
  const isRecovery = category === "RECOVERY";
  const isReturn = category === "SALE_RETURN";
  const isStandardSale = category === "WALK_IN" || category === "DELIVERY";

  const onError = (errors: any) => {
    console.error("❌ RAW FORM ERRORS:", errors);
    toast.error("Form validation failed. Check console (F12) for exact field.");
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit, onError)}
        className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
      >
        <input type="hidden" {...methods.register("category")} />
        <input type="hidden" {...methods.register("orderType")} />

        <FormHeader
          category={category}
          orderType={orderType}
          onBack={onBack}
        />

        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <CustomerSelection branchId={branchId} />
            {isRecovery && <RecoveryItems />}
            {isReturn && <SaleReturnItems />}
            {isDelivery && <DeliveryRider branchId={branchId} />}
            {isStandardSale && <SelectProduct branchId={branchId} />}
          </div>
          <div className="lg:col-span-1 h-full">
            {isStandardSale ? (
              <CheckoutSale branchId={branchId} isDelivery={isDelivery} />
            ) : (
              <SubmitActionPanel category={category} orderType={orderType} />
            )}
          </div>

        </div>
      </form>
    </FormProvider>
  );
}