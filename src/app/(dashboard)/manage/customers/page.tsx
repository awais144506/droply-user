"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { useRole } from "@/hooks/use-role";
import { useCustomers, CustomerItem } from "@/features/customers/api/use-customers";
import { CustomerStats } from "@/features/customers/components/customer-stats";
import { CustomersTable } from "@/features/customers/components/customer-table";
import { Button } from "@/components/ui/button";
// import { CustomerFormModal } from "@/features/customers/components/customer-form-modal";

export default function CustomersPage() {
  const { branchId, isLoading: isTenantLoading } = useRole();
  const { data: customers = [], isLoading } = useCustomers(branchId);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<CustomerItem | null>(null);

  const handleOpenCreate = () => {
    setEditingCustomer(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (customer: CustomerItem) => {
    setEditingCustomer(customer);
    setIsModalOpen(true);
  };

  if (isTenantLoading || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin mb-4 text-sky-600" />
        <p className="text-sm font-medium">Loading customer directory...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto p-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Customer Directory & Khata
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage customer accounts, sector routes, outstanding balances, and returnable asset liabilities.
          </p>
        </div>

        <Button onClick={handleOpenCreate} variant="create">
          <Plus className="h-4 w-4 mr-2" />
          Add New Customer
        </Button>
      </div>

      {/* Aggregate Stats */}
      <CustomerStats customers={customers} />

      {/* Main Table with Pagination */}
      <CustomersTable 
        customers={customers} 
        onEdit={handleOpenEdit} 
      />

      {/* Modal Placeholder (To be implemented) */}
      {/* <CustomerFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        customer={editingCustomer}
      /> */}
    </div>
  );
}