import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card"
import { FormInput } from "@/components/ui/form-input"
import { Calculator, Settings2, AlertCircle } from "lucide-react"


const ProductPriceCard = ({ profitMargin, isEditMode, itemType }: { profitMargin: string, isEditMode: boolean, itemType: "RETURNABLE" | "OUTRIGHT" }) => {
    return (
        <div>   <div className="space-y-6">
            <Card>
                <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <Calculator className="h-4 w-4 text-emerald-600" /> Pricing & Margins
                    </CardTitle>
                    <div className={`px-2.5 py-1 font-bold text-xs rounded-md border ${parseFloat(profitMargin) > 0 ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-slate-100 text-slate-600 border-slate-200"}`}>
                        {profitMargin}% Margin
                    </div>
                </CardHeader>
                <CardContent className="pt-4 grid grid-cols-2 gap-4">
                    <FormInput
                        label="Unit Cost"
                        type="number"
                        required
                        prefix="Rs"
                        name="unitCost"
                    />
                    <FormInput
                        label="Sale Price"
                        type="number"
                        required
                        prefix="Rs"
                        name="salePrice"
                    />
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-3 border-b border-slate-100">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <Settings2 className="h-4 w-4 text-amber-600" /> Inventory Settings
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 grid grid-cols-2 gap-4">
                    <FormInput
                        label={isEditMode ? "Adjust Current Stock" : "Opening Stock"}
                        type="number"
                        required
                        name="openingStock"
                        helperText={isEditMode ? (
                            <p className="text-[10px] text-amber-600 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" /> Adjusts live inventory.
                            </p>
                        ) : undefined}
                    />
                    <FormInput
                        label="Low Stock Alert At"
                        type="number"
                        required
                        name="lowStockThreshold"
                    />
                    {itemType === "RETURNABLE" && (<FormInput
                        label="Security Deposit"
                        type="number"
                        name="securityDeposit"
                        prefix="Rs"
                    />)}
                </CardContent>
            </Card>
        </div>
        </div>
    )
}

export default ProductPriceCard