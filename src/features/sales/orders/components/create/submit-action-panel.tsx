"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { CheckCircle2, Truck, Loader2 } from "lucide-react";
import { OrderCategory, OrderType } from "../../types/order";

interface Props {
    category: OrderCategory;
    orderType: OrderType;
}

export default function SubmitActionPanel({ category, orderType }: Props) {
    const { formState: { isSubmitting }, control } = useFormContext();
    const customerId = useWatch({ control, name: "customerId" });
    const isDelivery = orderType === "DELIVERY";
    const getButtonText = () => {
        if (isSubmitting) return "Processing...";
    };

    return (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-inner animate-in fade-in slide-in-from-right-4">
            <div className="pt-6 mt-auto border-t border-slate-200">
                <button
                    type="submit"
                    disabled={isSubmitting || !customerId}
                    className={`w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm font-bold text-white transition-all shadow-sm
                        ${!customerId ? 'bg-slate-300 cursor-not-allowed' : 
                          isDelivery ? 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-md' : 'bg-emerald-600 hover:bg-emerald-700 hover:shadow-md'
                        }
                    `}
                >
                    {isSubmitting ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : isDelivery ? (
                        <Truck className="h-5 w-5" />
                    ) : (
                        <CheckCircle2 className="h-5 w-5" />
                    )}
                    {getButtonText()}
                </button>
                {!customerId && (
                    <p className="text-[10px] text-center text-slate-500 mt-2 font-medium">
                        Select a customer to enable submission
                    </p>
                )}
            </div>
        </div>
    );
}