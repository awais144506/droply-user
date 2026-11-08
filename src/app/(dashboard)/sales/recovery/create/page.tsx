
"use client";

import { useState } from "react";
import { useRole } from "@/lib/hooks/use-role";
import ChooseType from "@/features/sales/recovery/components/create_recovery/choose-type";
import RecoveryForm from "@/features/sales/recovery/components/create_recovery/RecoveryForm";
import SaleReturnForm from "@/features/sales/recovery/components/create_salereturn/SaleReturnForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const CreateNewRecovery = () => {
    const { branchId } = useRole();

    const [step, setStep] = useState<"SELECT_SALE" | "FORM">("SELECT_SALE");
    const [selectedType, setSelectedType] = useState<"RETURN" | "RECOVERY">("RETURN");

    const handleTypeSelect = (type: "RETURN" | "RECOVERY") => {
        setSelectedType(type);
        setStep("FORM");
    };

    return (
        <div className="space-y-6">

            {step === "SELECT_SALE" ? (
                <ChooseType step={step} handleTypeSelect={handleTypeSelect} />
            ) : selectedType === "RETURN" ? (
                <SaleReturnForm branchId={branchId} />
            ) : (
                <RecoveryForm branchId={branchId} />
            )}
        </div>
    );
};

export default CreateNewRecovery;