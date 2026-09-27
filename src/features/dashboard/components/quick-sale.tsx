import { useState } from "react";
import { Truck, UserPlus, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import WalkInSaleDialog from "@/features/dashboard/components/walk-in-sale-dialog";

type Props = {}

const QuickSale = (props: Props) => {

    const router = useRouter();
    const [isQuickSaleOpen, setIsQuickSaleOpen] = useState(false);

    return (
        <div> {/* Left Column: Quick Actions */}
            <div className="lg:col-span-1 space-y-6">
                <Card className="border-sky-200 bg-sky-50 shadow-sm overflow-hidden">
                    <CardHeader className="pb-3 border-b border-sky-100 bg-white">
                        <CardTitle className="text-sm font-bold text-sky-900">Over-the-Counter</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-3">
                        <Button
                            onClick={() => setIsQuickSaleOpen(true)}
                            className="w-full bg-sky-600 hover:bg-sky-700 text-white h-14 text-lg shadow-sm"
                        >
                            <Zap className="mr-2 h-5 w-5" /> Quick Sale
                        </Button>
                        <div className="grid grid-cols-2 gap-3">
                            <Button
                                onClick={() => router.push('/manage/customers/create-customer')}
                                variant="outline" className="h-12 bg-white border-sky-200 text-sky-700 hover:bg-sky-100 px-2 text-xs">
                                <UserPlus className="mr-1.5 h-4 w-4" /> New Customer
                            </Button>
                            <Button
                                onClick={() => router.push('/sales/orders/create-sale')}
                                variant="outline" className="h-12 bg-white border-sky-200 text-sky-700 hover:bg-sky-100 px-2 text-xs">
                                <Truck className="mr-1.5 h-4 w-4" /> Dispatch
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <WalkInSaleDialog
                isOpen={isQuickSaleOpen}
                onClose={() => setIsQuickSaleOpen(false)}
            />
        </div>
    )
}

export default QuickSale