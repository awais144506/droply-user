"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRole } from "@/lib/hooks/use-role";
import { useZones } from "@/features/manage/zones/api/use-zones";
import { useCreateStaff } from "@/features/admin/staff/api/use-mutate-staff";
import { CreateStaffFormData } from "@/features/admin/staff/schema/create-staff-schema";
import ChooseStaff from "@/features/admin/staff/components/create/choose-user";
import CreateFormHeader from "@/lib/utils/components/FormHeaderNavigation";
import { useVehicles } from "@/features/admin/fleet/api/use-fleet";
import { CreateStaffForm } from "@/features/admin/staff/components/create/StaffForm";
import { useStaffList } from "@/features/admin/staff/api/use-staff";

export default function CreateStaffPage() {
  const router = useRouter();
  const { branchId } = useRole();

  // Data Fetching
  const { data: zoneData, isLoading: isZoneLoading } = useZones(branchId);
  const { data: vehiclesData, isLoading: isVehiclesLoading } = useVehicles(branchId);
  const { data: activeStaff } = useStaffList(branchId);

  const zoneOptions = zoneData?.zoneOptions;
  const vehicleOptions = vehiclesData?.vehicleOptions;
  const isLimitReached = activeStaff?.isLimitReached

  const { mutate: createStaff, isPending } = useCreateStaff(branchId);

  // Wizard State
  const [step, setStep] = useState<"SELECT_ROLE" | "FORM">("SELECT_ROLE");
  const [selectedRole, setSelectedRole] = useState<"MANAGER" | "RIDER" | "STAFF">("STAFF");

  const handleRoleSelect = (role: "MANAGER" | "RIDER") => {
    setSelectedRole(role);
    setStep("FORM");
  };

  const onSubmit = (data: CreateStaffFormData) => {
    createStaff(data, {
      onSuccess: () => router.back(),
    });
  };

  return (
    <div className="max-w-8xl mx-auto space-y-6 p-4 sm:p-6 lg:p-8">

      <CreateFormHeader
        title={`Create New Staff`}
        breadcrumbs={[
          { label: "Staff", href: "/admin/staff" },
          { label: `Create Staff` }
        ]}
      />
      <ChooseStaff
        step={step}
        handleRoleSelect={handleRoleSelect}
      />

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
          isLimitReached={isLimitReached}
        />
      )}
    </div>
  );
}