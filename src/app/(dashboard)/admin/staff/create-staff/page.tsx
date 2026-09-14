"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRole } from "@/lib/hooks/use-role";
import { useZones } from "@/features/zones/api/use-zones";
import { useCreateStaff } from "@/features/staff/api/use-mutate-staff";
import { CreateStaffFormData } from "@/features/staff/schema/create-staff-schema";
import ChooseStaff from "@/features/staff/components/create/choose-user";
import CreateFormHeader from "@/lib/utils/create-formHeader";
import { formatStaffPayload, StaffRole } from "@/features/staff/utils/formatStaffPayload";
import { useVehicles } from "@/features/fleet/api/use-fleet";
import CreateStaffForm from "@/features/staff/components/create/CreateStaffForm";

export default function CreateStaffPage() {
  const router = useRouter();
  const { branchId } = useRole();

  // Data Fetching
  const { data: zoneData, isLoading: isZoneLoading } = useZones(branchId);
  const { data: vehiclesData, isLoading: isVehiclesLoading } = useVehicles(branchId);
  const zoneOptions = zoneData?.zoneOptions;
  const vehicleOptions = vehiclesData?.vehicleOptions;

  const { mutate: createStaff, isPending } = useCreateStaff(branchId);

  // Wizard State
  const [step, setStep] = useState<"SELECT_ROLE" | "FORM">("SELECT_ROLE");
  const [selectedRole, setSelectedRole] = useState<"MANAGER" | "RIDER">("RIDER");

  const handleRoleSelect = (role: "MANAGER" | "RIDER") => {
    setSelectedRole(role);
    setStep("FORM");
  };

  const onSubmit = (data: CreateStaffFormData) => {
    const payload = formatStaffPayload(data, branchId, selectedRole as StaffRole);
    createStaff(payload, {
      onSuccess: () => router.back(),
    });
  };

  return (
    <div className="max-w-8xl mx-auto space-y-6 p-4 sm:p-6 lg:p-8">

      <CreateFormHeader text={`Create Staff (${selectedRole})`} href="/admin/staff" />
      <ChooseStaff step={step} handleRoleSelect={handleRoleSelect} />

      {step === "FORM" && (
        <CreateStaffForm
          selectedRole={selectedRole}
          onSubmit={onSubmit}
          zoneOptions={zoneOptions}
          isZoneLoading={isZoneLoading}
          vehicleOptions={vehicleOptions}
          isVehiclesLoading={isVehiclesLoading}
          isPending={isPending}
          setStep={setStep}
        />
      )}
    </div>
  );
}