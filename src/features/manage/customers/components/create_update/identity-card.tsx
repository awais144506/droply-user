/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from "lucide-react";
import { FormInput } from "@/components/ui/form-input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { partyOptions, categoryOptions } from "@/features/manage/customers/components/data/dropdownOptions";
import { FormSelect } from "@/components/ui/form-select";

export default function IdentityCard({ zoneOptions, isLoading }: any) {
    return (
        <Card>
            <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <User className="h-4 w-4 text-sky-600" />
                    Identity & Contact
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                        <FormSelect
                            label="Party Type"
                            name="partyType"
                            required
                            options={partyOptions}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <FormSelect
                            label="Category Options"
                            name="customerCategory"
                            required
                            options={categoryOptions}
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <FormInput
                        label="Full Name / Business Name"
                        required
                        placeholder="e.g. Muhammad Awais"
                        name="name"
                    />
                </div>

                <div className="space-y-1.5">
                    <FormInput
                        label="Phone Number"
                        required
                        placeholder="e.g. 03211234567"
                        name="phone"
                    />
                </div>
                <div className="space-y-1.5">
                    <FormInput
                        label="Email"
                        placeholder="e.g. awais@gmail.com"
                        name="email"
                    />
                </div>


                <div className="space-y-1.5">
                    <FormSelect
                        label="Select Zone Route"
                        name="zoneId"
                        required
                        options={zoneOptions}
                        isLoading={isLoading}
                        isSearchable={true}
                    />
                </div>
            </CardContent>
        </Card>
    );
}