"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Building2, Phone, Mail, MapPin, Upload, Loader2, Save, X } from "lucide-react";
import { toast } from "sonner";
import { branchSettingsSchema, BranchSettingsData } from "../api/use-branch-settings";
import { Button } from "@/components/ui/button";

interface BranchSettingsFormProps {
  initialData: BranchSettingsData;
  onSubmit: (data: BranchSettingsData) => void;
  isPending: boolean;
}

export function BranchSettingsForm({ initialData, onSubmit, isPending }: BranchSettingsFormProps) {
  // Setup file upload state and ref
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, formState: { errors, isDirty } } = useForm<BranchSettingsData>({
    resolver: yupResolver(branchSettingsSchema),
    defaultValues: initialData,
  });

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (Max 3MB)
    if (file.size > 3 * 1024 * 1024) {
      toast.error("File size exceeds 2MB limit. Please choose a smaller image.");
      e.target.value = ""; // Reset input
      return;
    }

    // Create a local URL for instant preview
    const previewUrl = URL.createObjectURL(file);
    setLogoPreview(previewUrl);
    
    // Note: In a real app, you would also use form's `setValue('logo', file, { shouldDirty: true })` 
    // to include the file in your API payload.
  };

  const removeLogo = () => {
    setLogoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset input
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Logo Upload Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-1">Invoice Logo</h3>
        <p className="text-xs text-slate-500 mb-6">This logo will appear on your printed invoices and PDFs.</p>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Preview Box */}
          <div className="relative h-24 w-24 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-slate-400 overflow-hidden group shrink-0">
            {logoPreview ? (
              <>
                <Image src={logoPreview} alt="Branch Logo" fill className="object-contain p-2" />
                <button 
                  type="button"
                  onClick={removeLogo}
                  className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-6 w-6 text-white" />
                </button>
              </>
            ) : (
              <Building2 className="h-8 w-8 opacity-20" />
            )}
          </div>

          <div className="space-y-3">
            {/* Hidden File Input */}
            <input 
              type="file" 
              accept="image/png, image/jpeg, image/svg+xml"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleUploadClick}
              className="h-9 text-xs font-semibold rounded-lg cursor-pointer hover:bg-slate-50"
            >
              <Upload className="h-3.5 w-3.5 mr-2 text-sky-600" /> 
              {logoPreview ? "Change Logo" : "Upload New Logo"}
            </Button>
            <p className="text-[10px] text-slate-400 font-medium">PNG, JPG or SVG. Max size 2MB.</p>
          </div>
        </div>
      </div>

      {/* Branch Details Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-1">Branch Details</h3>
          <p className="text-xs text-slate-500">Update the contact information displayed to your customers and suppliers.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Display Name</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                {...register("branchName")}
                className={`w-full h-10 pl-10 pr-4 rounded-xl border text-sm focus:outline-none focus:ring-2 bg-slate-50 focus:bg-white transition-colors ${errors.branchName ? "border-rose-300 focus:ring-rose-500" : "border-slate-200 focus:ring-sky-500/20 focus:border-sky-500"}`}
              />
            </div>
            {errors.branchName && <p className="text-[11px] font-medium text-rose-500">{errors.branchName.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Contact Phone</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                {...register("phone")}
                className={`w-full h-10 pl-10 pr-4 rounded-xl border text-sm font-mono focus:outline-none focus:ring-2 bg-slate-50 focus:bg-white transition-colors ${errors.phone ? "border-rose-300 focus:ring-rose-500" : "border-slate-200 focus:ring-sky-500/20 focus:border-sky-500"}`}
              />
            </div>
            {errors.phone && <p className="text-[11px] font-medium text-rose-500">{errors.phone.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Billing Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                {...register("email")}
                className={`w-full h-10 pl-10 pr-4 rounded-xl border text-sm focus:outline-none focus:ring-2 bg-slate-50 focus:bg-white transition-colors ${errors.email ? "border-rose-300 focus:ring-rose-500" : "border-slate-200 focus:ring-sky-500/20 focus:border-sky-500"}`}
              />
            </div>
            {errors.email && <p className="text-[11px] font-medium text-rose-500">{errors.email.message}</p>}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Physical Address</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <textarea
              {...register("address")}
              rows={3}
              className={`w-full py-2 pl-10 pr-4 rounded-xl border text-sm focus:outline-none focus:ring-2 bg-slate-50 focus:bg-white transition-colors resize-none ${errors.address ? "border-rose-300 focus:ring-rose-500" : "border-slate-200 focus:ring-sky-500/20 focus:border-sky-500"}`}
            />
          </div>
          {errors.address && <p className="text-[11px] font-medium text-rose-500">{errors.address.message}</p>}
        </div>
      </div>

      <div className="flex justify-end">
        <Button 
          type="submit" 
          disabled={(!isDirty && !logoPreview) || isPending}
          className="bg-sky-600 hover:bg-sky-700 text-white h-10 px-6 rounded-xl shadow-sm cursor-pointer min-w-[140px]"
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="h-4 w-4 mr-2" /> Save Settings</>}
        </Button>
      </div>
    </form>
  );
}