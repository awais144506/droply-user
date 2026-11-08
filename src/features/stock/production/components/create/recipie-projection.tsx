import { PackageMinus, AlertCircle } from "lucide-react";


interface Recipe {
    name: string;
    quantityNeeded: number;
    currentStock: number;
    rawMaterialId: string;
    unitOfMeasure: string;
}
type Props = {
    selectedProductDetails: {
        hasRecipe: boolean;
        recipe: Recipe[];
    } | undefined;
    expectedYield: number;
}

export const RecipeProjection = ({ selectedProductDetails, expectedYield }: Props) => {
    return (
        <div>
            {selectedProductDetails?.hasRecipe && selectedProductDetails.recipe.length > 0 && (
                <div className="bg-sky-50/50 p-6 rounded-2xl border border-sky-100 shadow-sm">
                    <div className="flex items-center justify-between mb-4 pb-2 border-b border-sky-100">
                        <div className="flex items-center gap-2">
                            <PackageMinus className="w-5 h-5 text-sky-600" />
                            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Raw Material Consumption</h3>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="grid grid-cols-12 gap-2 px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            <div className="col-span-6">Raw Material</div>
                            <div className="col-span-3 text-right">Required</div>
                            <div className="col-span-3 text-right">Current Stock</div>
                        </div>

                        {selectedProductDetails.recipe.map((item: Recipe) => {
                            const totalRequired = item.quantityNeeded * expectedYield;
                            const isShort = totalRequired > item.currentStock;

                            return (
                                <div key={item.rawMaterialId} className={`grid grid-cols-12 gap-2 px-3 py-3 bg-white border rounded-xl items-center text-sm ${isShort ? "border-rose-200" : "border-slate-100"}`}>
                                    <div className="col-span-6 font-medium text-slate-700 flex items-center gap-2">
                                        {isShort && <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />}
                                        {item.name}
                                    </div>
                                    <div className={`col-span-3 text-right font-bold ${isShort ? "text-rose-600" : "text-slate-900"}`}>
                                        {totalRequired.toLocaleString()} ({item.unitOfMeasure.toLowerCase()})
                                    </div>
                                    <div className="col-span-3 text-right text-slate-500">
                                        {item.currentStock.toLocaleString()} ({item.unitOfMeasure.toLowerCase()})
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {selectedProductDetails && !selectedProductDetails.hasRecipe && (
                <div className="bg-amber-50 p-4 rounded-xl border border-slate-100 text-sm font-semibold text-amber-700 flex flex-col items-start gap-3">
                    <p>This product does not have a recipe/finished_good. Logging this batch will directly increase its stock without deducting any raw materials.</p>
                </div>
            )}
        </div>
    )
}