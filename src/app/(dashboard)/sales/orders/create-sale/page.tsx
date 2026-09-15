"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRole } from "@/lib/hooks/use-role";
import ChooseSale from "@/features/sales/orders/components/create/choose-sale";
import CreateSaleForm from "@/features/sales/orders/components/create/CreateSaleForm";


const CreateNewSalePage = () => {
    const router = useRouter();
    const { branchId } = useRole();

    const [step, setStep] = useState<"SELECT_SALE" | "FORM">("SELECT_SALE");
    const [selectedSale, setSelectedSale] = useState<"WALK_IN" | "DELIVERY">("DELIVERY");

    const handleSaleSelect = (sale: "WALK_IN" | "DELIVERY") => {
        setSelectedSale(sale);
        setStep("FORM");
    }

    return (
        <div className="max-w-8xl mx-auto space-y-6 p-4 sm:p-6 lg:p-8">
            <ChooseSale
                step={step}
                handleSaleSelect={handleSaleSelect}
            />
            {step === "FORM" && (
                <CreateSaleForm
                    branchId={branchId}
                    saleType={selectedSale}
                    setSaleType={setSelectedSale}
                />
            )}
        </div>
    )
}

export default CreateNewSalePage