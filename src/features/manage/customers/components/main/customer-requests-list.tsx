"use client";

import { UserPlus, Clock, Phone, MapPin, User, CheckCircle2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface CustomerRequest {
    id: string;
    name: string;
    phone: string;
    address: string;
    status: string;
    requestedById: string; // Ideally, your backend should join this to get the rider's name
    createdAt: string;
}

interface CustomerRequestsListProps {
    requests: CustomerRequest[];
    isLoading: boolean;
}

export function CustomerRequestsList({ requests, isLoading }: CustomerRequestsListProps) {
    // Only show pending requests
    const pendingRequests = requests.filter(req => req.status === "PENDING");

    if (isLoading) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-6 flex items-center justify-center h-48">
                <span className="text-sm font-medium text-slate-400">Loading requests...</span>
            </div>
        );
    }

    if (pendingRequests.length === 0) {
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
                <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                    {pendingRequests.length} Pending
                </span>
            </div>

            <div className="divide-y divide-slate-100 max-h-100 overflow-y-auto">
                {pendingRequests.map((request) => (
                    <div key={request.id} className="p-4 hover:bg-slate-50/50 transition-colors">

                        <div className="flex justify-between items-start mb-2">
                            <h4 className="text-sm font-bold text-slate-900">{request.name}</h4>
                            <span className="text-[10px] text-slate-400 font-medium flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                            </span>
                        </div>

                        <div className="space-y-1.5 mb-3">
                            <div className="flex items-center text-xs text-slate-600">
                                <Phone className="h-3.5 w-3.5 text-slate-400 mr-2" />
                                {request.phone}
                            </div>
                            <div className="flex items-center text-xs text-slate-600">
                                <MapPin className="h-3.5 w-3.5 text-slate-400 mr-2" />
                                <span className="truncate">{request.address}</span>
                            </div>
                            <div className="flex items-center text-xs text-slate-500 mt-1">
                                <User className="h-3.5 w-3.5 text-sky-400 mr-2" />
                                Requested by: <span className="font-semibold ml-1">Rider ID: {request.requestedById.slice(-5)}</span>
                            </div>
                        </div>

                        <div className="flex gap-2 mt-2">
                            <button
                                onClick={() => console.log('Mark as Contacted:', request.id)}
                                className="flex-1 bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold py-2 rounded-lg border border-sky-200 transition-colors"
                            >
                                Mark Contacted
                            </button>
                            <button
                                onClick={() => console.log('Add to DB:', request)}
                                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2 rounded-lg transition-colors"
                            >
                                Create Account
                            </button>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
}