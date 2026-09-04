"use client";

import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useRole } from "@/hooks/use-role";
import { useStaffMember } from "@/features/staff/api/use-staff";
import { StaffProfile } from "@/features/staff/components/staff-profile";

export default function StaffMemberPage() {
  const params = useParams();
  const staffId = params.staffId as string;
  const { branchId, isLoading: isTenantLoading } = useRole();
  const { data: user, isLoading } = useStaffMember(branchId, staffId);

  if (isTenantLoading || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin mb-4 text-sky-600" />
        <p className="text-sm font-medium">Loading staff profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
        <p className="text-sm font-medium">User not found or access denied.</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto p-6">
      <StaffProfile user={user} />
    </div>
  );
}