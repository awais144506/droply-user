"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Package, Wallet, Users, MapPin, Trash2, Edit } from "lucide-react";
import { toast } from "sonner";
import { useZone, useDeleteZone } from "@/features/zones/api/use-zones";
import { ZoneCustomersTable } from "@/features/zones/components/zone-customers-table";
import { AssignedRidersCard } from "@/features/zones/components/assigned-riders-card";
import PageStatsCard from "@/utils/page-stats-card";
import PageDetailHeader from "@/utils/page-detail-header";
import GeneralMap from "@/utils/general-map";
import Loading from "@/app/loading";
import NotFoundPage from "@/app/not-found";
import { Button } from "@/components/ui/button";
import ConfirmDeleteDialog from "@/utils/confirm-delete-dialog";
import EditZoneDialog from "@/features/zones/components/edit-zone";
import { formatCurrency } from "@/utils/format-currency";

export default function ZoneDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const zoneId = params.zoneId as string;
  const { data: zone, isLoading } = useZone(zoneId);
  const { mutate: deleteZone, isPending: isDeleting } = useDeleteZone();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  if (isLoading) return <Loading />
  if (!zone) return <NotFoundPage item="Zone" href="/manage/zones" />

  // 1. First Step: The Safety Check
  const handleDeleteClick = () => {
    const hasCustomers = (zone.customers?.length || 0) > 0;
    const hasLedger = (zone.calculatedLedger || 0) > 0;
    const hasReturnables = (zone.calculatedReturnables || 0) > 0;
    const hasRiders = (zone.riders?.length || 0) > 0;

    if (hasCustomers || hasLedger || hasReturnables || hasRiders) {
      toast.error("Cannot Delete Zone", {
        description: "This zone has active customers, assigned riders, or pending balances.",
      });
      return;
    }
    setIsDeleteDialogOpen(true);
  };

  // 2. Second Step: The Actual Deletion
  const handleConfirmDelete = () => {
    deleteZone(zoneId, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        toast.success("Zone deleted successfully");
        router.push('/manage/zones');
      },
      onError: () => {
        setIsDeleteDialogOpen(false);
      }
    });
  };

  return (
    <>
      <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <PageDetailHeader
          heading={zone.name}
          description="Zone Overview & Customer Directory"
          href="/manage/zones"
        >
          <Button
            type="button"
            onClick={() => setIsEditDialogOpen(true)}
            variant="outline"
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>

          <Button
            type="button"
            onClick={handleDeleteClick}
            variant="destructive"
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </PageDetailHeader>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <PageStatsCard
            title="Total Customers"
            value={zone.customers?.length || 0}
            icon={Users}
          />
          <PageStatsCard
            title="Zone Khata"
            value={formatCurrency(zone.calculatedLedger)}
            prefix="Rs."
            icon={Wallet}
            iconContainerClass="bg-amber-50 text-amber-600"
            valueColorClass="text-amber-600"
          />
          <PageStatsCard
            title="Assets Out"
            value={zone.calculatedReturnables}
            postfix="items"
            icon={Package}
            iconContainerClass="bg-indigo-50 text-indigo-600"
            valueColorClass="text-indigo-600"
          />
        </div>

        {/* Map and Riders Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col h-full min-h-120 min-w-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Coverage Area</h3>
                <p className="text-xs text-slate-500">Center location and estimated service radius</p>
              </div>
            </div>

            <div className="flex-1 rounded-xl overflow-hidden border border-slate-100">
              {zone.latitude && zone.longitude ? (
                <GeneralMap
                  lat={zone.latitude}
                  lng={zone.longitude}
                  popupText={zone.name}
                  showCircle={true}
                  circleRadius={1500}
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-slate-50 text-slate-400 text-sm italic">
                  Coordinates not set for this zone
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1 min-h-75">
            <AssignedRidersCard riders={zone.riders} />
          </div>
        </div>

        <ZoneCustomersTable customers={zone.customers} />
      </div>

      <ConfirmDeleteDialog
        itemName={`Zone "${zone.name}"`}
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
      <EditZoneDialog
        zone={zone}
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
      />
    </>
  );
}