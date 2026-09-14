"use client"
import CreateFormHeader from "@/lib/utils/create-formHeader"
import { useRole } from "@/lib/hooks/use-role"
import CreateVehicleForm from "@/features/fleet/components/create/CreateVehicleForm";

const CreateVehicle = () => {
    const { branchId } = useRole();

    return (
        <div className="max-w-7xl mx-auto space-y-6 p-6">
            <CreateFormHeader
                text="Create New Vehicle"
                href="/admin/fleet"
            />
            <CreateVehicleForm
                branchId={branchId}
            />
        </div>
    )
}

export default CreateVehicle