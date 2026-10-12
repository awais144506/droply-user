/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import SubscriptionHeader from "@/features/admin/subscription/components/details/subscription-header";
import PlanSelection from "@/features/admin/subscription/components/details/plan-selection";
import CheckoutArea from "@/features/admin/subscription/components/details/checkout-action-area";

// --- 1. MOCK DATABASE & CURRENT USER ---
export const PRICING_DB = {
    SILVER: { monthly: 5000, yearly: 50000, users: 5 },
    GOLD: { monthly: 10000, yearly: 100000, users: 15 },
    PLATINUM: { monthly: 20000, yearly: 200000, users: "Unlimited" },
};

const CURRENT_USER = {
    tier: "GOLD",
    cycle: "MONTHLY",
    activeStaffCount: 12,
    renewDate: new Date("2026-10-15T00:00:00.000Z"),
    price: 10000,
};

export default function ChangePlanPage() {
    const [selectedCycle, setSelectedCycle] = useState<"MONTHLY" | "YEARLY">(CURRENT_USER.cycle as any);
    const [selectedTier, setSelectedTier] = useState<string>(CURRENT_USER.tier);

    // --- 2. LOGIC & CALCULATIONS ---
    const tierWeight = { SILVER: 1, GOLD: 2, PLATINUM: 3 };
    const isDowngrade = tierWeight[selectedTier as keyof typeof tierWeight] < tierWeight[CURRENT_USER.tier as keyof typeof tierWeight];
    const isSamePlan = selectedTier === CURRENT_USER.tier && selectedCycle === CURRENT_USER.cycle;
    const isCycleLocked = CURRENT_USER.cycle === "YEARLY" && selectedCycle === "MONTHLY";
    const targetLimit = PRICING_DB[selectedTier as keyof typeof PRICING_DB].users;
    const isOverLimitForDowngrade = typeof targetLimit === "number" && CURRENT_USER.activeStaffCount > targetLimit;
    const amountDue = PRICING_DB[selectedTier as keyof typeof PRICING_DB][selectedCycle.toLowerCase() as "monthly" | "yearly"];

    const today = new Date("2026-10-12");
    const daysLeft = Math.ceil((CURRENT_USER.renewDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    // --- 3. DYNAMIC BUTTON STATE ---
    let buttonText = "Submit Payment & Upgrade";
    let buttonClass = "bg-emerald-600 hover:bg-emerald-700 text-white";
    let isButtonDisabled = false;
    let requirePayment = true;

    if (isSamePlan) {
        buttonText = "Current Plan Active";
        buttonClass = "bg-slate-200 text-slate-500";
        isButtonDisabled = true;
        requirePayment = false;
    } else if (isCycleLocked) {
        buttonText = "Locked in Yearly Contract";
        buttonClass = "bg-slate-200 text-slate-500";
        isButtonDisabled = true;
        requirePayment = false;
    } else if (isDowngrade) {
        requirePayment = false;
        if (isOverLimitForDowngrade) {
            buttonText = "Reduce Staff to Downgrade";
            buttonClass = "bg-amber-200 text-amber-700";
            isButtonDisabled = true;
        } else {
            buttonText = "Schedule Downgrade (No Payment)";
            buttonClass = "bg-amber-500 hover:bg-amber-600 text-white";
        }
    }

    return (
        <div className="min-w-7xl mx-auto p-4 sm:p-6 space-y-6">
            <SubscriptionHeader
                currentUser={CURRENT_USER}
                daysLeft={daysLeft}
            />

            <PlanSelection
                pricingDb={PRICING_DB}
                currentUser={CURRENT_USER}
                selectedCycle={selectedCycle}
                selectedTier={selectedTier}
                onCycleChange={setSelectedCycle}
                onTierChange={setSelectedTier}
                isCycleLocked={isCycleLocked}
                isDowngrade={isDowngrade}
                isOverLimit={isOverLimitForDowngrade}
                targetLimit={targetLimit}
            />
            <CheckoutArea
                amountDue={amountDue}
                requirePayment={requirePayment}
                buttonText={buttonText}
                buttonClass={buttonClass}
                isButtonDisabled={isButtonDisabled}
            />
        </div>
    );
}