import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { Package, Network, Pen, Trash2, TrendingUp, AlertCircle, ShieldAlert, Layers, Power, PowerOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@/lib/utils/components/TableCreateMachine";
import { ProductList } from "../../types/product";
import { formatCurrency } from "@/lib/utils/functions/setFormat";

export const getProductColumns = (
    router: AppRouterInstance,
    isOwner: boolean,
    setProductToDelete: (product: ProductList) => void,
    onToggleStatus?: (id: string) => void
): ColumnDef<ProductList>[] => [
        {
            header: "Code",
            render: (product) => (
                <p className="font-bold text-xs text-left text-slate-900">{product.productCode}</p>
            )
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
                        <div className="flex items-center gap-1.5 flex-wrap">
                            {product.hasRecipe && (
                                <span className="rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-100 flex items-center gap-1 px-2 py-0.5">
                                    <Network className="h-3 w-3" /> Recipe
                                </span>
                            )}
                            {product.trackingType === "RETURNABLE" && product.securityDeposit > 0 && (
                                <span className="rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-100 flex items-center gap-1 px-2 py-0.5">
                                    <ShieldAlert className="h-3 w-3" /> Deposit: {formatCurrency(product.securityDeposit)}
                                </span>
                            )}
                        </div>
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
                        {product.category?.replace(/_/g, " ")}
                    </span>
                </div>
            )
        },
        {
            header: "Sale Price (Default)",
            render: (product) => {
                const defaultTier = product.priceTiers?.find(t => t.isDefault) || product.priceTiers?.[0];
                const salePrice = defaultTier?.salePrice ?? product.salePrice ?? 0;
                const totalTiers = product.priceTiers?.length || 0;

                return (
                    <div className="text-center flex items-center justify-center gap-1">
                        <p className="font-black text-slate-900">{formatCurrency(salePrice)}</p>
                        {totalTiers > 1 && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded">
                                <Layers className="h-2.5 w-2.5" /> +{totalTiers - 1} tiers
                            </span>
                        )}
                    </div>
                );
            }
        },
        {
            header: "Unit Cost (Default)",
            render: (product) => {
                const defaultTier = product.priceTiers?.find(t => t.isDefault) || product.priceTiers?.[0];
                const unitCost = defaultTier?.unitCost ?? product.unitCost ?? 0;
                return (
                    <p className="text-sm font-black text-center text-slate-900">
                        {formatCurrency(unitCost)}
                    </p>
                );
            }
        },
        {
            header: "Margin",
            render: (product) => {
                const defaultTier = product.priceTiers?.find(t => t.isDefault) || product.priceTiers?.[0];
                const sale = defaultTier?.salePrice ?? product.salePrice ?? 0;
                const cost = defaultTier?.unitCost ?? product.unitCost ?? 0;
                const margin = sale > 0 ? (((sale - cost) / sale) * 100).toFixed(0) : "0";

                return (
                    <div className="flex items-center justify-center gap-1 text-sm font-bold text-emerald-600 mt-0.5">
                        <TrendingUp className="h-3 w-3" />{margin}%
                    </div>
                );
            }
        },
        {
            header: "Stock On Hand",
            className: "text-center",
            render: (product) => {
                const currentStock = product.currentStock ?? 0;
                const threshold = product.lowStockThreshold ?? 10;
                const isLowStock = currentStock <= threshold;
                return (
                    <div>
                        <p className={`text-base font-bold ${isLowStock ? "text-rose-600" : "text-slate-900"}`}>
                            {currentStock} <span className="text-xs">({product.unitOfMeasure?.toLowerCase()})</span>
                        </p>
                        {isLowStock && (
                            <div className="flex items-center justify-center gap-1 text-[10px] font-medium text-rose-500 mt-0.5">
                                <AlertCircle className="h-3 w-3" /> Low stock
                            </div>
                        )}
                    </div>
                );
            }
        },
        {
            header: "Status",
            className: "text-center",
            render: (product) => (
                <span
                    className={`rounded-sm font-bold border transition-colors text-xs px-3 py-1 ${product.isActive
                            ? "bg-emerald-100 text-emerald-600 border border-emerald-100 hover:bg-emerald-100"
                            : "bg-rose-100 text-rose-600 border-rose-100 hover:bg-rose-100"
                        }`}
                >
                    {product.isActive ? "ACTIVE" : "INACTIVE"}
                </span>
            )
        },
        {
            header: "Actions",
            className: "text-right",
            render: (product) => {
                return (
                    <div className="flex items-center justify-end gap-1">
                        {/* Quick Toggle Status Icon Button */}
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => onToggleStatus && onToggleStatus(product.id)}
                            className={`cursor-pointer ${product.isActive
                                    ? "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                                    : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"
                                }`}
                            title={product.isActive ? "Deactivate product" : "Activate product"}
                        >
                            {product.isActive ? <Power className="h-4 w-4" /> : <PowerOff className="h-4 w-4" />}
                        </Button>

                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/manage/products/edit-item/${product.id}`)}
                            className="text-slate-400 hover:text-sky-600 cursor-pointer"
                            title="Edit product"
                        >
                            <Pen className="h-4 w-4" />
                        </Button>

                        {isOwner && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setProductToDelete(product)}
                                className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                                title="Delete product"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                );
            }
        }
    ];