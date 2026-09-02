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
  planName = "Gold Tier", 
  maxRecipeLimit = 15 
}: ProductStatsProps) {
  
  const totalItems = products.length;
  const lowStockCount = products.filter(p => p.stockOnHand <= p.lowStockThreshold).length;
  const returnablesCount = products.filter(p => p.trackingType === "RETURNABLE").length;
  
  // Assumes ProductItem type is updated to include hasRecipe?: boolean
  const recipeItemsCount = products.filter(p => (p as any).hasRecipe).length;

  // Calculate quota progress safely for Recipes only
  const isUnlimited = maxRecipeLimit === "UNLIMITED";
  const quotaPercentage = isUnlimited ? 0 : Math.min((recipeItemsCount / (maxRecipeLimit as number)) * 100, 100);
  const isNearLimit = !isUnlimited && quotaPercentage >= 80;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      
      {/* 1. Total Catalog Items (Unlimited) */}
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
        <p className="text-[11px] font-medium text-slate-400 mt-4">
          Unlimited inventory items allowed.
        </p>
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
        <p className="text-[11px] font-medium text-slate-400 mt-4">
          Items below assigned minimum threshold.
        </p>
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
        <p className="text-[11px] font-medium text-slate-400 mt-4">
          Tracked containers in market circulation.
        </p>
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
            {recipeItemsCount} <span className="text-sm font-medium text-slate-400">/ {isUnlimited ? "∞" : maxRecipeLimit}</span>
          </p>
        </div>
        
        {!isUnlimited && (
          <div className="mt-4">
            <div className="flex justify-between text-[10px] font-bold mb-1.5">
              <span className={isNearLimit ? "text-rose-600" : "text-slate-500"}>{planName}</span>
              <span className={isNearLimit ? "text-rose-600" : "text-slate-500"}>{quotaPercentage.toFixed(0)}% Used</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${isNearLimit ? "bg-rose-500" : "bg-sky-500"}`} 
                style={{ width: `${quotaPercentage}%` }} 
              />
            </div>
          </div>
        )}
        {isUnlimited && (
          <div className="mt-4 inline-flex items-center">
            <span className="px-2 py-1 bg-amber-50 text-amber-700 text-[10px] font-bold rounded-md border border-amber-100">
              Platinum Unlimited
            </span>
          </div>
        )}
      </div>

    </div>
  );
}