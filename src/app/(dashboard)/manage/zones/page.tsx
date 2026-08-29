"use client";

import { useState } from "react";
import { Plus, Search, MapPinned, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  useZones,
  useBranchRiders,
  useCreateZone,
  useUpdateZone,
  useDeleteZone,
} from "@/features/zones/api/use-zones";
import { ZoneStats } from "@/features/zones/components/zone-stats";
import { ZoneCard } from "@/features/zones/components/zone-card";
import { ZoneFormModal } from "@/features/zones/components/zone-form-modal";
import { ZoneItem } from "@/features/zones/types";
import { useTenant } from "@/hooks/use-tenant";
import { Button } from "@/components/ui/button";

export default function ZonesPage() {
  const { branchId, isLoading: isTenantLoading } = useTenant();

  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<ZoneItem | null>(null);

  // TanStack Query hooks
  const { data: rawZones, isLoading: isLoadingZones } = useZones(branchId);
  const { data: rawRiders } = useBranchRiders(branchId);

  // Safe Array Normalization
  const zones: ZoneItem[] = Array.isArray(rawZones) ? rawZones : [];
  const riders = Array.isArray(rawRiders) ? rawRiders : [];

  const createZoneMutation = useCreateZone(branchId);
  const updateZoneMutation = useUpdateZone(branchId);
  const deleteZoneMutation = useDeleteZone(branchId);

  const filteredZones = zones.filter((z) =>
    z.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateOrUpdate = async (data: { name: string; riderIds: string[] }) => {
    try {
      if (editingZone) {
        await updateZoneMutation.mutateAsync({
          id: editingZone.id,
          payload: data,
        });
        toast.success("Zone updated successfully");
      } else {
        await createZoneMutation.mutateAsync(data);
        toast.success("Zone created successfully");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || "Operation failed");
    }
  };

  const handleDelete = async (zoneId: string) => {
    if (!confirm("Are you sure you want to delete this zone?")) return;
    try {
      await deleteZoneMutation.mutateAsync(zoneId);
      toast.success("Zone deleted");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || "Failed to delete zone");
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Delivery Zones
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage distribution sectors, route riders, and track empty returnable items liabilities.
          </p>
        </div>

        <Button
          onClick={() => {
            setEditingZone(null);
            setIsModalOpen(true);
          }}
          variant="create"
        >
          <Plus className="h-4 w-4" />
          <span>Add Zone</span>
        </Button>
      </div>

      {/* Aggregate Metric Stats */}
      <ZoneStats zones={zones} />

      {/* High-Contrast Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search zones by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-500 bg-white text-xs font-medium text-slate-900 placeholder:text-slate-500 shadow-2xs focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
        />
      </div>

      {/* Main Grid View */}
      {isLoadingZones || isTenantLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400">
          <Loader2 className="h-6 w-6 animate-spin mb-2" />
          <p className="text-xs">Loading branch zones...</p>
        </div>
      ) : filteredZones.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredZones.map((zone) => (
            <ZoneCard
              key={zone.id}
              zone={zone}
              onEdit={(z) => {
                setEditingZone(z);
                setIsModalOpen(true);
              }}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center bg-white rounded-2xl border border-dashed border-slate-200">
          <div className="h-10 w-10 mx-auto rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 mb-2">
            <MapPinned className="h-5 w-5" />
          </div>
          <p className="text-sm font-semibold text-slate-700">No delivery zones found</p>
          <p className="text-xs text-slate-400 mt-0.5">
            Click Add Zone above to configure your first delivery sector.
          </p>
        </div>
      )}

      {/* Form Modal */}
      <ZoneFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateOrUpdate}
        zone={editingZone}
        availableRiders={riders}
        isLoading={createZoneMutation.isPending || updateZoneMutation.isPending}
      />
    </div>
  );
}