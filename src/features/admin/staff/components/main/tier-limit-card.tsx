"use client";

import { Users, Info, Shield, Zap, Phone } from "lucide-react";
import { useRole } from "@/lib/hooks/use-role";
import { useRouter } from "next/navigation";

// Shadcn Imports
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";

export const getTierConfig = (tier: string) => {
    const normalizedTier = tier?.toUpperCase();

    switch (normalizedTier) {
        case "GOLD":
            return {
                badge: "Gold Plan",
                colors: {
                    bg: "bg-amber-50",
                    border: "border-amber-200",
                    text: "text-amber-900",
                    icon: "text-amber-600",
                    progressText: "text-amber-700",
                    // Added progress bar fill color
                    progressIndicator: "bg-amber-500", 
                },
                Icon: Zap,
            };
        case "PLATINUM":
            return {
                badge: "Platinum Plan",
                colors: {
                    bg: "bg-indigo-50",
                    border: "border-indigo-200",
                    text: "text-indigo-900",
                    icon: "text-indigo-600",
                    progressText: "text-indigo-700",
                    progressIndicator: "bg-indigo-500",
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
                    text: "text-slate-900",
                    icon: "text-slate-600",
                    progressText: "text-slate-600",
                    progressIndicator: "bg-slate-800",
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
    isLimitReached 
}: TierLimitCardProps) {
    const { userTier } = useRole();
    const router = useRouter();
    const tierConfig = getTierConfig(userTier);

    // Calculate percentage for the Shadcn Progress bar (max 100%)
    const rawPercentage = (activeStaffCount / maxUsersLimit) * 100;
    const progressPercentage = Math.min(rawPercentage, 100);

    return (
        <Card className={`overflow-hidden border ${tierConfig.colors.border} ${tierConfig.colors.bg} shadow-sm`}>
            <CardContent className="p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
                    
                    {/* Left Side: Icon & Info */}
                    <div className="flex items-start gap-4 flex-1 w-full">
                        
                        {/* Tier Icon */}
                        <div className={`h-12 w-12 shrink-0 rounded-xl bg-white border ${tierConfig.colors.border} flex items-center justify-center shadow-sm`}>
                            <tierConfig.Icon className={`h-6 w-6 ${tierConfig.colors.icon}`} />
                        </div>

                        {/* Title & Progress Bar Container */}
                        <div className="flex-1 w-full">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className={`text-sm font-bold ${tierConfig.colors.text}`}>
                                    {tierConfig.badge}
                                </h3>
                                <span className={`text-xs font-bold ${tierConfig.colors.text}`}>
                                    {activeStaffCount} / {maxUsersLimit} Slots
                                </span>
                            </div>

                            {/* The Shadcn Progress Bar */}
                            <Progress 
                                value={progressPercentage} 
                                className="h-2.5 bg-white border border-slate-200 shadow-inner mb-2"
                                // We inject the custom color class directly onto the indicator div inside Progress
                                indicatorClassName={tierConfig.colors.progressIndicator}
                            />

                            <p className={`text-xs flex items-center gap-1.5 ${tierConfig.colors.progressText} mt-2`}>
                                <Info className="h-3.5 w-3.5 shrink-0" />
                                <span>Tip: If you disable/suspend a user, their slot will become available for a new team member.</span>
                            </p>
                        </div>
                    </div>

                    {/* Right Side: Upgrade Action */}
                    {isLimitReached && (
                        <div className="shrink-0 w-full sm:w-auto">
                            <Button
                                onClick={() => router.push(`/admin/subscription`)}
                                variant="outline"
                                className="w-full sm:w-auto bg-white hover:bg-slate-50 border-rose-200 text-rose-600 hover:text-rose-700 shadow-sm"
                            >
                                <Phone className="h-4 w-4 mr-2" />
                                Upgrade Plan
                            </Button>
                        </div>
                    )}

                </div>
            </CardContent>
        </Card>
    );
}