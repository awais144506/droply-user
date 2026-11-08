"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingProps {
    text?: string;
    className?: string;
    iconClassName?: string;
    variant?: "page" | "card" | "inline"; // Flexible layout wrappers
}

export default function Loading({
    text = "Loading data...",
    className,
    iconClassName,
    variant = "page",
}: LoadingProps) {
    // 1. Inline Variant (for buttons, table cells, or compact containers)
    if (variant === "inline") {
        return (
            <div className={cn("inline-flex items-center gap-2 text-slate-500", className)}>
                <Loader2 className={cn("h-4 w-4 animate-spin text-sky-600", iconClassName)} />
                {text && <span className="text-xs font-semibold animate-pulse">{text}</span>}
            </div>
        );
    }

    // 2. Card Variant (for inside stats cards, tables, or small sections)
    if (variant === "card") {
        return (
            <div className={cn("flex h-48 w-full flex-col items-center justify-center p-6", className)}>
                <div className="flex flex-col items-center gap-2.5 text-slate-500">
                    <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-500/10 border border-sky-400/30 backdrop-blur-md shadow-xs">
                        <Loader2 className={cn("h-5 w-5 animate-spin text-sky-600", iconClassName)} />
                    </div>
                    {text && (
                        <p className="text-xs font-bold text-slate-600 uppercase tracking-wider animate-pulse">
                            {text}
                        </p>
                    )}
                </div>
            </div>
        );
    }

    // 3. Full Page Variant (Default - Gorgeous frosted card center-screen)
    return (
        <div className={cn("flex min-h-[50vh] w-full flex-col items-center justify-center p-6", className)}>
            <div className="relative group flex flex-col items-center gap-3.5 p-6 rounded-3xl border border-slate-200/80 bg-white/80 backdrop-blur-xl shadow-lg shadow-sky-600/5 transition-all duration-300">
                {/* Soft ambient corner glow behind spinner */}
                <div className="pointer-events-none absolute inset-0 rounded-3xl bg-linear-to-b from-sky-500/5 to-transparent opacity-50" />

                <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-500/15 text-sky-600 border border-sky-400/40 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8)] backdrop-blur-md">
                    <Loader2 className={cn("h-6 w-6 animate-spin text-sky-600 stroke-[2.5]", iconClassName)} />
                </div>

                {text && (
                    <div className="text-center space-y-0.5">
                        <p className="text-xs font-black text-slate-800 uppercase tracking-wider animate-pulse">
                            {text}
                        </p>
                        <p className="text-[10px] font-medium text-slate-400">
                            Please wait a moment...
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}