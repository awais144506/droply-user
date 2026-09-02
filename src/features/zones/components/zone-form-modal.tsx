"use client";

import { useEffect, useState } from "react";
import { X, Loader2 } from "lucide-react";
import { ZoneItem, ZoneRider } from "../types";
import { Button } from "@/components/ui/button";

interface ZoneFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; riderIds: string[] }) => void;
  zone: ZoneItem | null;
  availableRiders: ZoneRider[];
  isLoading: boolean;
}

export function ZoneFormModal({ isOpen, onClose, onSubmit, zone, availableRiders, isLoading }: ZoneFormModalProps) {
  const [name, setName] = useState("");
  const [selectedRiders, setSelectedRiders] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      setName(zone?.name || "");
      setSelectedRiders(zone?.riders?.map(r => r.id) || []);
    }
  }, [isOpen, zone]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, riderIds: selectedRiders });
  };

  const toggleRider = (riderId: string) => {
    setSelectedRiders(prev => 
      prev.includes(riderId) ? prev.filter(id => id !== riderId) : [...prev, riderId]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">
            {zone ? "Edit Zone" : "Create New Zone"}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors rounded-lg p-1 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Zone Name Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
              Zone / Sector Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Farid Town Sector A"
              className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:bg-white transition-all"
            />
          </div>

          {/* Rider Multi-Select */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
              Assign Riders
            </label>
            <p className="text-xs text-slate-500 mb-3">Select which dispatch riders operate in this sector.</p>
            
            <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {availableRiders.length === 0 ? (
                <div className="text-xs text-slate-400 italic p-2 bg-slate-50 rounded-lg border border-slate-100">
                  No active riders found in this branch.
                </div>
              ) : (
                availableRiders.map((rider) => {
                  const isSelected = selectedRiders.includes(rider.id);
                  return (
                    <div 
                      key={rider.id}
                      onClick={() => toggleRider(rider.id)}
                      className={`flex items-center px-3 py-2.5 rounded-xl border cursor-pointer transition-all ${
                        isSelected ? "bg-sky-50 border-sky-200" : "bg-white border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className={`h-4 w-4 rounded border flex items-center justify-center mr-3 ${
                        isSelected ? "bg-sky-600 border-sky-600" : "border-slate-300"
                      }`}>
                        {isSelected && <X className="h-3 w-3 text-white" style={{ transform: 'rotate(45deg)' }} />}
                      </div>
                      <div>
                        <p className={`text-sm font-semibold ${isSelected ? "text-sky-900" : "text-slate-700"}`}>
                          {rider.name}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 rounded-xl">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !name.trim()} className="flex-1 rounded-xl bg-sky-600 hover:bg-sky-700">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {zone ? "Save Changes" : "Create Zone"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}