/* eslint-disable @typescript-eslint/no-explicit-any */

import { User } from "lucide-react";;
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormInput } from "@/components/ui/form-input";



const CreateStaffIdentityCard = ({ register, errors }: any) => {
    return (
        <div>
            <Card>
                <CardHeader className="pb-3 border-b border-slate-100">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <User className="h-4 w-4 text-sky-600" />
                        Personal Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                    <div className="flex space-x-4">
                        <FormInput
                            label="Full Name"
                            required
                            placeholder="e.g. Ali Ahmad"
                            register={register("name")}
                            error={errors.name?.message}
                        />
                        <FormInput
                            label="Email Address (Login ID)"
                            required
                            placeholder="e.g. ahmad@gmail.com"
                            register={register("email")}
                            error={errors.email?.message}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <FormInput
                            label="Phone / WhatsApp"
                            required
                            placeholder="e.g. 03001234567"
                            register={register("phone")}
                            error={errors.phone?.message}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <FormInput
                            label="CNIC"
                            required
                            placeholder="e.g. 3650214562317"
                            register={register("cnic")}
                            error={errors.cnic?.message}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <FormInput
                            label="Current Address"
                            required
                            placeholder="e.g. Shadman Town, District Lahore"
                            register={register("address")}
                            error={errors.address?.message}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <FormInput
                            label="Joining Date"
                            required
                            type="date"
                            placeholder="e.g. 30000"
                            register={register("joiningDate")}
                            error={errors.joiningDate?.message}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <FormInput
                            label="Basic Salary"
                            type="number"
                            placeholder="e.g. 30000"
                            register={register("salary")}
                            error={errors.salary?.message}
                        />
                    </div>
                </CardContent>
            </Card></div>
    )
}

export default CreateStaffIdentityCard