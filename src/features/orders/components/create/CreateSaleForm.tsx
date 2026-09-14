"use client";

import React, { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner"; 
import FormHeader from "./form-header";
import { orderSchema, OrderFormValues } from "../../schema/create-order-schema";
import CustomerSelection from "./customer-selection";
import DeliveryRider from "./delivery-rider";
import SelectProduct from "./select-product";
import CheckoutSale from "./checkout-sale";
import { useProducts } from "@/features/products/api/use-products";
import { useCreateOrder } from "../../api/use-mutate-order"; // Adjust path based on your folder structure

type SaleType = "WALK_IN" | "DELIVERY";

interface Props {
  saleType: SaleType;
  setSaleType: React.Dispatch<React.SetStateAction<SaleType>>;
  branchId: string;
}

export default function CreateSaleForm({ saleType, setSaleType, branchId }: Props) {
  const { data: productData } = useProducts(branchId);
  const { mutateAsync } = useCreateOrder();

  const methods = useForm<OrderFormValues>({
    resolver: yupResolver(orderSchema),
    mode: "onChange",
    defaultValues: {
      saleType: saleType,
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
      remarks: "",
    },
  });

  useEffect(() => {
    methods.setValue("saleType", saleType);
  }, [saleType, methods]);

  const onSubmit = async (data: OrderFormValues) => {
    const products = productData?.products || [];
    for (const item of data.items) {
      const product = products.find(p => p.id === item.productId);
      const requestedQty = Number(item.paidQty) + Number(item.offerQty);

      if (product && requestedQty > product.currentStock) {
        toast.error(`Not enough stock for ${product.name}. Only ${product.currentStock} left.`);
        return;
      }
    }

    try {
      const payload = {
        ...data,
        branchId,
      };
      await mutateAsync(payload);
      methods.reset();
    } catch (error) {
      console.error("Order submission failed", error);
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="max-w-5xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
      >
        <FormHeader saleType={saleType} setSaleType={setSaleType} />

        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <CustomerSelection branchId={branchId} />
            <DeliveryRider branchId={branchId} />
            <SelectProduct branchId={branchId} />
          </div>
          <CheckoutSale branchId={branchId} />
        </div>
      </form>
    </FormProvider>
  );
}