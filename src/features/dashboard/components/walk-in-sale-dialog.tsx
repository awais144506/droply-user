"use client";

import { useState, useMemo } from "react";
import { Loader2, Plus, Minus, Printer, Ban, Receipt, CheckCircle, ShoppingBag, ArrowLeft } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// MOCK DATA (Replace with your actual API hooks)
const MOCK_PRODUCTS = [
  { id: "p1", name: "19L Mineral Water Bottle", price: 250, stock: 45 },
  { id: "p2", name: "1.5L Water (Pack of 6)", price: 400, stock: 20 },
  { id: "p3", name: "500ml Water (Pack of 24)", price: 800, stock: 15 },
  { id: "p4", name: "Water Dispenser (Top Load)", price: 15000, stock: 5 },
];

const MOCK_RECENT_SALES = [
  { id: "INV-0912", time: "10 mins ago", items: 2, total: 500, status: "COMPLETED" },
  { id: "INV-0911", time: "45 mins ago", items: 1, total: 800, status: "COMPLETED" },
  { id: "INV-0910", time: "2 hours ago", items: 3, total: 2100, status: "VOIDED" },
];

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export default function WalkInSaleDialog({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [activeTab, setActiveTab] = useState("new-sale");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State for the Print Receipt overlay
  const [receiptData, setReceiptData] = useState<any>(null);

  // --- CART LOGIC ---
  const handleUpdateQuantity = (product: any, delta: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        const newQuantity = existing.quantity + delta;
        if (newQuantity <= 0) return prev.filter(item => item.id !== product.id); // Remove if 0
        return prev.map(item => item.id === product.id ? { ...item, quantity: newQuantity } : item);
      }
      if (delta > 0) {
        return [...prev, { id: product.id, name: product.name, price: product.price, quantity: 1 }];
      }
      return prev;
    });
  };

  const getQuantity = (id: string) => cart.find(item => item.id === id)?.quantity || 0;
  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + (item.price * item.quantity), 0), [cart]);

  // --- ACTIONS ---
  const handleFinalizeSale = () => {
    if (cart.length === 0) return;
    setIsSubmitting(true);

    // Simulate API Call to create sale
    setTimeout(() => {
      setIsSubmitting(false);
      // Capture data for receipt before clearing cart
      setReceiptData({
        invoiceNo: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toLocaleString(),
        items: [...cart],
        total: cartTotal
      });
      setCart([]); // Clear cart for next sale
      toast.success("Sale completed successfully!");
    }, 800);
  };

  const handleVoidSale = (invoiceId: string) => {
    toast.error(`Sale ${invoiceId} has been voided. Stock returned.`, {
      icon: <Ban className="h-4 w-4 text-rose-500" />
    });
    // Call your API here to void the transaction
  };

  const handlePrintReceipt = () => {
    // Trigger actual browser print or thermal printer integration
    window.print(); 
  };

  const resetAndClose = () => {
    setCart([]);
    setReceiptData(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) resetAndClose();
    }}>
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden bg-slate-50">
        
        {/* --- RECEIPT / PRINT VIEW (Shows after successful sale or when clicking Reprint) --- */}
        {receiptData ? (
          <div className="p-8 flex flex-col items-center justify-center min-h-[400px] bg-white text-center">
            <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-1">Sale Finalized!</h2>
            <p className="text-slate-500 mb-6">Invoice {receiptData.invoiceNo} • Total: Rs {receiptData.total.toLocaleString()}</p>
            
            <div className="w-full max-w-sm bg-slate-50 border border-slate-100 rounded-lg p-4 mb-8 text-left text-sm font-mono shadow-inner print-area">
              <div className="text-center font-bold mb-4 border-b border-slate-200 pb-2">DROPLY EXPRESS</div>
              {receiptData.items.map((item: CartItem) => (
                <div key={item.id} className="flex justify-between mb-1.5">
                  <span>{item.quantity}x {item.name.substring(0, 15)}...</span>
                  <span>Rs {item.price * item.quantity}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold mt-4 pt-2 border-t border-slate-200">
                <span>TOTAL</span>
                <span>Rs {receiptData.total.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full max-w-sm">
              <Button variant="outline" className="flex-1" onClick={() => setReceiptData(null)}>
                <ArrowLeft className="h-4 w-4 mr-2" /> New Sale
              </Button>
              <Button className="flex-1 bg-sky-600 hover:bg-sky-700 text-white" onClick={handlePrintReceipt}>
                <Printer className="h-4 w-4 mr-2" /> Print Receipt
              </Button>
            </div>
          </div>
        ) : (
          
          /* --- MAIN WALK-IN SALE INTERFACE --- */
          <>
            <DialogHeader className="p-6 pb-2 bg-white border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-sky-100 text-sky-700 rounded-lg shrink-0">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <div>
                  <DialogTitle className="text-xl">Walk-in Sale</DialogTitle>
                  <DialogDescription>Quick over-the-counter transaction.</DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="px-6 pt-3 bg-white border-b border-slate-100">
                <TabsList className="grid w-full max-w-xs grid-cols-2">
                  <TabsTrigger value="new-sale">New Sale</TabsTrigger>
                  <TabsTrigger value="recent">Recent History</TabsTrigger>
                </TabsList>
              </div>

              {/* TAB 1: NEW SALE */}
              <TabsContent value="new-sale" className="m-0 focus-visible:outline-none">
                <div className="p-6 max-h-[50vh] overflow-y-auto space-y-3">
                  {MOCK_PRODUCTS.map((product) => {
                    const qty = getQuantity(product.id);
                    return (
                      <div key={product.id} className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${qty > 0 ? 'bg-sky-50/50 border-sky-200' : 'bg-white border-slate-200'}`}>
                        <div>
                          <h4 className="font-semibold text-slate-900 text-sm">{product.name}</h4>
                          <p className="text-sky-600 font-bold text-sm mt-0.5">Rs {product.price}</p>
                        </div>
                        
                        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-lg p-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-md text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                            onClick={() => handleUpdateQuantity(product, -1)}
                            disabled={qty === 0}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-6 text-center font-bold text-slate-900">{qty}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-md text-slate-500 hover:text-sky-600 hover:bg-sky-50"
                            onClick={() => handleUpdateQuantity(product, 1)}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-6 bg-white border-t border-slate-200 flex items-center justify-between shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)]">
                  <div>
                    <p className="text-sm text-slate-500 font-medium">Grand Total</p>
                    <p className="text-3xl font-black text-slate-900">Rs {cartTotal.toLocaleString()}</p>
                  </div>
                  <Button 
                    className="h-14 px-8 text-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                    disabled={cart.length === 0 || isSubmitting}
                    onClick={handleFinalizeSale}
                  >
                    {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}
                    {isSubmitting ? "Processing..." : "Charge Cash"}
                  </Button>
                </div>
              </TabsContent>

              {/* TAB 2: RECENT SALES */}
              <TabsContent value="recent" className="m-0 p-6 max-h-[60vh] overflow-y-auto focus-visible:outline-none">
                <div className="space-y-3">
                  {MOCK_RECENT_SALES.map((sale) => (
                    <div key={sale.id} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900">{sale.id}</h4>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                            sale.status === "COMPLETED" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                          }`}>
                            {sale.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{sale.time} • {sale.items} Items • <span className="font-bold text-slate-700">Rs {sale.total.toLocaleString()}</span></p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 border-slate-200 text-slate-600 hover:text-sky-600"
                          disabled={sale.status === "VOIDED"}
                          onClick={() => {
                            // Dummy reprint logic
                            setReceiptData({ invoiceNo: sale.id, date: "Reprinted", items: [], total: sale.total });
                          }}
                        >
                          <Printer className="h-3.5 w-3.5 mr-1.5" /> Reprint
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 border-slate-200 text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200"
                          disabled={sale.status === "VOIDED"}
                          onClick={() => handleVoidSale(sale.id)}
                        >
                          <Ban className="h-3.5 w-3.5 mr-1.5" /> Void
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

            </Tabs>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}