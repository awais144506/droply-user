/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";
import { useState, useMemo, useEffect, Dispatch, SetStateAction } from "react";
import {
  Zap,
  Plus,
  Minus,
  Trash2,
  Banknote,
  CreditCard,
  Loader2,
  FileEdit,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  QuickSaleProduct,
  CartItem,
  QuickSaleRecord,
  CreateQuickSalePayload,
} from "../../types/quicksale";
import { ReceiptOrderData } from "../thermal-receipt-dialog";
import {
  useCreateQuickSale,
  useUpdateQuickSale,
} from "../../api/use-mutate-quicksale";
import { quickSaleSchema } from "../../schema/quicksale-schema";

type Props = {
  branchId: string;
  staffId: string;
  cart: CartItem[];
  setCart: Dispatch<SetStateAction<CartItem[]>>;
  products: QuickSaleProduct[];
  onOrderComplete: (order: ReceiptOrderData) => void;
  editingSale?: QuickSaleRecord | null;
  onCancelEdit?: () => void;
};

const ProductCart = ({
  branchId,
  staffId,
  cart,
  setCart,
  products,
  onOrderComplete,
  editingSale,
  onCancelEdit,
}: Props) => {
  const [customerName, setCustomerName] = useState("Walk-in Customer");
  const [customerPhone, setCustomerPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "ONLINE">("CASH");
  const [discount, setDiscount] = useState<number>(0);
  const [cashReceived, setCashReceived] = useState<string>("");

  // API Mutations
  const createMutation = useCreateQuickSale();
  const updateMutation = useUpdateQuickSale();
  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  // Populate form fields if editing an existing receipt
  useEffect(() => {
    if (editingSale) {
      setCustomerName(editingSale.customerName || "Walk-in Customer");
      setCustomerPhone(editingSale.customerPhone || "");
      setPaymentMethod(editingSale.paymentMethod || "CASH");
      setDiscount(Number(editingSale.discount || 0));
      setCashReceived(
        editingSale.cashReceived ? String(editingSale.cashReceived) : ""
      );
    } else {
      setCustomerName("Walk-in Customer");
      setPaymentMethod("CASH");
      setDiscount(0);
      setCashReceived("");
      setCustomerPhone("");
    }
  }, [editingSale]);

  // Helper to get max allowed stock (including quantity already on receipt during edit)
  const getMaxAllowedStock = (productId: string, product?: QuickSaleProduct) => {
    if (!product) return Infinity;
    const origQty =
      editingSale?.items.find((i) => i.productId === productId)?.quantity || 0;
    return Number(product.stock) + Number(origQty);
  };

  // 1. Increment / Decrement by Button (+ / -)
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

      const maxStock = getMaxAllowedStock(id, product);
      if (product && !isUntracked && inCart && inCart.qty >= maxStock) {
        toast.error(`Maximum stock (${maxStock}) reached for ${product.name}`);
        return;
      }
    }

    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, qty: item.qty + delta } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  // 2. Direct Editable Quantity Input Handler
  const handleDirectQtyChange = (id: string, rawValue: string) => {
    if (rawValue === "") {
      setCart((prev) =>
        prev.map((item) => (item.id === id ? { ...item, qty: 0 } : item))
      );
      return;
    }

    const parsedQty = parseInt(rawValue, 10);
    if (isNaN(parsedQty) || parsedQty < 0) return;

    const product = products.find((p) => p.id === id);
    const isUntracked =
      !product ||
      product.trackingType === "UNTRACKED" ||
      product.trackingType === "NONE" ||
      product.stock === null ||
      product.stock === undefined;

    const maxStock = getMaxAllowedStock(id, product);

    if (product && !isUntracked && parsedQty > maxStock) {
      toast.error(
        `Only ${maxStock} ${product.unit || "units"} available for ${product.name}`
      );
      setCart((prev) =>
        prev.map((item) => (item.id === id ? { ...item, qty: maxStock } : item))
      );
      return;
    }

    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, qty: parsedQty } : item))
    );
  };

  const handleQtyBlur = (id: string, currentQty: number) => {
    if (!currentQty || currentQty <= 0) {
      setCart((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const removeItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // Totals Calculation
  const { subTotal, grandTotal, changeDue } = useMemo(() => {
    const sub = cart.reduce(
      (sum, item) => sum + item.price * (item.qty || 0),
      0
    );
    const grand = Math.max(0, sub - (discount || 0));
    const received = cashReceived ? Number(cashReceived) : grand;
    const change = Math.max(0, received - grand);
    return { subTotal: sub, grandTotal: grand, changeDue: change };
  }, [cart, discount, cashReceived]);

  // Submit Quick Sale (Create or Update in NestJS Backend)
  const handleGenerateSale = async () => {
    const validCart = cart.filter((item) => item.qty > 0);
    if (validCart.length === 0) {
      toast.error("Please add at least one product to generate a sale.");
      return;
    }

    const receivedAmount = cashReceived ? Number(cashReceived) : grandTotal;

    const payload: CreateQuickSalePayload = {
      branchId,
      staffId,
      customerName: customerName.trim() || "Walk-in Customer",
      customerPhone: customerPhone.trim(),
      paymentMethod,
      subTotal,
      discount: Number(discount || 0),
      totalAmount: grandTotal,
      cashReceived: receivedAmount,
      changeDue,
      items: validCart.map((item) => ({
        // Custom ad-hoc items send productId: null so Prisma doesn't fail foreign key checks
        productId: item.id.startsWith("custom-") ? null : item.id,
        itemName: item.name,
        unit: item.unit && item.unit !== "Item" && item.unit !== "Unit" ? item.unit : "PIECE",
        quantity: Number(item.qty),
        unitPrice: Number(item.price),
        subtotal: Number(item.price) * Number(item.qty),
      })),
    };

    try {
      // 1. Validate with Yup Schema first
      await quickSaleSchema.validate(payload, { abortEarly: false });

      // 2. Execute Create or Update Mutation
      const savedRecord = editingSale
        ? await updateMutation.mutateAsync({
          id: editingSale.id,
          payload,
        })
        : await createMutation.mutateAsync(payload);

      // 3. Build Thermal Receipt Snapshot from Real Database Record
      const orderSnapshot: ReceiptOrderData = {
        receiptNumber: savedRecord.receiptNumber,
        createdAt: new Date(savedRecord.createdAt).toLocaleTimeString([], {
          year: "numeric",
          month: "short",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }),
        customerName: savedRecord.customerName,
        customerPhone: savedRecord.customerPhone || "",
        paymentMethod: savedRecord.paymentMethod,
        items: savedRecord.items.map((i) => ({
          id: i.id,
          name: i.itemName,
          qty: i.quantity,
          price: i.unitPrice,
          unit: i.unit,
        })),
        discount: savedRecord.discount,
        subTotal: savedRecord.subTotal,
        grandTotal: savedRecord.totalAmount,
        cashReceived: savedRecord.cashReceived ?? savedRecord.totalAmount,
        changeDue: savedRecord.changeDue ?? 0,
      };

      onOrderComplete(orderSnapshot);

      // 4. Reset Terminal (and exit edit mode if active)
      setCart([]);
      setDiscount(0);
      setCashReceived("");
      setCustomerName("Walk-in Customer");
      setCustomerPhone("");
      if (editingSale && onCancelEdit) {
        onCancelEdit();
      }
    } catch (err: any) {
      if (err?.name === "ValidationError") {
        toast.error(err.errors?.[0] || "Invalid sale details");
      }
    }
  };

  return (
    <Card
      className={`shadow-xs rounded-2xl sticky top-6 transition-colors ${editingSale
        ? "border-amber-400 ring-1 ring-amber-400"
        : "border-slate-200/90"
        }`}
    >
      <CardHeader
        className={`pb-3 border-b rounded-t-2xl ${editingSale
          ? "bg-amber-50/80 border-amber-200"
          : "bg-slate-50/50 border-slate-100"
          }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {editingSale && <FileEdit className="h-4 w-4 text-amber-600" />}
            <CardTitle className="text-sm font-bold text-slate-900">
              {editingSale
                ? `Editing Receipt #${editingSale.receiptNumber}`
                : "Current Sale Slip"}
            </CardTitle>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-sky-700 bg-sky-100 px-2.5 py-0.5 rounded-full">
              {cart.reduce((sum, i) => sum + (i.qty || 0), 0)} Items
            </span>
            {editingSale && onCancelEdit && (
              <button
                type="button"
                onClick={onCancelEdit}
                className="text-xs font-semibold text-amber-800 hover:text-amber-950 bg-amber-200/60 px-2 py-0.5 rounded-md flex items-center gap-1"
              >
                <X className="h-3 w-3" /> Cancel
              </button>
            )}
          </div>
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
              Customer Phone
            </label>
            <Input
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              placeholder="e.g 03001234567"
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
        <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 max-h-65 overflow-y-auto">
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

                {/* Minus Button + Direct Editable Quantity Input + Plus Button */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => updateQty(item.id, -1)}
                    className="h-7 w-7 rounded-md border border-slate-200 flex items-center justify-center hover:bg-slate-100 shrink-0"
                  >
                    <Minus className="h-3 w-3" />
                  </button>

                  <input
                    type="number"
                    min={1}
                    value={item.qty === 0 ? "" : item.qty}
                    onChange={(e) =>
                      handleDirectQtyChange(item.id, e.target.value)
                    }
                    onBlur={() => handleQtyBlur(item.id, item.qty)}
                    className="h-7 w-12 text-center text-xs font-bold border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />

                  <button
                    type="button"
                    onClick={() => updateQty(item.id, 1)}
                    className="h-7 w-7 rounded-md border border-slate-200 flex items-center justify-center hover:bg-slate-100 shrink-0"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>

                <div className="w-20 text-right font-bold text-xs text-slate-900">
                  Rs. {(item.price * (item.qty || 0)).toLocaleString()}
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

        {/* Submit Button */}
        <Button
          type="button"
          onClick={handleGenerateSale}
          disabled={cart.length === 0 || isSubmitting}
          className={`w-full h-12 text-white font-bold text-base rounded-xl shadow-sm ${editingSale
            ? "bg-amber-600 hover:bg-amber-700"
            : "bg-sky-600 hover:bg-sky-700"
            }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              {editingSale ? "Updating Receipt..." : "Saving Sale..."}
            </>
          ) : (
            <>
              <Zap className="mr-2 h-5 w-5" />
              {editingSale ? "Update Quick Sale" : "Generate Quick Sale"}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCart;