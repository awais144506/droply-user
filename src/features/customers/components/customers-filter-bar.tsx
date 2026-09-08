import { Search } from "lucide-react";

interface CustomersFilterBarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  filterDebt: "ALL" | "DEBT" | "CLEAR";
  setFilterDebt: (val: "ALL" | "DEBT" | "CLEAR") => void;
}

export function CustomersFilterBar({
  searchQuery,
  setSearchQuery,
  filterDebt,
  setFilterDebt,
}: CustomersFilterBarProps) {
  return (
    <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center gap-4 justify-between bg-white">
      
      {/* Search Input */}
      <div className="relative w-full sm:max-w-xs">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search customers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:bg-white transition-all"
        />
      </div>

      {/* Debt Filters */}
      <div className="flex items-center bg-slate-50 p-1 rounded-lg border border-slate-200 shrink-0">
        <button
          onClick={() => setFilterDebt("ALL")}
          className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${
            filterDebt === "ALL" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          All Khata
        </button>
        <button
          onClick={() => setFilterDebt("DEBT")}
          className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${
            filterDebt === "DEBT" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Has Debt
        </button>
        <button
          onClick={() => setFilterDebt("CLEAR")}
          className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${
            filterDebt === "CLEAR" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
          }`}
        >
          Clear
        </button>
      </div>
    </div>
  );
}