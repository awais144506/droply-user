import { Info, AlertTriangle, CheckCircle2, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import PricingTierCard from "./pricing-card";

type Props = {
    pricingDb: Record<string, any>;
    currentUser: { tier: string; cycle: string; activeStaffCount: number; renewDate: Date; price: number };
    selectedCycle: "MONTHLY" | "YEARLY";
    selectedTier: string;
    onCycleChange: (cycle: "MONTHLY" | "YEARLY") => void;
    onTierChange: (tier: string) => void;
    isCycleLocked: boolean;
    isDowngrade: boolean;
    isUpgrade: boolean;
    isSamePlan: boolean;
    isPastDue: boolean;
    isOverLimit: boolean;
    targetLimit: number | string;
    amountDue: number;
    selectedPlanFullPrice: number;
};

export default function PlanSelection({
    pricingDb,
    currentUser,
    selectedCycle,
    selectedTier,
    onCycleChange,
    onTierChange,
    isCycleLocked,
    isDowngrade,
    isUpgrade,
    isSamePlan,
    isPastDue,
    isOverLimit,
    targetLimit,
    amountDue,
    selectedPlanFullPrice,
}: Props) {
    // Only lock the Monthly button if they are on a Yearly plan AND the cycle is still active
    const disableMonthlyBtn = !isPastDue && currentUser.cycle === "YEARLY";

    return (
        <Card className="rounded-2xl border-slate-200 shadow-sm flex flex-col">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <h3 className="text-lg font-bold text-slate-900">1. Select Plan & Cycle</h3>
                
                <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
                    <button
                        onClick={() => onCycleChange("MONTHLY")}
                        disabled={disableMonthlyBtn}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            selectedCycle === "MONTHLY" 
                                ? "bg-white text-slate-900 shadow-sm" 
                                : disableMonthlyBtn 
                                ? "text-slate-400 cursor-not-allowed" 
                                : "text-slate-500 hover:text-slate-900"
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
                        Yearly <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-sm">20% SAVE</span>
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

                {/* DYNAMIC STATUS NOTES */}
                <div className="mt-auto space-y-3">
                    
                    {/* 1. Staff Limit Warning (Always show if over limit) */}
                    {isOverLimit && (
                        <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                            <p className="text-sm font-medium text-rose-800">
                                You currently have <strong>{currentUser.activeStaffCount} active staff</strong>, but the {selectedTier} plan only allows <strong>{targetLimit}</strong>. Please suspend {currentUser.activeStaffCount - (targetLimit as number)} staff members to select this tier.
                            </p>
                        </div>
                    )}

                    {/* 2. Active Cycle: Same Plan (Duplicate Payment Prevention) */}
                    {!isPastDue && isSamePlan && (
                        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                            <p className="text-sm font-medium text-slate-600">
                                Your <strong>{currentUser.tier} ({currentUser.cycle})</strong> plan is currently active. To avoid duplicate payments, renewal payments will unlock once your cycle ends on <strong>{currentUser.renewDate.toLocaleDateString()}</strong>.
                            </p>
                        </div>
                    )}

                    {/* 3. Active Cycle: Downgrade Blocked until Past Due */}
                    {!isPastDue && isDowngrade && !isOverLimit && (
                        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-3">
                            <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                            <p className="text-sm font-medium text-amber-800">
                                Downgrades take effect after your current cycle expires. You can select and pay for the <strong>{selectedTier}</strong> plan after <strong>{currentUser.renewDate.toLocaleDateString()}</strong>.
                            </p>
                        </div>
                    )}

                    {/* 4. Active Cycle: Upgrade Price Difference Breakdown */}
                    {!isPastDue && isUpgrade && !isCycleLocked && !isOverLimit && (
                        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex items-start gap-3">
                            <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                            <div className="text-sm font-medium text-emerald-900 space-y-1">
                                <p className="font-bold">Immediate Upgrade Available</p>
                                {currentUser.price > 0 ? (
                                    <p>
                                        New Plan (Rs. {selectedPlanFullPrice.toLocaleString()}) − Current Plan (Rs. {currentUser.price.toLocaleString()}) = <strong>Rs. {amountDue.toLocaleString()} due today</strong>.
                                    </p>
                                ) : (
                                    <p>
                                        Pay <strong>Rs. {amountDue.toLocaleString()}</strong> to activate your {selectedTier} ({selectedCycle}) plan immediately.
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* 5. Past Due: Ready for Renewal or Plan Change */}
                    {isPastDue && !isOverLimit && (
                        <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-xl flex items-start gap-3">
                            <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                            <p className="text-sm font-medium text-indigo-900">
                                Your billing cycle has ended. You can now pay <strong>Rs. {amountDue.toLocaleString()}</strong> to {isSamePlan ? "renew your current plan" : isDowngrade ? `downgrade to ${selectedTier}` : `upgrade to ${selectedTier}`}.
                            </p>
                        </div>
                    )}

                </div>
            </CardContent>
        </Card>
    );
}