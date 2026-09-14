"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { useRole } from "@/lib/hooks/use-role";
import { useRecoveries, RecoveryRecord } from "@/features/recovery/api/use-recoveries";
import { RecoveryStats } from "@/features/recovery/components/recovery-stats";
import { RecoveryTable } from "@/features/recovery/components/recovery-table";
import { Button } from "@/components/ui/button";

export default function RecoveryPage() {
  const { branchId, isLoading: isTenantLoading } = useRole();
  const { data: records = [], isLoading } = useRecoveries(branchId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<RecoveryRecord | null>(null);

  if (isTenantLoading || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin mb-4 text-sky-600" />
        <p className="text-sm font-medium">Loading recovery logs...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Sales Returns & Recovery</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage defective returns, asset recoveries, and security deposit refunds.
          </p>
        </div>
        <Button 
          onClick={() => { setEditingRecord(null); setIsModalOpen(true); }}
          className="bg-sky-600 hover:bg-sky-700 text-white h-10 px-4 rounded-xl shadow-sm cursor-pointer"
        >
          <Plus className="h-4 w-4 mr-2" /> Log Recovery Request
        </Button>
      </div>

      <RecoveryStats records={records} />
      
      <RecoveryTable 
        records={records} 
        onEdit={(record) => {
          setEditingRecord(record);
          setIsModalOpen(true);
        }}
      />
    </div>
  );
}