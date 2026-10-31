"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { Loader2, Package, History } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCustomerPortalData } from "@/features/customer-order/api/use-customerOrder";

import { CustomerHeader } from "@/features/customer-order/components/CustomerHeader";
import { NewOrderTab } from "@/features/customer-order/components/NewOrderTab";
import { HistoryTab } from "@/features/customer-order/components/HistoryTab";

export default function CustomerOrderPortal() {
    const params = useParams();
    const token = params?.token as string;

    const [activeTab, setActiveTab] = useState("new-order");

    const { data, isLoading, isError, refetch } = useCustomerPortalData(token);

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
                Server Error. Contact Branch Please.
            </div>
        );
    }

    const { customer, products, history = [] } = data;

    return (
        <div className="max-w-md mx-auto min-h-screen bg-slate-50 pb-32">
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