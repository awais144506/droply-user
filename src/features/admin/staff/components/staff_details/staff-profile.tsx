/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Edit2, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ProfileHeader from "./profile-header";
import PersonalInfoCard from "./personal-info-card";
import AssignmentCard from "./assignment-card";
import AttendanceManager from "./attendance-manager";
import AttendanceLedger from "./attendance-ledger";
import PageDetailHeader from "@/lib/utils/components/PageDetailHeader";
import ConfirmDeleteDialog from "@/lib/utils/components/ConfirmDeleteItemDialog";
import { useStaffDisable } from "../../api/use-mutate-staff";

export function StaffProfile({ user, userId, branchId }: { user: any, userId: string, branchId: string }) {
  const router = useRouter();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const { mutate: disableUser, isPending } = useStaffDisable(userId, branchId, () => setIsDeleteDialogOpen(false));

  const [localUser, setLocalUser] = useState<any>({
    ...user,
    isActive: user.status === "ACTIVE",
    role: user.designation
  });

  useEffect(() => {
    setLocalUser({
      ...user,
      isActive: user.status === "ACTIVE",
      role: user.designation
    });
  }, [user]);


  const markAttendance = (status: any) => {
    const time = status === "PRESENT" || status === "HALF_DAY"
      ? new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      : null;
    setLocalUser((prev: any) => ({ ...prev, todayAttendance: status, checkInTime: time }));
    toast.success(`${user.name}'s attendance marked as ${status.replace("_", " ")}.`);
  };

  const handleDelete = () => {
    disableUser(userId);
  };

  return (
    <div className="space-y-6">
      <PageDetailHeader
        href="/admin/staff"
        heading="Staff Profile"
        description="View and manage employee details, assignments, and attendance."
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/manage/staff/${user.id}/edit`)}
          className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm"
        >
          <Edit2 className="h-4 w-4 mr-1.5" /> Edit Profile
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setIsDeleteDialogOpen(true)}
          className="shadow-sm"
        >
          <Ban className="h-4 w-4 mr-1.5" /> Disable
        </Button>
      </PageDetailHeader>

      {/* 1. Top Header */}
      <ProfileHeader user={localUser} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column: Details & Danger Zone */}
        <div className="lg:col-span-1 space-y-6">
          <PersonalInfoCard user={localUser} />
          {localUser.role === "RIDER" && <AssignmentCard user={localUser} />}
        </div>

        {/* Right Column: Attendance & Operations */}
        <div className="lg:col-span-2 space-y-6">
          <AttendanceManager
            user={localUser}
            markAttendance={markAttendance}
          />
          <AttendanceLedger user={localUser} />
        </div>

      </div>
      <ConfirmDeleteDialog
        itemName={localUser.name}
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        isDeleting={isPending}
        btnText="Disable"
      />
    </div>
  );
}