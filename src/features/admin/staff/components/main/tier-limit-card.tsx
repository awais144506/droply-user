"use client";

import { Users, Info, Shield, Zap } from "lucide-react";
import { useRole } from "@/lib/hooks/use-role";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
export const getTierConfig = (tier: string) => {
    const normalizedTier = tier?.toUpperCase();

    switch (normalizedTier) {
        case "GOLD":
            return {
                badge: "Gold Plan",
                colors: {
                    bg: "bg-amber-50",
                    border: "border-amber-200",
                    text: "text-amber-800",
                    icon: "text-amber-600",
                    progressText: "text-amber-700",
                },
                Icon: Zap,
            };
        case "PLATINUM":
            return {
                badge: "Platinum Plan",
                colors: {
                    bg: "bg-indigo-50",
                    border: "border-indigo-200",
                    text: "text-indigo-800",
                    icon: "text-indigo-600",
                    progressText: "text-indigo-700",
                },
                Icon: Shield,
            };
        case "SILVER":
        default:
            return {
                badge: "Silver Plan",
                colors: {
                    bg: "bg-slate-50",
                    border: "border-slate-200",
                    text: "text-slate-800",
                    icon: "text-slate-600",
                    progressText: "text-slate-700",
                },
                Icon: Users,
            };
    }
};

interface TierLimitCardProps {
    activeStaffCount: number;
    maxUsersLimit: number;
    isLimitReached: boolean;
}

export default function TierLimitCard({ activeStaffCount, maxUsersLimit, isLimitReached }: TierLimitCardProps) {
    const { userTier } = useRole();
    const router = useRouter();
    const tierConfig = getTierConfig(userTier);

    return (
        <div className={`p-4 sm:p-5 rounded-2xl border ${tierConfig.colors.bg} ${tierConfig.colors.border} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm`}>
            <div className="flex items-start sm:items-center gap-4">
                <div className={`h-10 w-10 shrink-0 rounded-xl bg-white border ${tierConfig.colors.border} flex items-center justify-center shadow-sm`}>
                    <tierConfig.Icon className={`h-5 w-5 ${tierConfig.colors.icon}`} />
                </div>

                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className={`text-sm font-bold ${tierConfig.colors.text}`}>
                            {tierConfig.badge}
                        </h3>
                        <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-white border ${tierConfig.colors.border} ${tierConfig.colors.icon}`}>
                            {
                                `${activeStaffCount} / ${maxUsersLimit} Slots Used`
                            }
                        </span>
                    </div>

                    <p className={`text-xs flex items-center gap-1.5 ${tierConfig.colors.progressText} opacity-90`}>
                        <Info className="h-3.5 w-3.5" />
                        Tip: If you disable or suspend a user, their slot will become available for a new team member.
                    </p>
                </div>
            </div>

            {isLimitReached && (
                <Button
                    onClick={() => router.push(`/admin/subscription`)}
                    variant="destructive">
                    Upgrade Plan
                </Button>
            )}
        </div>
    );
}