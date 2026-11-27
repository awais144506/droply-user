import { Calendar, Crown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Props = {
    currentUser: { tier: string; cycle: string; renewDate: Date; price: number; status: string };
    daysLeft: number;
};

export default function SubscriptionHeader({ currentUser, daysLeft }: Props) {
    return (
        <Card className="bg-slate-900 text-white border-none shadow-lg rounded-2xl overflow-hidden">
            <div className="p-4 sm:p-6 md:p-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-5 sm:gap-6 relative min-w-0">
                <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/20 blur-3xl rounded-full pointer-events-none" />

                <div className="flex items-start sm:items-center gap-3.5 sm:gap-5 z-10 min-w-0">
                    <div className="h-12 w-12 sm:h-16 sm:w-16 shrink-0 bg-white/10 rounded-xl sm:rounded-2xl flex items-center justify-center border border-white/20">
                        <Crown className="w-6 h-6 sm:w-8 sm:h-8 text-amber-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-slate-400 text-[11px] sm:text-sm font-bold tracking-widest uppercase mb-1">
                            Current Active Plan
                        </p>
                        <h2 className="text-xl sm:text-3xl font-black flex flex-wrap items-center gap-2 sm:gap-3 min-w-0">
                            <span className="wrap-break-word">{currentUser.tier}</span>
                            <Badge className="bg-indigo-500 hover:bg-indigo-600 text-white border-none shrink-0">
                                {currentUser.cycle}
                            </Badge>
                        </h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-10 z-10 w-full md:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-white/10 min-w-0">
                    <div className="min-w-0">
                        <p className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1">
                            Renewal Date
                        </p>
                        <div className="flex items-center gap-2 text-sm sm:text-lg font-bold min-w-0">
                            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400 shrink-0" />
                            <span className="truncate">{currentUser.renewDate.toLocaleDateString()}</span>
                        </div>
                    </div>

                    <div className="min-w-0">
                        <p className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1">
                            {currentUser.status === "ACTIVE" ? "Time Remaining" : "Account Status"}
                        </p>

                        {/* Dynamic Status Rendering */}
                        {currentUser.status === "ACTIVE" ? (
                            <div className="text-lg sm:text-xl font-black text-emerald-400">
                                {daysLeft} Days Left
                            </div>
                        ) : (
                            <div
                                className={`text-lg sm:text-xl font-black uppercase wrap-break-word ${
                                    currentUser.status === "PAST_DUE" ? "text-rose-500" : "text-amber-500"
                                }`}
                            >
                                {currentUser.status}
                            </div>
                        )}
                    </div>

                    <div className="text-left sm:text-right min-w-0">
                        <p className="text-slate-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-1">
                            Current Price
                        </p>
                        <div className="text-lg sm:text-2xl font-black wrap-break-word">
                            Rs. {currentUser.price.toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}