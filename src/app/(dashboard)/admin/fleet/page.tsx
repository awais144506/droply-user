"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { useRole } from "@/hooks/use-role";
import { useFleet, Vehicle } from "@/features/fleet/api/use-fleet";
import { FleetStats } from "@/features/fleet/components/fleet-stats";
import { FleetTable } from "@/features/fleet/components/fleet-table";
import { Button } from "@/components/ui/button";

export default function FleetPage() {
  const { branchId, isLoading: isTenantLoading } = useRole();
  const { data: fleet = [], isLoading } = useFleet(branchId);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  if (isTenantLoading || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin mb-4 text-sky-600" />
        <p className="text-sm font-medium">Loading fleet data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Fleet & Fuel</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage delivery vehicles, track maintenance, and log fuel expenses.
          </p>
        </div>
        <Button 
          onClick={() => { setEditingVehicle(null); setIsModalOpen(true); }}
          className="bg-sky-600 hover:bg-sky-700 text-white h-10 px-4 rounded-xl shadow-sm cursor-pointer"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Vehicle
        </Button>
      </div>

      <FleetStats fleet={fleet} />
      
      <FleetTable 
        fleet={fleet} 
        onEdit={(vehicle) => {
          setEditingVehicle(vehicle);
          setIsModalOpen(true);
        }}
      />
    </div>
  );
}