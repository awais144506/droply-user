"use client"
import CreateFormHeader from '@/lib/utils/components/FormHeaderNavigation'
import ZoneCreateForm from '@/features/manage/zones/components/create/CreateZoneForm'
import { useRole } from '@/lib/hooks/use-role'

const CreateZone = () => {
    const { branchId } = useRole();
    return (
        <div className="max-w-3xl mx-auto space-y-6 p-6">
            <CreateFormHeader
                href="/manage/zones"
                text="Create New Zone"
            />
            <ZoneCreateForm
                branchId={branchId}
            />
        </div>
    )
}
export default CreateZone