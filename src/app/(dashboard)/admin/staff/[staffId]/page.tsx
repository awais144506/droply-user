"use client";

import { useParams } from "next/navigation";
import Loading from "@/app/loading";
import { useStaffDetail } from "@/features/staff/api/use-staff";
import { StaffProfile } from "@/features/staff/components/staff-profile";
import NotFoundPage from "@/app/not-found";
import { useRole } from "@/hooks/use-role";

export default function StaffMemberPage() {
  const params = useParams();
  const { branchId } = useRole();
  const staffId = params.staffId as string;
  const { data: user, isLoading } = useStaffDetail(staffId);

  if (isLoading) return <Loading />

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