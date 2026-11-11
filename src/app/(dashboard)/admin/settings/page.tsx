"use client";
import { useRole } from "@/lib/hooks/use-role";
import { useBranchSettings } from "@/features/admin/settings/api/use-branch-settings";
import { useUpdateBranchSettings } from "@/features/admin/settings/api/use-update-branch-settings";
import { BranchSettingsForm } from "@/features/admin/settings/components/branch-settings-form";
import Loading from "@/app/loading";
import ErrorBoundary from "@/app/error";
import MainPageHeader from "@/lib/utils/components/MainPageHeader";
import { Settings } from "lucide-react";

export default function BranchSettingsPage() {
  const { branchId, isLoading: isTenantLoading } = useRole();
  const { data: branchData, isLoading, isError, error } = useBranchSettings(branchId);
  const { mutate: updateBranch, isPending } = useUpdateBranchSettings(branchId);

  if (isTenantLoading || isLoading) return <Loading text="Loadig Branch Details..." />
  if (isError || !branchData) return <ErrorBoundary error={error?.message} />

  return (
    <div className="p-6 space-y-6">
      <MainPageHeader
        heading="Branch Settings"
        description="Manage your localized branch identity for customer-facing documents and invoices."
        icon={Settings}
      />

      <BranchSettingsForm
        initialData={branchData}
        onSubmit={(data) => updateBranch(data)}
        isPending={isPending}
      />
    </div>
  );
}