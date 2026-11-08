"use client";

import { Users, Info, Zap, Crown, ArrowUpRight, Sparkles, AlertCircle, Infinity as InfinityIcon } from "lucide-react";
import { useRole } from "@/lib/hooks/use-role";
import { useRouter } from "next/navigation";

// Shadcn Imports
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";

export const getTierConfig = (tier: string) => {
    const normalizedTier = tier?.toUpperCase();

    switch (normalizedTier) {
        case "PLATINUM":
            return {
                badge: "Platinum Plan",
                subtitle: "Enterprise Staff Capacity",
                isDark: true,
                colors: {
                    card: "bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 border-slate-800 shadow-md shadow-indigo-500/10",
                    iconBox: "bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-indigo-400/30 shadow-lg shadow-indigo-500/20",
                    badgePill: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
                    title: "text-white",
                    subtitle: "text-slate-400",
                    slotCount: "text-indigo-400",
                    slotTotal: "text-slate-500",
                    progressTrack: "bg-slate-800 border-slate-700/50",
                    progressIndicator: "bg-gradient-to-r from-indigo-500 to-purple-500",
                    infoBox: "bg-white/5 border-white/10 text-slate-300",
                    infoIcon: "text-indigo-400",
                },
                Icon: Crown,
            };
        case "GOLD":
            return {
                badge: "Gold Plan",
                subtitle: "Growth Team Capacity",
                isDark: false,
                colors: {
                    card: "bg-gradient-to-br from-amber-50/70 via-white to-orange-50/30 border-amber-200/80 shadow-sm",
                    iconBox: "bg-gradient-to-br from-amber-400 to-orange-500 text-white border-amber-300 shadow-md shadow-amber-500/20",
                    badgePill: "bg-amber-100/80 text-amber-800 border-amber-200",
                    title: "text-slate-900",
                    subtitle: "text-slate-500",
                    slotCount: "text-amber-600",
                    slotTotal: "text-slate-400",
                    progressTrack: "bg-amber-100/60 border-amber-200/60",
                    progressIndicator: "bg-gradient-to-r from-amber-500 to-orange-500",
                    infoBox: "bg-amber-50/80 border-amber-200/60 text-amber-900",
                    infoIcon: "text-amber-600",
                },
                Icon: Zap,
            };
        case "SILVER":
        default:
            return {
                badge: "Silver Plan",
                subtitle: "Standard Team Capacity",
                isDark: false,
                colors: {
                    card: "bg-gradient-to-br from-slate-50/80 via-white to-slate-50/40 border-slate-200/90 shadow-sm",
                    iconBox: "bg-gradient-to-br from-slate-700 to-slate-900 text-white border-slate-600 shadow-sm",
                    badgePill: "bg-slate-100 text-slate-700 border-slate-200",
                    title: "text-slate-900",
                    subtitle: "text-slate-500",
                    slotCount: "text-slate-900",
                    slotTotal: "text-slate-400",
                    progressTrack: "bg-slate-100 border-slate-200/80",
                    progressIndicator: "bg-slate-800",
                    infoBox: "bg-slate-50 border-slate-200/70 text-slate-600",
                    infoIcon: "text-slate-500",
                },
                Icon: Users,
            };
    }
};

interface TierLimitCardProps {
    activeStaffCount: number;
    maxUsersLimit: number;
    isLimitReached?: boolean;
}

export default function TierLimitCard({
    activeStaffCount,
    maxUsersLimit,
    isLimitReached,
}: TierLimitCardProps) {
    const { userTier } = useRole();
    const router = useRouter();
    const tierConfig = getTierConfig(userTier);

    // Handle "Unlimited" plans gracefully (e.g. 9999+ in DB)
    const isUnlimited = maxUsersLimit >= 9999;

    const limitHit = !isUnlimited && (isLimitReached || activeStaffCount >= maxUsersLimit);
    const remainingSlots = Math.max(0, maxUsersLimit - activeStaffCount);

    return (
        <Card className={`relative overflow-hidden rounded-2xl border transition-all duration-300 ${tierConfig.colors.card}`}>
            <CardContent className="p-5 sm:p-6">
                <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">

                    {/* Left & Center: Icon, Details & Progress */}
                    <div className="flex items-start gap-4 sm:gap-5 flex-1 w-full">

                        {/* Elevated Tier Icon */}
                        <div className={`h-12 w-12 sm:h-14 sm:w-14 shrink-0 rounded-2xl border flex items-center justify-center transition-transform duration-300 hover:scale-105 ${tierConfig.colors.iconBox}`}>
                            <tierConfig.Icon className="h-6 w-6 sm:h-7 sm:w-7" />
                        </div>

                        {/* Content Container */}
                        <div className="flex-1 w-full space-y-3">

                            {/* Top Row: Plan Badge & Numeric Counter */}
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-2.5">
                                    <h3 className={`text-base font-extrabold tracking-tight ${tierConfig.colors.title}`}>
                                        Staff Allocation
                                    </h3>
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${tierConfig.colors.badgePill}`}>
                                        <Sparkles className="h-2.5 w-2.5" />
                                        {tierConfig.badge}
                                    </span>
                                    {limitHit && (
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-500 border border-rose-500/20">
                                            Limit Reached
                                        </span>
                                    )}
                                </div>

                                {/* Slot Counter */}
                                <div className="flex items-baseline gap-1">
                                    <span className={`text-lg font-black tracking-tight ${limitHit ? "text-rose-500" : tierConfig.colors.slotCount}`}>
                                        {activeStaffCount}
                                    </span>
                                    <span className={`text-xs font-bold uppercase ${tierConfig.colors.slotTotal}`}>
                                        / {isUnlimited ? <InfinityIcon className="inline h-4 w-4 mb-0.5" /> : `${maxUsersLimit} Active Slots`}
                                    </span>
                                </div>
                            </div>

                            {/* Bottom Info / Tip Pill */}
                            <div className={`flex items-center justify-between gap-2 px-3 py-2 rounded-xl border text-xs ${limitHit && !tierConfig.isDark
                                    ? "bg-rose-50/70 border-rose-200/70 text-rose-800"
                                    : tierConfig.colors.infoBox
                                }`}>
                                <div className="flex items-center gap-2">
                                    {limitHit ? (
                                        <AlertCircle className="h-3.5 w-3.5 shrink-0 text-rose-500" />
                                    ) : (
                                        <Info className={`h-3.5 w-3.5 shrink-0 ${tierConfig.colors.infoIcon}`} />
                                    )}
                                    <span className="font-medium leading-relaxed">
                                        {limitHit
                                            ? "All staff slots are occupied. Suspend an inactive user or upgrade your plan to add more team members."
                                            : "Tip: Suspending or disabling a staff member immediately frees up their slot for someone new."}
                                    </span>
                                </div>

                                {!isUnlimited && !limitHit && (
                                    <span className={`hidden sm:inline-block shrink-0 text-[11px] font-bold uppercase tracking-wide ${tierConfig.colors.subtitle}`}>
                                        {remainingSlots} {remainingSlots === 1 ? "slot" : "slots"} free
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Upgrade CTA */}
                    {limitHit && (
                        <div className="shrink-0 w-full lg:w-auto pt-1 lg:pt-0">
                            <Button
                                onClick={() => router.push(`/admin/subscription`)}
                                className="w-full lg:w-auto h-11 px-5 rounded-xl font-bold bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 text-white shadow-md shadow-rose-500/20 border-0 transition-all duration-200 group"
                            >
                                Upgrade Capacity
                                <ArrowUpRight className="h-4 w-4 ml-1.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </Button>
                        </div>
                    )}

                </div>
            </CardContent>
        </Card>
    );
}