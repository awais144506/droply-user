import { User } from "lucide-react";;
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormInput } from "@/components/ui/form-input";

const StaffExtraDetails = () => {
    return (
        <div>
            <Card>
                <CardHeader className="pb-3 border-b border-slate-100">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <User className="h-4 w-4 text-sky-600" />
                        Additional Information (Optional)
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                    <div className="flex space-x-4">
                        <FormInput
                            label="Father Name"
                            placeholder="e.g. Ali"
                            name="fatherName"
                        />
                        <FormInput
                            label="Father CNIC"
                            placeholder="e.g. 3650214562317"
                            name="fatherCnic"
                        />
                    </div>
                    <div className="flex space-x-4">
                        <FormInput
                            label="Guarantor Name"
                            placeholder="e.g. Ali"
                            name="guarantorName"
                        />
                        <FormInput
                            label="Guarantor CNIC"
                            placeholder="e.g. 3650214562317"
                            name="guarantorCnic"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <FormInput
                            label="Guarantor Phone"
                            placeholder="e.g. 03001234567"
                            name="guarantorPhone"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <FormInput
                            label="Blood Group"
                            placeholder="e.g. O+"
                            name="bloodGroup"
                        />
                    </div>
                </CardContent>
            </Card></div>
    )
}

export default StaffExtraDetails