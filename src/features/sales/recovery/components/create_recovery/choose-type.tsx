"use client";

import { RotateCcw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
    step: string;
    handleTypeSelect: (type: "RETURN" | "RECOVERY") => void;
};

export default function ChooseType({ step, handleTypeSelect }: Props) {
    return (
        <div className="w-full">
            {step === "SELECT_SALE" && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 max-w-5xl mx-auto">

                    {/* 1. SALE RETURN CARD */}
                    <div className="group flex flex-col p-6 bg-white border border-slate-200 rounded-2xl hover:border-sky-500 hover:shadow-[0_8px_30px_rgb(14,165,233,0.1)] transition-all duration-300 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-sky-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        <div className="flex flex-col sm:flex-row items-start sm:items-center">
                            <div className="h-14 w-14 rounded-xl bg-sky-50 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-sky-100 transition-all duration-300">
                                <RotateCcw className="h-7 w-7 text-sky-600" />
                            </div>
                            <div className="mt-4 sm:mt-0 sm:ml-6 flex-1">
                                <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Sale Return</h3>
                                <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                                    Process returns from completed customer orders. Route returned items back to live stock or log damaged goods into wastage, adjusting Khata or issuing refunds.
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:ml-20">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => handleTypeSelect("RETURN")}
                                className="flex-1 flex items-center justify-center gap-2 bg-slate-50 hover:bg-sky-50 text-slate-700 hover:text-sky-700 border-slate-200 hover:border-sky-200 h-11 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
                            >
                                <RotateCcw className="h-4 w-4" /> Process Sale Return
                            </Button>
                        </div>
                    </div>

                    {/* 2. CUSTOMER RECOVERY CARD */}
                    <div className="group flex flex-col p-6 bg-white border border-slate-200 rounded-2xl hover:border-emerald-500 hover:shadow-[0_8px_30px_rgb(16,185,129,0.1)] transition-all duration-300 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        <div className="flex flex-col sm:flex-row items-start sm:items-center">
                            <div className="h-14 w-14 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-emerald-100 transition-all duration-300">
                                <ShieldCheck className="h-7 w-7 text-emerald-600" />
                            </div>
                            <div className="mt-4 sm:mt-0 sm:ml-6 flex-1">
                                <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Customer Recovery</h3>
                                <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                                    Collect pending Khata payments and recover outstanding returnable containers (empties) safely within account limits.
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 flex flex-col sm:flex-row gap-3 sm:ml-20">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => handleTypeSelect("RECOVERY")}
                                className="flex-1 flex items-center justify-center gap-2 bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border-slate-200 hover:border-emerald-200 h-11 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
                            >
                                <ShieldCheck className="h-4 w-4" /> Process Recovery
                            </Button>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
}