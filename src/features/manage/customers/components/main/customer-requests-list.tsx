"use client";

import { UserPlus, Clock, Phone, MapPin, User, CheckCircle2, Loader2 } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { useMarkCustomerRequest } from "@/features/manage/customers/api/use-mutate-customer";
import { getCustomerDetailsMessage } from "@/lib/utils/functions/whatsapp/customerWhatsApp";
import { BranchSettingData } from "@/features/admin/settings/types/settings";
import { NewCustomerRequest } from "../../types/customer";
import { formatPhoneNumber } from "react-phone-number-input";

interface CustomerRequestsListProps {
    requests: NewCustomerRequest[];
    isLoading: boolean;
    branchSettings?: BranchSettingData;
}

export function CustomerRequestsList({
    requests,
    isLoading,
    branchSettings,
}: CustomerRequestsListProps) {
    const router = useRouter();
    const { mutate: statusChange, isPending: isStatusPending } = useMarkCustomerRequest();

    const allRequests = requests.filter((req) => req.status === "PENDING" || req.status === "CONTACTED");
    const pendingCount = allRequests.filter((req) => req.status === "PENDING").length;

    if (isLoading) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6 flex items-center justify-center h-48">
                <span className="text-sm font-medium text-slate-400">Loading requests...</span>
            </div>
        );
    }

    if (allRequests.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                        <UserPlus className="h-4 w-4 text-sky-600" />
                        New Customer Requests
                    </h3>
                </div>
                <div className="p-8 flex flex-col items-center justify-center text-center">
                    <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center mb-3">
                        <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                    </div>
                    <p className="text-sm font-medium text-slate-600">All caught up!</p>
                    <p className="text-xs text-slate-400 mt-1">No pending requests from riders.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                    <UserPlus className="h-4 w-4 text-sky-600" />
                    New Customer Requests
                </h3>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${
                    pendingCount === 0 
                        ? "bg-emerald-100 text-emerald-700" 
                        : "bg-rose-100 text-rose-700"
                }`}>
                    {pendingCount === 0 ? "0 Pending (All Contacted)" : `${pendingCount} Pending`}
                </span>
            </div>


            <div className="divide-y divide-slate-100 max-h-105 overflow-y-auto">
                {allRequests.map((request) => {
                    const isContacted = request.status === "CONTACTED";

                    return (
                        <div key={request.id} className="p-4 hover:bg-slate-50/50 transition-colors">
                            
                            {/* Two-Column Side-by-Side Layout */}
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                                
                                {/* Left Side: Information */}
                                <div className="md:col-span-7 space-y-1.5">
                                    <div className="flex items-center justify-between md:justify-start gap-2">
                                        <h4 className="text-sm font-bold text-slate-900">{request.name}</h4>
                                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                                            isContacted 
                                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                                                : "bg-amber-50 text-amber-700 border border-amber-200"
                                        }`}>
                                            {request.status}
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-medium flex items-center ml-auto">
                                            <Clock className="h-3 w-3 mr-1" />
                                            {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                                        </span>
                                    </div>

                                    <div className="flex items-center text-xs text-slate-600">
                                        <Phone className="h-3.5 w-3.5 text-slate-400 mr-2 shrink-0" />
                                        <span>{formatPhoneNumber(request.phone)}</span>
                                    </div>

                                    <div className="flex items-center text-xs text-slate-600">
                                        <MapPin className="h-3.5 w-3.5 text-slate-400 mr-2 shrink-0" />
                                        <span className="truncate">{request.address}</span>
                                    </div>

                                    <div className="flex items-center text-xs text-slate-500 pt-0.5">
                                        <User className="h-3.5 w-3.5 text-sky-400 mr-2 shrink-0" />
                                        <span>Requested by Rider: <span className="font-semibold">{request.requestedBy}</span></span>
                                    </div>
                                </div>

                                {/* Right Side: Actions (WhatsApp, Mark Contacted, Create Account) */}
                                <div className="md:col-span-5 flex flex-col sm:flex-row md:flex-col gap-2 justify-center">
                                    <div className="flex gap-2">
                                        {/* WhatsApp Icon Button */}
                                        <button
                                            type="button"
                                            onClick={() => getCustomerDetailsMessage(request, branchSettings)}
                                            title="Send Location Request via WhatsApp"
                                            className="flex items-center justify-center px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 text-xs font-bold py-2 rounded-xl border border-emerald-200 transition-colors cursor-pointer shrink-0"
                                        >
                                            <FaWhatsapp className="h-4 w-4" />
                                        </button>

                                        {/* Mark Contacted / Status Button */}
                                        <button
                                            type="button"
                                            disabled={isStatusPending}
                                            onClick={() => statusChange(request.id)}
                                            className={`flex-1 text-xs font-bold py-2 px-3 rounded-xl border transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5 ${
                                                isContacted
                                                    ? "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200"
                                                    : "bg-sky-50 hover:bg-sky-100 text-sky-700 border-sky-200"
                                            }`}
                                        >
                                            {isStatusPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                                            {isContacted ? "Contacted ✓" : "Mark Contacted"}
                                        </button>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => router.push(`/manage/customers/create-customer`)}
                                        className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2 px-3 rounded-xl transition-colors cursor-pointer text-center shadow-xs"
                                    >
                                        Create Account
                                    </button>
                                </div>

                            </div>

                        </div>
                    );
                })}
            </div>
        </div>
    );
}