"use client"
import CreateFormHeader from '@/utils/create-formHeader'
import ZoneCreateForm from '@/features/zones/components/zone-create-form'
import { useRole } from '@/hooks/use-role'

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