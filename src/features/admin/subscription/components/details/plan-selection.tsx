/* eslint-disable @typescript-eslint/no-explicit-any */
import { Info, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import PricingTierCard from "./pricing-card";

type Props = {
    pricingDb: Record<string, any>;
    currentUser: { tier: string; cycle: string; activeStaffCount: number };
    selectedCycle: "MONTHLY" | "YEARLY";
    selectedTier: string;
    onCycleChange: (cycle: "MONTHLY" | "YEARLY") => void;
    onTierChange: (tier: string) => void;
    isCycleLocked: boolean;
    isDowngrade: boolean;
    isOverLimit: boolean;
    targetLimit: number | string;
};

export default function PlanSelection({
    pricingDb, currentUser, selectedCycle, selectedTier, onCycleChange, onTierChange, isCycleLocked, isDowngrade, isOverLimit, targetLimit
}: Props) {
    return (
        <Card className="rounded-2xl border-slate-200 shadow-sm flex flex-col h-100">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <h3 className="text-lg font-bold text-slate-900">1. Select New Plan</h3>
                
                <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                    <button
                        onClick={() => onCycleChange("MONTHLY")}
                        disabled={currentUser.cycle === "YEARLY"}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            selectedCycle === "MONTHLY" ? "bg-white text-slate-900 shadow-sm" : currentUser.cycle === "YEARLY" ? "text-slate-400 cursor-not-allowed" : "text-slate-500 hover:text-slate-900"
                        }`}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => onCycleChange("YEARLY")}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                            selectedCycle === "YEARLY" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900"
                        }`}
                    >
                        Yearly <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-sm">16% OFF</span>
                    </button>
                </div>
            </div>

            <CardContent className="p-6 flex-1 flex flex-col">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    {Object.keys(pricingDb).map((tier) => (
                        <PricingTierCard 
                            key={tier}
                            tier={tier}
                            price={pricingDb[tier][selectedCycle.toLowerCase()]}
                            cycle={selectedCycle}
                            isSelected={selectedTier === tier}
                            isCurrent={currentUser.tier === tier}
                            onClick={() => onTierChange(tier)}
                        />
                    ))}
                </div>

                <div className="mt-auto">
                    {isCycleLocked && (
                        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-start gap-3">
                            <Info className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
                            <p className="text-sm font-medium text-slate-600">You are locked in a yearly contract. You cannot switch back to monthly billing until your renewal date.</p>
                        </div>
                    )}
                    {isDowngrade && isOverLimit && (
                        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                            <p className="text-sm font-medium text-amber-800">
                                You have <strong>{currentUser.activeStaffCount} active staff</strong>. The {selectedTier} plan limits you to <strong>{targetLimit}</strong>. Suspend {currentUser.activeStaffCount - (targetLimit as number)} users to downgrade.
                            </p>
                        </div>
                    )}
                    {isDowngrade && !isOverLimit && (
                        <div className="bg-sky-50 border border-sky-200 p-4 rounded-xl flex items-start gap-3">
                            <Info className="w-5 h-5 text-sky-500 shrink-0 mt-0.5" />
                            <p className="text-sm font-medium text-sky-800">Downgrades take effect at the end of your current cycle. No payment is required today.</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}