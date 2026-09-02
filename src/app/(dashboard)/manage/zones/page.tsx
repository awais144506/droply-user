"use client";

import { useState, useMemo } from "react";
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
import { useRole } from "@/hooks/use-role";
import { Button } from "@/components/ui/button";

export default function ZonesPage() {
  const { branchId, isLoading: isTenantLoading } = useRole();

  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingZone, setEditingZone] = useState<ZoneItem | null>(null);

  const { data: rawZones, isLoading: isLoadingZones } = useZones(branchId);
  const { data: rawRiders } = useBranchRiders(branchId);

  const zones: ZoneItem[] = Array.isArray(rawZones) ? rawZones : [];
  const riders = Array.isArray(rawRiders) ? rawRiders : [];

  const createZoneMutation = useCreateZone(branchId);
  const updateZoneMutation = useUpdateZone(branchId);
  const deleteZoneMutation = useDeleteZone(branchId);

  // 1. Sort absolute array (Oldest first) and assign Zone Number
  // 2. Filter by search query
  const processedZones = useMemo(() => {
    const sortedAndNumbered = [...zones]
      .sort((a, b) => {
        // Fallback to name sort if createdAt is missing, otherwise sort chronological ASC
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateA - dateB;
      })
      .map((zone, index) => ({ ...zone, zoneNumber: index + 1 }));

    if (!searchQuery) return sortedAndNumbered;

    return sortedAndNumbered.filter((z) =>
      z.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [zones, searchQuery]);

  const handleCreateOrUpdate = async (data: { name: string; riderIds: string[] }) => {
    try {
      if (editingZone) {
        await updateZoneMutation.mutateAsync({ id: editingZone.id, payload: data });
        toast.success("Zone updated successfully");
      } else {
        await createZoneMutation.mutateAsync(data);
        toast.success("Zone created successfully");
      }
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err?.message || "Operation failed");
    }
  };

  const handleDelete = async (zoneId: string) => {
    if (!confirm("Are you sure you want to delete this zone? This cannot be undone.")) return;
    try {
      await deleteZoneMutation.mutateAsync(zoneId);
      toast.success("Zone deleted");
    } catch (err: any) {
      toast.error("Failed to delete zone. Ensure no customers are attached.");
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Delivery Zones</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage distribution sectors, route riders, and track total liabilities per area.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingZone(null);
            setIsModalOpen(true);
          }}
          variant="create"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Zone
        </Button>
      </div>

      <ZoneStats zones={zones} />

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search zones by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-10 pl-9 pr-4 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-900 placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
        />
      </div>

      {isLoadingZones || isTenantLoading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400">
          <Loader2 className="h-6 w-6 animate-spin mb-2" />
          <p className="text-sm">Loading branch zones...</p>
        </div>
      ) : processedZones.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {processedZones.map((zone) => (
            <ZoneCard
              key={zone.id}
              zone={zone as ZoneItem & { zoneNumber: number }}
              onEdit={() => {
                setEditingZone(zone);
                setIsModalOpen(true);
              }}
              onDelete={() => handleDelete(zone.id)}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center bg-white rounded-2xl border border-dashed border-slate-200 shadow-sm">
          <div className="h-12 w-12 mx-auto rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 mb-3 border border-slate-100">
            <MapPinned className="h-6 w-6" />
          </div>
          <p className="text-sm font-bold text-slate-700">No delivery zones found</p>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            You haven&apos;t set up any geographic routing sectors yet. Click Add Zone to configure your first area.
          </p>
        </div>
      )}

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