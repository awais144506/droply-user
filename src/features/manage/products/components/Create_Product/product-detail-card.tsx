import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { FormInput } from "@/components/ui/form-input"
import { Package } from "lucide-react"
import { FormSelect } from "@/components/ui/form-select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Controller, useFormContext } from "react-hook-form"
import { categoryOptions, trackingOptions, scaleOptions } from "../../data/create-product-dropdown";

const ProductDetailCard = () => {
    const { control } = useFormContext();

    return (
        <div>
            <Card>
                <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <Package className="h-4 w-4 text-sky-600" /> Product Details
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                        <Controller
                            control={control}
                            name="isPublic"
                            render={({ field }) => (
                                <Switch
                                    id="isPublic"
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            )}
                        />
                        <Label htmlFor="isPublic" className="text-xs font-semibold text-slate-700 cursor-pointer">
                            Show in Customer Portal
                        </Label>
                    </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <FormInput
                            label="Product Name"
                            placeholder="e.g. 19-Liter Water"
                            required
                            name="name"
                        />
                        <FormSelect
                            label="Scale"
                            name="unitOfMeasure"
                            options={scaleOptions}
                            required
                            isSearchable={false}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <FormSelect
                                label="Category"
                                name="category"
                                options={categoryOptions}
                                required
                                isSearchable={false}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <FormSelect
                                label="Tracking Type"
                                name="trackingType"
                                options={trackingOptions}
                                required
                                isSearchable={false}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default ProductDetailCard