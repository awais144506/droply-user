
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useMemo } from "react";
import { FormProvider } from "react-hook-form";
import {
    CreditCard,
    ShieldCheck,
    UploadCloud,
    Banknote,
    Landmark,
    Hash,
    FileImage,
    FileText,
    Loader2,
    X,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FormInput } from "@/components/ui/form-input";
import { FormSelect, SelectOption } from "@/components/ui/form-select";
import { PaymentChannels } from "./payment-channels";
import { useUploadThing } from "@/lib/uploadthing";
import { getCheckoutSchema, CheckoutSubmitPayload } from "../../schema/payment.schema";
import { useAppForm } from "@/lib/hooks/use-app-form";
import { compressImageFile } from "@/lib/utils/functions/compress-image";

const PAYMENT_TYPE_OPTIONS: SelectOption[] = [
    { label: "Bank Transfer", value: "BANK" },
    { label: "JazzCash", value: "JAZZ_CASH" },
    { label: "Easypaisa", value: "EASY_PAISA" },
    { label: "Other", value: "OTHER" },
];

type Props = {
    amountDue: number;
    requirePayment: boolean;
    isRenewal: boolean;
    buttonText: string;
    buttonClass: string;
    isButtonDisabled: boolean;
    isSubmittingPayment?: boolean;
    onSubmitPayment: (data: CheckoutSubmitPayload) => Promise<void> | void;
};

export default function CheckoutArea({
    amountDue,
    requirePayment,
    isRenewal,
    buttonText,
    buttonClass,
    isButtonDisabled,
    isSubmittingPayment = false,
    onSubmitPayment,
}: Props) {

    const schema = useMemo(() => getCheckoutSchema(requirePayment), [requirePayment]);

    const methods = useAppForm(schema, {
        amountPaid: requirePayment ? amountDue : 0,
        type: "BANK",
        transactionId: "",
        receiptImage: undefined,
    })

    const { startUpload, isUploading } = useUploadThing("paymentReceipt", {
        onUploadError: (err) => {
            console.error("🔥 REAL UPLOADTHING ERROR:", err.message, err.data);
            methods.setError("receiptImage", { message: `Upload Error: ${err.message}` });
        },
    });

    useEffect(() => {
        methods.setValue("amountPaid", requirePayment ? amountDue : 0, { shouldValidate: !!requirePayment });
    }, [amountDue, requirePayment, methods]);

    const selectedFile = methods.watch("receiptImage");
    const fileError = methods.formState.errors.receiptImage?.message as string | undefined;

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Compress image right before setting into form state
            const compressedFile = await compressImageFile(file);
            methods.setValue("receiptImage", compressedFile, { shouldValidate: true });
        }
    };

    const removeFile = (e: React.MouseEvent) => {
        e.preventDefault();
        methods.setValue("receiptImage", undefined as any, { shouldValidate: true });
        const fileInput = document.getElementById("receipt-upload") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
    };

    const onSubmit = async (data: any) => {
        if (!requirePayment) {
            await onSubmitPayment({ amountPaid: 0, type: "BANK", imageUrl: "", isRenewal });
            return;
        }

        const file = data.receiptImage as File;
        const uploadResponse = await startUpload([file]);
        const uploadedUrl = uploadResponse?.[0]?.ufsUrl || uploadResponse?.[0]?.url;

        if (!uploadedUrl) {
            methods.setError("receiptImage", { message: "Upload failed. Could not retrieve URL." });
            return;
        }
        await onSubmitPayment({
            amountPaid: Number(data.amountPaid),
            type: data.type,
            transactionId: data.transactionId?.trim() || undefined,
            imageUrl: uploadedUrl,
            isRenewal,
        });
    };

    const isBusy = isUploading || isSubmittingPayment;
    const isPdf = selectedFile?.type === "application/pdf";

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="h-full flex flex-col">
                <Card className="rounded-2xl border-slate-200 shadow-sm overflow-hidden flex flex-col flex-1 bg-slate-50">
                    <div className="p-6 border-b border-slate-200 bg-white flex items-center justify-between">
                        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                            <CreditCard className="w-5 h-5 text-indigo-600" />
                            2. Checkout & Verification
                        </h3>
                        <div className="text-right">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Amount Due</p>
                            <p className={`text-xl font-black ${requirePayment ? "text-emerald-600" : "text-slate-400"}`}>
                                Rs. {requirePayment ? amountDue.toLocaleString() : "0"}
                            </p>
                        </div>
                    </div>

                    <CardContent className={`p-6 flex-1 flex flex-col transition-opacity duration-300 ${requirePayment && !isBusy ? "opacity-100" : "opacity-40 pointer-events-none"}`}>
                        <div className="mb-6">
                            <PaymentChannels />
                        </div>

                        <div className="space-y-4 mt-auto border-t border-slate-200 pt-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormInput
                                    name="amountPaid"
                                    label="Amount Paid"
                                    type="number"
                                    prefix="Rs."
                                    placeholder="0"
                                    disabled
                                    labelIcon={Banknote}
                                    iconColor="text-emerald-600"
                                    className="bg-white font-bold"
                                />

                                <FormSelect
                                    name="type"
                                    label="Payment Channel"
                                    options={PAYMENT_TYPE_OPTIONS}
                                    placeholder="Select channel..."
                                    disabled={!requirePayment || isBusy}
                                    labelIcon={Landmark}
                                    iconColor="text-indigo-600"
                                />
                            </div>

                            <FormInput
                                name="transactionId"
                                label="Transaction Reference / TID (Optional)"
                                type="text"
                                placeholder="e.g. 0123456789"
                                disabled={!requirePayment || isBusy}
                                labelIcon={Hash}
                                iconColor="text-slate-500"
                                className="bg-white font-mono"
                            />

                            <div className="space-y-1.5">
                                <Label className="flex items-center text-xs font-bold text-slate-700 uppercase tracking-wide">
                                    <UploadCloud className="h-3.5 w-3.5 mr-1.5 text-sky-500" />
                                    Upload Payment Receipt (Image Only)
                                    <span className="text-rose-500 ml-1">*</span>
                                </Label>

                                <label className={`flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-xl transition-colors px-4 ${fileError ? "border-rose-300 bg-rose-50/30" : selectedFile ? "border-emerald-300 bg-emerald-50/30" : "border-slate-300 bg-white hover:bg-indigo-50/50"} ${requirePayment && !isBusy ? "cursor-pointer" : "cursor-not-allowed"}`}>
                                    {selectedFile ? (
                                        <div className="flex items-center justify-between w-full max-w-sm bg-white p-2.5 rounded-lg border border-emerald-200 shadow-sm">
                                            <div className="flex items-center gap-2.5 overflow-hidden">
                                                {isPdf ? <FileText className="w-5 h-5 text-rose-500 shrink-0" /> : <FileImage className="w-5 h-5 text-emerald-600 shrink-0" />}
                                                <div className="truncate">
                                                    <p className="text-xs font-bold text-slate-800 truncate">{selectedFile.name}</p>
                                                    <p className="text-[10px] text-slate-400 uppercase">{isPdf ? "PDF Document" : "Image"} {(selectedFile.size / 1024).toFixed(1)} KB</p>
                                                </div>
                                            </div>
                                            <button type="button" onClick={removeFile} disabled={isBusy} className="p-1 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition-colors">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center text-slate-500">
                                            <UploadCloud className="w-6 h-6 mb-1 text-slate-400" />
                                            <p className="text-xs font-semibold">Click to upload receipt</p>
                                            <p className="text-[10px] text-slate-400">PNG, JPG (Max 2MB)</p>
                                        </div>
                                    )}
                                    <input id="receipt-upload" disabled={!requirePayment || isBusy} type="file" className="hidden" accept="image/*,application/pdf" onChange={handleFileChange} />
                                </label>
                                {fileError && <p className="text-[10px] text-rose-500 mt-1 font-medium">{fileError}</p>}
                            </div>
                        </div>
                    </CardContent>

                    <div className="p-6 bg-white border-t border-slate-200">
                        <Button type="submit" disabled={isButtonDisabled || isBusy} className={`w-full h-14 font-bold rounded-xl shadow-sm text-base transition-all duration-300 ${buttonClass}`}>
                            {isBusy ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    {isUploading ? "Uploading Receipt..." : "Submitting..."}
                                </>
                            ) : (
                                <>
                                    {!isButtonDisabled && requirePayment && <ShieldCheck className="w-5 h-5 mr-2" />}
                                    {buttonText}
                                </>
                            )}
                        </Button>
                    </div>
                </Card>
            </form>
        </FormProvider>
    );
}