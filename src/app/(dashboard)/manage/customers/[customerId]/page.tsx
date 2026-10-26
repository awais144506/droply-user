/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Trash2, Edit, ShieldBan, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCustomer } from "@/features/manage/customers/api/use-customer";
import { useDeleteCustomer, useToggleCustomerStatus } from "@/features/manage/customers/api/use-mutate-customer";
import PageDetailHeader from "@/lib/utils/components/PageDetailHeader";
import ConfirmDeleteDialog from "@/lib/utils/components/ConfirmDialog";
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
  const { mutate: toggleStatus, isPending: isTogglingStatus } = useToggleCustomerStatus();
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);

  if (isLoading) return <Loading text="Loading customer details..." />;
  if (!customer) return <NotFoundPage />;

  const totalReturnables = customer.returnables?.reduce(
    (sum: number, item: any) => sum + item.currentBalance,
    0
  ) || 0;

  const isActive = customer.status === "ACTIVE";
  const targetStatus = isActive ? "BLOCKED" : "ACTIVE";

  // Status Toggle Confirmation Handler
  const handleConfirmToggleStatus = () => {
    toggleStatus(
      { id: customerId, status: targetStatus },
      {
        onSuccess: () => {
          setIsStatusDialogOpen(false);
        },
        onError: () => {
          setIsStatusDialogOpen(false);
        },
      }
    );
  };

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
      },
    });
  };

  return (
    <>
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">

        {/* Header Section */}
        <PageDetailHeader
          breadcrumbs={[
            { label: "Customers", href: "/manage/customers" },
            { label: `${customer.name} Details` }
          ]}
          heading={customer.name}
          description={`Customer Code: ${customer.customerCode}`}
          createdAt={customer.createdAt}
          updatedAt={customer.updatedAt}
        >
          {/* Block / Activate Button opens confirmation dialog */}
          <Button
            type="button"
            onClick={() => setIsStatusDialogOpen(true)}
            variant="outline"
            disabled={isTogglingStatus || isDeleting}
            className={
              isActive
                ? "border-amber-200 bg-amber-50/50 text-amber-700 hover:bg-amber-100 hover:text-amber-800 hover:border-amber-300"
                : "border-emerald-200 bg-emerald-50/50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 hover:border-emerald-300"
            }
          >
            {isActive ? (
              <>
                <ShieldBan className="h-4 w-4 mr-2" />
                Block
              </>
            ) : (
              <>
                <ShieldCheck className="h-4 w-4 mr-2" />
                Activate
              </>
            )}
          </Button>

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

      {/* Status Toggle Confirmation Dialog */}
      <ConfirmDeleteDialog
        title={`${isActive ? "Block" : "Activate"} "${customer.name}"?`}
        description={
          <span>
            Are you sure you want to {isActive ? "block" : "activate"} <span className="font-bold text-slate-900">{customer.name}</span>? 
            {isActive ? " They will be temporarily restricted from new orders." : " They will be restored to active status."}
          </span>
        }
        isLoading={isTogglingStatus}
        confirmText={isActive ? "Yes, Block Customer" : "Yes, Activate Customer"}
        confirmButtonClass={isActive ? "bg-amber-600 hover:bg-amber-700 text-white" : "bg-emerald-600 hover:bg-emerald-700 text-white"}
        isOpen={isStatusDialogOpen}
        onClose={() => setIsStatusDialogOpen(false)}
        onConfirm={handleConfirmToggleStatus}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        title={`Delete "${customer.name}" Customer?`}
        description={
          <span>
            Are you sure you want to delete <span className="font-bold text-slate-900">{customer.name}</span>?
          </span>
        }
        isLoading={isDeleting}
        confirmText="Delete Customer"
        confirmButtonClass="bg-rose-600 hover:bg-rose-700 text-white"
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}