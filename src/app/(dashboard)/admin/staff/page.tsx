"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRole } from "@/hooks/use-role";
import { useStaff, useCreateStaff, useUpdateStaff, BranchUserItem } from "@/features/staff/api/use-staff";
import { useZones } from "@/features/zones/api/use-zones"; // Import zones hook
import { StaffStats } from "@/features/staff/components/staff-stats";
import { StaffTable } from "@/features/staff/components/staff-table";
import { StaffFormModal } from "@/features/staff/components/staff-form-modal";
import { Button } from "@/components/ui/button";

export default function StaffPage() {
  const { branchId, isLoading: isTenantLoading } = useRole();
  const { data: staff = [], isLoading } = useStaff(branchId);
  const { data: rawZones } = useZones(branchId);

  const zones = Array.isArray(rawZones) ? rawZones : [];
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<BranchUserItem | null>(null);

  const createStaffMutation = useCreateStaff(branchId);
  const updateStaffMutation = useUpdateStaff(branchId);

  const handleFormSubmit = async (payload: any) => {
    try {
      if (editingStaff) {
        await updateStaffMutation.mutateAsync({ id: editingStaff.id, payload });
        toast.success("Staff profile updated successfully");
      } else {
        await createStaffMutation.mutateAsync(payload);
        toast.success("Staff member created & synced with Clerk");
      }
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || "Operation failed");
    }
  };

  if (isTenantLoading || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin mb-4 text-sky-600" />
        <p className="text-sm font-medium">Loading workforce data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-350 mx-auto p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Staff & Payroll</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your managers, dispatch riders, app access, and payroll ledgers.
          </p>
        </div>
        <Button 
          onClick={() => { setEditingStaff(null); setIsModalOpen(true); }} 
          className="bg-sky-600 hover:bg-sky-700 text-white h-10 px-4 rounded-xl shadow-sm"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Staff Member
        </Button>
      </div>

      <StaffStats staff={staff} maxUsersLimit={15} planName="Gold Plan" />
      
      <StaffTable 
        staff={staff} 
        onEdit={(user) => {
          setEditingStaff(user);
          setIsModalOpen(true);
        }} 
      />

      <StaffFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        staff={editingStaff}
        availableZones={zones}
        isLoading={createStaffMutation.isPending || updateStaffMutation.isPending}
      />
    </div>
  );
}