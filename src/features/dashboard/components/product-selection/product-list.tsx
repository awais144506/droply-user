/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useState, useMemo, useEffect } from "react";
import {
  Plus,
  Droplets,
  PackagePlus,
  Loader2,
  AlertTriangle,
  Search,
  Pin,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuickSaleProduct, CartItem } from "../../types/quicksale";

type Props = {
  products: QuickSaleProduct[];
  isLoading: boolean;
  cart: CartItem[];
  handleAddProduct: (product: QuickSaleProduct) => void;
};

const PINNED_STORAGE_KEY = "pos_pinned_product_ids";

const ProductList = ({ products, isLoading, handleAddProduct, cart }: Props) => {
  const [pinnedIds, setPinnedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [customName, setCustomName] = useState("");
  const [customPrice, setCustomPrice] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(PINNED_STORAGE_KEY);
      if (saved) {
        setPinnedIds(JSON.parse(saved));
      }
    } catch (err) {
      console.error("Failed to read pinned products from localStorage", err);
    }
  }, []);

  const togglePinProduct = (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();
    setPinnedIds((prev) => {
      const isAlreadyPinned = prev.includes(productId);
      const updated = isAlreadyPinned
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];

      try {
        localStorage.setItem(PINNED_STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error("Failed to save pinned products", err);
      }
      return updated;
    });
  };

  const filteredAndSortedProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const filtered = products.filter((p) => {
      if (!q) return true;
      const matchName = p.name?.toLowerCase().includes(q);
      const matchCode = p.code?.toLowerCase().includes(q);
      return matchName || matchCode;
    });

    return [...filtered].sort((a, b) => {
      const aPinned = pinnedIds.includes(a.id) ? 1 : 0;
      const bPinned = pinnedIds.includes(b.id) ? 1 : 0;
      return bPinned - aPinned;
    });
  }, [products, searchQuery, pinnedIds]);

  const handleAddCustomItem = () => {
    const priceNum = Number(customPrice);
    if (!customName.trim() || !priceNum || priceNum <= 0) {
      toast.error("Enter a valid item name and price");
      return;
    }
    handleAddProduct({
      id: `custom-${Date.now()}`,
      name: customName.trim(),
      price: priceNum,
      stock: 999999,
      trackingType: "UNTRACKED",
      unit: "PIECE",
    });
    setCustomName("");
    setCustomPrice("");
  };

  return (
    <div className="space-y-5">
      {/* Main Product Grid Card */}
      <Card className="border-slate-200/90 shadow-xs rounded-2xl">
        <CardHeader className="pb-3 border-b border-slate-100 space-y-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Droplets className="h-4 w-4 text-sky-600" />
              Tap Product to Add
            </CardTitle>
            <span className="text-xs text-slate-400 font-medium">
              Total Items: {products.length}
            </span>
          </div>

          {/* Search Bar by Name or Product Code */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by product name or code (e.g. PRD-001)..."
              className="pl-9 pr-8 h-9 text-xs bg-slate-50/70 border-slate-200 focus:bg-white"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-4">
          {isLoading ? (
            <div className="py-16 flex flex-col items-center justify-center text-slate-400 gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-sky-600" />
              <span className="text-xs font-medium">Loading branch products...</span>
            </div>
          ) : filteredAndSortedProducts.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              {searchQuery
                ? `No products matching "${searchQuery}".`
                : "No products found in this branch catalog."}
            </div>
          ) : (
            <div className="max-h-135 overflow-y-auto p-1">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {filteredAndSortedProducts.map((product) => {
                  const inCart = cart.find((i) => i.id === product.id);
                  const inCartQty = inCart?.qty || 0;
                  const isPinned = pinnedIds.includes(product.id);

                  const isUntracked =
                    product.trackingType === "UNTRACKED" ||
                    product.trackingType === "NONE" ||
                    product.stock === null ||
                    product.stock === undefined;

                  const remainingStock = isUntracked
                    ? Infinity
                    : Math.max(0, product.stock - inCartQty);
                  const isOutOfStock = !isUntracked && remainingStock <= 0;
                  const isLowStock =
                    !isUntracked &&
                    !isOutOfStock &&
                    product.lowStock !== undefined &&
                    remainingStock <= product.lowStock;

                  const cardStyles = isOutOfStock
                    ? "border-rose-400 bg-rose-50/70 ring-1 ring-rose-400 cursor-not-allowed opacity-90"
                    : isLowStock
                    ? inCart
                      ? "border-amber-500 bg-amber-50/80 ring-1 ring-amber-500"
                      : "border-amber-300 bg-amber-50/40 hover:border-amber-400"
                    : inCart
                    ? "border-sky-500 bg-sky-50/70 ring-1 ring-sky-500"
                    : "border-slate-300 bg-white hover:border-sky-300 hover:bg-slate-50/60";

                  const qtyBadgeStyles = isOutOfStock
                    ? "bg-rose-600 text-white"
                    : isLowStock
                    ? "bg-amber-600 text-white"
                    : "bg-sky-600 text-white";

                  return (
                    <div
                      key={product.id}
                      role="button"
                      tabIndex={isOutOfStock ? -1 : 0}
                      onClick={() => !isOutOfStock && handleAddProduct(product)}
                      onKeyDown={(e) => {
                        if (
                          !isOutOfStock &&
                          (e.key === "Enter" || e.key === " ")
                        ) {
                          e.preventDefault();
                          handleAddProduct(product);
                        }
                      }}
                      className={`group cursor-pointer relative text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between min-h-30 select-none ${cardStyles}`}
                    >
                      <div className="space-y-1.5 w-full">
                        <div className="flex items-start justify-between gap-1.5">
                          <div className="min-w-0 flex-1">
                            {product.code && (
                              <span className="block text-[12px] font-mono font-semibold text-slate-700 uppercase tracking-tight">
                                {product.code}
                              </span>
                            )}
                            <span className="text-sm font-bold text-slate-900 line-clamp-2">
                              {product.name}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            {inCart && (
                              <span
                                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${qtyBadgeStyles}`}
                              >
                                x{inCart.qty}
                              </span>
                            )}

                            <button
                              type="button"
                              onClick={(e) => togglePinProduct(e, product.id)}
                              title={isPinned ? "Unpin product" : "Pin to top"}
                              className={`p-1 rounded-md transition-colors ${
                                isPinned
                                  ? "text-sky-600 bg-sky-100/80 hover:bg-sky-200/70"
                                  : "text-slate-500 opacity-0 group-hover:opacity-100 hover:text-slate-600 hover:bg-slate-100"
                              }`}
                            >
                              <Pin
                                className={`h-3.5 w-3.5 ${
                                  isPinned ? "fill-sky-600 rotate-45" : ""
                                }`}
                              />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {isUntracked ? (
                            <span className="inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                              Untracked
                            </span>
                          ) : (
                            <span
                              className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                                isOutOfStock
                                  ? "bg-rose-100 text-rose-700 border border-rose-200"
                                  : isLowStock
                                  ? "bg-amber-100 text-amber-800 border border-amber-300/70"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {(isLowStock || isOutOfStock) && (
                                <AlertTriangle
                                  className={`h-2.5 w-2.5 ${
                                    isOutOfStock
                                      ? "text-rose-600"
                                      : "text-amber-600"
                                  }`}
                                />
                              )}
                              {isOutOfStock
                                ? "Out of Stock (0)"
                                : `Stock: ${remainingStock}`}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-100/80 flex items-baseline justify-between w-full">
                        <span
                          className={`text-sm font-extrabold ${
                            isOutOfStock
                              ? "text-rose-700"
                              : isLowStock
                              ? "text-amber-700"
                              : "text-sky-700"
                          }`}
                        >
                          Rs. {Number(product.price).toLocaleString()}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          /{product.unit || "Unit"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Other / Custom Item Card */}
      <Card className="border-slate-200/90 shadow-xs rounded-2xl">
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <PackagePlus className="h-4 w-4 text-sky-600" />
            Add Custom / Other Item
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              placeholder="Item description (e.g. Tap Valve Replacement)"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="flex-1"
            />
            <Input
              type="number"
              placeholder="Price (Rs.)"
              value={customPrice}
              onChange={(e) => setCustomPrice(e.target.value)}
              className="w-full sm:w-36"
            />
            <Button
              type="button"
              onClick={handleAddCustomItem}
              className="bg-slate-900 hover:bg-slate-800 text-white shrink-0"
            >
              <Plus className="h-4 w-4 mr-1" /> Add Item
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductList;