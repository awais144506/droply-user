import { Store, Truck, RotateCcw, HandCoins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OrderType, OrderCategory } from "../../types/order";

type Props = {
    step: string;
    handleSaleSelect: (category: OrderCategory, type: OrderType) => void;
}

export default function ChooseSale({ step, handleSaleSelect }: Props) {
    return (
        <div className="w-full">
            {step === "SELECT_SALE" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 max-w-5xl mx-auto">

                    {/* 1. WALK-IN CARD */}
                    <div className="group flex flex-col p-6 bg-white border border-slate-200 rounded-2xl hover:border-sky-500 hover:shadow-[0_8px_30px_rgb(14,165,233,0.1)] transition-all duration-300 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-sky-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        <div className="flex flex-col sm:flex-row items-start sm:items-center">
                            <div className="h-14 w-14 rounded-xl bg-sky-50 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-sky-100 transition-all duration-300">
                                <Store className="h-7 w-7 text-sky-600" />
                            </div>
                            <div className="mt-4 sm:mt-0 sm:ml-6 flex-1">
                                <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Plant Gate POS (Walk-In)</h3>
                                <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                                    Immediate over-the-counter billing. Deduct stock instantly, collect cash, exchange assets, and update the Khata ledger.
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:ml-20">
                            <Button
                                variant="outline"
                                onClick={() => handleSaleSelect("WALK_IN", "WALK_IN")}
                                className="flex-1 flex items-center justify-center gap-2 bg-slate-50 hover:bg-sky-50 text-slate-700 hover:text-sky-700 border-slate-200 hover:border-sky-200 h-11 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
                            >
                                <Store className="h-4 w-4" /> Process Walk-In Sale
                            </Button>
                        </div>
                    </div>

                    {/* 2. DELIVERY CARD */}
                    <div className="group flex flex-col p-6 bg-white border border-slate-200 rounded-2xl hover:border-indigo-500 hover:shadow-[0_8px_30px_rgb(99,102,241,0.1)] transition-all duration-300 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        <div className="flex flex-col sm:flex-row items-start sm:items-center">
                            <div className="h-14 w-14 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-indigo-100 transition-all duration-300">
                                <Truck className="h-7 w-7 text-indigo-600" />
                            </div>
                            <div className="mt-4 sm:mt-0 sm:ml-6 flex-1">
                                <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Route Delivery Order</h3>
                                <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                                    Schedule a dispatch for a registered client. Reserve stock on the truck; ledgers update only upon rider completion.
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:ml-20">
                            <Button
                                variant="outline"
                                onClick={() => handleSaleSelect("DELIVERY", "DELIVERY")}
                                className="flex-1 flex items-center justify-center gap-2 bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border-slate-200 hover:border-indigo-200 h-11 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
                            >
                                <Truck className="h-4 w-4" /> Schedule Dispatch
                            </Button>
                        </div>
                    </div>

                    {/* 3. SALE RETURN CARD */}
                    <div className="group flex flex-col p-6 bg-white border border-slate-200 rounded-2xl hover:border-rose-500 hover:shadow-[0_8px_30px_rgb(244,63,94,0.1)] transition-all duration-300 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-rose-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        <div className="flex flex-col sm:flex-row items-start sm:items-center">
                            <div className="h-14 w-14 rounded-xl bg-rose-50 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-rose-100 transition-all duration-300">
                                <RotateCcw className="h-7 w-7 text-rose-600" />
                            </div>
                            <div className="mt-4 sm:mt-0 sm:ml-6 flex-1">
                                <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Sale Return</h3>
                                <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                                    Process defective items or returned assets. Classify inbound goods to usable Store inventory or Wastage records.
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:ml-20">
                            <Button
                                variant="outline"
                                onClick={() => handleSaleSelect("SALE_RETURN", "WALK_IN")}
                                className="flex-1 flex items-center justify-center gap-2 bg-slate-50 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border-slate-200 hover:border-rose-200 h-11 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
                            >
                                <Store className="h-4 w-4" /> Receive at Counter
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => handleSaleSelect("SALE_RETURN", "DELIVERY")}
                                className="flex-1 flex items-center justify-center gap-2 bg-slate-50 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border-slate-200 hover:border-rose-200 h-11 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
                            >
                                <Truck className="h-4 w-4" /> Assign to Rider
                            </Button>
                        </div>
                    </div>

                    {/* 4. RECOVERY CARD */}
                    <div className="group flex flex-col p-6 bg-white border border-slate-200 rounded-2xl hover:border-emerald-500 hover:shadow-[0_8px_30px_rgb(16,185,129,0.1)] transition-all duration-300 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        <div className="flex flex-col sm:flex-row items-start sm:items-center">
                            <div className="h-14 w-14 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-emerald-100 transition-all duration-300">
                                <HandCoins className="h-7 w-7 text-emerald-600" />
                            </div>
                            <div className="mt-4 sm:mt-0 sm:ml-6 flex-1">
                                <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Ledger Recovery</h3>
                                <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                                    Collect pending cash debts or retrieve empty assets from customers to clear their outstanding balances.
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:ml-20">
                            <Button
                                variant="outline"
                                onClick={() => handleSaleSelect("RECOVERY", "WALK_IN")}
                                className="flex-1 flex items-center justify-center gap-2 bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border-slate-200 hover:border-emerald-200 h-11 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
                            >
                                <Store className="h-4 w-4" /> Counter Collection
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => handleSaleSelect("RECOVERY", "DELIVERY")}
                                className="flex-1 flex items-center justify-center gap-2 bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border-slate-200 hover:border-emerald-200 h-11 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
                            >
                                <Truck className="h-4 w-4" /> Assign to Rider
                            </Button>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
}