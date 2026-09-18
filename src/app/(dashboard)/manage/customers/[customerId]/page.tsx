/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Trash2, Edit } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCustomer } from "@/features/manage/customers/api/use-customer";
import { useDeleteCustomer } from "@/features/manage/customers/api/use-mutate-customer";
import PageDetailHeader from "@/lib/utils/components/PageDetailHeader";
import ConfirmDeleteDialog from "@/lib/utils/components/ConfirmDeleteItemDialog";
import Loading from "@/app/loading";
import NotFoundPage from "@/app/not-found";
import CustomerDetailsStats from "@/features/manage/customers/components/customer_details/customer-details-stats";
import PersonalInformationAssets from "@/features/manage/customers/components/customer_details/personal-assets-held";
import CustomerOrderHistory from "@/features/manage/customers/components/customer_details/customer-order-history";
import CustomerVisitMapDetails from "@/features/manage/customers/components/customer_details/customer-visit-map";


export default function CustomerDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const customerId = params.customerId as string;
  const { data: customer, isLoading } = useCustomer(customerId);
  const { mutate: deleteCustomer, isPending: isDeleting } = useDeleteCustomer();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  if (isLoading) return <Loading />;
  if (!customer) return <NotFoundPage />;
  const totalReturnables = customer.returnables?.reduce(
    (sum: number, item: any) => sum + item.currentBalance,
    0
  ) || 0;

  // Deletion Safety Check
  const handleDeleteClick = () => {
    if (customer.customerCredit > 0 || totalReturnables > 0) {
      toast.error("Cannot Delete Customer", {
        description: "This customer has pending ledger balances or unreturned assets.",
      });
      return;
    }
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    deleteCustomer(customerId, {
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
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">

        {/* Header Section */}
        <PageDetailHeader
          heading={customer.name}
          description={`Customer Code: ${customer.customerCode}`}
          href="/manage/customers"
          createdAt={customer.createdAt}
          updatedAt={customer.updatedAt}
        >
          <Button
            type="button"
            onClick={() => router.push(`/manage/customers/${customer.id}/edit`)}
            variant="outline"
            disabled={isDeleting}
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

        {/* Top Metric Cards */}
        <CustomerDetailsStats
          customerCredit={customer.customerCredit}
          totalReturnables={totalReturnables}
          customerAdvance={customer.customerAdvance}
          securityDeposit={customer.securityDeposit}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-2 gap-6">
          {/* Left Column (Details, Assets, Order History) */}
          <div className="grid grid-cols-1">
            <div className="lg:col-span-2 space-y-6">
              <PersonalInformationAssets
                customer={customer}
              />
              <CustomerOrderHistory
                orders={customer.orders}
              />
            </div>
          </div>

          <CustomerVisitMapDetails
            lastVisitDate={customer.lastVisitDate}
            longitude={customer.longitude}
            latitude={customer.latitude}
            name={customer.name}
          />
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        itemName={`Customer "${customer.name}"`}
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </>
  );
}