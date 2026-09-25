import ReturnForm from "@/features/supply/returns/components/create/ReturnForm"
import CreateFormHeader from "@/lib/utils/components/FormHeaderNavigation"

const CreateReturn = () => {
    return (
        <div className="w-full max-w-6xl mx-auto py-6 space-y-6">
            {/* Page Header */}
            <CreateFormHeader
                title="Create New PO Return"
                href="/supply/returns"
            />

            {/* Form Container */}
            <div className="w-full">
                <ReturnForm />
            </div>
        </div>
    )
}

export default CreateReturn