import { Calendar, Crown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Props = {
    currentUser: { tier: string; cycle: string; renewDate: Date; price: number };
    daysLeft: number;
};

export default function SubscriptionHeader({ currentUser, daysLeft }: Props) {
    return (
        <Card className="bg-slate-900 text-white border-none shadow-lg rounded-2xl overflow-hidden">
            <div className="p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative">
                <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/20 blur-3xl rounded-full pointer-events-none" />
                
                <div className="flex items-center gap-5 z-10">
                    <div className="h-16 w-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
                        <Crown className="w-8 h-8 text-amber-400" />
                    </div>
                    <div>
                        <p className="text-slate-400 text-sm font-bold tracking-widest uppercase mb-1">Current Active Plan</p>
                        <h2 className="text-3xl font-black flex items-center gap-3">
                            {currentUser.tier}
                            <Badge className="bg-indigo-500 hover:bg-indigo-600 text-white border-none">{currentUser.cycle}</Badge>
                        </h2>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-6 md:gap-12 z-10">
                    <div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Renewal Date</p>
                        <div className="flex items-center gap-2 text-lg font-bold">
                            <Calendar className="w-5 h-5 text-indigo-400" />
                            {currentUser.renewDate.toLocaleDateString()}
                        </div>
                    </div>
                    <div>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Time Remaining</p>
                        <div className="text-xl font-black text-emerald-400">{daysLeft} Days Left</div>
                    </div>
                    <div className="text-right">
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Current Price</p>
                        <div className="text-2xl font-black">Rs. {currentUser.price.toLocaleString()}</div>
                    </div>
                </div>
            </div>
        </Card>
    );
}