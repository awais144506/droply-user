"use client";

import PaymentForm from "@/features/supply/payments/components/create/PaymentForm";
import CreateFormHeader from "@/lib/utils/components/FormHeaderNavigation";

export default function CreateNewPayment() {

    return (
        <div className="w-full max-w-4xl mx-auto py-6 space-y-6">
            {/* Page Header */}
            <CreateFormHeader
                title="Create New Payement"
                href="/supply/payments"
            />

            {/* Form Container */}
            <div className="w-full">
                <PaymentForm />
            </div>
        </div>
    );
}