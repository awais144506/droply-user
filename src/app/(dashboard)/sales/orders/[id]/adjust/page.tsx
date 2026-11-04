/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, ArrowLeft } from "lucide-react";
import { useRole } from "@/lib/hooks/use-role";
import CreateSaleForm from "@/features/sales/orders/components/create/CreateSaleForm";
import { orderKeys } from "@/features/sales/orders/api/order-keys"; // Adjust import to your order keys path
import { Button } from "@/components/ui/button";

const AdjustOrderPage = () => {
    const params = useParams();
    const router = useRouter();
    const orderId = params?.id as string;
    const { branchId } = useRole();
    const queryClient = useQueryClient();
    const queryCache = queryClient.getQueryCache();
    const listQueries = queryCache.findAll({ queryKey: orderKeys.lists() });

    let cachedOrder: any = null;
    for (const query of listQueries) {
        const data: any = query.state.data;
        if (data?.orders && Array.isArray(data.orders)) {
            const found = data.orders.find((o: any) => o.id === orderId || o.orderId === orderId);
            if (found) {
                cachedOrder = found;
                break;
            }
        }
    }
    const order = cachedOrder;

    if (!order) {
        return (
            <div className="flex flex-col items-center justify-center min-h-100 space-y-4">
                <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl shadow-md border border-slate-200">
                    <Loader2 className="w-5 h-5 animate-spin text-sky-600" />
                    <span className="text-sm font-bold text-slate-700">Order details not found in cache. Please go back and click Adjust from the list.</span>
                </div>
                <Button
                    variant="outline"
                    onClick={() => router.push("/sales/orders")}
                    className="rounded-xl text-xs font-bold gap-2 cursor-pointer"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Orders
                </Button>
            </div>
        );
    }

    const category = order.category || order.orderType;
    const orderType = order.type || order.orderType;

    return (
        <div className="space-y-6 p-4 sm:p-6 lg:p-8 min-h-125">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center justify-between">
                <div>
                    <h1 className="text-lg font-black text-slate-900">
                        Adjust Order #{order.orderCode || order.id}
                    </h1>
                    <p className="text-xs text-slate-500 font-medium">
                        Modifying line items, returnable containers, and payment details. Customer cannot be changed.
                    </p>
                </div>
            </div>

            <CreateSaleForm
                branchId={branchId}
                category={category}
                orderType={orderType}
                initialData={order}
                isEditing={true}
                onBack={() => router.push("/sales/orders")}
            />
        </div>
    );
};

export default AdjustOrderPage;