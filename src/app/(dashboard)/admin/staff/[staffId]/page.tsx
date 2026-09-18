"use client";

import { useParams } from "next/navigation";
import Loading from "@/app/loading";
import { useStaffDetail } from "@/features/admin/staff/api/use-staff";
import { StaffProfile } from "@/features/admin/staff/components/staff_details/StaffProfile";
import NotFoundPage from "@/app/not-found";
import { useRole } from "@/lib/hooks/use-role";

export default function StaffMemberPage() {
  const params = useParams();
  const { branchId } = useRole();
  const staffId = params.staffId as string;
  const { data: user, isLoading } = useStaffDetail(staffId);

  if (isLoading) return <Loading text="Loading Staff Profile..."/>

  if (!user) return <NotFoundPage />

  return (
    <div className=" p-6">
      <StaffProfile
        user={user}
        userId={staffId}
        branchId={branchId}
      />
    </div>
  );
}