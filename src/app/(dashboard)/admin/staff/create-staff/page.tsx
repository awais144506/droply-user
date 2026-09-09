"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";

import { useRole } from "@/hooks/use-role";
import { useZones } from "@/features/zones/api/use-zones";
import { useCreateStaff } from "@/features/staff/api/use-staff";
import { createStaffSchema, CreateStaffFormData } from "@/features/staff/schema/create-staff-schema";

import { Button, buttonVariants } from "@/components/ui/button";
import ChooseStaff from "@/features/staff/components/create/choose-user";
import CreateFormHeader from "@/utils/create-formHeader";
import CreateStaffIdentityCard from "@/features/staff/components/create/IdentityCard";
import RiderZoneCard from "@/features/staff/components/create/RiderZoneCard";
import StaffExtraDetails from "@/features/staff/components/create/StaffExtraDetails";

export default function CreateStaffPage() {
  const router = useRouter();
  const { branchId } = useRole();

  // Data Fetching
  const { data: rawZones } = useZones(branchId);
  const zones = Array.isArray(rawZones?.zones) ? rawZones.zones : [];
  const zoneOptions = zones.map((z: any) => ({ value: z.id, label: z.name }));

  // You will likely have a useVehicles() hook here later
  const vehicleOptions: { value: string, label: string }[] = [];

  const { mutate: createStaff, isPending } = useCreateStaff();

  // Wizard State
  const [step, setStep] = useState<"SELECT_ROLE" | "FORM">("SELECT_ROLE");
  const [selectedRole, setSelectedRole] = useState<"MANAGER" | "RIDER">("");

  const { register, handleSubmit, control, formState: { errors, isValid } } = useForm<CreateStaffFormData>({
    resolver: yupResolver(createStaffSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      cnic: "",
      address: "",
      salary: 0,
      zoneIds: [],
      vehicleIds: [],
    },
  });

  const handleRoleSelect = (role: "MANAGER" | "RIDER") => {
    setSelectedRole(role);
    setStep("FORM");
  };

  const onSubmit = (data: CreateStaffFormData) => {
    if (!branchId) return toast.error("Branch ID is missing.");

    // Format payload to strictly match Prisma
    const payload = {
      branchId,
      designation: selectedRole, // Prisma uses 'designation' for StaffRole
      name: data.name,
      email: data.email || undefined,
      phone: data.phone,
      cnic: data.cnic,
      currentAddress: data.address || undefined,
      basicSalary: data.salary,
      joiningDate: data.joiningDate ? new Date(data.joiningDate).toISOString() : undefined,

      // Extra Details
      fatherName: data.fatherName || undefined,
      fatherCnic: data.fatherCnic || undefined,
      bloodGroup: data.bloodGroup || undefined,
      guarantorName: data.guarantorName || undefined,
      guarantorCnic: data.guarantorCnic || undefined,
      guarantorPhone: data.guarantorPhone || undefined,

      // Role specific fields
      zoneIds: selectedRole === "RIDER" ? data.zoneIds : undefined,
      vehicleIds: selectedRole === "RIDER" ? data.vehicleIds : undefined,
      licenseNumber: selectedRole === "RIDER" ? data.licenseNumber || undefined : undefined,
    };

    createStaff(payload, {
      onSuccess: () => {
        toast.success(`${selectedRole === "MANAGER" ? "Manager" : "Rider"} created successfully!`);
        router.push("/admin/staff");
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message || "Email already taken.");
      }
    });
  };

  return (
    <div className="max-w-8xl mx-auto space-y-6 p-4 sm:p-6 lg:p-8">

      <CreateFormHeader text={`Create Staff (${selectedRole})`} href="/admin/staff" />
      <ChooseStaff step={step} handleRoleSelect={handleRoleSelect} />

      {step === "FORM" && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="col-span-1 space-y-6">
            <div className="grid grid-cols-3 gap-6">
              <CreateStaffIdentityCard register={register} errors={errors} />
              {selectedRole === 'RIDER' && (
                <RiderZoneCard
                  selectedRole={selectedRole}
                  control={control}
                  zoneOptions={zoneOptions}
                  vehicleOptions={vehicleOptions}
                  register={register}
                  errors={errors}
                />
              )}
              <StaffExtraDetails register={register} errors={errors} />
            </div>

          </div>

          <div className="flex items-center justify-end gap-3 border-t pt-4">
            <Button type="button" variant="outline" onClick={() => setStep("SELECT_ROLE")} className="mr-auto">
              Change Role
            </Button>
            <Link href="/admin/staff" className={buttonVariants({ variant: "outline" })}>
              Cancel
            </Link>
            <Button type="submit" disabled={isPending || !isValid} className="min-w-36 bg-emerald-600 hover:bg-emerald-700 text-white">
              {isPending ? (
                <><Loader2 className="h-4 w-4 animate-spin mr-1.5" /> Creating...</>
              ) : (
                <><Plus className="h-4 w-4 mr-1.5" /> Create Account</>
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}