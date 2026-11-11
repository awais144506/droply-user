/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, Package, History, Store, ChevronDown } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCustomerPortalData } from "@/features/customer-order/api/use-customerOrder";
import { portalStorage,SavedCustomerPortal } from "@/lib/token-storage";

import { CustomerHeader } from "@/features/customer-order/components/CustomerHeader";
import { NewOrderTab } from "@/features/customer-order/components/NewOrderTab";
import { HistoryTab } from "@/features/customer-order/components/HistoryTab";

export default function CustomerOrderPortal() {
    const params = useParams();
    const router = useRouter();
    const token = params?.token as string;

    const [activeTab, setActiveTab] = useState("new-order");
    const [savedPortals, setSavedPortals] = useState<SavedCustomerPortal[]>([]);

    const { data, isLoading, isError, refetch, error } = useCustomerPortalData(token);
    useEffect(() => {
        if (token && data?.customer) {
            const branchName =
                data.customer.branch?.name ||
                "Supplier Branch";

            const updatedList = portalStorage.savePortal({
                token,
                branchName,
                customerName: data.customer.name || "Customer",
            });
            setSavedPortals(updatedList);
        }
    }, [token, data]);

    const handleBranchSwitch = (newToken: string) => {
        portalStorage.setActiveToken(newToken);
        router.push(`/order/${newToken}`);
    };

    if (isLoading || !data) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <Loader2 className="animate-spin text-sky-600 h-8 w-8" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6 text-center text-rose-600 font-bold text-lg">
                {error.message} Please contact your branch
            </div>
        );
    }

    const { customer, products, history = [] } = data;

    return (
        <div className="max-w-md mx-auto min-h-screen bg-slate-50 pb-32">
            {savedPortals.length > 1 && (
                <div className="bg-slate-900 text-white px-4 py-2 flex items-center justify-between text-xs border-b border-slate-800">
                    <span className="flex items-center gap-1.5 text-slate-400 font-medium">
                        <Store className="h-3.5 w-3.5 text-sky-400" />
                        Supplier:
                    </span>
                    <div className="relative">
                        <select
                            value={token}
                            onChange={(e) => handleBranchSwitch(e.target.value)}
                            className="appearance-none bg-slate-800 hover:bg-slate-700 text-white font-bold py-1 pl-3 pr-7 rounded-lg border border-slate-700 text-xs focus:outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer"
                        >
                            {savedPortals.map((p) => (
                                <option key={p.token} value={p.token}>
                                    {p.branchName}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="h-3.5 w-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                </div>
            )}

            <CustomerHeader customer={customer} />

            <div className="px-4 mt-6">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-slate-200/60 p-1 rounded-xl">
                        <TabsTrigger value="new-order" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold text-sm">
                            <Package className="w-4 h-4 mr-2" /> New Order
                        </TabsTrigger>
                        <TabsTrigger value="history" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold text-sm">
                            <History className="w-4 h-4 mr-2" /> History
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="new-order" className="mt-6">
                        <NewOrderTab
                            token={token}
                            products={products}
                            onSuccess={() => setActiveTab("history")}
                        />
                    </TabsContent>

                    <TabsContent value="history" className="mt-6">
                        <HistoryTab history={history} onRefresh={refetch} />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}