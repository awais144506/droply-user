"use client";
import { useState } from "react";
import { Edit2, Ban, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import ProfileHeader from "./profile-header";
import PersonalInfoCard from "./personal-info-card";
import AssignmentCard from "./assignment-card";
import PageDetailHeader from "@/lib/utils/components/PageDetailHeader";
import ConfirmActionDialog from "@/lib/utils/components/ConfirmDialog";
import { useStaffDisable, useStaffEnable } from "../../api/use-mutate-staff";
import { useStaffList } from "../../api/use-staff";
import { toast } from "sonner";
import { Staff } from "../../types/staff";

export function StaffProfile({ user, userId, branchId }: { user: Staff, userId: string, branchId: string }) {
  const router = useRouter();

  const [isDisableOpen, setIsDisableOpen] = useState(false);
  const [isEnableOpen, setIsEnableOpen] = useState(false);

  const { mutate: disableUser, isPending: isDisabling } = useStaffDisable(userId, branchId, () => setIsDisableOpen(false));
  const { mutate: enableUser, isPending: isEnabling } = useStaffEnable(userId, branchId, () => setIsEnableOpen(false));
  const { data } = useStaffList(branchId);

  const isLimitReached = data?.isLimitReached;

  const handleDisableConfirm = () => {
    disableUser(userId);
  };

  const handleEnableConfirm = () => {
    if (isLimitReached) {
      toast.error("Staff Limit Reached!", {
        description: "You have used all available slots in your current plan. Please upgrade to add more staff."
      });
      setIsEnableOpen(false);
      return;
    }
    enableUser(userId);
  };

  const isDisabled = user.status === "SUSPENDED";

  return (
    <div className="space-y-6">
      <PageDetailHeader
        heading="Staff Profile"
        description="View and manage employee details and assignments."
        breadcrumbs={[
          { label: "Staff", href: "/admin/staff" },
          { label: `${user.name} Details` }
        ]}
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/admin/staff/${userId}/edit`)}
          className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm"
        >
          <Edit2 className="h-4 w-4 mr-1.5" /> Edit Profile
        </Button>

        <Button
          variant={isDisabled ? "success" : "destructive"}
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
              <Ban className="h-4 w-4 mr-1.5" /> Suspend
            </>
          )}
        </Button>
      </PageDetailHeader>

      {/* Top Header */}
      <ProfileHeader user={user} branchId={branchId} />

      {/* Clean 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <PersonalInfoCard user={user} />
        {user.role === "RIDER" && <AssignmentCard user={user} />}
      </div>

      {/* Suspend / Disable Dialog */}
      <ConfirmActionDialog
        title={`Suspend ${user.name}?`}
        isOpen={isDisableOpen}
        description={
          <span>
            Are you sure you want to suspend <strong className="text-slate-900">{user.name}</strong>? They will lose access to the branch portal immediately.
          </span>
        }
        onClose={() => setIsDisableOpen(false)}
        onConfirm={handleDisableConfirm}
        isLoading={isDisabling}
        confirmText="Suspend Staff"
        confirmButtonClass="bg-rose-600 hover:bg-rose-700 text-white hover:text-white"
        confirmButtonVariant="destructive"
      />

      {/* Enable Dialog */}
      <ConfirmActionDialog
        title={`Enable ${user.name}?`}
        isOpen={isEnableOpen}
        description={
          <span>
            Are you ready to re-activate <strong className="text-slate-900">{user.name}</strong>? Their login access will be restored immediately.
          </span>
        }
        onClose={() => setIsEnableOpen(false)}
        onConfirm={handleEnableConfirm}
        isLoading={isEnabling}
        confirmText="Enable Staff"
        confirmButtonClass="bg-emerald-600 hover:bg-emerald-700 text-white"
        confirmButtonVariant="default"
      />
    </div>
  );
}