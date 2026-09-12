/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  User, MapPin, Phone, Mail, CreditCard,
  Package, Tag, Briefcase, Building2, Trash2, Edit, Wallet, ShieldCheck,
  CalendarClock, History, Receipt
} from "lucide-react";
import { toast } from "sonner";

// Adjust these imports based on your file structure
import { useCustomer } from "@/features/customers/api/use-customer";
import { useDeleteCustomer } from "@/features/customers/api/use-mutate-customer";
import PageStatsCard from "@/utils/page-stats-card";
import PageDetailHeader from "@/utils/page-detail-header";
import GeneralMap from "@/utils/general-map";
import ConfirmDeleteDialog from "@/utils/confirm-delete-dialog";
import Loading from "@/app/loading";
import NotFoundPage from "@/app/not-found";
import { Button } from "@/components/ui/button";

// Helper function to calculate days ago
const getDaysAgoText = (dateString?: string | null) => {
  if (!dateString) return "Never";
  const diffTime = new Date().getTime() - new Date(dateString).getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return `${diffDays} days ago`;
};

export default function CustomerDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const customerId = params.customerId as string;

  const { data: customer, isLoading } = useCustomer(customerId);
  const { mutate: deleteCustomer, isPending: isDeleting } = useDeleteCustomer();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  if (isLoading) return <Loading />;
  if (!customer) return <NotFoundPage item="Customer" href="/manage/customers" />;

  // Calculate total returnables held
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
        toast.success("Customer deleted successfully");
        router.push('/manage/customers');
      },
      onError: () => {
        setIsDeleteDialogOpen(false);
      }
    });
  };

  const isActive = customer.status?.toLowerCase() === "active";

  return (
    <>
      <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">

        {/* Header Section */}
        <PageDetailHeader
          heading={customer.name}
          description={`Customer Code: ${customer.customerCode}`}
          href="/manage/customers"
        >
          <Button
            type="button"
            onClick={() => console.log("Open Edit Customer Dialog/Page")}
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
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <PageStatsCard
            title="Current Khata (Payable)"
            value={customer.customerCredit}
            prefix="Rs."
            icon={CreditCard}
            iconContainerClass="bg-amber-50 text-amber-600"
            valueColorClass="text-amber-600"
          />
          <PageStatsCard
            title="Total Items Held"
            value={totalReturnables}
            postfix="items"
            icon={Package}
            iconContainerClass="bg-indigo-50 text-indigo-600"
            valueColorClass="text-indigo-600"
          />
          <PageStatsCard
            title="Advance Balance"
            value={customer.customerAdvance}
            prefix="Rs."
            icon={Wallet}
            iconContainerClass="bg-emerald-50 text-emerald-600"
            valueColorClass="text-emerald-600"
          />
          <PageStatsCard
            title="Security Deposit"
            value={customer.securityDeposit}
            prefix="Rs."
            icon={ShieldCheck}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Column (Details, Assets, Order History) */}
          <div className="lg:col-span-2 space-y-6">

            {/* Profile Information Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <User className="h-5 w-5 text-sky-600" />
                  Profile Information
                </h3>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${isActive
                  ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                  : "bg-rose-50 text-rose-600 border border-rose-100"
                  }`}>
                  {customer.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 block">Phone</label>
                  <div className="flex items-center gap-2 text-sm text-slate-900 font-medium">
                    <Phone className="h-4 w-4 text-slate-400" />
                    {customer.phone}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 block">Email</label>
                  <div className="flex items-center gap-2 text-sm text-slate-900 font-medium">
                    <Mail className="h-4 w-4 text-slate-400" />
                    {customer.email || <span className="text-slate-400 italic">Not provided</span>}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 block">Party Type</label>
                  <div className="flex items-center gap-2 text-sm text-slate-900 font-medium">
                    <Briefcase className="h-4 w-4 text-slate-400" />
                    <span className="capitalize">{customer.partyType?.toLowerCase()}</span>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 block">Category</label>
                  <div className="flex items-center gap-2 text-sm text-slate-900 font-medium">
                    <Tag className="h-4 w-4 text-slate-400" />
                    <span className="capitalize">{customer.category?.toLowerCase()}</span>
                  </div>
                </div>

                <div className="md:col-span-1 pt-3 border-t border-slate-100">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 block">Assigned Zone</label>
                  <div className="flex items-center gap-2 text-sm text-slate-900 font-medium">
                    <Building2 className="h-4 w-4 text-slate-400" />
                    {customer.zone?.name || <span className="text-rose-500 italic">Unassigned</span>}
                  </div>
                </div>

                <div className="md:col-span-1 pt-3 border-t border-slate-100">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 block">Address</label>
                  <div className="flex items-center gap-2 text-sm text-slate-900 font-medium">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    <span className="truncate">{customer.address || <span className="text-rose-500 italic">Unassigned</span>}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Returnable Assets Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Package className="h-5 w-5 text-indigo-600" />
                  Returnable Assets Held
                </h3>
              </div>

              {customer.returnables && customer.returnables.length > 0 ? (
                <div className="border border-slate-200 rounded-xl overflow-hidden ">
                  <table className="w-full text-sm text-center">
                    <thead className="bg-slate-50 text-slate-500 font-bold text-xs uppercase">
                      <tr>
                        <th className="px-4 py-3">Product Name</th>
                        <th className="px-4 py-3">Opening Balance</th>
                        <th className="px-4 py-3">Current Items Held</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {customer.returnables.map((item: any) => (
                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 font-medium text-slate-900">
                            {item.productName}
                          </td>
                          <td className="px-4 py-3 font-bold text-slate-900">{item.openingBalance}</td>
                          <td className="px-4 py-3 font-bold text-amber-600">{item.currentBalance}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-8 text-center flex flex-col items-center">
                  <Package className="h-8 w-8 text-slate-300 mb-2" />
                  <p className="text-sm font-medium text-slate-600">No assets currently held</p>
                  <p className="text-xs text-slate-400 mt-1">This customer has returned all company assets.</p>
                </div>
              )}
            </div>

            {/* Order History Section */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <History className="h-5 w-5 text-amber-600" />
                  Recent Orders
                </h3>
                <Button variant="outline" size="sm" className="h-8 text-xs">View All</Button>
              </div>

              {customer.orders && customer.orders.length > 0 ? (
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500 font-bold text-xs uppercase">
                      <tr>
                        <th className="px-4 py-3">Order ID</th>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Amount</th>
                        <th className="px-4 py-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {customer.orders.slice(0, 5).map((order: any) => (
                        <tr key={order.id} className="hover:bg-slate-50 transition-colors cursor-pointer">
                          <td className="px-4 py-3 font-medium text-sky-600">#{order.orderCode}</td>
                          <td className="px-4 py-3 text-slate-500">
                            {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' }).format(new Date(order.createdAt))}
                          </td>
                          <td className="px-4 py-3 font-medium text-slate-900">Rs. {order.totalAmount}</td>
                          <td className="px-4 py-3 text-right">
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600">
                              {order.status || 'Completed'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-8 text-center flex flex-col items-center">
                  <Receipt className="h-8 w-8 text-slate-300 mb-2" />
                  <p className="text-sm font-medium text-slate-600">No order history found</p>
                  <p className="text-xs text-slate-400 mt-1">Orders placed by this customer will appear here.</p>
                </div>
              )}
            </div>

          </div>

          {/* Right Column (Activity & Map) */}
          <div className="lg:col-span-1 space-y-6">

            {/* Last Activity Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <CalendarClock className="h-4 w-4 text-emerald-600" />
                Last Visit / Order
              </h3>

              {customer.lastVisitDate ? (
                <div>
                  <div className="flex items-end justify-between mb-1">
                    <span className="text-2xl font-black tracking-tight text-slate-900">
                      {getDaysAgoText(customer.lastVisitDate)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">
                    {new Intl.DateTimeFormat('en-US', {
                      dateStyle: 'medium',
                      timeStyle: 'short'
                    }).format(new Date(customer.lastVisitDate))}
                  </p>
                </div>
              ) : (
                <div className="text-slate-400 text-sm italic">
                  No previous visits recorded.
                </div>
              )}
            </div>

            {/* Location Map */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col min-h-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Location</h3>
                </div>
              </div>

              <div className="flex-1 rounded-xl overflow-hidden border border-slate-100 relative min-h-75">
                {customer.latitude && customer.longitude ? (
                  <GeneralMap
                    lat={customer.latitude}
                    lng={customer.longitude}
                    popupText={customer.name}
                    showCircle={false}
                  />
                ) : (
                  <div className="h-full w-full absolute inset-0 flex flex-col items-center justify-center bg-slate-50 text-slate-400 text-sm italic p-6 text-center">
                    <MapPin className="h-8 w-8 text-slate-300 mb-2" />
                    Coordinates not set. Update customer profile to view on map.
                  </div>
                )}
              </div>
            </div>

          </div>

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