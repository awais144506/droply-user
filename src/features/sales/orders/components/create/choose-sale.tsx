import { Store, Truck } from "lucide-react";

type Props = {
    step: string;
    handleSaleSelect: (saleType: "WALK_IN" | "DELIVERY") => void;
}

export default function ChooseSale({ step, handleSaleSelect }: Props) {

    return (
        <div>
            {step === "SELECT_SALE" && (
                <div className="flex gap-4 pt-4 max-w-3xl mx-auto">
                    <button
                        onClick={() => handleSaleSelect("WALK_IN")}
                        className="group flex flex-col sm:flex-row items-start sm:items-center p-6 bg-white border border-slate-200 rounded-2xl hover:border-sky-500 hover:shadow-[0_8px_30px_rgb(14,165,233,0.1)] transition-all duration-300 text-left w-full relative overflow-hidden cursor-pointer"
                    >
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-sky-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        <div className="h-14 w-14 rounded-xl bg-sky-50 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-sky-100 transition-all duration-300">
                            <Store className="h-7 w-7 text-sky-600" />
                        </div>

                        <div className="mt-4 sm:mt-0 sm:ml-6 flex-1">
                            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Plant Gate POS (Walk-In)</h3>
                            <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                                Immediate over-the-counter billing for regular clients. Collect cash, exchange returnable containers, and update the Khata instantly.
                            </p>
                        </div>

                    </button>

                    {/* Delivery Card */}
                    <button
                        onClick={() => handleSaleSelect("DELIVERY")}
                        className="group flex flex-col sm:flex-row items-start sm:items-center p-6 bg-white border border-slate-200 rounded-2xl hover:border-indigo-500 hover:shadow-[0_8px_30px_rgb(99,102,241,0.1)] transition-all duration-300 text-left w-full relative overflow-hidden cursor-pointer"
                    >
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        <div className="h-14 w-14 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-indigo-100 transition-all duration-300">
                            <Truck className="h-7 w-7 text-indigo-600" />
                        </div>

                        <div className="mt-4 sm:mt-0 sm:ml-6 flex-1">
                            <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Route Delivery Order</h3>
                            <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                                Schedule a delivery for a registered client. Assign a rider, allocate stock, and finalize asset exchanges upon rider return.
                            </p>
                        </div>
                    </button>
                </div>
            )}
        </div>
    );
}