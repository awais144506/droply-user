import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { FormInput } from "@/components/ui/form-input"
import { Package } from "lucide-react"
import { FormSelect } from "@/components/ui/form-select"
import { categoryOptions, trackingOptions } from "../../data/create-product-dropdown";

const ProductDetailCard = () => {
    return (
        <div><Card>
            <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Package className="h-4 w-4 text-sky-600" /> Item Details
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <FormInput
                        label="Item Name"
                        placeholder="e.g. 19-Liter Water"
                        required
                        name="name"
                    />
                    <FormInput
                        label="SKU / Code"
                        placeholder="e.g. BOT-19L"
                        required
                        name="sku"
                    />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                        <FormSelect
                            label="Category"
                            name="category"
                            options={categoryOptions}
                            required
                        />
                    </div>

                    <div className="space-y-1.5">
                        <FormSelect
                            label="Tracking Type"
                            name="trackingType"
                            options={trackingOptions}
                            required
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
        </div>
    )
}

export default ProductDetailCard