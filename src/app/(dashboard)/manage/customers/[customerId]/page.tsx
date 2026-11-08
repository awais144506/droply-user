/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Trash2, Edit, ShieldBan, ShieldCheck, Link2, RefreshCw } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCustomer } from "@/features/manage/customers/api/use-customer";
import {
  useDeleteCustomer,
  useToggleCustomerStatus,
  useUpdateCustomerToken
} from "@/features/manage/customers/api/use-mutate-customer";
import PageDetailHeader from "@/lib/utils/components/PageDetailHeader";
import ConfirmDeleteDialog from "@/lib/utils/components/ConfirmDialog";
import Loading from "@/app/loading";
import NotFoundPage from "@/app/not-found";
import CustomerDetailsStats from "@/features/manage/customers/components/customer_details/customer-details-stats";
import PersonalInformationAssets from "@/features/manage/customers/components/customer_details/personal-assets-held";
import CustomerOrderHistory from "@/features/manage/customers/components/customer_details/customer-order-history";
import CustomerVisitMapDetails from "@/features/manage/customers/components/customer_details/customer-visit-map";
import { sendWhatsAppMessage } from "@/lib/utils/functions/whatsapp/customerWhatsApp";

export default function CustomerDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const customerId = params.customerId as string;
  const { data: customer, isLoading, isFetching, refetch } = useCustomer(customerId);
  const { mutate: deleteCustomer, isPending: isDeleting } = useDeleteCustomer();
  const { mutate: toggleStatus, isPending: isTogglingStatus } = useToggleCustomerStatus();
  const { mutate: updateToken, isPending: isUpdatingToken } = useUpdateCustomerToken();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isTokenDialogOpen, setIsTokenDialogOpen] = useState(false);

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

  // Magic Link Token Update Handler
  const handleConfirmUpdateToken = () => {
    updateToken(customerId, {
      onSuccess: () => {
        setIsTokenDialogOpen(false);
      },
      onError: () => {
        setIsTokenDialogOpen(false);
      },
    });
  };

  // WhatsApp Quick Messaging Handler
  const handleWhatsAppClick = () => {
    if (!customer.phone) {
      toast.error("No phone number available for this customer.");
      return;
    }
    const portalUrl = `${window.location.origin}/order/${customer.magicLink}`;
    const msg = `Hi *${customer.name}*, here is your updated secure ordering portal link:\n\n${portalUrl}\n\nYou can use this link anytime to place orders directly with us!`;
    sendWhatsAppMessage(customer.phone, msg);
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
            { label: `${customer?.name || "Customer"} Details` }
          ]}
          heading={customer?.name}
          description={`Customer Code: ${customer?.customerCode}`}
          createdAt={customer?.createdAt}
          updatedAt={customer?.updatedAt}
        >
          {/* Refresh Button */}
          <Button
            type="button"
            onClick={() => refetch()}
            disabled={isLoading || isFetching}
            variant="outline"
            className="border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-100 hover:text-slate-800 hover:border-slate-300 gap-2"
          >
            <RefreshCw className={`h-4 w-4 text-slate-600 ${isLoading || isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </Button>

          {/* WhatsApp Button */}
          <Button
            type="button"
            onClick={handleWhatsAppClick}
            variant="outline"
            className="border-emerald-200 bg-emerald-50/50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 hover:border-emerald-300 gap-2"
          >
            <FaWhatsapp className="h-4 w-4 text-emerald-600" />
            WhatsApp
          </Button>

          {/* Update Magic Link Button */}
          <Button
            type="button"
            onClick={() => setIsTokenDialogOpen(true)}
            variant="outline"
            disabled={isUpdatingToken}
            className="border-sky-200 bg-sky-50/50 text-sky-700 hover:bg-sky-100 hover:text-sky-800 hover:border-sky-300 gap-2"
          >
            <Link2 className="h-4 w-4" />
            Update Magic Link
          </Button>

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

      {/* Magic Link Update Confirmation Dialog */}
      <ConfirmDeleteDialog
        title={`Regenerate Magic Link for "${customer.name}"?`}
        description={
          <span>
            Are you sure you want to regenerate the magic link token for <span className="font-bold text-slate-900">{customer.name}</span>?
            Any previously shared links will immediately stop working.
          </span>
        }
        isLoading={isUpdatingToken}
        confirmText="Yes, Regenerate Link"
        confirmButtonClass="bg-sky-600 hover:bg-sky-700 text-white"
        isOpen={isTokenDialogOpen}
        onClose={() => setIsTokenDialogOpen(false)}
        onConfirm={handleConfirmUpdateToken}
      />

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