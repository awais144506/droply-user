import { Badge } from "@/components/ui/badge";

type Props = {
    tier: string;
    price: number;
    cycle: string;
    isSelected: boolean;
    isCurrent: boolean;
    onClick: () => void;
};

const colors: Record<string, string> = {
    SILVER: "border-slate-400 ring-slate-100 text-slate-700",
    GOLD: "border-amber-400 ring-amber-50 text-amber-600",
    PLATINUM: "border-indigo-400 ring-indigo-50 text-indigo-600",
};

export default function PricingTierCard({ tier, price, cycle, isSelected, isCurrent, onClick }: Props) {
    const theme = colors[tier] || colors.SILVER;

    return (
        <div 
            onClick={onClick}
            className={`relative cursor-pointer transition-all duration-300 bg-white p-4 rounded-xl flex flex-col justify-center text-center min-h-[140px] ${
                isSelected 
                    ? `border-2 shadow-lg scale-105 z-10 ${theme} ring-4` 
                    : `border border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100`
            }`}
        >
            {isCurrent && (
                <div className="absolute -top-2 inset-x-0 flex justify-center">
                    <Badge className="bg-slate-900 text-white border-none text-[9px] uppercase px-2 py-0.5 shadow-sm">Current</Badge>
                </div>
            )}
            <h4 className={`text-sm font-black uppercase tracking-widest mb-1 ${isSelected ? theme.split(' ')[2] : 'text-slate-500'}`}>{tier}</h4>
            <div className="flex flex-col items-center">
                <span className={`text-2xl font-black ${isSelected ? 'text-slate-900' : 'text-slate-600'}`}>
                    {price.toLocaleString()}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                    / {cycle === "MONTHLY" ? "Month" : "Year"}
                </span>
            </div>
        </div>
    );
}