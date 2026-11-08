"use client";

import { ArrowLeft, RefreshCw, Store, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderCategory, OrderType } from "../../types/order";

type Props = {
    category: OrderCategory;
    orderType: OrderType;
    onBack: () => void;
}

const FormHeader = ({ category, orderType, onBack }: Props) => {

    // Dynamically map colors, icons, and text based on the selected category
    const getHeaderConfig = () => {
        switch (category) {
            case "WALK_IN":
                return {
                    bg: "bg-sky-50/40",
                    border: "border-b-sky-500",
                    iconBg: "bg-sky-100",
                    iconText: "text-sky-600",
                    Icon: Store,
                    title: "Plant Gate POS (Walk-In)",
                    desc: "Immediate counter billing and asset exchange",
                    btnBorder: "border-sky-200",
                    btnHoverBg: "hover:bg-sky-50",
                    btnHoverBorder: "hover:border-sky-300",
                    btnText: "text-sky-700"
                };
            case "DELIVERY":
                return {
                    bg: "bg-indigo-50/40",
                    border: "border-b-indigo-500",
                    iconBg: "bg-indigo-100",
                    iconText: "text-indigo-600",
                    Icon: Truck,
                    title: "Route Delivery Order",
                    desc: "Schedule a drop-off and assign a route rider",
                    btnBorder: "border-indigo-200",
                    btnHoverBg: "hover:bg-indigo-50",
                    btnHoverBorder: "hover:border-indigo-300",
                    btnText: "text-indigo-700"
                };
    };}

    const config = getHeaderConfig();
    const { Icon } = config;

    return (
        <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 border-b-4 transition-colors duration-300 gap-4 ${config.border} ${config.bg}`}>
            <div className="flex items-center gap-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onBack}
                    className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer shadow-sm shrink-0 h-auto"
                >
                    <ArrowLeft className="h-4 w-4 text-slate-600" />
                </Button>

                <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl shrink-0 transition-colors ${config.iconBg} ${config.iconText}`}>
                        <Icon className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                            {config.title}
                        </h2>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                            {config.desc}
                        </p>
                    </div>
                </div>
            </div>

            <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className={`h-11 bg-white rounded-xl text-xs font-bold border-2 cursor-pointer transition-all shadow-sm ${config.btnBorder} ${config.btnHoverBorder} ${config.btnHoverBg} ${config.btnText}`}
            >
                <RefreshCw className="h-4 w-4 mr-2" />
                Change Category
            </Button>
        </div>
    );
}

export default FormHeader;