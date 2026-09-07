import { ElementType } from "react";

type Props = {
    title: string;
    value: string | number;
    icon: ElementType;
    iconContainerClass?: string;
    valueColorClass?: string;
}

export default function PageStatsCard({ 
    title, 
    value, 
    icon: Icon, 
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
                <p className={`text-3xl font-bold ${valueColorClass}`}>
                    {value}
                </p>
            </div>
        </div>
    );
}