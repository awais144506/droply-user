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
    isLoading?: boolean; // Added isLoading prop
}

export default function PageStatsCard({
    title,
    value,
    icon: Icon,
    prefix,
    postfix,
    description,
    postfixTextColor = "text-slate-400",
    iconContainerClass = "bg-sky-50 text-sky-600",
    valueColorClass = "text-slate-900",
    isLoading = false // Default to false
}: Props) {
    return (
        <Card className="shadow-sm border-slate-200 hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {title}
                </CardTitle>
                <div className={cn("p-2 rounded-lg shrink-0", iconContainerClass)}>
                    <Icon className="h-4 w-4" />
                </div>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    /* Shadcn-style Skeleton Loader */
                    <div className="mt-1 space-y-2">
                        <div className="h-9 w-24 rounded-md bg-slate-200 animate-pulse" />
                        {description && (
                            <div className="h-3 w-32 rounded-md bg-slate-100 animate-pulse mt-2" />
                        )}
                    </div>
                ) : (
                    /* Actual Content */
                    <>
                        <div className="flex items-baseline gap-1 mt-1">
                            {prefix && (
                                <span className="text-lg font-semibold text-slate-400">{prefix}</span>
                            )}
                            <div className={cn("text-3xl font-bold tracking-tight", valueColorClass)}>
                                {value}
                            </div>
                            {postfix && (
                                <span className={cn("text-sm font-semibold ml-0.5", postfixTextColor)}>
                                    {postfix}
                                </span>
                            )}
                        </div>
                        {description && (
                            <p className="text-xs text-slate-500 mt-2 font-medium">
                                {description}
                            </p>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    );
}