"use client"

import React from 'react'
import { useParams, useRouter } from 'next/navigation'

import SupplierForm from '@/features/supply/suppliers/components/create/SupplierForm'
import CreateFormHeader from '@/lib/utils/components/FormHeaderNavigation'
import Loading from '@/app/loading'

import { useUpdateSupplier } from '@/features/supply/suppliers/api/use-mutate-supplier'
import { useSupplierDetail } from '@/features/supply/suppliers/api/use-suppliers'
import { SupplierFormData } from '@/features/supply/suppliers/schema/create-supplier-schema'
import { formatPhoneNumber } from 'react-phone-number-input'

const EditSupplier = () => {
  const router = useRouter();
  const params = useParams();
  const supplierId = params.supplierId as string;
  const isEditMode = !!supplierId

  const { data: supplierData, isLoading } = useSupplierDetail(supplierId);
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
    supplierName: supplierData.supplierName,
    email: supplierData.email || "",
    phone: (supplierData.phone),
    address: supplierData.address || "",
    city: supplierData.city,
  } : undefined;


  if (isLoading) return <Loading />

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-6">
      <CreateFormHeader
        title={`Edit: ${supplierData?.firmName || "Supplier"}`}
        href='/supply/suppliers'
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