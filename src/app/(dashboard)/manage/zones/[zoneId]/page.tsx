"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Trash2, Edit} from "lucide-react";
import { toast } from "sonner";
import { useZone } from "@/features/manage/zones/api/use-zones";
import { useDeleteZone, } from "@/features/manage/zones/api/use-mutate-zone";
import { ZoneCustomersTable } from "@/features/manage/zones/components/zone_details/zone-customers-table";
import PageDetailHeader from "@/lib/utils/components/PageDetailHeader";
import Loading from "@/app/loading";
import NotFoundPage from "@/app/not-found";
import { Button } from "@/components/ui/button";
import ConfirmDeleteDialog from "@/lib/utils/components/ConfirmDeleteItemDialog";
import EditZoneDialog from "@/features/manage/zones/components/zone_details/EditZone";
import { ZoneDetailStats } from "@/features/manage/zones/components/zone_details/zone-detail-stats";
import ZoneDetailMap from "@/features/manage/zones/components/zone_details/zone-detail-map";
import { useSearchParams } from "next/navigation";

export default function ZoneDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const zoneId = params.zoneId as string;
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || undefined;

  const { data, isLoading } = useZone(zoneId, search);

  const { mutate: deleteZone, isPending: isDeleting } = useDeleteZone();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  if (isLoading) return <Loading />
  if (!data || !data.zone) return <NotFoundPage />

  const { zone, filterCustomer, stats, hasCustomers, hasLedger, hasReturnables, hasRiders } = data;

  const handleDeleteClick = () => {
    if (hasCustomers || hasLedger || hasReturnables || hasRiders) {
      toast.error("Cannot Delete Zone", {
        description: "This zone has active customers, assigned riders, or pending balances.",
      });
      return;
    }
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    deleteZone(zoneId, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        router.back();
      },
      onError: () => {
        setIsDeleteDialogOpen(false);
      }
    });
  };

  return (
    <>
      <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">

        {/* Header Section */}
        <div className="flex flex-col gap-3">
          <PageDetailHeader
            heading={zone.name}
            description="Zone Overview & Customer Directory"
            href="/manage/zones"
            createdAt={zone.createdAt}
            updatedAt={zone.updatedAt}
          >
            <Button
              type="button"
              onClick={() => setIsEditDialogOpen(true)}
              variant="outline"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>

            <Button
              type="button"
              onClick={handleDeleteClick}
              variant="destructive"
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </PageDetailHeader>
        </div>

        {/* Top Metric Cards */}
        <ZoneDetailStats
          totalCustomers={zone.customers?.length}
          totalLedger={stats?.calculatedLedger}
          totalReturnables={stats?.calculatedReturnables}
        />

        {/* Map and Riders Grid */}
        <ZoneDetailMap
          zone={zone}
        />

        <ZoneCustomersTable customers={filterCustomer} />
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