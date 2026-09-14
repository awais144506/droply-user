// /* eslint-disable react-hooks/set-state-in-effect */
// "use client";

// import { useState, useEffect } from "react";
// import { Printer, ShoppingCart, History, Ban } from "lucide-react";
// import { toast } from "sonner";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";

// export interface StockItem {
//   id: string;
//   name: string;
//   price: number;
//   currentStock: number;
// }

// interface SaleRecord {
//   id: string;
//   itemName: string;
//   quantity: number;
//   total: number;
//   time: string;
//   status: "COMPLETED" | "VOIDED";
// }

// export function QuickSale({ items = [] }: { items: StockItem[] }) {
//   const [activeTab, setActiveTab] = useState<"NEW" | "HISTORY">("NEW");
//   const [selectedItemId, setSelectedItemId] = useState<string>(items[0]?.id || "");
//   const [quantity, setQuantity] = useState<number>(1);
  
//   const [slipToPrint, setSlipToPrint] = useState<SaleRecord | null>(null);
  
//   const [salesHistory, setSalesHistory] = useState<SaleRecord[]>([
//     { id: "QS-9042", itemName: "19L Bottle Refill", quantity: 2, total: 400, time: "05:15 PM", status: "COMPLETED" },
//     { id: "QS-9041", itemName: "1.5L PET Carton (12x)", quantity: 1, total: 850, time: "03:30 PM", status: "COMPLETED" },
//   ]);

//   // Ensure selected item updates if items load asynchronously
//   useEffect(() => {
//     if (!selectedItemId && items.length > 0) {
//       setSelectedItemId(items[0].id);
//     }
//   }, [items, selectedItemId]);

//   const selectedItem = items.find(i => i.id === selectedItemId);
//   const currentTotal = (selectedItem?.price || 0) * quantity;

//   const handlePrintNew = () => {
//     if (!selectedItem) return;
    
//     const newSale: SaleRecord = {
//       id: `QS-${Math.floor(1000 + Math.random() * 9000)}`,
//       itemName: selectedItem.name,
//       quantity,
//       total: currentTotal,
//       time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
//       status: "COMPLETED"
//     };
    
//     setSalesHistory([newSale, ...salesHistory]);
//     setSlipToPrint(newSale);
    
//     setTimeout(() => {
//       window.print();
//       setQuantity(1);
//     }, 100);
//     toast.success("Transaction saved. Printing receipt...");
//   };

//   const handleReprint = (sale: SaleRecord) => {
//     setSlipToPrint(sale);
//     setTimeout(() => {
//       window.print();
//     }, 100);
//     toast.success(`Reprinting slip ${sale.id}...`);
//   };

//   const handleVoidSlip = (id: string) => {
//     setSalesHistory(prev => prev.map(sale => 
//       sale.id === id ? { ...sale, status: "VOIDED" } : sale
//     ));
//     toast.success(`Slip ${id} voided. Stock deduction reversed.`);
//   };

//   return (
//     <>
//       <style dangerouslySetInnerHTML={{ __html: `
//         @media print {
//           body * { visibility: hidden; }
//           #thermal-receipt, #thermal-receipt * { visibility: visible; }
//           #thermal-receipt {
//             position: absolute; left: 0; top: 0; width: 80mm; padding: 0; margin: 0;
//           }
//         }
//       `}} />

//       <div className="bg-white rounded-2xl border border-slate-200 shadow-sm print:hidden flex flex-col h-full overflow-hidden">
        
//         {/* Header Tabs */}
//         <div className="flex border-b border-slate-100 bg-slate-50/50">
//           <button 
//             onClick={() => setActiveTab("NEW")}
//             className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === "NEW" ? "bg-white text-sky-600 border-b-2 border-sky-600" : "text-slate-500 hover:text-slate-700"}`}
//           >
//             <ShoppingCart className="h-4 w-4" /> New Sale
//           </button>
//           <button 
//             onClick={() => setActiveTab("HISTORY")}
//             className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === "HISTORY" ? "bg-white text-sky-600 border-b-2 border-sky-600" : "text-slate-500 hover:text-slate-700"}`}
//           >
//             <History className="h-4 w-4" /> Recent Slips
//           </button>
//         </div>

//         <div className="p-6 flex-1 flex flex-col overflow-hidden">
//           {activeTab === "NEW" ? (
//             <div className="flex flex-col h-full">
//               <div className="space-y-4 flex-1">
                
//                 {/* 🔥 Custom UI Select Component */}
//                 <div>
//                   <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Select Item</label>
//                   <div className="mt-1.5">
//                     <Select value={selectedItemId} onValueChange={setSelectedItemId}>
//                       <SelectTrigger className="w-full h-10 rounded-xl bg-slate-50 border-slate-200 focus:ring-2 focus:ring-sky-500/20 shadow-none">
//                         <SelectValue placeholder="Select product to sell" />
//                       </SelectTrigger>
//                       <SelectContent className="rounded-xl border-slate-200 shadow-lg">
//                         {items.map(item => (
//                           <SelectItem key={item.id} value={item.name} className="cursor-pointer rounded-lg">
//                             {item.name} <span className="text-slate-400 ml-1">(Rs {item.price})</span>
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>

//                 {/* 🔥 Custom UI Input Component */}
//                 <div>
//                   <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Quantity</label>
//                   <Input 
//                     type="number" 
//                     min={1} 
//                     max={100} 
//                     value={quantity} 
//                     onChange={(e) => setQuantity(Number(e.target.value))}
//                     className="w-full h-10 mt-1.5 rounded-xl border-slate-200 bg-slate-50 text-sm focus-visible:ring-sky-500/20 shadow-none font-medium"
//                   />
//                 </div>
//               </div>

//               <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
//                 <div>
//                   <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Due</p>
//                   <p className="text-2xl font-bold text-slate-900">Rs {currentTotal.toLocaleString()}</p>
//                 </div>
//                 <Button 
//                   onClick={handlePrintNew} 
//                   disabled={!selectedItem}
//                   className="bg-slate-900 hover:bg-slate-800 text-white h-12 px-6 rounded-xl shadow-md cursor-pointer"
//                 >
//                   <Printer className="h-4 w-4 mr-2" /> Cash & Print
//                 </Button>
//               </div>
//             </div>
//           ) : (
//             <div className="flex-1 overflow-y-auto pr-2 space-y-3">
//               {salesHistory.map(sale => (
//                 <div key={sale.id} className={`p-4 rounded-xl border transition-colors ${sale.status === "VOIDED" ? "bg-slate-50/50 border-slate-100 opacity-75" : "bg-white border-slate-200"}`}>
//                   <div className="flex justify-between items-start mb-2">
//                     <div>
//                       <p className={`font-bold text-sm ${sale.status === "VOIDED" ? "text-slate-500 line-through" : "text-slate-900"}`}>
//                         {sale.id}
//                       </p>
//                       <p className="text-xs font-medium text-slate-500">{sale.quantity}x {sale.itemName}</p>
//                     </div>
//                     <p className={`font-bold ${sale.status === "VOIDED" ? "text-slate-400" : "text-emerald-600"}`}>
//                       Rs {sale.total}
//                     </p>
//                   </div>
                  
//                   <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-2">
//                     <span className="text-[10px] font-bold text-slate-400">{sale.time}</span>
//                     <div className="flex gap-2">
//                       {sale.status === "COMPLETED" ? (
//                         <>
//                           <Button 
//                             variant="ghost"
//                             onClick={() => handleReprint(sale)}
//                             className="flex items-center gap-1 text-[10px] font-bold text-sky-600 hover:text-sky-700 bg-sky-50 hover:bg-sky-100 px-2 py-1 h-auto rounded-lg transition-colors cursor-pointer"
//                           >
//                             <Printer className="h-3 w-3" /> Reprint
//                           </Button>
//                           <Button 
//                             variant="ghost"
//                             onClick={() => handleVoidSlip(sale.id)}
//                             className="flex items-center gap-1 text-[10px] font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-2 py-1 h-auto rounded-lg transition-colors cursor-pointer"
//                           >
//                             <Ban className="h-3 w-3" /> Delete
//                           </Button>
//                         </>
//                       ) : (
//                         <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">
//                           Deleted
//                         </span>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* THERMAL PRINTER RECEIPT */}
//       {slipToPrint && (
//         <div id="thermal-receipt" className="hidden print:block text-black font-mono text-sm mx-auto p-4 bg-white">
//           <div className="text-center mb-4">
//             <h1 className="font-bold text-xl">Blue Mist</h1>
//             <p className="text-xs">Jan Muhammad Road - Lahore</p>
//             <p className="text-xs">{slipToPrint.time}</p>
//             <p className="text-xs mt-1 border-b border-black pb-1">Slip: {slipToPrint.id}</p>
//           </div>
          
//           <div className="border-b border-black py-2 mb-2 border-dashed">
//             <div className="flex justify-between font-bold text-xs mb-1">
//               <span>ITEM</span>
//               <span>AMT</span>
//             </div>
//             <div className="flex justify-between text-xs">
//               <span>{slipToPrint.quantity}x {slipToPrint.itemName}</span>
//               <span>Rs {slipToPrint.total}</span>
//             </div>
//           </div>
          
//           <div className="flex justify-between font-bold text-base mb-4">
//             <span>TOTAL</span>
//             <span>Rs {slipToPrint.total}</span>
//           </div>
          
//           <div className="text-center text-xs">
//             <p>Thank you for your visit!</p>
//             <p>System by Droply</p>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }