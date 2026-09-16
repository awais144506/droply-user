import { MapPin } from "lucide-react";
import { FormInput } from "@/components/ui/form-input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AddressCard() {
    return (
        <Card>
            <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-emerald-600" />
                    Address & Coordinates
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
                <div className="space-y-1.5">
                    <FormInput
                        label="STREET ADDRESS"
                        placeholder="House / Shop No, Street, Area"
                        name="address"
                        required
                    />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                        <FormInput
                            label="Latitude"
                            placeholder="31.5189"
                            type="number"
                            name="latitude"
                            required
                        />
                    </div>
                    <div className="space-y-1.5">
                        <FormInput
                            label="Longitude"
                            placeholder="74.3680"
                            type="number"
                            name="longitude"
                            required
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}