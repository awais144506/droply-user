import { User } from "lucide-react";;
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormInput } from "@/components/ui/form-input";
const CreateStaffIdentityCard = () => {
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
                            name="name"
                        />
                        <FormInput
                            label="Email Address (Login ID)"
                            required
                            placeholder="e.g. ahmad@gmail.com"
                            name="email"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <FormInput
                            label="Phone / WhatsApp"
                            required
                            placeholder="e.g. 03001234567"
                            name="phone"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <FormInput
                            label="CNIC"
                            required
                            placeholder="e.g. 3650214562317"
                            name="cnic"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <FormInput
                            label="Current Address"
                            required
                            placeholder="e.g. Shadman Town, District Lahore"
                            name="address"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <FormInput
                            label="Joining Date"
                            required
                            type="date"
                            name="joiningDate"
                        />
                    </div>
                    <div className="space-y-1.5">
                        <FormInput
                            label="Basic Salary"
                            type="number"
                            placeholder="e.g. 30000"
                            name="salary"
                        />
                    </div>
                </CardContent>
            </Card></div>
    )
}

export default CreateStaffIdentityCard