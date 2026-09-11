"use client";
import { useRole } from "@/hooks/use-role";
import { useBranchSettings } from "@/features/settings/api/use-branch-settings";
import { BranchSettingsForm } from "@/features/settings/components/branch-settings-form";
import Loading from "@/app/loading";
import ErrorBoundary from "@/app/error";

export default function BranchSettingsPage() {
  const { branchId, isLoading: isTenantLoading } = useRole();
  const { fetchBranchSettings, updateBranchSettings } = useBranchSettings(branchId);

  if (isTenantLoading || fetchBranchSettings.isLoading) return <Loading />
  if (fetchBranchSettings.isError || !fetchBranchSettings.data) return <ErrorBoundary error="Error Loading Data" />

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Branch Settings</h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your localized branch identity for customer-facing documents and invoices.
        </p>
      </div>

      <BranchSettingsForm
        initialData={fetchBranchSettings.data}
        onSubmit={(data) => updateBranchSettings.mutate(data)}
        isPending={updateBranchSettings.isPending}
      />
    </div>
  );
}