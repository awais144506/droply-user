import {
    Truck,
    UserPlus,
    Zap,
    ReceiptText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const NavigationHeader = () => {
    const router = useRouter();
    return (
        <div> <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-xs">
                    <Zap className="h-5 w-5" />
                </div>
                <div>
                    <h1 className="text-lg font-bold text-slate-900">Over-the-Counter Quick Sale</h1>
                    <p className="text-xs text-slate-500">
                        Select products, add custom items, and generate instant walk-in orders
                    </p>
                </div>
            </div>

            {/* The 3 Action Navigation Buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
                <Button
                    onClick={() => router.push("/manage/customers/create-customer")}
                    variant="outline"
                    className="h-10 border-sky-200 bg-sky-50/60 text-sky-800 hover:bg-sky-100 font-medium text-xs"
                >
                    <UserPlus className="mr-1.5 h-4 w-4 text-sky-600" />
                    Create Customer
                </Button>

                <Button
                    onClick={() => router.push("/sales/orders/create-sale")}
                    variant="outline"
                    className="h-10 border-indigo-200 bg-indigo-50/60 text-indigo-800 hover:bg-indigo-100 font-medium text-xs"
                >
                    <Truck className="mr-1.5 h-4 w-4 text-indigo-600" />
                    Create Order
                </Button>

                <Button
                    onClick={() => router.push("/sales/daily")}
                    variant="outline"
                    className="h-10 border-emerald-200 bg-emerald-50/60 text-emerald-800 hover:bg-emerald-100 font-medium text-xs"
                >
                    <ReceiptText className="mr-1.5 h-4 w-4 text-emerald-600" />
                    Daily Sales
                </Button>
            </div>
        </div></div>
    )
}

export default NavigationHeader