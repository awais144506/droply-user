/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from "lucide-react";;
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormInput } from "@/components/ui/form-input";

const StaffExtraDetails = ({ register, errors }: any) => {
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
                            register={register("fatherName")}
                            error={errors.fatherName?.message}
                        />
                        <FormInput
                            label="Father CNIC"
                            placeholder="e.g. 3650214562317"
                            register={register("fatherCnic")}
                            error={errors.fatherCnic?.message}
                        />
                    </div>
                    <div className="flex space-x-4">
                        <FormInput
                            label="Guarantor Name"
                            placeholder="e.g. Ali"
                            register={register("guarantorName")}
                            error={errors.guarantorName?.message}
                        />
                        <FormInput
                            label="Guarantor CNIC"
                            placeholder="e.g. 3650214562317"
                            register={register("guarantorCnic")}
                            error={errors.guarantorCnic?.message}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <FormInput
                            label="Guarantor Phone"
                            placeholder="e.g. 03001234567"
                            register={register("guarantorPhone")}
                            error={errors.guarantorPhone?.message}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <FormInput
                            label="Blood Group"
                            placeholder="e.g. O+"
                            register={register("bloodGroup")}
                            error={errors.bloodGroup?.message}
                        />
                    </div>
                </CardContent>
            </Card></div>
    )
}

export default StaffExtraDetails