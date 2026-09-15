import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useRole } from "@/lib/hooks/use-role";
import { useDeleteProduct } from "../api/use-mutate-product";
import { usePagination } from "@/lib/utils/functions/pagination-calculation";
import { ProductList } from "../types/product";
import DataTable from "@/lib/utils/components/TableCreateMachine";
import TablePagination from "@/lib/utils/components/TablePagination";
import ConfirmDeleteDialog from "@/lib/utils/components/ConfirmDeleteItemDialog";
import { ProductsFilterBar } from "./products-filter-bar";

// 1. Import your extracted column logic
import { getProductColumns } from "./products-columns";

export function ProductsTable({ products }: { products: ProductList[] | undefined }) {
    const router = useRouter();
    const { isOwner } = useRole();
    const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct();

    // States
    const [searchQuery, setSearchQuery] = useState("");
    const [showLowStockOnly, setShowLowStockOnly] = useState(false);
    const [categoryFilter, setCategoryFilter] = useState<string>("ALL");
    const [trackingFilter, setTrackingFilter] = useState<string>("ALL");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<ProductList | null>(null);

    // Filtering Logic
    const filteredProducts = products?.filter((p) => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesLowStock = showLowStockOnly ? p.currentStock <= p.lowStockThreshold : true;
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
        deleteProduct(productToDelete.id)
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