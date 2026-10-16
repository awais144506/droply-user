/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ReceiptOrderData } from "./thermal-receipt-dialog";
import ProductList from "./product-selection/product-list";
import ProductCart from "./product-selection/product-cart";
import {
  QuickSaleProduct,
  CartItem,
  QuickSaleRecord,
} from "../types/quicksale";

type Props = {
  branchId: string;
  staffId: string;
  products: QuickSaleProduct[];
  isLoading: boolean;
  onOrderComplete: (order: ReceiptOrderData) => void;
  editingSale?: QuickSaleRecord | null;
  onCancelEdit?: () => void;
};

const ProductSelection = ({
  branchId,
  staffId,
  products,
  isLoading,
  onOrderComplete,
  editingSale,
  onCancelEdit,
}: Props) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Hydrate cart automatically when user clicks "Edit" on a receipt in QuickSaleHistory
  useEffect(() => {
    if (editingSale) {
      const hydratedItems: CartItem[] = editingSale.items.map((item) => ({
        id: item.productId || `custom-${item.id}`,
        name: item.itemName,
        price: Number(item.unitPrice),
        qty: Number(item.quantity),
        unit: item.unit,
      }));
      setCart(hydratedItems);
    } else {
      setCart([]);
    }
  }, [editingSale]);

  // Add Product to Cart (with Stock Limit Guard that accounts for Edit Mode)
  const handleAddProduct = (product: QuickSaleProduct) => {
    const isUntracked =
      product.trackingType === "UNTRACKED" ||
      product.trackingType === "NONE" ||
      product.stock === null ||
      product.stock === undefined;

    // If editing an existing sale, include the quantity already on that receipt in available stock
    const originalQtyInReceipt =
      editingSale?.items.find((i) => i.productId === product.id)?.quantity || 0;
    const effectiveMaxStock = Number(product.stock) + Number(originalQtyInReceipt);

    const existing = cart.find((item) => item.id === product.id);
    const currentQty = existing?.qty || 0;

    if (!isUntracked && currentQty >= effectiveMaxStock) {
      toast.error(
        `Out of stock! Only ${effectiveMaxStock} ${product.unit || "units"} available.`
      );
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left 7 Columns: Product Catalog & Custom Item Box */}
      <div className="lg:col-span-7">
        <ProductList
          products={products}
          isLoading={isLoading}
          handleAddProduct={handleAddProduct}
          cart={cart}
        />
      </div>

      {/* Right 5 Columns: Active Cart Slip & Backend Checkout */}
      <div className="lg:col-span-5">
        <ProductCart
          branchId={branchId}
          staffId={staffId}
          cart={cart}
          setCart={setCart}
          products={products}
          onOrderComplete={onOrderComplete}
          editingSale={editingSale}
          onCancelEdit={onCancelEdit}
        />
      </div>
    </div>
  );
};

export default ProductSelection;