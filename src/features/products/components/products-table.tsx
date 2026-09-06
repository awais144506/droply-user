"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Search, Droplets, Package, AlertCircle,
    Pen, Eye, Trash2, TrendingUp, Filter, X,
    Network, ChevronLeft, ChevronRight, Loader2
} from "lucide-react";
import { ProductItem, useDeleteProduct } from "../api/use-products";
import { useRole } from "@/hooks/use-role";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export function ProductsTable({ products }: { products: ProductItem[] }) {
    const router = useRouter();
    const { role } = useRole();
    const isOwner = role === "OWNER";

    // API Hook for deletion (make sure to create this in use-products.ts)
    const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct();

    // Filter & UI States
    const [searchQuery, setSearchQuery] = useState("");
    const [showLowStockOnly, setShowLowStockOnly] = useState(false);
    const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
    const [trackingFilter, setTrackingFilter] = useState<string>("ALL");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    
    // Delete Confirmation State
    const [productToDelete, setProductToDelete] = useState<ProductItem | null>(null);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, showLowStockOnly, categoryFilter, trackingFilter]);

    const activeFiltersCount =
        (showLowStockOnly ? 1 : 0) +
        (categoryFilter !== "ALL" ? 1 : 0) +
        (trackingFilter !== "ALL" ? 1 : 0);

    const clearFilters = () => {
        setShowLowStockOnly(false);
        setCategoryFilter("ALL");
        setTrackingFilter("ALL");
        setIsFilterOpen(false);
    };

    const confirmDelete = () => {
        if (!productToDelete) return;
        
        deleteProduct(productToDelete.id, {
            onSuccess: () => {
                toast.success(`${productToDelete.name} deleted successfully`);
                setProductToDelete(null);
            },
            onError: (err: any) => {
                toast.error(err?.response?.data?.message || "Failed to delete product");
                setProductToDelete(null);
            }
        });
    };

    const filteredProducts = products.filter((p) => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesLowStock = showLowStockOnly ? p.stockOnHand <= p.lowStockThreshold : true;
        const matchesCategory = categoryFilter !== "ALL" ? p.category === categoryFilter : true;
        const matchesTracking = trackingFilter !== "ALL" ? p.trackingType === trackingFilter : true;
        return matchesSearch && matchesLowStock && matchesCategory && matchesTracking;
    });

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

    const calculateMargin = (sale: number, cost: number) => {
        if (sale <= 0) return 0;
        return (((sale - cost) / sale) * 100).toFixed(0);
    };

    const formatCategory = (cat: string) => cat.replace(/_/g, " ");

    return (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            {/* ... Keep your existing Search & Filter Bar exactly as is ... */}
            
            <div className="overflow-x-auto min-h-100">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-white text-[10px] uppercase font-bold text-slate-400 tracking-wider border-b border-slate-100">
                        <tr>
                            <th className="px-4 py-4">Code</th>
                            <th className="px-4 py-4 whitespace-nowrap">Product</th>
                            <th className="px-4 py-4 whitespace-nowrap">Type & Tracking</th>
                            <th className="px-4 py-4 whitespace-nowrap">Sale Price</th>
                            <th className="px-4 py-4 whitespace-nowrap">Unit Cost</th>
                            <th className="px-4 py-4 whitespace-nowrap text-center">Stock On Hand</th>
                            <th className="px-4 py-4 whitespace-nowrap text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {paginatedProducts.length > 0 ? (
                            paginatedProducts.map((product) => {
                                const isWater = product.name.toLowerCase().includes("water");
                                const isLowStock = product.stockOnHand <= product.lowStockThreshold;

                                return (
                                    <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="px-4 py-4 text-center text-xs font-bold">{product.sku}</td>
                                        
                                        {/* Item & SKU */}
                                        <td className="px-4 py-4 flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-xl bg-sky-50 flex items-center justify-center shrink-0">
                                                {isWater ? <Droplets className="h-5 w-5 text-sky-500" /> : <Package className="h-5 w-5 text-sky-500" />}
                                            </div>
                                            <div><p className="font-bold text-slate-900">{product.name}</p></div>
                                        </td>

                                        {/* Type, Tracking & Recipe */}
                                        <td className="px-4 py-4">
                                            <div className="flex flex-wrap items-center gap-2">
                                                {product.trackingType === "RETURNABLE" ? (
                                                    <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-100">Returnable</span>
                                                ) : (
                                                    <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold border border-slate-200">Outright</span>
                                                )}
                                                <span className="px-2.5 py-1 rounded-full bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                                                    {formatCategory(product.category)}
                                                </span>
                                                {product.hasRecipe && (
                                                    <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-100 flex items-center gap-1">
                                                        <Network className="h-3 w-3" /> Recipe
                                                    </span>
                                                )}
                                            </div>
                                        </td>

                                        <td className="px-4 py-4 font-bold text-slate-900">
                                            Rs {product.salePrice.toLocaleString("en-PK", { minimumFractionDigits: 2 })}
                                        </td>

                                        <td className="px-4 py-4">
                                            <p className="text-sm font-medium text-slate-500">
                                                Rs {product.unitCost.toLocaleString("en-PK", { minimumFractionDigits: 2 })}
                                            </p>
                                            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 mt-0.5">
                                                <TrendingUp className="h-3 w-3" /> ~{calculateMargin(product.salePrice, product.unitCost)}% margin
                                            </div>
                                        </td>

                                        <td className="px-4 py-4 text-center">
                                            <p className={`text-base font-bold ${isLowStock ? "text-rose-600" : "text-slate-900"}`}>
                                                {product.stockOnHand.toLocaleString("en-PK")}
                                            </p>
                                            {isLowStock && (
                                                <div className="flex items-center justify-center gap-1 text-[10px] font-medium text-rose-500 mt-0.5">
                                                    <AlertCircle className="h-3 w-3" /> Low stock
                                                </div>
                                            )}
                                        </td>

                                        {/* Actions */}
                                        <td className="px-4 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1 transition-opacity">
                                                {/* Edit Navigation */}
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon-sm" 
                                                    onClick={() => router.push(`/manage/products/edit-item/${product.id}`)}
                                                    className="text-slate-400 hover:text-sky-600 h-8 w-8 rounded-lg"
                                                >
                                                    <Pen className="h-4 w-4" />
                                                </Button>

                                                {/* Delete Button (Owner Only) */}
                                                {isOwner && (
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon-sm" 
                                                        onClick={() => setProductToDelete(product)}
                                                        className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 h-8 w-8 rounded-lg"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                {/* ... Keep your empty state as is ... */}
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* ... Keep Pagination Footer as is ... */}

            {/* Confirmation Alert Dialog */}
            <AlertDialog open={!!productToDelete} onOpenChange={(open) => !open && setProductToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete <span className="font-bold text-slate-900">{productToDelete?.name}</span> from your branch inventory. This action cannot be undone and will remove it from all associated recipes.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <Button 
                            variant="destructive" 
                            onClick={confirmDelete} 
                            disabled={isDeleting}
                        >
                            {isDeleting ? <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Deleting...</> : "Yes, delete item"}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}