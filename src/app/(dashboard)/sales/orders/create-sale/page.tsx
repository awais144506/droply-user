"use client"
import { useState } from "react";
import { useRole } from "@/lib/hooks/use-role";
import ChooseSale from "@/features/sales/orders/components/create/choose-sale";
import CreateSaleForm from "@/features/sales/orders/components/create/CreateSaleForm";
import { OrderCategory, OrderType } from "@/features/sales/orders/types/order";

const CreateNewSalePage = () => {
    const { branchId } = useRole();

    const [step, setStep] = useState<"SELECT_SALE" | "FORM">("SELECT_SALE");
    const [selectedCategory, setSelectedCategory] = useState<OrderCategory>("DELIVERY");
    const [selectedType, setSelectedType] = useState<OrderType>("DELIVERY");

    const handleSaleSelect = (category: OrderCategory, type: OrderType) => {
        setSelectedCategory(category);
        setSelectedType(type);
        setStep("FORM");
    }

    return (
        <div className="space-y-6 p-4 sm:p-6 lg:p-8">
            <ChooseSale
                step={step}
                handleSaleSelect={handleSaleSelect}
            />
            {step === "FORM" && (
                <CreateSaleForm
                    branchId={branchId}
                    category={selectedCategory}
                    orderType={selectedType}
                    onBack={() => setStep("SELECT_SALE")}
                />
            )}
        </div>
    )
}

export default CreateNewSalePage;