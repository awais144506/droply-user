"use client";

import { useState } from "react";
import {
  Droplet,
  RotateCcw,
  Package,
  AlertTriangle,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  X,
  ShieldAlert,
  Activity,
  Gauge,
  TrendingUp,
  Layers,
  Sparkles,
  Printer,
  Calendar,
  Filter,
} from "lucide-react";

// --- TYPES ---
export type ShiftType = "MORNING" | "EVENING" | "NIGHT";
export type BatchStatus = "COMPLETED" | "IN_PROGRESS" | "CANCELLED";

export interface ProductionBatch {
  id: string;
  batchNumber: string;
  shift: ShiftType;
  supervisorName: string;
  plantLine: string;
  emptiesWashed: number;
  bottlesFilled: number;
  defectiveRejected: number;
  capsConsumed: number;
  sealsConsumed: number;
  waterTdsPpm: number;
  waterPhLevel: number;
  startTime: string;
  endTime: string;
  status: BatchStatus;
  notes?: string;
}

// --- DUMMY DATA (Sahiwal RO Plant Operations) ---
const MOCK_BATCHES: ProductionBatch[] = [
  {
    id: "bat-101",
    batchNumber: "RUN-20260829-01",
    shift: "MORNING",
    supervisorName: "Kamran Akmal",
    plantLine: "RO Line 1 (2,000 LPH)",
    emptiesWashed: 320,
    bottlesFilled: 316,
    defectiveRejected: 4,
    capsConsumed: 316,
    sealsConsumed: 316,
    waterTdsPpm: 138,
    waterPhLevel: 7.2,
    startTime: "08:00 AM",
    endTime: "11:30 AM",
    status: "COMPLETED",
    notes: "Batch passed TDS & ozone sterilization check",
  },
  {
    id: "bat-102",
    batchNumber: "RUN-20260829-02",
    shift: "EVENING",
    supervisorName: "Bilal Hussain",
    plantLine: "RO Line 1 (2,000 LPH)",
    emptiesWashed: 250,
    bottlesFilled: 247,
    defectiveRejected: 3,
    capsConsumed: 247,
    sealsConsumed: 247,
    waterTdsPpm: 142,
    waterPhLevel: 7.1,
    startTime: "01:30 PM",
    endTime: "04:45 PM",
    status: "COMPLETED",
    notes: "Replaced 3 cracked handle bottles",
  },
  {
    id: "bat-103",
    batchNumber: "RUN-20260829-03",
    shift: "EVENING",
    supervisorName: "Kamran Akmal",
    plantLine: "RO Line 2 (1,000 LPH)",
    emptiesWashed: 180,
    bottlesFilled: 130,
    defectiveRejected: 2,
    capsConsumed: 130,
    sealsConsumed: 130,
    waterTdsPpm: 135,
    waterPhLevel: 7.3,
    startTime: "05:15 PM",
    endTime: "In Progress",
    status: "IN_PROGRESS",
    notes: "Ongoing evening stock refill for Farid Town morning route",
  },
];

export default function ProductionPage() {
  const [batches, setBatches] = useState<ProductionBatch[]>(MOCK_BATCHES);
  const [searchQuery, setSearchQuery] = useState("");
  const [shiftFilter, setShiftFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    shift: "MORNING" as ShiftType,
    supervisorName: "Kamran Akmal",
    plantLine: "RO Line 1 (2,000 LPH)",
    emptiesWashed: 200,
    bottlesFilled: 196,
    defectiveRejected: 4,
    waterTdsPpm: 140,
    waterPhLevel: 7.2,
    notes: "Standard 3-stage chemical sanitization and refill",
  });

  // KPI Calculations
  const totalFilledToday = batches.reduce((sum, b) => sum + b.bottlesFilled, 0);
  const totalWashedToday = batches.reduce((sum, b) => sum + b.emptiesWashed, 0);
  const totalScrappedToday = batches.reduce((sum, b) => sum + b.defectiveRejected, 0);
  const totalCapsUsed = batches.reduce((sum, b) => sum + b.capsConsumed, 0);
  const avgEfficiency =
    totalWashedToday > 0
      ? ((totalFilledToday / totalWashedToday) * 100).toFixed(1)
      : "100";

  // Filtered List
  const filteredBatches = batches.filter((b) => {
    const matchesSearch =
      b.batchNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.supervisorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.plantLine.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;
    if (shiftFilter !== "ALL" && b.shift !== shiftFilter) return false;
    if (statusFilter !== "ALL" && b.status !== statusFilter) return false;

    return true;
  });

  const handleCreateBatch = (e: React.FormEvent) => {
    e.preventDefault();
    const newBatch: ProductionBatch = {
      id: `bat-${Date.now()}`,
      batchNumber: `RUN-20260829-0${batches.length + 1}`,
      shift: formData.shift,
      supervisorName: formData.supervisorName,
      plantLine: formData.plantLine,
      emptiesWashed: Number(formData.emptiesWashed),
      bottlesFilled: Number(formData.bottlesFilled),
      defectiveRejected: Number(formData.defectiveRejected),
      capsConsumed: Number(formData.bottlesFilled),
      sealsConsumed: Number(formData.bottlesFilled),
      waterTdsPpm: Number(formData.waterTdsPpm),
      waterPhLevel: Number(formData.waterPhLevel),
      startTime: "Just now",
      endTime: "Completed",
      status: "COMPLETED",
      notes: formData.notes,
    };

    setBatches([newBatch, ...batches]);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Plant Bottling & Production Runs
            </h1>
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-sky-50 text-sky-700 border border-sky-200/60">
              Sahiwal RO Plant
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Log washing cycles, RO water filtration outputs, cap/seal usage, and quality rejection metrics.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-1.5 h-9 px-4 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold transition-colors shadow-xs"
        >
          <Plus className="h-4 w-4" />
          <span>Log Bottling Run</span>
        </button>
      </div>

      {/* Production KPIs Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Total Bottles Filled */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Filled Today (Ready)
            </span>
            <div className="h-7 w-7 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600">
              <Droplet className="h-4 w-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900 font-mono">
              {totalFilledToday.toLocaleString()}{" "}
              <span className="text-xs text-slate-400 font-sans font-normal">Bottles</span>
            </p>
            <p className="text-[11px] text-emerald-600 font-medium mt-0.5 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              <span>Added to Available Stock</span>
            </p>
          </div>
        </div>

        {/* Empties Washed */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Empties Sanitized & Washed
            </span>
            <div className="h-7 w-7 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <RotateCcw className="h-4 w-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-indigo-950 font-mono">
              {totalWashedToday.toLocaleString()}{" "}
              <span className="text-xs text-slate-400 font-sans font-normal">Units</span>
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">3-stage automatic wash cycle</p>
          </div>
        </div>

        {/* Defect / Rejection Rate */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Defects / Cracks Rejected
            </span>
            <div className="h-7 w-7 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600">
              <ShieldAlert className="h-4 w-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-rose-600 font-mono">
              {totalScrappedToday}{" "}
              <span className="text-xs font-sans text-slate-400 font-normal">Scrapped</span>
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Deducted from plant asset ledger</p>
          </div>
        </div>

        {/* Consumables Auto-Depleted */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Caps & Seals Depleted
            </span>
            <div className="h-7 w-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <Package className="h-4 w-4" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-slate-900 font-mono">
              {totalCapsUsed.toLocaleString()}{" "}
              <span className="text-xs text-slate-400 font-sans font-normal">Pcs</span>
            </p>
            <p className="text-[11px] text-emerald-600 font-medium mt-0.5">
              Yield Efficiency: {avgEfficiency}%
            </p>
          </div>
        </div>
      </div>

      {/* Production Batch Log Directory */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {/* Table Filters & Search */}
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search by batch #, shift supervisor, line..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Shift Filter */}
            <select
              value={shiftFilter}
              onChange={(e) => setShiftFilter(e.target.value)}
              className="h-9 px-3 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
            >
              <option value="ALL">All Shifts</option>
              <option value="MORNING">Morning Shift</option>
              <option value="EVENING">Evening Shift</option>
              <option value="NIGHT">Night Shift</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 px-3 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
            >
              <option value="ALL">All Status</option>
              <option value="COMPLETED">Completed</option>
              <option value="IN_PROGRESS">In Progress</option>
            </select>
          </div>
        </div>

        {/* Batches Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-400 uppercase text-[10px] tracking-wider font-semibold">
                <th className="py-3 px-4">Batch & Shift</th>
                <th className="py-3 px-4">Plant Line & Supervisor</th>
                <th className="py-3 px-4 text-center">Washed Empties</th>
                <th className="py-3 px-4 text-center">Filled & Sealed</th>
                <th className="py-3 px-4 text-center">Caps & Seals Used</th>
                <th className="py-3 px-4 text-center">Rejected (Cracks)</th>
                <th className="py-3 px-4 text-center">Water Quality</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-mono">
              {filteredBatches.length > 0 ? (
                filteredBatches.map((batch) => (
                  <tr key={batch.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Batch Number & Shift */}
                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900 block">{batch.batchNumber}</span>
                      <span className="text-[10px] font-sans font-semibold text-slate-400 uppercase">
                        {batch.shift} ({batch.startTime} - {batch.endTime})
                      </span>
                    </td>

                    {/* Line & Supervisor */}
                    <td className="py-3 px-4 font-sans">
                      <div className="font-semibold text-slate-800">{batch.supervisorName}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{batch.plantLine}</div>
                    </td>

                    {/* Washed Empties */}
                    <td className="py-3 px-4 text-center text-indigo-700 font-semibold">
                      {batch.emptiesWashed}
                    </td>

                    {/* Filled Output */}
                    <td className="py-3 px-4 text-center text-emerald-700 font-bold bg-emerald-50/30">
                      +{batch.bottlesFilled}
                    </td>

                    {/* Raw Materials Used */}
                    <td className="py-3 px-4 text-center font-sans text-slate-600">
                      {batch.capsConsumed} caps • {batch.sealsConsumed} seals
                    </td>

                    {/* Defects Scrapped */}
                    <td className="py-3 px-4 text-center">
                      {batch.defectiveRejected > 0 ? (
                        <span className="text-rose-600 font-bold">
                          {batch.defectiveRejected} Units
                        </span>
                      ) : (
                        <span className="text-slate-400">0</span>
                      )}
                    </td>

                    {/* Water Quality Parameters */}
                    <td className="py-3 px-4 text-center font-sans">
                      <span className="inline-flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded text-[11px] font-mono text-slate-700">
                        <span>TDS: {batch.waterTdsPpm}</span>
                        <span>•</span>
                        <span>pH: {batch.waterPhLevel}</span>
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-4 text-center font-sans">
                      {batch.status === "COMPLETED" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Finished</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 text-sky-700 border border-sky-200 animate-pulse">
                          <Clock className="h-3 w-3" />
                          <span>Filling</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 font-sans">
                    No production runs found matching the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL: LOG NEW BOTTLING BATCH */}
      {/* ========================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                  <Droplet className="h-4 w-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">Record Production Run</h2>
                  <p className="text-[11px] text-slate-400">Log washed empties to ready-to-sell inventory</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateBatch} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Production Shift *</label>
                  <select
                    value={formData.shift}
                    onChange={(e) => setFormData({ ...formData, shift: e.target.value as any })}
                    className="w-full h-9 rounded-xl border border-slate-300 px-3 text-xs bg-white"
                  >
                    <option value="MORNING">Morning Shift</option>
                    <option value="EVENING">Evening Shift</option>
                    <option value="NIGHT">Night Shift</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Shift Supervisor *</label>
                  <select
                    value={formData.supervisorName}
                    onChange={(e) => setFormData({ ...formData, supervisorName: e.target.value })}
                    className="w-full h-9 rounded-xl border border-slate-300 px-3 text-xs bg-white"
                  >
                    <option value="Kamran Akmal">Kamran Akmal</option>
                    <option value="Bilal Hussain">Bilal Hussain</option>
                  </select>
                </div>
              </div>

              {/* Counters */}
              <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-indigo-700">Empties Washed *</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.emptiesWashed}
                    onChange={(e) =>
                      setFormData({ ...formData, emptiesWashed: Number(e.target.value) })
                    }
                    className="w-full h-9 rounded-xl border border-slate-300 px-2 text-center text-xs font-mono font-bold bg-white"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-emerald-700">Filled & Capped *</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.bottlesFilled}
                    onChange={(e) =>
                      setFormData({ ...formData, bottlesFilled: Number(e.target.value) })
                    }
                    className="w-full h-9 rounded-xl border border-emerald-300 px-2 text-center text-xs font-mono font-bold bg-emerald-50/50 text-emerald-900"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-rose-600">Scrap / Leaking</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.defectiveRejected}
                    onChange={(e) =>
                      setFormData({ ...formData, defectiveRejected: Number(e.target.value) })
                    }
                    className="w-full h-9 rounded-xl border border-rose-200 px-2 text-center text-xs font-mono font-bold bg-rose-50/50 text-rose-700"
                  />
                </div>
              </div>

              {/* Water Quality Parameters */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Water TDS Level (ppm) *</label>
                  <input
                    type="number"
                    value={formData.waterTdsPpm}
                    onChange={(e) => setFormData({ ...formData, waterTdsPpm: Number(e.target.value) })}
                    className="w-full h-9 rounded-xl border border-slate-300 px-3 text-xs font-mono"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Water pH Level *</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.waterPhLevel}
                    onChange={(e) => setFormData({ ...formData, waterPhLevel: Number(e.target.value) })}
                    className="w-full h-9 rounded-xl border border-slate-300 px-3 text-xs font-mono"
                    required
                  />
                </div>
              </div>

              {/* Inventory Auto Deductions Preview */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1 text-xs">
                <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] block">
                  Automatic Material Deductions
                </span>
                <div className="flex justify-between text-slate-600">
                  <span>55mm Smart Caps Deducted:</span>
                  <span className="font-mono font-bold text-slate-900">-{formData.bottlesFilled} pcs</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Heat Shrink Neck Sleeves Deducted:</span>
                  <span className="font-mono font-bold text-slate-900">-{formData.bottlesFilled} pcs</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="h-9 px-4 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-9 px-5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold transition-colors shadow-xs"
                >
                  Commit Production Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}