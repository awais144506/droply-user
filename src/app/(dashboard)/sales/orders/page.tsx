import PageHeader from "@/lib/utils/page-header"


const Orders = () => {
  return (
    <div className="space-y-6 max-w-7xl p-4 sm:p-6 lg:p-8">
      <PageHeader
        heading="Sales & Despatch Orders"
        description="Generate instant branch counter bills or schedule route deliveries for zones."
        href="/sales/orders/create-sale"
        btnText="Create New Sale"
      />
    </div>
  )
}

export default Orders