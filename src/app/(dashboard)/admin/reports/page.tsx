"use client";

import { ReportGenerator } from "@/features/reports/components/report-generator";

export default function ReportsPage() {
  return (
    <div className="space-y-6 max-w-300 mx-auto p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">System Reports</h1>
        <p className="text-sm text-slate-500 mt-1">
          Generate structured PDF or Excel reports for accounting, auditing, and operational tracking.
        </p>
      </div>

      <ReportGenerator />
    </div>
  );
}