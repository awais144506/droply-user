import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { Package, Network, Pen, Trash2, TrendingUp, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@/utils/data-table";
import { ProductList } from "../types/product";
import { toast } from "sonner";
import { formatCurrency } from "@/utils/setFormat";
// Helper function just for this file
const calculateMargin = (sale: number, cost: number) => {
    if (sale <= 0) return 0;
    return (((sale - cost) / sale) * 100).toFixed(0);
};

// We wrap the columns in a function so we can pass in the Router and State from the parent
export const getProductColumns = (
    router: AppRouterInstance,
    isOwner: boolean,
    setProductToDelete: (product: ProductList) => void
): ColumnDef<ProductList>[] => [
        {
            header: "Code",
            accessorKey: "sku",
            className: "text-center text-xs font-bold",
        },
        {
            header: "Product",
            render: (product) => (
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-sky-50 flex items-center justify-center shrink-0">
                        <Package className="h-5 w-5 text-sky-500" />
                    </div>
                    <div>
                        <p className="font-bold text-slate-900 mb-1">{product.name}</p>
                        {product.hasRecipe && (
                            <span className="rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-100 flex items-center gap-1 w-fit px-2 py-0.5">
                                <Network className="h-3 w-3" /> Recipe
                            </span>
                        )}
                    </div>
                </div>
            )
        },
        {
            header: "Type & Tracking",
            render: (product) => (
                <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${product.trackingType === "RETURNABLE"
                        ? "bg-indigo-50 text-indigo-700 border-indigo-100"
                        : "bg-slate-100 text-slate-600 border-slate-200"
                        }`}>
                        {product.trackingType === "RETURNABLE" ? "Returnable" : "Outright"}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-wider border border-slate-200">
                        {product.category.replace(/_/g, " ")}
                    </span>
                </div>
            )
        },
        {
            header: "Sale Price",
            render: (product) => (
                <p className="font-black text-center text-slate-900">{formatCurrency(product.salePrice)}</p>
            )
        },
        {
            header: "Unit Cost",
            render: (product) => (
                <div>
                    <p className="text-sm font-black text-center text-slate-900">
                        {formatCurrency(product.unitCost)}
                    </p>
                </div>
            )
        },
        {
            header: "Margin",
            render: (product) => (
                    <div className="flex items-center gap-1 text-sm font-bold text-emerald-600 mt-0.5">
                        <TrendingUp className="h-3 w-3" />{calculateMargin(product.salePrice, product.unitCost)}%
                    </div>
            )
        },
        {
            header: "Stock On Hand",
            className: "text-center",
            render: (product) => {
                const isLowStock = product.currentStock <= product.lowStockThreshold;
                return (
                    <div>
                        <p className={`text-base font-bold ${isLowStock ? "text-rose-600" : "text-slate-900"}`}>
                            {product.currentStock}
                        </p>
                        {isLowStock && (
                            <div className="flex items-center justify-center gap-1 text-[10px] font-medium text-rose-500 mt-0.5">
                                <AlertCircle className="h-3 w-3" /> Low stock
                            </div>
                        )}
                    </div>
                )
            }
        },
        {
            header: "Actions",
            className: "text-right",
            render: (product) => {
                const isUsed = product.isUsedInRecipes;

                return (
                    <div className="flex items-center justify-end gap-1">
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => router.push(`/manage/products/edit-item/${product.id}`)}
                            className="text-slate-400 hover:text-sky-600"
                        >
                            <Pen className="h-4 w-4" />
                        </Button>

                        {isOwner && (
                            <Button
                                variant="ghost"
                                size="icon-sm"
                                onClick={() => {
                                    if (isUsed) {
                                        toast.error(`Cannot delete "${product.name}" because it is used in active recipes.`);
                                        return;
                                    }
                                    setProductToDelete(product);
                                }}
                                className={`h-8 w-8 rounded-lg ${isUsed
                                    ? "text-slate-300 hover:bg-transparent cursor-not-allowed"
                                    : "text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                                    }`}
                                title={isUsed ? "Cannot delete: used in active recipes" : "Delete item"}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                );
            }
        }
    ];