"use client";

import { useState } from "react";
import {
  Package,
  Plus,
  Search,
  SlidersHorizontal,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  RotateCcw,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  X,
  Droplet,
  Layers,
  ArrowUpRight,
  HelpCircle,
} from "lucide-react";

// --- TYPES ---
export type ItemClassification = "FINISHED_WATER" | "RETURNABLE_CONTAINER" | "RAW_MATERIAL" | "EQUIPMENT";
export type ItemReturnableType = "RETURNABLE" | "NON_RETURNABLE";

export interface CatalogItem {
  id: string;
  sku: string;
  name: string;
  classification: ItemClassification;
  returnableType: ItemReturnableType;
  salePrice: number;
  unitCost: number;
  stockCount: number;
  lowStockThreshold: number;
  isActive: boolean;
}

// --- DUMMY DATA ---
const MOCK_ITEMS: CatalogItem[] = [
  {
    id: "item-1",
    sku: "WTR-19L-FL",
    name: "19-Liter Water Refill (Sealed)",
    classification: "FINISHED_WATER",
    returnableType: "NON_RETURNABLE",
    salePrice: 200.0,
    unitCost: 65.0,
    stockCount: 148,
    lowStockThreshold: 50,
    isActive: true,
  },
  {
    id: "item-2",
    sku: "BTL-19L-EMPTY",
    name: "19L Polycarbonate Empty Bottle",
    classification: "RETURNABLE_CONTAINER",
    returnableType: "RETURNABLE",
    salePrice: 1200.0,
    unitCost: 850.0,
    stockCount: 520,
    lowStockThreshold: 100,
    isActive: true,
  },
  {
    id: "item-3",
    sku: "CAP-55MM-BLU",
    name: "12L & 19L Smart Bottle Cap",
    classification: "RAW_MATERIAL",
    returnableType: "NON_RETURNABLE",
    salePrice: 30.0,
    unitCost: 14.5,
    stockCount: 1850,
    lowStockThreshold: 500,
    isActive: true,
  },
  {
    id: "item-4",
    sku: "BTL-12L-HNDL",
    name: "12L Bottle with Grip Handle",
    classification: "RETURNABLE_CONTAINER",
    returnableType: "RETURNABLE",
    salePrice: 650.0,
    unitCost: 380.0,
    stockCount: 18,
    lowStockThreshold: 25,
    isActive: true,
  },
  {
    id: "item-5",
    sku: "PET-1500ML-PK",
    name: "1500ml Bottled Water (Pack of 6)",
    classification: "FINISHED_WATER",
    returnableType: "NON_RETURNABLE",
    salePrice: 420.0,
    unitCost: 290.0,
    stockCount: 3040,
    lowStockThreshold: 400,
    isActive: true,
  },
  {
    id: "item-6",
    sku: "PUMP-MANUAL-DSP",
    name: "Manual Hand Water Dispenser",
    classification: "EQUIPMENT",
    returnableType: "NON_RETURNABLE",
    salePrice: 550.0,
    unitCost: 320.0,
    stockCount: 15,
    lowStockThreshold: 15,
    isActive: false,
  },
];

export default function ItemsStockPage() {
  const [items, setItems] = useState<CatalogItem[]>(MOCK_ITEMS);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [classificationFilter, setClassificationFilter] = useState<string>("ALL");
  const [returnableFilter, setReturnableFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [targetItemForAdjust, setTargetItemForAdjust] = useState<CatalogItem | null>(null);

  // Form State for Stock Adjustment
  const [adjustData, setAdjustData] = useState({
    adjustmentType: "ADD", // 'ADD' (Stock In/Purchased) or 'SUBTRACT' (Damaged/Used)
    quantity: 50,
    newUnitCost: 0,
    reason: "New supplier shipment batch received",
  });

  // Filter Logic
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (classificationFilter !== "ALL" && item.classification !== classificationFilter) return false;
    if (returnableFilter !== "ALL" && item.returnableType !== returnableFilter) return false;
    if (statusFilter === "ACTIVE" && !item.isActive) return false;
    if (statusFilter === "HIDDEN" && item.isActive) return false;

    return true;
  });

  // Checkbox selections
  const handleSelectAll = () => {
    if (selectedItemIds.length === filteredItems.length) {
      setSelectedItemIds([]);
    } else {
      setSelectedItemIds(filteredItems.map((i) => i.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedItemIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleActive = (id: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, isActive: !i.isActive } : i))
    );
  };

  const openAdjustModal = (item: CatalogItem) => {
    setTargetItemForAdjust(item);
    setAdjustData({
      adjustmentType: "ADD",
      quantity: 50,
      newUnitCost: item.unitCost,
      reason: "Stock replenishment",
    });
    setIsAdjustModalOpen(true);
  };

  const handleSaveStockAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetItemForAdjust) return;

    setItems((prev) =>
      prev.map((i) => {
        if (i.id === targetItemForAdjust.id) {
          const delta =
            adjustData.adjustmentType === "ADD"
              ? Number(adjustData.quantity)
              : -Number(adjustData.quantity);
          return {
            ...i,
            stockCount: Math.max(0, i.stockCount + delta),
            unitCost:
              adjustData.adjustmentType === "ADD" && adjustData.newUnitCost > 0
                ? Number(adjustData.newUnitCost)
                : i.unitCost,
          };
        }
        return i;
      })
    );

    setIsAdjustModalOpen(false);
    setTargetItemForAdjust(null);
  };

  const singleSelectedItem =
    selectedItemIds.length === 1
      ? items.find((i) => i.id === selectedItemIds[0])
      : null;

  return (
    <div className="space-y-5 max-w-7xl mx-auto p-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1">
            <span>Plant Data</span>
            <span>/</span>
            <span className="text-slate-700">Catalog & Stock</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Items & Inventory
          </h1>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-1.5 h-9 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold transition-colors shadow-xs"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Item</span>
        </button>
      </div>

      {/* Instructional Banner */}
      <div className="flex items-start gap-3 p-3.5 bg-sky-50/70 border border-sky-200/70 rounded-2xl text-xs text-sky-950">
        <HelpCircle className="h-4 w-4 text-sky-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="font-semibold text-sky-900">Stock & Cost Tracking:</strong>{" "}
          Select any item below to record new shipments or update unit purchase costs. Rider customer drops automatically reduce inventory and reconcile returns in real-time.
        </p>
      </div>

      {/* Contextual Action Toolbar (Shows when item(s) selected) */}
      <div className="flex items-center gap-2 p-2 bg-white rounded-xl border border-slate-200 shadow-2xs">
        {selectedItemIds.length === 0 ? (
          <span className="text-xs text-slate-400 italic px-2">
            Select an item row below to trigger quick inventory adjustments or cost revisions.
          </span>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-800 px-2 bg-slate-100 py-1 rounded-lg">
              {selectedItemIds.length} Selected
            </span>

            {singleSelectedItem && (
              <>
                <button
                  onClick={() => openAdjustModal(singleSelectedItem)}
                  className="h-8 px-3 rounded-lg bg-sky-50 border border-sky-200 text-sky-700 text-xs font-semibold inline-flex items-center gap-1.5 hover:bg-sky-100 transition-colors"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Adjust Stock</span>
                </button>

                <button
                  onClick={() => openAdjustModal(singleSelectedItem)}
                  className="h-8 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>Update Cost</span>
                </button>
              </>
            )}

            <button
              onClick={() => {
                setItems((prev) =>
                  prev.map((i) =>
                    selectedItemIds.includes(i.id) ? { ...i, isActive: !i.isActive } : i
                  )
                );
                setSelectedItemIds([]);
              }}
              className="h-8 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
            >
              <EyeOff className="h-3.5 w-3.5" />
              <span>Toggle Status</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Filter Controls */}
        <div className="p-3.5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search items by name or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Classification */}
            <select
              value={classificationFilter}
              onChange={(e) => setClassificationFilter(e.target.value)}
              className="h-9 px-3 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
            >
              <option value="ALL">All Categories</option>
              <option value="FINISHED_WATER">Finished Water</option>
              <option value="RETURNABLE_CONTAINER">Returnable Bottles</option>
              <option value="RAW_MATERIAL">Caps & Consumables</option>
              <option value="EQUIPMENT">Equipment & Pumps</option>
            </select>

            {/* Returnable Type */}
            <select
              value={returnableFilter}
              onChange={(e) => setReturnableFilter(e.target.value)}
              className="h-9 px-3 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
            >
              <option value="ALL">All Container Types</option>
              <option value="RETURNABLE">Returnable (Khata Tracked)</option>
              <option value="NON_RETURNABLE">Non-Returnable (Outright)</option>
            </select>

            {/* Active / Hidden */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 px-3 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active Only</option>
              <option value="HIDDEN">Hidden / Inactive</option>
            </select>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                <th className="py-3 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={
                      filteredItems.length > 0 &&
                      selectedItemIds.length === filteredItems.length
                    }
                    onChange={handleSelectAll}
                    className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4">Item & SKU</th>
                <th className="py-3 px-4">Type & Tracking</th>
                <th className="py-3 px-4 text-right">Sale Price</th>
                <th className="py-3 px-4 text-right">Unit Cost</th>
                <th className="py-3 px-4 text-right">Stock on Hand</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => {
                  const isSelected = selectedItemIds.includes(item.id);
                  const isLowStock = item.stockCount <= item.lowStockThreshold;
                  const profitMargin =
                    item.salePrice > 0
                      ? Math.round(((item.salePrice - item.unitCost) / item.salePrice) * 100)
                      : 0;

                  return (
                    <tr
                      key={item.id}
                      className={`transition-colors ${
                        isSelected ? "bg-sky-50/40" : "hover:bg-slate-50/70"
                      } ${!item.isActive ? "opacity-60" : ""}`}
                    >
                      {/* Checkbox */}
                      <td className="py-3 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(item.id)}
                          className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
                        />
                      </td>

                      {/* Name & SKU */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="h-8 w-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                            {item.classification === "FINISHED_WATER" ? (
                              <Droplet className="h-4 w-4" />
                            ) : (
                              <Package className="h-4 w-4" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{item.name}</p>
                            <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                              {item.sku}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Type Badges */}
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap items-center gap-1">
                          {item.returnableType === "RETURNABLE" ? (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                              Returnable
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-600">
                              Outright
                            </span>
                          )}

                          <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-700">
                            {item.classification.replace("_", " ")}
                          </span>
                        </div>
                      </td>

                      {/* Sale Price */}
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                        Rs {item.salePrice.toFixed(2)}
                      </td>

                      {/* Unit Cost & Margin */}
                      <td className="py-3 px-4 text-right">
                        <div className="font-mono text-slate-600">
                          Rs {item.unitCost.toFixed(2)}
                        </div>
                        <div className="text-[10px] font-medium text-emerald-600 flex items-center justify-end gap-0.5">
                          <TrendingUp className="h-2.5 w-2.5" />
                          <span>{profitMargin}% margin</span>
                        </div>
                      </td>

                      {/* Stock Count */}
                      <td className="py-3 px-4 text-right">
                        <div
                          className={`font-mono font-bold text-sm ${
                            isLowStock ? "text-rose-600" : "text-slate-900"
                          }`}
                        >
                          {item.stockCount.toLocaleString()}
                        </div>
                        {isLowStock && (
                          <span className="text-[10px] text-rose-500 font-semibold flex items-center justify-end gap-0.5">
                            <AlertCircle className="h-2.5 w-2.5" />
                            <span>Low stock</span>
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => openAdjustModal(item)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition-colors"
                            title="Adjust Stock & Cost"
                          >
                            <RotateCcw className="h-3.5 w-3.5" />
                          </button>

                          <button
                            onClick={() => handleToggleActive(item.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                            title={item.isActive ? "Hide from Catalog" : "Make Active"}
                          >
                            {item.isActive ? (
                              <Eye className="h-3.5 w-3.5" />
                            ) : (
                              <EyeOff className="h-3.5 w-3.5 text-amber-500" />
                            )}
                          </button>

                          <button
                            onClick={() => {
                              if (confirm("Delete this catalog item?")) {
                                setItems((prev) => prev.filter((i) => i.id !== item.id));
                              }
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete Item"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No items found matching the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL: ADJUST STOCK / REVISE COST */}
      {/* ========================================================= */}
      {isAdjustModalOpen && targetItemForAdjust && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Adjust Inventory & Cost
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {targetItemForAdjust.name}
                </p>
              </div>
              <button
                onClick={() => setIsAdjustModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveStockAdjustment} className="space-y-3.5">
              {/* Type Switcher */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setAdjustData({ ...adjustData, adjustmentType: "ADD" })
                  }
                  className={`h-9 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                    adjustData.adjustmentType === "ADD"
                      ? "bg-emerald-50 border-emerald-500 text-emerald-700"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span>+ Stock In (Received)</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setAdjustData({ ...adjustData, adjustmentType: "SUBTRACT" })
                  }
                  className={`h-9 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                    adjustData.adjustmentType === "SUBTRACT"
                      ? "bg-rose-50 border-rose-500 text-rose-700"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <span>- Stock Out (Damaged)</span>
                </button>
              </div>

              {/* Quantity */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  Units to {adjustData.adjustmentType === "ADD" ? "Add" : "Deduct"} *
                </label>
                <input
                  type="number"
                  value={adjustData.quantity}
                  onChange={(e) =>
                    setAdjustData({ ...adjustData, quantity: Number(e.target.value) })
                  }
                  className="w-full h-9 rounded-xl border border-slate-300 px-3 text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none"
                  required
                />
              </div>

              {/* Unit Cost (Only for Stock in) */}
              {adjustData.adjustmentType === "ADD" && (
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Unit Purchase Cost (Rs)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={adjustData.newUnitCost}
                    onChange={(e) =>
                      setAdjustData({
                        ...adjustData,
                        newUnitCost: Number(e.target.value),
                      })
                    }
                    className="w-full h-9 rounded-xl border border-slate-300 px-3 text-xs font-mono text-slate-900 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none"
                  />
                </div>
              )}

              {/* Reason / Reference */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">
                  Notes / Batch Ref
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sahiwal vendor delivery"
                  value={adjustData.reason}
                  onChange={(e) =>
                    setAdjustData({ ...adjustData, reason: e.target.value })
                  }
                  className="w-full h-9 rounded-xl border border-slate-300 px-3 text-xs text-slate-900 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none"
                />
              </div>

              {/* Projected Stock Preview */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                <span className="text-slate-500">Current: {targetItemForAdjust.stockCount}</span>
                <span className="font-bold text-slate-900">
                  New Projected:{" "}
                  {adjustData.adjustmentType === "ADD"
                    ? targetItemForAdjust.stockCount + Number(adjustData.quantity)
                    : Math.max(0, targetItemForAdjust.stockCount - Number(adjustData.quantity))}
                </span>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAdjustModalOpen(false)}
                  className="h-8 px-3 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-8 px-4 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold transition-colors"
                >
                  Apply Adjustment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ADD NEW ITEM */}
      {/* ========================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900">Add New Catalog Item</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsAddModalOpen(false);
              }}
              className="space-y-3"
            >
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Item Name *</label>
                <input
                  type="text"
                  placeholder="e.g. 19L Refill or 55mm Caps"
                  className="w-full h-9 rounded-xl border border-slate-300 px-3 text-xs outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Category *</label>
                  <select className="w-full h-9 rounded-xl border border-slate-300 px-2 text-xs bg-white">
                    <option value="FINISHED_WATER">Finished Water</option>
                    <option value="RETURNABLE_CONTAINER">Returnable Bottle</option>
                    <option value="RAW_MATERIAL">Cap / Consumable</option>
                    <option value="EQUIPMENT">Dispenser / Pump</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Returnable? *</label>
                  <select className="w-full h-9 rounded-xl border border-slate-300 px-2 text-xs bg-white">
                    <option value="NON_RETURNABLE">Non-Returnable</option>
                    <option value="RETURNABLE">Yes (Khata Bottle)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Sale Price (Rs) *</label>
                  <input
                    type="number"
                    placeholder="200.00"
                    className="w-full h-9 rounded-xl border border-slate-300 px-3 text-xs font-mono outline-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Unit Cost (Rs) *</label>
                  <input
                    type="number"
                    placeholder="65.00"
                    className="w-full h-9 rounded-xl border border-slate-300 px-3 text-xs font-mono outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="h-8 px-3 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-8 px-4 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold transition-colors"
                >
                  Create Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}