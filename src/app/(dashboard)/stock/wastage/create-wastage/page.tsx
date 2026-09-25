"use client"
import WastageForm from "@/features/stock/wastage/components/create/WastageForm"
import CreateFormHeader from "@/lib/utils/components/FormHeaderNavigation"

const CreateWastage = () => {
  return (
    <div className="max-w-3xl mx-auto py-6">
      <CreateFormHeader
        title="Log New Wastage"
        description="Manage the logs of your wastage"
        href="/stock/wastage"
      />
      <WastageForm />
    </div>
  )
}

export default CreateWastage