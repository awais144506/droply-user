"use client"
import { useParams, useRouter } from 'next/navigation'
import SupplierForm from '@/features/supply/suppliers/components/create/SupplierForm'
import CreateFormHeader from '@/lib/utils/components/FormHeaderNavigation'
import Loading from '@/app/loading'
import { useUpdateSupplier } from '@/features/supply/suppliers/api/use-mutate-supplier'
import { useSupplierDetail } from '@/features/supply/suppliers/api/use-suppliers'
import { SupplierFormData } from '@/features/supply/suppliers/schema/create-supplier-schema'
import { useRole } from '@/lib/hooks/use-role'

const EditSupplier = () => {
  const router = useRouter();
  const params = useParams();
  const supplierId = params.supplierId as string;
  const isEditMode = !!supplierId
  const { branchId } = useRole();

  const { data: supplierData, isLoading } = useSupplierDetail(branchId, supplierId);
  const { mutate: updateSupplier, isPending } = useUpdateSupplier()

  const handleSubmit = (data: SupplierFormData) => {
    updateSupplier(
      {
        id: supplierId,
        data: data
      },
      {
        onSuccess: () => {
          router.back();
        }
      }
    );
  };

  const initialData = supplierData ? {
    firmName: supplierData.firmName,
    name: supplierData.name,
    email: supplierData.email || "",
    phone: (supplierData.phone),
    address: supplierData.address || "",
    city: supplierData.city,
    ntn: supplierData.ntn,
    strn: supplierData.ntn
  } : undefined;


  if (isLoading) return <Loading />

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-6">
      <CreateFormHeader
        title={`Edit: ${supplierData?.firmName || "Supplier"}`}
        breadcrumbs={[
          { label: "Suppliers", href: "/supply/suppliers" },
          { label: "Edit Supplier" }
        ]}
      />
      <SupplierForm
        isPending={isPending}
        onSubmit={handleSubmit}
        initialData={initialData}
        isEditMode={isEditMode}
      />
    </div>
  )
}

export default EditSupplier