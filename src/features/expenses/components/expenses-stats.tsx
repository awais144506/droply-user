"use client";

import { Receipt, Wallet, Coffee, TrendingDown } from "lucide-react";
import { Expense } from "../api/use-expenses";

export function ExpenseStats({ expenses }: { expenses: Expense[] }) {
  const totalExpenses = expenses.reduce((acc, exp) => acc + exp.amount, 0);
  const cashExpenses = expenses.filter(e => e.paymentMethod === "CASH").reduce((acc, exp) => acc + exp.amount, 0);
  const totalTransactions = expenses.length;

  const formatCurrency = (val: number) => `Rs ${val.toLocaleString("en-PK")}`;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Expenses</p>
            <div className="p-2 bg-rose-50 rounded-lg text-rose-600">
              <TrendingDown className="h-4 w-4" />
            </div>
          </div>
          <p className="text-3xl font-bold text-rose-600">{formatCurrency(totalExpenses)}</p>
        </div>
        <p className="text-[11px] font-medium text-slate-400 mt-4">Across all selected records</p>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cash Outflow</p>
            <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
              <Wallet className="h-4 w-4" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900">{formatCurrency(cashExpenses)}</p>
        </div>
        <p className="text-[11px] font-medium text-amber-600 mt-4">Paid via physical cash</p>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Vouchers Logged</p>
            <div className="p-2 bg-sky-50 rounded-lg text-sky-600">
              <Receipt className="h-4 w-4" />
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900">{totalTransactions}</p>
        </div>
        <p className="text-[11px] font-medium text-slate-400 mt-4">Individual petty entries</p>
      </div>

      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Top Category</p>
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
              <Coffee className="h-4 w-4" />
            </div>
          </div>
          <p className="text-xl font-bold text-slate-900">Utilities</p>
        </div>
        <p className="text-[11px] font-medium text-emerald-600 mt-4">Highest spending category</p>
      </div>
    </div>
  );
}