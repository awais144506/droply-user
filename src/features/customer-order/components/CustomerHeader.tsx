import { MapPin, Store, RotateCcw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { CustomerData } from "../types/customerOrder";

export function CustomerHeader({ customer }: { customer: CustomerData }) {
    return (
        <div className="bg-slate-900 text-white p-6 pt-8 rounded-b-[2.5rem] shadow-xl space-y-5">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-4 ">
                <Link 
                    href="https://dedroply.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 group transition-opacity hover:opacity-90"
                    title="Visit Droply"
                >
                    <Image
                        src="/logo2.png" // Using the full wordmark logo
                        alt="Droply Logo"
                        width={110}
                        height={36}
                        priority
                        className="object-contain h-8 w-auto bg-white rounded-lg p-1"
                    />
                </Link>
                
                <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-xs font-medium text-slate-300">
                    <Store className="w-3.5 h-3.5 text-sky-400" />
                    <span>{customer.branch?.name || "Droply"}</span>
                </div>
            </div>

            {/* Customer Greeting */}
            <div>
                <h1 className="text-2xl font-black mb-1 text-white">Hi, {customer.name}</h1>
                <p className="text-xs text-slate-400 font-medium">Manage your branch orders and ledger below</p>
            </div>

            {/* Financial Ledger & Deposits */}
            <div className="grid grid-cols-3 gap-3 bg-white/5 p-3 rounded-2xl border border-white/10">
                <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Ledger</span>
                    <span className={`text-sm font-bold ${customer.customerCredit > 0 ? "text-amber-400" : "text-emerald-400"}`}>
                        Rs. {customer.customerCredit || 0}
                    </span>
                </div>
                <div className="flex flex-col border-l border-white/10 pl-3">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Advance</span>
                    <span className="text-sm font-bold text-emerald-400">Rs. {customer.customerAdvance || 0}</span>
                </div>
                <div className="flex flex-col border-l border-white/10 pl-3">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Security</span>
                    <span className="text-sm font-bold text-white">Rs. {customer.securityDeposit || 0}</span>
                </div>
            </div>

            {/* Returnables Conditionally Rendered */}
            {customer.returnablesLength > 0 && (
                <div className="bg-white/5 p-3 rounded-2xl border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-400">
                        <RotateCcw className="w-4 h-4 text-sky-400" />
                        <span className="text-xs font-bold uppercase tracking-wider">Returnable Assets Held</span>
                    </div>
                    <Badge variant="secondary" className="bg-sky-500/20 text-sky-300 hover:bg-sky-500/30 border-none font-bold">
                        {customer.returnablesLength}x Empty Bottles
                    </Badge>
                </div>
            )}

            {/* Address & Zone */}
            <div className="bg-white/5 p-3 rounded-2xl flex items-start gap-3 border border-white/10">
                <MapPin className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Delivery Address</p>
                    <p className="text-sm font-semibold text-white leading-snug mt-0.5">{customer.address}</p>
                    <p className="text-xs font-medium text-slate-300 mt-1 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        Zone: {customer.zone?.name || "Unassigned"}
                    </p>
                </div>
            </div>
        </div>
    );
}