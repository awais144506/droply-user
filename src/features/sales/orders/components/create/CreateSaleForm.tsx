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
import CheckoutSale from "./checkout-sale";
import { useProducts } from "@/features/manage/products/api/use-products";
import { useCreateOrder, useUpdateOrder } from "../../api/use-mutate-order";
import { useAppForm } from "@/lib/hooks/use-app-form";
import { OrderCategory, OrderType } from "../../types/order";

interface Props {
  branchId: string;
  category: OrderCategory;
  orderType: OrderType;
  onBack: () => void;
  initialData?: any;
  isEditing?: boolean;
}

const getSafeLocalDate = (dateInput?: string | Date) => {
  const d = dateInput ? new Date(dateInput) : new Date();
  if (isNaN(d.getTime())) return new Date().toISOString().split('T')[0];

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function CreateSaleForm({
  branchId,
  category,
  orderType,
  onBack,
  initialData,
  isEditing = false,
}: Props) {
  const { data: productData } = useProducts(branchId);
  const { mutateAsync: createOrder } = useCreateOrder();
  const { mutateAsync: updateOrder } = useUpdateOrder();

  const usedExchangeIds = new Set<string>();
  const initialItems = initialData?.lineItems?.length
    ? initialData.lineItems.map((item: any, idx: number) => {
      let matchingAssetExchange = initialData.assetExchanges?.find(
        (ae: any) =>
          !usedExchangeIds.has(ae.id) &&
          (ae.productId === item.containerId || ae.productId === item.returnableProductId)
      );

      if (!matchingAssetExchange && initialData.assetExchanges?.[idx]) {
        const candidate = initialData.assetExchanges[idx];
        if (!usedExchangeIds.has(candidate.id)) {
          matchingAssetExchange = candidate;
        }
      }

      if (matchingAssetExchange?.id) {
        usedExchangeIds.add(matchingAssetExchange.id);
      }

      const freeQty = Number(item.freeQuantity || item.offerQty || 0);

      return {
        id: item.id || crypto.randomUUID(),
        productId: item.productId || item.product?.id || "",
        paidQty: item.paidQuantity ?? item.quantity ?? 1,
        priceTierId: item.priceTierId || "",
        emptiesIn: matchingAssetExchange
          ? Number(matchingAssetExchange.inboundQuantity ?? 0)
          : Number(item.emptiesIn ?? 0),
        emptiesOut: matchingAssetExchange
          ? Number(matchingAssetExchange.outboundQuantity ?? 0)
          : Number(item.emptiesOut ?? 0),
        hasOffer: freeQty > 0 || Boolean(item.hasOffer),
        offerQty: freeQty,
        chargedDeposit: Number(matchingAssetExchange?.depositCharged ?? item.depositCharged ?? item.chargedDeposit ?? 0),
        isDepositCharged: Boolean(matchingAssetExchange?.depositCharged || item.depositCharged || item.isDepositCharged),
        unitPrice: item.unitPrice || 0,
        returnableProductId: item.returnableProductId || matchingAssetExchange?.productId || "",
      };
    })
    : [{
      id: crypto.randomUUID(),
      productId: "",
      paidQty: 1,
      priceTierId: "",
      emptiesIn: 0,
      emptiesOut: 0,
      hasOffer: false,
      offerQty: 0,
      chargedDeposit: 0,
      isDepositCharged: false,
      unitPrice: 0,
      returnableProductId: "",
    }];

  const methods = useAppForm(orderSchema, {
    category: initialData?.category || category,
    orderType: initialData?.orderType || orderType,
    customerId: initialData?.customerId || initialData?.customer?.id || "",
    items: initialItems,
    discount: initialData?.discount || 0,
    paymentMethod: initialData?.paymentMethod || "CASH",
    amountPaid: initialData?.amountPaid ?? initialData?.receivedAmount ?? 0,
    scheduledDate: getSafeLocalDate(initialData?.scheduledDate || initialData?.scheduleDate),
    deliveryCharges: initialData?.deliveryCharges || 0,
    ...(initialData?.riderId ? { riderId: initialData.riderId } : {}),
  });

  useEffect(() => {
    if (!isEditing) {
      methods.setValue("category", category, { shouldValidate: true });
      methods.setValue("orderType", orderType, { shouldValidate: true });
    }
  }, [category, orderType, methods, isEditing]);

  const products = productData?.products.filter(p => p.isActive === true) || [];

  const onSubmit = async (data: OrderFormValues) => {
    const filteredItems = data.items.filter(item => item.paidQty > 0);

    if (filteredItems.length === 0) {
      toast.error(`Please add at least one item to process this ${data.category.replace("_", " ").toLowerCase()}.`);
      return;
    }

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
      };

      if (isEditing && initialData?.id) {
        await updateOrder({ id: initialData.id, ...payload });
      } else {
        await createOrder(payload);
      }

      methods.reset();
      onBack();
    } catch (error) {
      console.error("Order submission failed", error);
      toast.error("Failed to save order changes.");
    }
  };

  const isDelivery = orderType === "DELIVERY";

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
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
            <CustomerSelection
              branchId={branchId}
              disabled={isEditing}
            />
            {isDelivery && <DeliveryRider branchId={branchId} initialData={initialData} isEditing={isEditing} />}
            <SelectProduct branchId={branchId} initialData={initialData} />
          </div>
          <div className="lg:col-span-1 h-full">
            <CheckoutSale branchId={branchId} isDelivery={isDelivery} initialData={initialData} isEditing={isEditing} />
          </div>
        </div>
      </form>
    </FormProvider>
  );
}