"use client";

import { ArrowLeft, RefreshCw, Store, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type SaleType = "WALK_IN" | "DELIVERY";
type Props = {
    saleType: SaleType;
    setSaleType: React.Dispatch<React.SetStateAction<SaleType>>;
}

const FormHeader = ({ saleType, setSaleType }: Props) => {
    const router = useRouter();
    const onBack = () => {
        router.back();
    };
    const toggleSaleType = () => {
        setSaleType((prev) => (prev === "WALK_IN" ? "DELIVERY" : "WALK_IN"));
    };

    const isWalkIn = saleType === "WALK_IN";

    return (
        <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 border-b-4 transition-colors duration-300 gap-4 ${
            isWalkIn 
                ? "border-b-sky-500 bg-sky-50/40" 
                : "border-b-indigo-500 bg-indigo-50/40"
        }`}>
            <div className="flex items-center gap-4">
                <button
                    onClick={onBack}
                    className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer shadow-sm shrink-0"
                >
                    <ArrowLeft className="h-4 w-4 text-slate-600" />
                </button>
                
                <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl shrink-0 transition-colors ${
                        isWalkIn ? "bg-sky-100 text-sky-600" : "bg-indigo-100 text-indigo-600"
                    }`}>
                        {isWalkIn ? <Store className="h-6 w-6" /> : <Truck className="h-6 w-6" />}
                    </div>
                    <div>
                        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                            {isWalkIn ? "Walk-In Gate Sale" : "Route Delivery Order"}
                        </h2>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                            {isWalkIn
                                ? "Immediate counter billing and asset exchange"
                                : "Schedule a drop-off and assign a route rider"
                            }
                        </p>
                    </div>
                </div>
            </div>

            <Button
                variant="outline"
                onClick={toggleSaleType}
                className={`h-11 rounded-xl text-xs font-bold border-2 cursor-pointer transition-all shadow-sm ${
                    isWalkIn 
                        ? "border-sky-200 hover:border-sky-300 hover:bg-sky-50 text-sky-700" 
                        : "border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50 text-indigo-700"
                }`}
            >
                <RefreshCw className="h-4 w-4 mr-2" />
                Switch to {isWalkIn ? "Delivery" : "Walk-In"}
            </Button>
        </div>
    );
}

export default FormHeader;