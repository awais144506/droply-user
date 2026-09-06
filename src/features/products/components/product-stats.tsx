"use client";

import { Package, AlertCircle, RotateCcw, Network } from "lucide-react";
import { ProductItem } from "../api/use-products";

interface ProductStatsProps {
  products: ProductItem[];
  planName?: string;
  maxRecipeLimit?: number | "UNLIMITED";
}

export function ProductStats({
  products,
  maxRecipeLimit = 15
}: ProductStatsProps) {

  const totalItems = products.length;
  const lowStockCount = products.filter(p => p.stockOnHand <= p.lowStockThreshold).length;
  const returnablesCount = products.filter(p => p.trackingType === "RETURNABLE").length;

  // Clean, strongly-typed filter (no more 'any' casting)
  const recipeItemsCount = products.filter(p => p.hasRecipe).length;

  // Calculate quota progress safely
  const isUnlimited = maxRecipeLimit === "UNLIMITED";


  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

      {/* 1. Total Catalog Items */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Catalog Items</p>
            <div className="p-2 bg-sky-50 rounded-lg text-sky-600">
              <Package className="h-4 w-4" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900">{totalItems}</p>
        </div>
      </div>


      {/* 4. Recipe / BoM Quota Tracker */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Recipe</p>
            <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
              <Network className="h-4 w-4" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900">
            {recipeItemsCount} <span className="text-sm font-medium text-slate-400">{isUnlimited}</span>
          </p>
        </div>

      </div>


      {/* 3. Returnable Assets */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Returnable Assets</p>
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
              <RotateCcw className="h-4 w-4" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900">{returnablesCount}</p>
        </div>
      </div>

      {/* 2. Low Stock Alerts */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Low Stock Alerts</p>
            <div className={`p-2 rounded-lg ${lowStockCount > 0 ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"}`}>
              <AlertCircle className="h-4 w-4" />
            </div>
          </div>
          <p className={`text-3xl font-bold ${lowStockCount > 0 ? "text-rose-600" : "text-emerald-600"}`}>
            {lowStockCount}
          </p>
        </div>
      </div>

    </div>
  );
}