"use client";
import { useRole } from "@/lib/hooks/use-role";
import { useBranchSettings } from "@/features/admin/settings/api/use-branch-settings";
import { useUpdateBranchSettings } from "@/features/admin/settings/api/use-update-branch-settings";
import { BranchSettingsForm } from "@/features/admin/settings/components/branch-settings-form";
import Loading from "@/app/loading";
import ErrorBoundary from "@/app/error";

export default function BranchSettingsPage() {
  const { branchId, isLoading: isTenantLoading } = useRole();
  const { data: branchData, isLoading, isError, error } = useBranchSettings(branchId);
  const { mutate: updateBranch, isPending } = useUpdateBranchSettings(branchId);

  if (isTenantLoading || isLoading) return <Loading text="Loadig Branch Details..." />
  if (isError || !branchData) return <ErrorBoundary error={error?.message} />

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Branch Settings</h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your localized branch identity for customer-facing documents and invoices.
        </p>
      </div>

      <BranchSettingsForm
        initialData={branchData}
        onSubmit={(data) => updateBranch(data)}
        isPending={isPending}
      />
    </div>
  );
}