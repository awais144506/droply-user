"use client";

import React from "react";
import SubscriptionHeader from "@/features/admin/subscription/components/details/subscription-header";
import PlanSelection from "@/features/admin/subscription/components/details/plan-selection";
import CheckoutArea from "@/features/admin/subscription/components/details/checkout-action-area";
import { useChangePlan } from "@/lib/hooks/use-change-plan";
import Loading from "@/app/loading";
import ErrorBoundary from "@/app/error";

export default function ChangePlanPage() {
    const {
        isLoading,
        isError,
        errorMessage,
        hasValidData,
        pricingDb,
        currentUser,
        daysLeft,
        selectedCycle,
        selectedTier,
        setSelectedCycle,
        setSelectedTier,
        isCycleLocked,
        isDowngrade,
        isUpgrade,
        isSamePlan,
        isPastDue,
        isOverLimit,
        targetLimit,
        amountDue,
        selectedPlanFullPrice,
        isRenewal,           
        requirePayment,
        buttonText,
        buttonClass,
        isButtonDisabled,
        isSubmittingPayment,
        handlePaymentSubmit,
    } = useChangePlan();

    if (isLoading) return <Loading text="Loading Subscription Details..." />;
    if (isError) return <ErrorBoundary error={errorMessage} />;
    if (!hasValidData) {
        return <div className="p-6 text-slate-500">No active subscription found.</div>;
    }

    return (
        <div className="p-4 sm:p-6 space-y-6">
            <SubscriptionHeader
                currentUser={currentUser}
                daysLeft={daysLeft}
            />

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <PlanSelection
                    pricingDb={pricingDb}
                    currentUser={currentUser}
                    selectedCycle={selectedCycle}
                    selectedTier={selectedTier}
                    onCycleChange={setSelectedCycle}
                    onTierChange={setSelectedTier}
                    isCycleLocked={isCycleLocked}
                    isDowngrade={isDowngrade}
                    isUpgrade={isUpgrade}
                    isSamePlan={isSamePlan}
                    isPastDue={isPastDue}
                    isOverLimit={isOverLimit}
                    targetLimit={targetLimit}
                    amountDue={amountDue}
                    selectedPlanFullPrice={selectedPlanFullPrice}
                />

                <CheckoutArea
                    amountDue={amountDue}
                    requirePayment={requirePayment}
                    isRenewal={isRenewal} // 🔥 Passed to Checkout
                    buttonText={buttonText}
                    buttonClass={buttonClass}
                    isButtonDisabled={isButtonDisabled}
                    isSubmittingPayment={isSubmittingPayment} // 🔥 Passed to Checkout
                    onSubmitPayment={handlePaymentSubmit}
                />
            </div>
        </div>
    );
}