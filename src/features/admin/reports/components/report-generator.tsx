"use client";

import { useState } from "react";
import { FileText, ShoppingCart, Package, Truck, Calendar, Download, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const reportCategories = [
  {
    id: "sales",
    label: "Sales & Khata",
    icon: FileText,
    reports: ["Daily Sales Summary", "Customer Dues & Ledger", "Route Wise Collection", "Returnable Asset Tracking"]
  },
  {
    id: "supply",
    label: "Procurement",
    icon: ShoppingCart,
    reports: ["Supplier Payment History", "Purchase Orders Summary", "Debit Notes & Returns"]
  },
  {
    id: "inventory",
    label: "Inventory",
    icon: Package,
    reports: ["Stock Movement Ledger", "Wastage & Damages Report"]
  },
  {
    id: "fleet",
    label: "Fleet & Fuel",
    icon: Truck,
    reports: ["Vehicle Fuel & Mileage Log", "Maintenance Expense History"]
  }
];

export function ReportGenerator() {
  const [activeTab, setActiveTab] = useState(reportCategories[0].id);
  const [selectedReport, setSelectedReport] = useState(reportCategories[0].reports[0]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const activeCategory = reportCategories.find(c => c.id === activeTab);
  
  // Format today's date as YYYY-MM-DD for the HTML input 'max' attribute
  const todayStr = new Date().toISOString().split("T")[0];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    const category = reportCategories.find(c => c.id === tabId);
    if (category) setSelectedReport(category.reports[0]);
  };

  const handleGenerate = async () => {
    if (!startDate || !endDate) {
      toast.error("Please select both a start and end date.");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      toast.error("Start date cannot be after the end date.");
      return;
    }

    // Performance Guard: Limit range to 365 days maximum
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 365) {
      toast.error("Please generate report with in range.");
      return;
    }

    setIsGenerating(true);
    
    // Simulate report generation delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsGenerating(false);
    toast.success(`"${selectedReport}" generated successfully!`);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[600px]">
      
      {/* Left Sidebar: Categories */}
      <div className="w-full md:w-64 bg-slate-50 border-r border-slate-100 p-4 shrink-0">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">Report Categories</h3>
        <div className="flex flex-col gap-1">
          {reportCategories.map((category) => {
            const Icon = category.icon;
            const isActive = activeTab === category.id;
            return (
              <button
                key={category.id}
                onClick={() => handleTabChange(category.id)}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                  isActive ? "bg-white text-sky-600 shadow-sm border border-slate-200/60" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/50 border border-transparent"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? "text-sky-600" : "text-slate-400"}`} />
                {category.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Content */}
      <div className="flex-1 p-6 md:p-8 flex flex-col">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            {activeCategory?.icon && <activeCategory.icon className="h-5 w-5 text-sky-600" />}
            {activeCategory?.label} Reports
          </h2>
          <p className="text-sm text-slate-500 mt-1">Select a specific report and set your date parameters to generate.</p>
        </div>

        {/* Report Type Selection */}
        <div className="space-y-3 mb-10">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Select Report Type</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activeCategory?.reports.map((report) => (
              <button
                key={report}
                onClick={() => setSelectedReport(report)}
                className={`flex items-start gap-3 p-4 rounded-xl border-2 transition-all text-left cursor-pointer ${
                  selectedReport === report ? "border-sky-500 bg-sky-50" : "border-slate-100 hover:border-sky-200 bg-white"
                }`}
              >
                <div className={`mt-0.5 rounded-full p-0.5 ${selectedReport === report ? "bg-sky-600 text-white" : "text-transparent border border-slate-300"}`}>
                  <CheckCircle2 className="h-3 w-3" />
                </div>
                <span className={`text-sm font-bold ${selectedReport === report ? "text-sky-900" : "text-slate-600"}`}>
                  {report}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Date Parameters */}
        <div className="space-y-3 mb-10">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Date Range (Max 1 Year)</label>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full sm:w-auto flex-1">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="date"
                max={todayStr}
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full h-12 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:bg-white transition-colors cursor-pointer"
              />
            </div>
            
            <span className="text-slate-400 font-medium text-sm hidden sm:block">to</span>
            
            <div className="relative w-full sm:w-auto flex-1">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="date"
                max={todayStr}
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full h-12 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:bg-white transition-colors cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-auto pt-6 border-t border-slate-100 flex justify-end">
          <Button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="bg-slate-900 hover:bg-slate-800 text-white h-12 px-8 rounded-xl shadow-md cursor-pointer transition-all active:scale-95 text-base"
          >
            {isGenerating ? (
              <><Loader2 className="h-5 w-5 mr-2 animate-spin" /> Compiling Data...</>
            ) : (
              <><Download className="h-5 w-5 mr-2" /> Generate & Download PDF</>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}