import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { ZoneItem, ZoneRider } from "../types";

interface ZoneFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; riderIds: string[] }) => Promise<void>;
  zone?: ZoneItem | null;
  availableRiders?: ZoneRider[];
  isLoading: boolean;
}

export function ZoneFormModal({
  isOpen,
  onClose,
  onSubmit,
  zone,
  availableRiders = [],
  isLoading,
}: ZoneFormModalProps) {
  const [name, setName] = useState("");
  const [selectedRiders, setSelectedRiders] = useState<string[]>([]);

  // Guarantee that riders is always a valid Array
  const ridersList = Array.isArray(availableRiders) ? availableRiders : [];

  useEffect(() => {
    if (zone) {
      setName(zone.name || "");
      setSelectedRiders(Array.isArray(zone.riders) ? zone.riders.map((r) => r.id) : []);
    } else {
      setName("");
      setSelectedRiders([]);
    }
  }, [zone, isOpen]);

  if (!isOpen) return null;

  const toggleRider = (riderId: string) => {
    setSelectedRiders((prev) =>
      prev.includes(riderId)
        ? prev.filter((id) => id !== riderId)
        : [...prev, riderId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await onSubmit({ name: name.trim(), riderIds: selectedRiders });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-xl border border-slate-100 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-sm font-bold text-slate-900">
            {zone ? "Edit Zone" : "Create New Zone"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Zone / Sector Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Airline Housing Society"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-9 rounded-xl border border-slate-200 px-3 text-xs outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700">
              Assigned Riders (Multi-Select)
            </label>
            <div className="max-h-40 overflow-y-auto space-y-1.5 border border-slate-200 rounded-xl p-2">
              {ridersList.length > 0 ? (
                ridersList.map((rider) => {
                  const isChecked = selectedRiders.includes(rider.id);
                  return (
                    <div
                      key={rider.id}
                      onClick={() => toggleRider(rider.id)}
                      className={`flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer transition-colors ${
                        isChecked
                          ? "bg-sky-50 text-sky-900 font-medium"
                          : "hover:bg-slate-50 text-slate-600"
                      }`}
                    >
                      <div>
                        <p>{rider.name}</p>
                        <p className="text-[10px] text-slate-400">{rider.phone}</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        readOnly
                        className="rounded border-slate-300 text-sky-600 pointer-events-none"
                      />
                    </div>
                  );
                })
              ) : (
                <p className="text-[11px] text-slate-400 text-center py-2">
                  No riders available in this branch.
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="h-8 px-3 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !name.trim()}
              className="h-8 px-4 rounded-lg bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
            >
              {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>{zone ? "Save Changes" : "Create Zone"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}