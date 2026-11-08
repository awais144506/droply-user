import { ElementType } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Props = {
    title: string;
    value: string | number | undefined;
    icon: ElementType;
    prefix?: string;
    postfix?: string;
    description?: string;
    iconContainerClass?: string;
    valueColorClass?: string;
    postfixTextColor?: string;
    isLoading?: boolean;
};

export default function PageStatsCard({
    title,
    value,
    icon: Icon,
    prefix,
    postfix,
    description,
    iconContainerClass = "bg-sky-500/15 text-sky-600 border-sky-400/40",
    valueColorClass = "text-slate-900",
    isLoading = false,
}: Props) {
    // Auto-format raw numbers with commas (e.g., 2400 -> 2,400) while preserving custom strings
    const formattedValue =
        typeof value === "number" ? value.toLocaleString() : (value ?? "0");

    return (
        <Card className="group relative overflow-hidden rounded-2xl border border-slate-200/90 bg-white/90 backdrop-blur-sm shadow-xs hover:shadow-md hover:border-slate-300/90 transition-all duration-300">
            {/* Subtle top glass specular reflection */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-sky-400/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Soft ambient corner glow on hover */}
            <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-sky-500/5 blur-2xl group-hover:bg-sky-500/10 transition-all duration-300" />

            <CardHeader className="flex flex-row items-center justify-between pb-2 pt-5 px-5 sm:px-6 space-y-0">
                <CardTitle className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider truncate pr-2">
                    {title}
                </CardTitle>

                {/* Glassy Icon Container */}
                <div
                    className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-xl shrink-0 border border-slate-200/60 backdrop-blur-md shadow-[inset_0_1px_0_0_rgba(255,255,255,0.75)] transition-transform duration-300 group-hover:scale-105",
                        iconContainerClass
                    )}
                >
                    <Icon className="h-4 w-4 stroke-[2.25]" />
                </div>
            </CardHeader>

            <CardContent className="px-5 sm:px-6 pb-5 pt-0">
                {isLoading ? (
                    /* Refined Skeleton Loader */
                    <div className="mt-1.5 space-y-2.5">
                        <div className="h-8 w-28 rounded-xl bg-slate-200/70 animate-pulse" />
                        {description && (
                            <div className="h-3.5 w-36 rounded-lg bg-slate-100 animate-pulse" />
                        )}
                    </div>
                ) : (
                    /* Actual Content */
                    <>
                        <div className="flex items-baseline gap-1.5 mt-0.5">
                            {prefix && (
                                <span className="text-sm sm:text-base font-bold text-slate-400 select-none">
                                    {prefix}
                                </span>
                            )}
                            <div
                                className={cn(
                                    "text-2xl sm:text-3xl font-black tracking-tight tabular-nums",
                                    valueColorClass
                                )}
                            >
                                {formattedValue}
                            </div>
                            {postfix && (
                                <span
                                    className={cn(
                                        "text-xs font-bold uppercase tracking-wide ml-0.5",
                                    )}
                                >
                                    {postfix}
                                </span>
                            )}
                        </div>

                        {description && (
                            <p className="text-xs text-slate-500 mt-2 font-medium leading-relaxed truncate">
                                {description}
                            </p>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    );
}