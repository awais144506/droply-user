/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, QrCode } from "lucide-react";
import { portalStorage } from "@/lib/token-storage";

export default function OrderRootRedirectPage() {
    const router = useRouter();
    const [missingToken, setMissingToken] = useState(false);

    useEffect(() => {
        const activeToken = portalStorage.getActiveToken();
        if (activeToken) {
            router.replace(`/order/${activeToken}`);
        } else {
            setMissingToken(true);
        }
    }, [router]);

    if (missingToken) {
        return (
            <div className="flex flex-col min-h-screen items-center justify-center bg-slate-50 p-6 text-center">
                <div className="h-12 w-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center mb-4">
                    <QrCode className="h-6 w-6" />
                </div>
                <h1 className="text-lg font-bold text-slate-900">No Active Order Link Found</h1>
                <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
                    Please open your unique ordering link sent via WhatsApp or SMS once to link your account to this app.
                </p>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
            <Loader2 className="animate-spin text-sky-600 h-8 w-8" />
        </div>
    );
}