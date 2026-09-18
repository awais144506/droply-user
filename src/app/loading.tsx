"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingProps {
    text?: string;
    className?: string;
    iconClassName?: string;
}

export default function Loading({
    text = "Loading...",
    className,
    iconClassName
}: LoadingProps) {
    return (
        <div className={cn("flex min-h-[40vh] w-full flex-col items-center justify-center", className)}>
            <div className="flex flex-col items-center gap-3 text-slate-500">
                {/* The standard Shadcn spinner */}
                <Loader2 className={cn("h-8 w-8 animate-spin text-sky-600", iconClassName)} />

                {/* Subtle pulse effect on the text looks highly professional */}
                {text && (
                    <p className="text-sm font-medium animate-pulse">
                        {text}
                    </p>
                )}
            </div>
        </div>
    );
}