/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { FormProvider } from "react-hook-form";
import { AlertTriangle, UserPlus } from "lucide-react";
import { FormSelect } from "@/components/ui/form-select";
import CreateStaffIdentityCard from "./identity-card";
import RiderZoneCard from "./rider-zone";
import StaffExtraDetails from "./staff-extra-details";
import { useAppForm } from "@/lib/hooks/use-app-form";
import { createStaffSchema, CreateStaffFormData } from "../../schema/create-staff-schema";
import { defaultCreateStaffValues } from "../../utils/staff-defaults";
import Loading from "@/app/loading";
import { toast } from "sonner";
import FormCTAFooter from "@/lib/utils/components/FormCTAFooter";

interface OptionItem {
    label: string;
    value: string;
}

interface CreateStaffFormProps {
    selectedRole?: "RIDER" | "MANAGER" | "STAFF";
    initialValues?: CreateStaffFormData;
    onSubmit: (payload: any) => void;
    isPending: boolean;
    zoneOptions?: OptionItem[];
    isZoneLoading?: boolean;
    vehicleOptions?: OptionItem[];
    isVehiclesLoading?: boolean;
    setStep?: (step: "SELECT_ROLE" | "FORM") => void;
    isLimitReached?: boolean;
}

export function CreateStaffForm({
    initialValues,
    onSubmit,
    isPending,
    selectedRole = "RIDER",
    zoneOptions = [],
    isZoneLoading = false,
    vehicleOptions = [],
    isVehiclesLoading = false,
    isLimitReached,
}: CreateStaffFormProps) {
    const isEditMode = Boolean(initialValues);

    const formDefaults: CreateStaffFormData = initialValues || {
        ...defaultCreateStaffValues,
        role: selectedRole === "MANAGER" ? "MANAGER" : "RIDER",
    };

    const methods = useAppForm(createStaffSchema, formDefaults as CreateStaffFormData);

    const activeRole = methods.watch("role");
    const isRoleChanged = isEditMode && initialValues?.role && activeRole !== initialValues.role;

    const handleFormSubmit = (formData: CreateStaffFormData) => {
        if (!isEditMode && activeRole === "RIDER" && isLimitReached) {
            toast.error("Staff Limit Reached!", {
                description: "You have reached your active staff limit. Please upgrade your plan to add more staff.",
            });
            return;
        }

        const {
            salary,
            fatherName,
            fatherCnic,
            bloodGroup,
            licenseNumber,
            guarantorName,
            guarantorCnic,
            guarantorPhone,
            email,
            ...rest
        } = formData;

        const cleanPayload = {
            ...rest,
            ...(!isEditMode && { email }),
            basicSalary: Number(salary ?? 0),
            zoneIds: activeRole === "RIDER" ? rest.zoneIds : [],
            vehicleId: activeRole === "RIDER" ? rest.vehicleId : null,
            hrProfile: {
                fatherName: fatherName || undefined,
                fatherCnic: fatherCnic || undefined,
                bloodGroup: bloodGroup || undefined,
                licenseNumber: licenseNumber || undefined,
                guarantorName: guarantorName || undefined,
                guarantorCnic: guarantorCnic || undefined,
                guarantorPhone: guarantorPhone || undefined,
            },
        };

        onSubmit(cleanPayload);
    };

    if (isZoneLoading || isVehiclesLoading) return <Loading text="Loading Options..." />;

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleFormSubmit)} className="space-y-6">
                {isRoleChanged && (
                    <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl flex items-start gap-3 text-sm shadow-sm max-w-4xl">
                        <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                            <p className="font-bold text-amber-900">Role Change Detected</p>
                            <p className="mt-1">
                                Changing role from <b className="uppercase">{initialValues?.role}</b> to{" "}
                                <b className="uppercase">{activeRole}</b> will modify assignments automatically.
                            </p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                    <div className="space-y-6">
                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                            <FormSelect
                                name="role"
                                label="Designation / Role"
                                required={true}
                                options={[
                                    { label: "Rider", value: "RIDER" },
                                    { label: "Manager", value: "MANAGER" },
                                ]}
                            />
                        </div>
                        <CreateStaffIdentityCard isEditMode={isEditMode} />
                    </div>

                    {activeRole === "RIDER" && (
                        <div className="w-full">
                            <RiderZoneCard
                                key={`${initialValues?.vehicleId || "new"}-${zoneOptions.length}-${vehicleOptions.length}`}
                                selectedRole={activeRole}
                                zoneOptions={zoneOptions}
                                vehicleOptions={vehicleOptions}
                            />
                        </div>
                    )}

                    <div className="w-full">
                        <StaffExtraDetails />
                    </div>
                </div>

                <FormCTAFooter
                    ctaText={isEditMode ? "Update Staff" : "Create Staff"}
                    icon={UserPlus}
                    isPending={isPending}
                    isEditMode={isEditMode}
                    isDirty={methods.formState.isDirty}
                    isValid={methods.formState.isValid}
                />
            </form>
        </FormProvider>
    );
}