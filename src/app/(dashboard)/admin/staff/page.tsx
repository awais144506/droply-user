"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRole } from "@/hooks/use-role";
import { useStaff, useUpdateStaff, BranchUserItem } from "@/features/staff/api/use-staff";
import { useZones } from "@/features/zones/api/use-zones"; 
import { StaffStats } from "@/features/staff/components/staff-stats";
import { StaffTable } from "@/features/staff/components/staff-table";
import { StaffFormModal } from "@/features/staff/components/staff-form-modal";
import { buttonVariants } from "@/components/ui/button";

export default function StaffPage() {
  const { branchId, isLoading: isTenantLoading } = useRole();
  const { data: staff = [], isLoading } = useStaff(branchId);
  const { data: rawZones } = useZones(branchId);

  const zones = Array.isArray(rawZones) ? rawZones : [];
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<BranchUserItem | null>(null);

  const updateStaffMutation = useUpdateStaff(branchId);

  const handleEditSubmit = async (payload: any) => {
    try {
      if (editingStaff) {
        await updateStaffMutation.mutateAsync({ id: editingStaff.id, payload });
        toast.success("Staff profile updated successfully");
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
    <div className="space-y-6 max-w-[1400px] mx-auto p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Staff & Payroll</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your managers, dispatch riders, app access, and payroll ledgers.
          </p>
        </div>
        <Link 
          href="/admin/staff/create-staff" 
          className={buttonVariants({ variant: "default", className: "bg-sky-600 hover:bg-sky-700 text-white rounded-xl h-10 px-4 shadow-sm" })}
        >
          <Plus className="h-4 w-4 mr-2" /> Add Staff Member
        </Link>
      </div>

      <StaffStats staff={staff} maxUsersLimit={15} planName="Gold Plan" />
      
      <StaffTable 
        staff={staff} 
        onEdit={(user) => {
          setEditingStaff(user);
          setIsModalOpen(true);
        }} 
      />

      {/* Kept exclusively for editing existing staff inline */}
      <StaffFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleEditSubmit}
        staff={editingStaff}
        availableZones={zones}
        isLoading={updateStaffMutation.isPending}
      />
    </div>
  );
}