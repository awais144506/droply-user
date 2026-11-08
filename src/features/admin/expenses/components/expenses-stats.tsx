"use client";
import { TrendingDown } from "lucide-react";
import PageStatsCard from "@/lib/utils/components/StatsMainPageCards";
import { formatCurrency } from "@/lib/utils/functions/setFormat";

export function ExpenseStats({ totalExpenses }: { totalExpenses: number }) {


  return (
    <div className="grid grid-cols-3">

      <PageStatsCard
        title="Total Expenses"
        value={formatCurrency(totalExpenses)}
        icon={TrendingDown}
        iconContainerClass="bg-rose-50 text-rose-600"
        prefix="Rs"
        valueColorClass="text-rose-600"
      />
    </div>
  );
}