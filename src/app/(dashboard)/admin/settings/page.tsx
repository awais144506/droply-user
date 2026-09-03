"use client";

import { Loader2 } from "lucide-react";
import { useRole } from "@/hooks/use-role";
import { useBranchSettings } from "@/features/settings/api/use-branch-settings";
import { BranchSettingsForm } from "@/features/settings/components/branch-settings-form";

export default function BranchSettingsPage() {
  const { branchId, isLoading: isTenantLoading } = useRole();
  const { query, mutation } = useBranchSettings(branchId);

  if (isTenantLoading || query.isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin mb-4 text-sky-600" />
        <p className="text-sm font-medium">Loading branch configurations...</p>
      </div>
    );
  }

  if (query.isError || !query.data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-rose-400">
        <p className="text-sm font-medium">Failed to load settings. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Branch Settings</h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your localized branch identity for customer-facing documents and invoices.
        </p>
      </div>

      <BranchSettingsForm 
        initialData={query.data} 
        onSubmit={(data) => mutation.mutate(data)} 
        isPending={mutation.isPending} 
      />
    </div>
  );
}