/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useRole } from "@/lib/hooks/use-role";
import ChooseSale from "@/features/sales/orders/components/create/choose-sale";
import CreateSaleForm from "@/features/sales/orders/components/create/CreateSaleForm";
import { OrderCategory, OrderType } from "@/features/sales/orders/types/order";

const CreateNewSalePage = () => {
  const { branchId } = useRole();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const fromRequest = searchParams.get("fromRequest") === "true";

  const [step, setStep] = useState<"SELECT_SALE" | "FORM">(
    fromRequest ? "FORM" : "SELECT_SALE"
  );
  const [selectedCategory, setSelectedCategory] = useState<OrderCategory>(
    fromRequest ? "DELIVERY" : "WALK_IN"
  );
  const [selectedType, setSelectedType] = useState<OrderType>(
    fromRequest ? "DELIVERY" : "WALK_IN"
  );
  const [prefillData, setPrefillData] = useState<any>(null);
  const [isReady, setIsReady] = useState(!fromRequest);

  useEffect(() => {
    if (fromRequest) {
      try {
        const raw = sessionStorage.getItem("prefill_order_request");
        if (raw) {
          const parsed = JSON.parse(raw);
          setPrefillData(parsed);
          setSelectedCategory("DELIVERY");
          setSelectedType("DELIVERY");
          setStep("FORM");
        }
      } catch (err) {
        console.error("Failed to parse prefill_order_request:", err);
      } finally {
        setIsReady(true);
      }
    }
  }, [fromRequest]);

  const handleSaleSelect = (category: OrderCategory, type: OrderType) => {
    setPrefillData(null);
    setSelectedCategory(category);
    setSelectedType(type);
    setStep("FORM");
  };

  const handleBack = () => {
    sessionStorage.removeItem("prefill_order_request");
    setPrefillData(null);
    if (fromRequest) {
      router.replace(pathname);
    }
    setStep("SELECT_SALE");
  };

  if (!isReady) return null;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 min-h-500">
      <ChooseSale step={step} handleSaleSelect={handleSaleSelect} />
      {step === "FORM" && (
        <CreateSaleForm
          // Key ensures the form mounts fresh when prefillData loads
          key={prefillData?.id || "manual-sale"}
          branchId={branchId}
          category={selectedCategory}
          orderType={selectedType}
          initialData={prefillData}
          isEditing={false}
          onBack={handleBack}
        />
      )}
    </div>
  );
};

export default CreateNewSalePage;