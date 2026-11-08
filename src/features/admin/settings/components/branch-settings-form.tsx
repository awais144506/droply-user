/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/incompatible-library */
"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Building2, Upload, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { BranchSettingData } from "../types/settings";
import { InvoicePreview } from "./invoice-preview";
import { useUploadThing } from "@/lib/uploadthing";
import { branchSettingsSchema, BranchSettingsFormValues } from "../schema/update-branch-settings.schema";
import { FormInput } from "@/components/ui/form-input";
import { FormPhoneInput } from "@/components/ui/form-phone-input";
import { compressImageFile } from "@/lib/utils/functions/compress-image";

interface BranchSettingsFormProps {
  initialData: BranchSettingData;
  onSubmit: (data: Partial<BranchSettingData>) => void;
  isPending: boolean;
}

export function BranchSettingsForm({ initialData, onSubmit, isPending }: BranchSettingsFormProps) {
  const rawLogo = initialData?.logoUrl;
  const safeInitialLogo = typeof rawLogo === 'string' && rawLogo.startsWith('http') ? rawLogo : null;

  const [logoPreview, setLogoPreview] = useState<string | null>(safeInitialLogo);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLogoRemoved, setIsLogoRemoved] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const methods = useForm<BranchSettingsFormValues>({
    resolver: yupResolver(branchSettingsSchema),
    mode: "onChange",
    defaultValues: {
      name: initialData?.name || "",
      phone: initialData?.phone || "",
      email: initialData?.email || "",
      address: initialData?.address || "",
      ntn: initialData?.ntn || "",
      strn: initialData?.strn || "",
    },
  });

  const { handleSubmit, watch, formState: { isValid, isDirty } } = methods;
  const liveData = watch();

  const { startUpload, isUploading } = useUploadThing("branchLogo");

  // 🔥 Strict tracking of whether the logo has actually been modified or removed
  const hasLogoChanged = !!selectedFile || (isLogoRemoved && safeInitialLogo !== null);
  const isFormDirty = isDirty || hasLogoChanged;

  const handleUploadClick = () => { fileInputRef.current?.click(); };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB limit.");
      e.target.value = "";
      return;
    }

    try {
      // 🔥 Compress the image file using our utility function
      const compressedFile = await compressImageFile(file);
      const previewUrl = URL.createObjectURL(compressedFile);

      setLogoPreview(previewUrl);
      setSelectedFile(compressedFile);
      setIsLogoRemoved(false);
    } catch (error) {
      toast.error("Failed to process and compress image.");
    }
  };

  const handleFormSubmit = async (data: Partial<BranchSettingData>) => {
    let logoUrl = isLogoRemoved ? undefined : safeInitialLogo;

    if (selectedFile) {
      try {
        const currentUrl = safeInitialLogo;
        const isValidRemoteUrl = currentUrl && (currentUrl.includes("utfs.io") || currentUrl.includes(".ufs.sh"));

        const res = await startUpload([selectedFile], {
          oldImageUrl: isValidRemoteUrl ? currentUrl : undefined
        });

        if (res && res.length > 0) {
          logoUrl = res[0].ufsUrl;
        } else {
          toast.error("Failed to upload logo.");
          return;
        }
      } catch (error: any) {
        toast.error(`Upload failed: ${error.message}`);
        return;
      }
    }
    const finalPayload = { ...data, logoUrl: logoUrl || "" };
    await onSubmit(finalPayload);
    methods.reset({
      name: data.name || "",
      phone: data.phone || "",
      email: data.email || "",
      address: data.address || "",
      ntn: data.ntn || "",
      strn: data.strn || "",
    });
    setSelectedFile(null);
    setIsLogoRemoved(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
            <div className="flex justify-start">
              <Button
                type="submit"
                disabled={!isFormDirty || !isValid || isPending || isUploading}
                variant="default"
              >
                {isPending || isUploading ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> {isUploading ? "Uploading Logo..." : "Saving..."}</>
                ) : (
                  <><Save className="h-4 w-4 mr-2" /> Save Settings</>
                )}
              </Button>
            </div>

            {/* Logo Upload Section */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-1">Invoice Logo</h3>
              <p className="text-xs text-slate-500 mb-6">This logo will appear on your printed invoices and PDFs.</p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="relative h-24 w-24 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center text-slate-400 overflow-hidden group shrink-0">
                  {typeof logoPreview === 'string' && (logoPreview.startsWith('http') || logoPreview.startsWith('blob')) ? (
                    <>
                      <Image src={logoPreview} alt="Branch Logo" fill sizes="(max-width: 768px) 100vw, 33vw" className="object-contain p-2" />
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
                  <p className="text-[10px] text-slate-600 font-medium">PNG, JPG or SVG. Compressed automatically.</p>
                </div>
              </div>
            </div>

            {/* Branch Details Section */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">Branch Details</h3>
                <p className="text-xs text-slate-500">Update the contact information displayed to your customers and suppliers.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <FormInput
                    name="name"
                    label="Name"
                    required
                    placeholder="e.g. Droply - Main Branch"
                  />
                </div>

                <div className="space-y-1.5">
                  <FormPhoneInput
                    name="phone"
                    label="Contact No"
                    required
                    placeholder="e.g. 03001234567"
                  />
                </div>

                <div className="space-y-1.5">
                  <FormInput
                    name="email"
                    label="Email"
                    placeholder="e.g. branch@droply.com"
                  />
                </div>

                <div className="space-y-1.5">
                  <FormInput
                    name="ntn"
                    label="NTN"
                    placeholder="e.g. 2532465134"
                  />
                </div>

                <div className="space-y-1.5">
                  <FormInput
                    name="strn"
                    label="STRN"
                    placeholder="e.g. 55-12254"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <FormInput
                  label="Branch Address"
                  name="address"
                  placeholder="e.g. Droply Main Branch, Lahore."
                />
              </div>
            </div>
          </form>
        </FormProvider>
      </div>

      {/* RIGHT COLUMN: THE PREVIEW */}
      <div className="lg:col-span-1 hidden lg:block">
        <InvoicePreview data={liveData} logoUrl={logoPreview} />
      </div>
    </div>
  );
}