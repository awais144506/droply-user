/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useRole } from "@/hooks/use-role";
import { useDeleteProduct } from "../api/use-products";
import { usePagination } from "@/utils/pagination-calculation";
import { ProductItem } from "../types/product-item";
import DataTable from "@/utils/data-table";
import TablePagination from "@/utils/table-pagination";
import ConfirmDeleteDialog from "@/utils/confirm-delete-dialog";
import { ProductsFilterBar } from "./products-filter-bar";

// 1. Import your extracted column logic
import { getProductColumns } from "./products-columns";

export function ProductsTable({ products }: { products: ProductItem[] }) {
    const router = useRouter();
    const { isOwner } = useRole();
    const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct();

    // States
    const [searchQuery, setSearchQuery] = useState("");
    const [showLowStockOnly, setShowLowStockOnly] = useState(false);
    const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
    const [trackingFilter, setTrackingFilter] = useState<string>("ALL");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<ProductItem | null>(null);

    // Filtering Logic
    const filteredProducts = products.filter((p) => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesLowStock = showLowStockOnly ? p.stockOnHand <= p.lowStockThreshold : true;
        const matchesCategory = categoryFilter !== "ALL" ? p.category === categoryFilter : true;
        const matchesTracking = trackingFilter !== "ALL" ? p.trackingType === trackingFilter : true;
        return matchesSearch && matchesLowStock && matchesCategory && matchesTracking;
    });

    const activeFiltersCount = (showLowStockOnly ? 1 : 0) + (categoryFilter !== "ALL" ? 1 : 0) + (trackingFilter !== "ALL" ? 1 : 0);

    const clearFilters = () => {
        setShowLowStockOnly(false);
        setCategoryFilter("ALL");
        setTrackingFilter("ALL");
        setIsFilterOpen(false);
    };

    // Pagination Hook
    const { currentPage, setCurrentPage, paginatedData, totalPages, totalItems, itemsPerPage } = usePagination(filteredProducts);

    const columns = useMemo(() =>
        getProductColumns(router, isOwner, setProductToDelete),
        [router, isOwner]);

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

    return (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <ProductsFilterBar
                searchQuery={searchQuery} setSearchQuery={setSearchQuery}
                showLowStockOnly={showLowStockOnly} setShowLowStockOnly={setShowLowStockOnly}
                categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter}
                trackingFilter={trackingFilter} setTrackingFilter={setTrackingFilter}
                clearFilters={clearFilters} activeFiltersCount={activeFiltersCount}
                isFilterOpen={isFilterOpen} setIsFilterOpen={setIsFilterOpen}
            />

            <DataTable
                data={paginatedData}
                columns={columns}
                emptyMessage="No items match your filters."
            />

            <TablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
            />

            <ConfirmDeleteDialog
                itemName={productToDelete?.name}
                isOpen={!!productToDelete}
                onClose={() => setProductToDelete(null)}
                onConfirm={confirmDelete}
                isDeleting={isDeleting}
            />
        </div>
    );
}