/* eslint-disable react-hooks/incompatible-library */
"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Building2, Upload, Loader2, Save, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { BranchSettingData } from "../api/use-branch-settings";
import { InvoicePreview } from "./invoice-preview";
import { FormInput } from "@/components/ui/form-input";
import { useUploadThing } from "@/lib/uploadthing";

const branchSettingsSchema = yup.object().shape({
  displayName: yup.string().required("Display Name is required"),
  displayPhone: yup.string().required("Phone Number is required"),
  displayEmail: yup.string().email("Must be a valid email address").optional(),
  displayAddress: yup.string().optional(),
});

interface BranchSettingsFormProps {
  initialData: BranchSettingData;
  onSubmit: (data: Partial<BranchSettingData>) => void;
  isPending: boolean;
}

export function BranchSettingsForm({ initialData, onSubmit, isPending }: BranchSettingsFormProps) {
  // Safe initial logo parsing
  const rawLogo = initialData?.logoUrl;
  const safeInitialLogo = typeof rawLogo === 'string' && rawLogo.startsWith('http') ? rawLogo : null;

  // React State for the Image Lifecycle
  const [logoPreview, setLogoPreview] = useState<string | null>(safeInitialLogo);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLogoRemoved, setIsLogoRemoved] = useState<boolean>(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, watch, formState: { errors, isValid, isDirty } } = useForm<Partial<BranchSettingData>>({
    resolver: yupResolver(branchSettingsSchema),
    mode: "onChange",
    defaultValues: {
      displayName: initialData?.displayName || "",
      displayPhone: initialData?.displayPhone || "",
      displayEmail: initialData?.displayEmail || "",
      displayAddress: initialData?.displayAddress || "",
    },
  });

  const liveData = watch();

  const { startUpload, isUploading } = useUploadThing("branchLogo");

  // Check if anything at all has changed (Form Text OR Logo Image)
  const hasLogoChanged = !!selectedFile || (isLogoRemoved && safeInitialLogo !== null);
  const isFormDirty = isDirty || hasLogoChanged;

  const handleUploadClick = () => { fileInputRef.current?.click(); };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 4 * 1024 * 1024) {
      toast.error("File size exceeds 4MB limit.");
      e.target.value = "";
      return;
    }

    // Just show local preview and queue the file for later
    const previewUrl = URL.createObjectURL(file);
    setLogoPreview(previewUrl);
    setSelectedFile(file);
    setIsLogoRemoved(false);
  };

  const removeLogo = () => {
    setLogoPreview(null);
    setSelectedFile(null);
    setIsLogoRemoved(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // 🔥 NEW SUBMIT HANDLER: Uploads the image FIRST, then saves the form
  const handleFormSubmit = async (data: Partial<BranchSettingData>) => {
    let finalLogoUrl = isLogoRemoved ? undefined : safeInitialLogo;

    // 1. If a new file was chosen, upload it now
    if (selectedFile) {
      try {
        const currentUrl = safeInitialLogo;
        const isValidRemoteUrl = currentUrl && (currentUrl.includes("utfs.io") || currentUrl.includes(".ufs.sh"));

        const res = await startUpload([selectedFile], {
          oldImageUrl: isValidRemoteUrl ? currentUrl : undefined
        });

        if (res && res.length > 0) {
          finalLogoUrl = res[0].ufsUrl;
        } else {
          toast.error("Failed to upload logo.");
          return; // Abort saving if upload failed
        }
      } catch (error: any) {
        toast.error(`Upload failed: ${error.message}`);
        return; // Abort saving if upload failed
      }
    }
    onSubmit({ ...data, logoUrl: finalLogoUrl });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

      {/* LEFT COLUMN: THE FORM */}
      <div className="lg:col-span-2">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
          
          {/* Submit Button */}
          <div className="flex justify-start">
            <Button
              type="submit"
              // 🔥 Button perfectly disabled if no changes, invalid inputs, or currently loading
              disabled={!isFormDirty || !isValid || isPending || isUploading}
              variant="create"
            >
              {isPending || isUploading ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> {isUploading ? "Uploading Logo..." : "Saving..."}</>
              ) : (
                <><Save className="h-4 w-4 mr-2" /> Save Settings</>
              )}
            </Button>
          </div>

          {/* Logo Upload Section */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Invoice Logo</h3>
            <p className="text-xs text-slate-500 mb-6">This logo will appear on your printed invoices and PDFs.</p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="relative h-24 w-24 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-slate-400 overflow-hidden group shrink-0">
                {typeof logoPreview === 'string' && (logoPreview.startsWith('http') || logoPreview.startsWith('blob')) ? (
                  <>
                    <Image src={logoPreview} alt="Branch Logo" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-contain p-2" />
                    <button type="button" onClick={removeLogo} className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="h-6 w-6 text-white" />
                    </button>
                  </>
                ) : (
                  <Building2 className="h-8 w-8 opacity-20" />
                )}
              </div>
              <div className="space-y-3">
                <input type="file" accept="image/png, image/jpeg, image/svg+xml" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleUploadClick}
                  disabled={isUploading}
                  className="h-9 text-xs font-semibold rounded-lg cursor-pointer hover:bg-slate-50"
                >
                  <Upload className="h-3.5 w-3.5 mr-2 text-sky-600" /> {logoPreview ? "Change Logo" : "Upload New Logo"}
                </Button>
                <p className="text-[10px] text-slate-400 font-medium">PNG, JPG or SVG. Max size 4MB.</p>
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
              {/* Display Name */}
              <div className="space-y-1.5">
                <FormInput
                  label="Display Name"
                  required
                  register={register("displayName")}
                  placeholder="e.g. Droply - Main Branch"
                  error={errors.displayName?.message}
                />
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <FormInput
                  label="Contact No"
                  required
                  register={register("displayPhone")}
                  placeholder="e.g. 03001234567"
                  error={errors.displayPhone?.message}
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <FormInput
                  label="Email"
                  register={register("displayEmail")}
                  placeholder="e.g. branch@droply.com"
                  error={errors.displayEmail?.message}
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-1.5">
              <FormInput
                label="Branch Address"
                register={register("displayAddress")}
                placeholder="e.g. Droply Main Branch, Lahore."
                error={errors.displayAddress?.message}
              />
            </div>
          </div>

        </form>
      </div>

      {/* RIGHT COLUMN: THE PREVIEW */}
      <div className="lg:col-span-1 hidden lg:block">
        <InvoicePreview data={liveData} logoUrl={logoPreview} />
      </div>

    </div>
  );
}