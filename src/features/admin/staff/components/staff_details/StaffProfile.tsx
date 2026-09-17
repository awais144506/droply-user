/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Edit2, Ban, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import ProfileHeader from "./profile-header";
import PersonalInfoCard from "./personal-info-card";
import AssignmentCard from "./assignment-card";
import PageDetailHeader from "@/lib/utils/components/PageDetailHeader";
import ConfirmDeleteDialog from "@/lib/utils/components/ConfirmDeleteItemDialog";
import { useStaffDisable } from "../../api/use-mutate-staff";
// import { useStaffEnable } from "../../api/use-mutate-staff";

export function StaffProfile({ user, userId, branchId }: { user: any, userId: string, branchId: string }) {
  const router = useRouter();
  
  const [isDisableOpen, setIsDisableOpen] = useState(false);
  const [isEnableOpen, setIsEnableOpen] = useState(false);

  const { mutate: disableUser, isPending: isDisabling } = useStaffDisable(userId, branchId, () => setIsDisableOpen(false));
  const isEnabling = false; // Replace with your useStaffEnable hook

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

  const handleDisableConfirm = () => {
    disableUser(userId);
  };

  const handleEnableConfirm = () => {
    // enableUser(userId);
  };

  const isDisabled = user.status === "DISABLE";

  return (
    <div className="space-y-6">
      <PageDetailHeader
        href="/admin/staff"
        heading="Staff Profile"
        description="View and manage employee details and assignments."
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/admin/staff/${user.id}/edit`)}
          className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm"
        >
          <Edit2 className="h-4 w-4 mr-1.5" /> Edit Profile
        </Button>

        <Button
          variant={isDisabled ? "default" : "destructive"}
          size="sm"
          onClick={() => {
            if (isDisabled) {
              setIsEnableOpen(true);
            } else {
              setIsDisableOpen(true);
            }
          }}
          className="shadow-sm"
        >
          {isDisabled ? (
            <>
              <CheckCircle2 className="h-4 w-4 mr-1.5" /> Enable
            </>
          ) : (
            <>
              <Ban className="h-4 w-4 mr-1.5" /> Disable
            </>
          )}
        </Button>
      </PageDetailHeader>

      {/* Top Header */}
      <ProfileHeader user={localUser} />

      {/* Clean 2-Column Grid - No Attendance Shit */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <PersonalInfoCard user={localUser} />
        {localUser.role === "RIDER" && <AssignmentCard user={localUser} />}
      </div>

      <ConfirmDeleteDialog
        itemName={localUser.name}
        isOpen={isDisableOpen}
        onClose={() => setIsDisableOpen(false)}
        onConfirm={handleDisableConfirm}
        isDeleting={isDisabling}
        btnText="Disable"
      />

      <ConfirmDeleteDialog
        itemName={localUser.name}
        isOpen={isEnableOpen}
        onClose={() => setIsEnableOpen(false)}
        onConfirm={handleEnableConfirm}
        isDeleting={isEnabling}
        btnText="Enable"
      />
    </div>
  );
}