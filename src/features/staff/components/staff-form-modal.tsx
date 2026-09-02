"use client";

import { useEffect, useState } from "react";
import { X, Loader2, Bike, Briefcase, ChevronDown, Check } from "lucide-react";
import { BranchUserItem } from "../api/use-staff";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";

interface StaffFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; email: string; phone: string; role: "MANAGER" | "RIDER"; zoneIds?: string[] }) => void;
  staff: BranchUserItem | null;
  availableZones: { id: string; name: string }[];
  isLoading: boolean;
}

export function StaffFormModal({ isOpen, onClose, onSubmit, staff, availableZones, isLoading }: StaffFormModalProps) {
  const [step, setStep] = useState<"SELECT_ROLE" | "FORM">("SELECT_ROLE");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<"MANAGER" | "RIDER">("RIDER");
  const [selectedZones, setSelectedZones] = useState<string[]>([]);
  
  const [isZoneDropdownOpen, setIsZoneDropdownOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (staff) {
        setName(staff.name || "");
        setEmail(staff.email || "");
        setPhone(staff.phone || "");
        setRole(staff.role === "MANAGER" ? "MANAGER" : "RIDER");
        setSelectedZones(staff.zones?.map(z => z.id) || []);
        setStep("FORM");
      } else {
        setName("");
        setEmail("");
        setPhone("");
        setRole("RIDER");
        setSelectedZones([]);
        setStep("SELECT_ROLE");
      }
      setIsZoneDropdownOpen(false);
    }
  }, [isOpen, staff]);

  if (!isOpen) return null;

  const handleRoleSelect = (selectedRole: "MANAGER" | "RIDER") => {
    setRole(selectedRole);
    setStep("FORM");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      email,
      phone,
      role,
      zoneIds: role === "RIDER" ? selectedZones : [],
    });
  };

  const toggleZone = (zoneId: string) => {
    setSelectedZones(prev =>
      prev.includes(zoneId) ? prev.filter(id => id !== zoneId) : [...prev, zoneId]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">
            {step === "SELECT_ROLE" ? "Select Account Type" : staff ? "Edit Staff Profile" : `Add ${role === "MANAGER" ? "Manager" : "Dispatch Rider"}`}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* STEP 1: BIG BUTTON ROLE SELECTION */}
        {step === "SELECT_ROLE" && (
          <div className="p-6 grid grid-cols-2 gap-4">
            <Button 
              variant="outline"
              onClick={() => handleRoleSelect("RIDER")}
              className="flex flex-col h-auto items-center justify-center p-6 border-2 border-slate-100 rounded-2xl hover:border-sky-500 hover:bg-sky-50 transition-all group whitespace-normal"
            >
              <div className="h-16 w-16 rounded-full bg-sky-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Bike className="h-8 w-8 text-sky-600" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Rider</h3>
              <p className="text-xs text-slate-500 text-center mt-2 font-normal">Field staff for deliveries and asset recovery.</p>
            </Button>

            <Button 
              variant="outline"
              onClick={() => handleRoleSelect("MANAGER")}
              className="flex flex-col h-auto items-center justify-center p-6 border-2 border-slate-100 rounded-2xl hover:border-indigo-500 hover:bg-indigo-50 transition-all group whitespace-normal"
            >
              <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Briefcase className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Branch Manager</h3>
              <p className="text-xs text-slate-500 text-center mt-2 font-normal">Admin access to manage operations and cash.</p>
            </Button>
          </div>
        )}

        {/* STEP 2: DATA ENTRY FORM */}
        {step === "FORM" && (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-visible">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ali Ahmed"
                className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  disabled={Boolean(staff)} 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="staff@domain.com"
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:bg-white disabled:opacity-60"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Phone / WhatsApp *</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+92 300 1234567"
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 focus:bg-white font-mono"
                />
              </div>
            </div>

            {role === "RIDER" && (
              <div className="flex flex-col space-y-1">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Assign Delivery Zones</label>
                <Popover open={isZoneDropdownOpen} onOpenChange={setIsZoneDropdownOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={isZoneDropdownOpen}
                      className="w-full justify-between min-h-10 h-auto py-2 px-3 rounded-xl border-slate-200 bg-slate-50 hover:bg-white hover:border-sky-500"
                    >
                      <div className="flex flex-wrap gap-1.5 items-center">
                        {selectedZones.length === 0 ? (
                          <span className="text-sm text-slate-400 font-normal">Select zones...</span>
                        ) : (
                          selectedZones.map(id => {
                            const zone = availableZones.find(z => z.id === id);
                            if (!zone) return null;
                            return (
                              <Badge key={id} variant="secondary" className="bg-sky-100 text-sky-800 hover:bg-sky-200 text-[10px] px-2 py-0.5 rounded-md">
                                {zone.name}
                                <X 
                                  className="ml-1 h-3 w-3 cursor-pointer hover:text-rose-600" 
                                  onClick={(e) => { e.stopPropagation(); toggleZone(id); }} 
                                />
                              </Badge>
                            );
                          })
                        )}
                      </div>
                      <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[430px] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search zones..." className="text-xs h-10" />
                      <CommandList>
                        <CommandEmpty className="text-xs text-slate-400 p-4 text-center">No zones found.</CommandEmpty>
                        <CommandGroup className="max-h-48 overflow-y-auto custom-scrollbar p-1">
                          {availableZones.map(zone => (
                            <CommandItem
                              key={zone.id}
                              value={zone.name}
                              onSelect={() => toggleZone(zone.id)}
                              className="flex items-center justify-between px-3 py-2 text-sm cursor-pointer rounded-lg"
                            >
                              <span className="text-slate-700 font-medium">{zone.name}</span>
                              <Check className={`h-4 w-4 text-sky-600 ${selectedZones.includes(zone.id) ? "opacity-100" : "opacity-0"}`} />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            )}

            <div className="pt-4 flex gap-3 border-t border-slate-100">
              {!staff && (
                <Button type="button" variant="outline" onClick={() => setStep("SELECT_ROLE")} className="rounded-xl px-4">
                  Back
                </Button>
              )}
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 rounded-xl">
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading || !name.trim() || !email.trim()} className="flex-1 rounded-xl bg-sky-600 hover:bg-sky-700 text-white">
                {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                {staff ? "Save Changes" : "Create Account"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}