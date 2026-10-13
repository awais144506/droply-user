/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useRole } from "@/lib/hooks/use-role";
import { useSubscription } from "@/features/admin/subscription/api/use-subscription";
import { useStaffList } from "@/features/admin/staff/api/use-staff";
import { useSubmitPayment } from "@/features/admin/subscription/api/use-mutate-subscription";
import { CheckoutSubmitPayload } from "@/features/admin/subscription/schema/payment.schema";

const TIER_WEIGHT: Record<string, number> = {
    SILVER: 1,
    GOLD: 2,
    PLATINUM: 3,
};

const RENEWAL_WINDOW_DAYS = 7;

export function useChangePlan() {
    const { branchId } = useRole();
    const submitPaymentMutation = useSubmitPayment(branchId);

    // 1. Fetch live data
    const { data: subData, isLoading: subLoading, isError: subError, error } = useSubscription(branchId);
    const { data: staffData, isLoading: staffLoading } = useStaffList(branchId);

    const currentPlan = subData?.currentPlan;
    const plans = subData?.plans || [];

    // 2. Local selection state
    const [userCycle, setSelectedCycle] = useState<"MONTHLY" | "YEARLY" | null>(null);
    const [userTier, setSelectedTier] = useState<string | null>(null);

    const defaultCycle = currentPlan?.cycle === "YEARLY" ? "YEARLY" : "MONTHLY";
    const selectedCycle = userCycle ?? defaultCycle;
    const selectedTier = userTier ?? currentPlan?.tier ?? "GOLD";

    // 3. Transform DB plans into UI dictionary
    const pricingDb = plans.reduce((acc: Record<string, any>, plan: any) => {
        acc[plan.tier] = {
            monthly: plan.monthlyPrice,
            yearly: Math.round(plan.monthlyPrice * 12 * (1 - plan.yearlyDiscountPercent / 100)),
            users: plan.staffLimit >= 9999 ? "Unlimited" : plan.staffLimit,
        };
        return acc;
    }, {});

    // 4. Staff & Date Calculations
    const activeStaffCount = Array.isArray(staffData)
        ? staffData.length
        : staffData?.staff?.length || staffData?.stats?.active || 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const renewDate = currentPlan?.renewDate ? new Date(currentPlan.renewDate) : new Date();
    renewDate.setHours(0, 0, 0, 0);

    // Calculate days left
    const daysLeft = Math.ceil((renewDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    // isPastDue triggers exactly at 0 days (Due Today) to unlock the renew button
    const isPastDue = daysLeft <= 0; 
    
    // Status strictly mirrors the Backend Cron Job
    let calculatedStatus = "ACTIVE";
    if (daysLeft < 0 && daysLeft >= -2) calculatedStatus = "PAST_DUE";
    if (daysLeft < -2) calculatedStatus = "SUSPENDED";

    const isTrial = currentPlan?.cycle === "TRIAL";
    const currentCycleKey = currentPlan?.cycle === "YEARLY" ? "yearly" : "monthly";
    const currentPlanPrice = isTrial || !currentPlan ? 0 : pricingDb[currentPlan.tier]?.[currentCycleKey] || 0;

    const currentUser = {
        tier: currentPlan?.tier || "GOLD",
        cycle: currentPlan?.cycle || "TRIAL",
        activeStaffCount,
        renewDate,
        price: currentPlanPrice,
        status: calculatedStatus,
    };

    // 5. Plan Comparison Flags
    const currentWeight = TIER_WEIGHT[currentUser.tier] || 0;
    const selectedWeight = TIER_WEIGHT[selectedTier] || 0;

    const isSamePlan = !isTrial && selectedTier === currentUser.tier && selectedCycle === currentUser.cycle;
    const isDowngrade = !isTrial && selectedWeight < currentWeight;
    const isCycleLocked = !isPastDue && currentUser.cycle === "YEARLY" && selectedCycle === "MONTHLY";
    const isUpgrade =
        isTrial ||
        selectedWeight > currentWeight ||
        (selectedWeight === currentWeight && currentUser.cycle === "MONTHLY" && selectedCycle === "YEARLY");

    const targetLimit = pricingDb[selectedTier]?.users;
    const isOverLimit = typeof targetLimit === "number" && activeStaffCount > targetLimit;

    // 6. Amount Due & Renewal Window Calculation
    const selectedPlanFullPrice = pricingDb[selectedTier]?.[selectedCycle.toLowerCase() as "monthly" | "yearly"] || 0;
    const inRenewalWindow = daysLeft <= RENEWAL_WINDOW_DAYS;

    let amountDue = 0;
    let isRenewal = false;

    if (isSamePlan) {
        amountDue = selectedPlanFullPrice;
        isRenewal = true;
    } else if (isDowngrade) {
        amountDue = 0;
        isRenewal = false; // Downgrades take effect next cycle, no charge today
    } else if (isUpgrade) {
        if (inRenewalWindow || isPastDue) {
            // Upgrade inside the renewal window or past due: charge full price and extend date
            amountDue = selectedPlanFullPrice;
            isRenewal = true;
        } else {
            // Mid-cycle upgrade: charge only the difference, keep the same date
            amountDue = Math.max(0, selectedPlanFullPrice - currentPlanPrice);
            isRenewal = false;
        }
    }

    // 7. Switch Statement for Button & Checkout State
    let buttonText = "Submit Payment";
    let buttonClass = "bg-emerald-600 hover:bg-emerald-700 text-white";
    let isButtonDisabled = false;
    let requirePayment = false;

    switch (true) {
        case isCycleLocked:
            buttonText = "Locked in Yearly Contract";
            buttonClass = "bg-slate-200 text-slate-500";
            isButtonDisabled = true;
            requirePayment = false;
            break;

        case isOverLimit:
            buttonText = `Reduce Staff to Select ${selectedTier}`;
            buttonClass = "bg-amber-200 text-amber-800";
            isButtonDisabled = true;
            requirePayment = false;
            break;

        // THE ANTI-DUPLICATE PAYMENT LOCK: Prevents paying for the exact same plan early
        case !isPastDue && isSamePlan:
            buttonText = "Current Plan Active (Already Paid)";
            buttonClass = "bg-slate-200 text-slate-500";
            isButtonDisabled = true;
            requirePayment = false;
            break;

        // Unlocks exactly when due today or past due
        case isPastDue && isSamePlan:
            buttonText = `Pay Rs. ${amountDue.toLocaleString()} to Renew ${selectedTier}`;
            buttonClass = "bg-indigo-600 hover:bg-indigo-700 text-white";
            isButtonDisabled = false;
            requirePayment = true;
            break;

        case !isPastDue && isDowngrade:
            buttonText = "Downgrade Available After Cycle Ends";
            buttonClass = "bg-amber-100 text-amber-700";
            isButtonDisabled = true;
            requirePayment = false;
            break;

        // 7-Day Window explicitly applies to UPGRADES only
        case !isPastDue && isUpgrade:
            buttonText = inRenewalWindow 
                ? `Pay Rs. ${amountDue.toLocaleString()} to Upgrade & Renew` 
                : `Pay Rs. ${amountDue.toLocaleString()} & Upgrade Now`;
            buttonClass = "bg-emerald-600 hover:bg-emerald-700 text-white";
            isButtonDisabled = false;
            requirePayment = true;
            break;

        case isPastDue && isDowngrade:
            buttonText = `Pay Rs. ${amountDue.toLocaleString()} & Downgrade to ${selectedTier}`;
            buttonClass = "bg-amber-600 hover:bg-amber-700 text-white";
            isButtonDisabled = false;
            requirePayment = true;
            break;

        case isPastDue && isUpgrade:
        default:
            buttonText = `Pay Rs. ${amountDue.toLocaleString()} & Upgrade to ${selectedTier}`;
            buttonClass = "bg-emerald-600 hover:bg-emerald-700 text-white";
            isButtonDisabled = false;
            requirePayment = true;
            break;
    }

    const handlePaymentSubmit = async (formData: CheckoutSubmitPayload) => {
        if (!branchId) return;

        const payload = {
            tier: selectedTier,
            cycle: selectedCycle,
            amountPaid: formData.amountPaid,
            type: formData.type,
            transactionId: formData.transactionId,
            imageUrl: formData.imageUrl,
            isRenewal: isRenewal, // Passed to backend to control date extension
        };

        await submitPaymentMutation.mutateAsync(payload);
    };

    return {
        // Loading & Error States
        isLoading: subLoading || staffLoading,
        isError: subError,
        errorMessage: error?.message || "Failed to load subscription details",
        hasValidData: Boolean(currentPlan && plans.length > 0),

        // Data & State
        pricingDb,
        currentUser,
        daysLeft,
        selectedCycle,
        selectedTier,
        setSelectedCycle,
        setSelectedTier,

        // Flags & Calculations
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

        // Checkout Controls
        requirePayment,
        buttonText,
        buttonClass,
        isButtonDisabled,
        handlePaymentSubmit,
        isSubmittingPayment: submitPaymentMutation.isPending,
    };
}