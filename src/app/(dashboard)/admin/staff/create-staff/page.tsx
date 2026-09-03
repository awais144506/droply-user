"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import ReactSelect from "react-select";
import { toast } from "sonner";
import { 
  ArrowLeft, Loader2, Bike, Briefcase, 
  User, MapPin, Plus
} from "lucide-react";

import { useRole } from "@/hooks/use-role";
import { useZones } from "@/features/zones/api/use-zones";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Reusable React-Select styling configuration
const reactSelectClassNames = {
  control: (state: any) => 
    `flex min-h-10 w-full items-center justify-between rounded-xl bg-slate-50 border px-3 ${
      state.isFocused ? 'border-sky-500 ring-2 ring-sky-500/20' : 'border-slate-200'
    } shadow-none hover:border-sky-500 hover:bg-white transition-colors text-sm cursor-text`,
  valueContainer: () => "flex items-center gap-1 w-full m-0 p-0 flex-wrap",
  multiValue: () => "bg-sky-100 text-sky-800 rounded-md flex items-center m-0.5",
  multiValueLabel: () => "px-1.5 py-0.5 text-[11px] font-bold",
  multiValueRemove: () => "hover:bg-rose-100 hover:text-rose-600 px-1 rounded-r-md cursor-pointer",
  input: () => "text-slate-900 m-0 p-0",
  placeholder: () => "text-slate-400 font-normal",
  indicatorsContainer: () => "flex items-center gap-1",
  clearIndicator: () => "text-slate-400 hover:text-rose-500 cursor-pointer",
  dropdownIndicator: () => "text-slate-400 hover:text-slate-600 cursor-pointer",
  indicatorSeparator: () => "hidden",
  menu: () => "rounded-xl border border-slate-200 bg-white shadow-lg mt-1 text-sm overflow-hidden z-50",
  menuList: () => "max-h-48 custom-scrollbar p-1",
  option: (state: any) => 
    `cursor-pointer px-3 py-2 rounded-lg transition-colors ${
      state.isSelected ? 'bg-sky-50 text-sky-700 font-bold' : state.isFocused ? 'bg-slate-50 text-slate-900' : 'text-slate-700'
    }`,
};

export default function CreateStaffPage() {
  const router = useRouter();
  const { branchId } = useRole();
  
  // Data Fetching
  const { data: rawZones } = useZones(branchId);
  const zones = Array.isArray(rawZones) ? rawZones : [];
  const zoneOptions = zones.map(z => ({ value: z.id, label: z.name }));

  // Wizard State
  const [step, setStep] = useState<"SELECT_ROLE" | "FORM">("SELECT_ROLE");
  const [selectedRole, setSelectedRole] = useState<"MANAGER" | "RIDER">("RIDER");

  // Mock Mutation State
  const isPending = false; 

  const { register, handleSubmit, control, formState: { errors, isValid } } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      zoneIds: [] as string[],
    },
  });

  const handleRoleSelect = (role: "MANAGER" | "RIDER") => {
    setSelectedRole(role);
    setStep("FORM");
  };

  const onSubmit = (data: any) => {
    const payload = { ...data, role: selectedRole };
    if (selectedRole === "MANAGER") delete payload.zoneIds;

    console.log("Staff Payload:", payload);
    toast.success(`${selectedRole === "MANAGER" ? "Manager" : "Rider"} created successfully!`);
    router.push("/admin/staff");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      
      {/* Top Header */}
      <div className="flex items-center gap-3 border-b pb-4">
        <Link href="/admin/staff" className={buttonVariants({ variant: "outline", size: "icon-sm" })}>
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {step === "SELECT_ROLE" ? "Select Role" : `Add New ${selectedRole === "MANAGER" ? "Manager" : "Rider"}`}
          </h1>
        </div>
      </div>

      {/* STEP 1: BIG BUTTON ROLE SELECTION */}
      {step === "SELECT_ROLE" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
          <button 
            onClick={() => handleRoleSelect("RIDER")}
            className="flex flex-col items-center justify-center p-8 bg-white border-2 border-slate-100 rounded-3xl hover:border-sky-500 hover:bg-sky-50 hover:shadow-md transition-all group cursor-pointer text-left h-full"
          >
            <div className="h-20 w-20 rounded-2xl bg-sky-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
              <Bike className="h-10 w-10 text-sky-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Dispatch Rider</h3>
            <p className="text-sm text-slate-500 text-center mt-3 max-w-[250px]">
              Field staff for delivering inventory, managing customer khatas, and recovering returnable assets.
            </p>
          </button>

          <button 
            onClick={() => handleRoleSelect("MANAGER")}
            className="flex flex-col items-center justify-center p-8 bg-white border-2 border-slate-100 rounded-3xl hover:border-indigo-500 hover:bg-indigo-50 hover:shadow-md transition-all group cursor-pointer text-left h-full"
          >
            <div className="h-20 w-20 rounded-2xl bg-indigo-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
              <Briefcase className="h-10 w-10 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Branch Manager</h3>
            <p className="text-sm text-slate-500 text-center mt-3 max-w-[250px]">
              Admin access to manage operations, view financial reporting, and handle physical cash flow.
            </p>
          </button>
        </div>
      )}

      {/* STEP 2: DATA ENTRY FORM */}
      {step === "FORM" && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Identity & Contact */}
            <Card>
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <User className="h-4 w-4 text-sky-600" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ali Ahmed"
                    {...register("name")}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Email Address (Login ID) *</label>
                  <input
                    type="email"
                    required
                    placeholder="staff@domain.com"
                    {...register("email")}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Phone / WhatsApp *</label>
                  <input
                    type="text"
                    required
                    placeholder="03001234567"
                    {...register("phone")}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:bg-white"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Territory Assignment (Rider Only) */}
            {selectedRole === "RIDER" && (
              <Card>
                <CardHeader className="pb-3 border-b border-slate-100">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-emerald-600" />
                    Territory Assignment
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Assign Delivery Zones</label>
                    <p className="text-[11px] text-slate-500 mb-2">Select the routes this rider is responsible for.</p>
                    <Controller
                      name="zoneIds"
                      control={control}
                      render={({ field }) => (
                        <ReactSelect
                          isMulti
                          options={zoneOptions}
                          value={zoneOptions.filter(z => field.value?.includes(z.value))}
                          onChange={(selected) => field.onChange(selected ? selected.map(s => s.value) : [])}
                          placeholder="Search & attach zones..."
                          unstyled
                          menuPortalTarget={typeof window !== "undefined" ? document.body : null}
                          menuPosition="fixed"
                          styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                          classNames={reactSelectClassNames}
                        />
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 border-t pt-4">
            <Button type="button" variant="outline" onClick={() => setStep("SELECT_ROLE")} className="rounded-xl px-4 mr-auto">
              Change Role
            </Button>
            <Link href="/manage/staff" className={buttonVariants({ variant: "outline", size: "sm" })}>
              Cancel
            </Link>
            <Button type="submit" disabled={isPending || !isValid} className="min-w-36 bg-sky-600 hover:bg-sky-700 rounded-xl h-10 text-white shadow-sm">
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