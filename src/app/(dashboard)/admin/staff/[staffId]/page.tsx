"use client";

import { useParams } from "next/navigation";
import Loading from "@/app/loading";
import { useStaffDetail } from "@/features/staff/api/use-staff";
import { StaffProfile } from "@/features/staff/components/staff-profile";
import NotFoundPage from "@/app/not-found";

export default function StaffMemberPage() {
  const params = useParams();
  const staffId = params.staffId as string;
  const { data: user, isLoading } = useStaffDetail(staffId);

  if (isLoading) return <Loading />

  if (!user) return <NotFoundPage item="Staff" href="/admin/staff"/>

  return (
    <div className=" p-6">
      <StaffProfile user={user} />
    </div>
  );
}