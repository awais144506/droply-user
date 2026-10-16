/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useState, useMemo, useEffect } from "react";
import {
    Zap,
    Plus,
    Minus,
    Trash2,
    Droplets,
    PackagePlus,
    Banknote,
    CreditCard,
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
import { ReceiptOrderData } from "./thermal-receipt-dialog";

const PINNED_STORAGE_KEY = "pos_pinned_product_ids";

export interface QuickSaleProduct {
    id: string;
    name: string;
    code?: string;
    price: number;
    stock: number;
    trackingType?: string;
    lowStock?: number;
    security?: number | null;
    unit: string;
}

export interface CartItem {
    id: string;
    name: string;
    price: number;
    qty: number;
    unit?: string;
}

type Props = {
    products: QuickSaleProduct[];
    isLoading: boolean;
    onOrderComplete: (order: ReceiptOrderData) => void;
};

const ProductSelection = ({ products, isLoading, onOrderComplete }: Props) => {
    // Search & LocalStorage Pinning State
    const [searchQuery, setSearchQuery] = useState("");
    const [pinnedIds, setPinnedIds] = useState<string[]>([]);

    // Load pinned product IDs from localStorage on mount
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

    // Toggle Pin & Save to localStorage
    const togglePinProduct = (e: React.MouseEvent, productId: string) => {
        e.stopPropagation(); // Prevents adding product to cart when clicking the pin icon
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

    // Filter by Name or Code + Sort Pinned Items to Top
    const filteredAndSortedProducts = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();

        const filtered = products.filter((p) => {
            if (!q) return true;
            const matchName = p.name?.toLowerCase().includes(q);
            const matchCode = p.code?.toLowerCase().includes(q);
            return matchName || matchCode;
        });

        // Sort so pinned items always appear first
        return [...filtered].sort((a, b) => {
            const aPinned = pinnedIds.includes(a.id) ? 1 : 0;
            const bPinned = pinnedIds.includes(b.id) ? 1 : 0;
            return bPinned - aPinned;
        });
    }, [products, searchQuery, pinnedIds]);

    // POS Cart & Billing State
    const [cart, setCart] = useState<CartItem[]>([]);
    const [customerName, setCustomerName] = useState("Walk-in Customer");
    const [paymentMethod, setPaymentMethod] = useState<"CASH" | "ONLINE">("CASH");
    const [discount, setDiscount] = useState<number>(0);
    const [cashReceived, setCashReceived] = useState<string>("");

    // Custom / Misc Item Inputs
    const [customName, setCustomName] = useState("");
    const [customPrice, setCustomPrice] = useState("");

    // Add Product to Cart (with Stock Limit Guard)
    const handleAddProduct = (product: QuickSaleProduct) => {
        const isUntracked =
            product.trackingType === "UNTRACKED" ||
            product.trackingType === "NONE" ||
            product.stock === null ||
            product.stock === undefined;

        const existing = cart.find((item) => item.id === product.id);
        const currentQty = existing?.qty || 0;

        if (!isUntracked && currentQty >= product.stock) {
            toast.error(`Out of stock! Only ${product.stock} ${product.unit || "units"} available.`);
            return;
        }

        setCart((prev) => {
            if (existing) {
                return prev.map((item) =>
                    item.id === product.id ? { ...item, qty: item.qty + 1 } : item
                );
            }
            return [
                ...prev,
                {
                    id: product.id,
                    name: product.name,
                    price: Number(product.price),
                    qty: 1,
                    unit: product.unit,
                },
            ];
        });
    };

    // Add Custom Ad-hoc Item
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
            unit: "Item",
        });
        setCustomName("");
        setCustomPrice("");
    };

    // Update Item Quantity from Cart Slip (with Stock Limit Guard)
    const updateQty = (id: string, delta: number) => {
        if (delta > 0) {
            const product = products.find((p) => p.id === id);
            const inCart = cart.find((i) => i.id === id);
            const isUntracked =
                !product ||
                product.trackingType === "UNTRACKED" ||
                product.trackingType === "NONE" ||
                product.stock === null ||
                product.stock === undefined;

            if (product && !isUntracked && inCart && inCart.qty >= product.stock) {
                toast.error(`Maximum stock (${product.stock}) reached for ${product.name}`);
                return;
            }
        }

        setCart((prev) =>
            prev
                .map((item) => (item.id === id ? { ...item, qty: item.qty + delta } : item))
                .filter((item) => item.qty > 0)
        );
    };

    // Remove Item
    const removeItem = (id: string) => {
        setCart((prev) => prev.filter((item) => item.id !== id));
    };

    // Totals Calculation
    const { subTotal, grandTotal, changeDue } = useMemo(() => {
        const sub = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
        const grand = Math.max(0, sub - (discount || 0));
        const received = cashReceived ? Number(cashReceived) : grand;
        const change = Math.max(0, received - grand);
        return { subTotal: sub, grandTotal: grand, changeDue: change };
    }, [cart, discount, cashReceived]);

    // Generate Quick Sale Order
    const handleGenerateSale = () => {
        if (cart.length === 0) {
            toast.error("Please add at least one product to generate a sale.");
            return;
        }

        const receivedAmount = cashReceived ? Number(cashReceived) : grandTotal;
        if (receivedAmount < grandTotal) {
            toast.error("Cash received cannot be less than the Grand Total.");
            return;
        }

        const orderSnapshot: ReceiptOrderData = {
            receiptNumber: `QS-${Math.floor(100000 + Math.random() * 900000)}`,
            createdAt: new Date().toLocaleTimeString([], {
                year: "numeric",
                month: "short",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
            }),
            customerName: customerName.trim() || "Walk-in Customer",
            paymentMethod,
            items: [...cart],
            discount,
            subTotal,
            grandTotal,
            cashReceived: receivedAmount,
            changeDue,
        };

        onOrderComplete(orderSnapshot);

        // Reset Terminal for next customer
        setCart([]);
        setDiscount(0);
        setCashReceived("");
        setCustomerName("Walk-in Customer");
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Side: Product Selection & Custom Item Adder */}
            <div className="lg:col-span-7 space-y-5">
                <Card className="border-slate-200/90 shadow-xs rounded-2xl">
                    <CardHeader className="pb-3 border-b border-slate-100 space-y-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                <Droplets className="h-4 w-4 text-sky-600" />
                                Tap Product to Add
                            </CardTitle>
                            <span className="text-xs text-slate-400 font-medium">
                                {filteredAndSortedProducts.length} of {products.length} Products
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
                            <div className="max-h-145 overflow-y-auto pr-1 space-y-3">
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
                                                    : "border-slate-200 bg-white hover:border-sky-300 hover:bg-slate-50/60";

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
                                                    if (!isOutOfStock && (e.key === "Enter" || e.key === " ")) {
                                                        e.preventDefault();
                                                        handleAddProduct(product);
                                                    }
                                                }}
                                                className={`group relative text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between min-h-30 select-none ${cardStyles}`}
                                            >
                                                <div className="space-y-1.5 w-full">
                                                    {/* Top Row: Code + Pin Button & Cart Badge */}
                                                    <div className="flex items-start justify-between gap-1.5">
                                                        <div className="min-w-0 flex-1">
                                                            {product.code && (
                                                                <span className="block text-[10px] font-mono font-semibold text-slate-400 uppercase tracking-tight">
                                                                    {product.code}
                                                                </span>
                                                            )}
                                                            <span className="text-xs font-bold text-slate-800 line-clamp-2">
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

                                                            {/* Pin to Top Toggle Button */}
                                                            <button
                                                                type="button"
                                                                onClick={(e) => togglePinProduct(e, product.id)}
                                                                title={isPinned ? "Unpin product" : "Pin to top"}
                                                                className={`p-1 rounded-md transition-colors ${isPinned
                                                                        ? "text-sky-600 bg-sky-100/80 hover:bg-sky-200/70"
                                                                        : "text-slate-300 opacity-0 group-hover:opacity-100 hover:text-slate-600 hover:bg-slate-100"
                                                                    }`}
                                                            >
                                                                <Pin
                                                                    className={`h-3.5 w-3.5 ${isPinned ? "fill-sky-600 rotate-45" : ""
                                                                        }`}
                                                                />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Stock Indicator Badge */}
                                                    <div className="flex items-center gap-1.5">
                                                        {isUntracked ? (
                                                            <span className="inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                                                                Untracked
                                                            </span>
                                                        ) : (
                                                            <span
                                                                className={`inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded ${isOutOfStock
                                                                        ? "bg-rose-100 text-rose-700 border border-rose-200"
                                                                        : isLowStock
                                                                            ? "bg-amber-100 text-amber-800 border border-amber-300/70"
                                                                            : "bg-slate-100 text-slate-600"
                                                                    }`}
                                                            >
                                                                {(isLowStock || isOutOfStock) && (
                                                                    <AlertTriangle
                                                                        className={`h-2.5 w-2.5 ${isOutOfStock ? "text-rose-600" : "text-amber-600"
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
                                                        className={`text-sm font-extrabold ${isOutOfStock
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

            {/* Right Side: Active Bill & Generate Button */}
            <div className="lg:col-span-5">
                <Card className="border-slate-200/90 shadow-xs rounded-2xl sticky top-6">
                    <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-bold text-slate-900">
                                Current Sale Slip
                            </CardTitle>
                            <span className="text-xs font-semibold text-sky-700 bg-sky-100 px-2.5 py-0.5 rounded-full">
                                {cart.reduce((sum, i) => sum + i.qty, 0)} Items
                            </span>
                        </div>
                    </CardHeader>

                    <CardContent className="p-4 space-y-4">
                        {/* Walk-in Customer Name & Payment Method */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <label className="text-[11px] font-semibold text-slate-500 uppercase">
                                    Customer Name
                                </label>
                                <Input
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    placeholder="Walk-in Customer"
                                    className="mt-1 h-9 text-xs"
                                />
                            </div>
                            <div>
                                <label className="text-[11px] font-semibold text-slate-500 uppercase">
                                    Payment Mode
                                </label>
                                <div className="grid grid-cols-2 gap-1.5 mt-1">
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod("CASH")}
                                        className={`h-9 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border ${paymentMethod === "CASH"
                                                ? "bg-emerald-600 text-white border-emerald-600"
                                                : "bg-white text-slate-600 border-slate-200"
                                            }`}
                                    >
                                        <Banknote className="h-3.5 w-3.5" /> Cash
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod("ONLINE")}
                                        className={`h-9 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 border ${paymentMethod === "ONLINE"
                                                ? "bg-sky-600 text-white border-sky-600"
                                                : "bg-white text-slate-600 border-slate-200"
                                            }`}
                                    >
                                        <CreditCard className="h-3.5 w-3.5" /> Online
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Cart Items List */}
                        <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 max-h-[260px] overflow-y-auto">
                            {cart.length === 0 ? (
                                <div className="py-10 text-center text-xs text-slate-400">
                                    No items selected. Tap products on the left to start.
                                </div>
                            ) : (
                                cart.map((item) => (
                                    <div
                                        key={item.id}
                                        className="p-3 flex items-center justify-between gap-2 bg-white"
                                    >
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs font-bold text-slate-800 truncate">
                                                {item.name}
                                            </p>
                                            <p className="text-[11px] text-slate-500">
                                                Rs. {item.price} each
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-1.5">
                                            <button
                                                type="button"
                                                onClick={() => updateQty(item.id, -1)}
                                                className="h-7 w-7 rounded-md border border-slate-200 flex items-center justify-center hover:bg-slate-100"
                                            >
                                                <Minus className="h-3 w-3" />
                                            </button>
                                            <span className="w-7 text-center text-xs font-bold">
                                                {item.qty}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => updateQty(item.id, 1)}
                                                className="h-7 w-7 rounded-md border border-slate-200 flex items-center justify-center hover:bg-slate-100"
                                            >
                                                <Plus className="h-3 w-3" />
                                            </button>
                                        </div>

                                        <div className="w-20 text-right font-bold text-xs text-slate-900">
                                            Rs. {(item.price * item.qty).toLocaleString()}
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => removeItem(item.id)}
                                            className="text-slate-400 hover:text-rose-600 p-1"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Discount & Cash Tendered Inputs */}
                        <div className="grid grid-cols-2 gap-3 pt-1">
                            <div>
                                <label className="text-[11px] font-semibold text-slate-500 uppercase">
                                    Discount (Rs.)
                                </label>
                                <Input
                                    type="number"
                                    min={0}
                                    value={discount || ""}
                                    onChange={(e) => setDiscount(Number(e.target.value) || 0)}
                                    placeholder="0"
                                    className="mt-1 h-9 text-xs"
                                />
                            </div>
                            <div>
                                <label className="text-[11px] font-semibold text-slate-500 uppercase">
                                    Cash Received (Optional)
                                </label>
                                <Input
                                    type="number"
                                    min={0}
                                    value={cashReceived}
                                    onChange={(e) => setCashReceived(e.target.value)}
                                    placeholder={`Rs. ${grandTotal}`}
                                    className="mt-1 h-9 text-xs"
                                />
                            </div>
                        </div>

                        {/* Financial Summary Banner */}
                        <div className="bg-slate-900 text-white p-4 rounded-xl space-y-1.5">
                            <div className="flex justify-between text-xs text-slate-400">
                                <span>Subtotal</span>
                                <span>Rs. {subTotal.toLocaleString()}</span>
                            </div>
                            {discount > 0 && (
                                <div className="flex justify-between text-xs text-amber-400">
                                    <span>Discount</span>
                                    <span>- Rs. {discount.toLocaleString()}</span>
                                </div>
                            )}
                            <div className="flex justify-between items-baseline pt-1 border-t border-slate-800">
                                <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                                    Total Payable
                                </span>
                                <span className="text-xl font-extrabold text-sky-400">
                                    Rs. {grandTotal.toLocaleString()}
                                </span>
                            </div>
                            {Number(cashReceived) > grandTotal && (
                                <div className="flex justify-between text-xs text-emerald-400 pt-1">
                                    <span>Change to Return</span>
                                    <span className="font-bold">Rs. {changeDue.toLocaleString()}</span>
                                </div>
                            )}
                        </div>

                        {/* Boom: Generate Order Button */}
                        <Button
                            type="button"
                            onClick={handleGenerateSale}
                            disabled={cart.length === 0}
                            className="w-full h-12 bg-sky-600 hover:bg-sky-700 text-white font-bold text-base rounded-xl shadow-sm"
                        >
                            <Zap className="mr-2 h-5 w-5" />
                            Generate Quick Sale
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ProductSelection;