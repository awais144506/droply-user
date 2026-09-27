import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, ArrowRight, } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

type LowStockItem = {
    id: string;
    name: string;
    unitOfMeasure: string;
    currentStock: number;
}
const LowStockAlerts = ({ lowStockItems }: { lowStockItems?: LowStockItem[] }) => {
    const router = useRouter();
    return (
        <div>
            <div className="lg:col-span-3">
                <Card className="shadow-sm border-slate-200 h-full">
                    <CardHeader className="pb-3 border-b border-slate-100">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-rose-500" />
                                Low Stock Alerts
                            </CardTitle>
                            <Button
                                onClick={() => router.push('/manage/products')}
                                variant="ghost" size="sm" className="h-8 text-xs text-slate-500">
                                View Inventory <ArrowRight className="ml-1 h-3 w-3" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {(lowStockItems?.length || 0) > 0 ? (
                            <div className="divide-y divide-slate-100">
                                {lowStockItems?.map((item) => (
                                    <div key={item.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                        <div>
                                            <p className="font-semibold text-slate-900 text-sm">{item.name}  <span className="text-xs">({item.unitOfMeasure.toLowerCase()})</span></p>
                                            <p className="text-xs text-slate-500 mt-0.5"></p>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-black bg-rose-100 text-rose-700 border border-rose-200">
                                                {item.currentStock} left
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-slate-500">
                                <p className="text-sm">All products are sufficiently stocked.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div></div>
    )
}

export default LowStockAlerts