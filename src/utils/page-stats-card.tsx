import { ElementType } from "react";

type Props = {
    title: string;
    value: string | number | undefined;
    icon: ElementType;
    prefix?: string;       // e.g., "Rs." or "$"
    postfix?: string;      // e.g., "kg" or "%"
    description?: string;  // e.g., "Compared to last month"
    iconContainerClass?: string;
    valueColorClass?: string;
}

export default function PageStatsCard({
    title,
    value,
    icon: Icon,
    prefix,
    postfix,
    description,
    iconContainerClass = "bg-sky-50 text-sky-600",
    valueColorClass = "text-slate-900"
}: Props) {
    return (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
                <div className="flex justify-between items-start mb-2">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        {title}
                    </p>
                    <div className={`p-2 rounded-lg ${iconContainerClass}`}>
                        <Icon className="h-4 w-4" />
                    </div>
                </div>

                <div className="flex items-baseline gap-1 mt-1">
                    {prefix && <span className="text-lg font-semibold text-slate-400">{prefix}</span>}
                    <p className={`text-3xl font-bold ${valueColorClass}`}>
                        {value}
                    </p>
                    {postfix && <span className="text-sm font-semibold text-slate-400 ml-0.5">{postfix}</span>}
                </div>

                {description && (
                    <p className="text-xs text-slate-500 mt-2 font-medium">
                        {description}
                    </p>
                )}
            </div>
        </div>
    );
}