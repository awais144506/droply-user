"use client";

import React, { useId } from "react";
import { useFormContext, get } from "react-hook-form";
import { MapPin, ClipboardPaste, Lock, X, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface FormCoordinatesInputProps {
    latName?: string;
    lngName?: string;
    label?: string;
    required?: boolean;
    disabled?: boolean;
    className?: string;
}

// Helper to parse "51.708921991042466, 8.770052475830951" or Google Maps URLs
function parseCoordinates(raw: string): { lat: number; lng: number } | null {
    if (!raw) return null;
    const text = raw.trim();

    // 1. Match Google Maps URLs if someone copied the URL instead of right-clicking
    const urlMatch = text.match(/(?:@|\?q=|&q=|ll=)(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/);
    if (urlMatch) {
        const lat = parseFloat(urlMatch[1]);
        const lng = parseFloat(urlMatch[2]);
        if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
            return { lat, lng };
        }
    }

    // 2. Match standard Google Maps right-click copy: "51.708921991042466, 8.770052475830951"
    const parts = text.split(/[,\s]+/).filter(Boolean);
    if (parts.length >= 2) {
        const lat = parseFloat(parts[0]);
        const lng = parseFloat(parts[1]);
        if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
            return { lat, lng };
        }
    }

    return null;
}

export function FormCoordinatesInput({
    latName = "latitude",
    lngName = "longitude",
    label = "Customer GPS Coordinates",
    required = false,
    disabled = false,
    className = "",
}: FormCoordinatesInputProps) {
    const {
        register,
        setValue,
        watch,
        formState: { errors },
    } = useFormContext();

    const latId = useId();
    const lngId = useId();

    const latValue = watch(latName);
    const lngValue = watch(lngName);

    const latError = get(errors, latName)?.message as string | undefined;
    const lngError = get(errors, lngName)?.message as string | undefined;
    const hasValues =
        latValue !== undefined &&
        latValue !== "" &&
        latValue !== null &&
        lngValue !== undefined &&
        lngValue !== "" &&
        lngValue !== null;

    const applyText = (text: string) => {
        const parsed = parseCoordinates(text);
        if (!parsed) {
            toast.error(
                "Invalid format! Right-click a pin on Google Maps and click the coordinates (e.g. 51.7089, 8.7700)."
            );
            return;
        }

        setValue(latName, parsed.lat, { shouldValidate: true, shouldDirty: true });
        setValue(lngName, parsed.lng, { shouldValidate: true, shouldDirty: true });
        toast.success("Latitude & Longitude populated!");
    };

    const handlePasteClick = async () => {
        if (disabled) return;
        try {
            const clipboardText = await navigator.clipboard.readText();
            if (!clipboardText) {
                toast.error("Clipboard is empty. Copy coordinates from Google Maps first.");
                return;
            }
            applyText(clipboardText);
        } catch {
            toast.error("Clipboard permission blocked. Click inside the box and press Ctrl+V.");
        }
    };

    // Fallback in case browser blocks navigator.clipboard and user presses Ctrl+V on the locked input
    const handleManualPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (disabled) return;
        const pasted = e.clipboardData.getData("text");
        applyText(pasted);
    };

    const handleClear = () => {
        if (disabled) return;
        setValue(latName, "", { shouldValidate: true, shouldDirty: true });
        setValue(lngName, "", { shouldValidate: true, shouldDirty: true });
    };

    return (
        <div
            className={`rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 space-y-3 ${className}`}
        >
            {/* Header Row: Label + Paste Action Button */}
            <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center text-xs font-bold text-slate-700 uppercase tracking-wide">
                    <MapPin className="h-3.5 w-3.5 mr-1.5 text-sky-600 shrink-0" />
                    {label}
                    {required && <span className="text-rose-500 ml-1">*</span>}
                </div>

                <div className="flex items-center gap-1.5">
                    {hasValues && !disabled && (
                        <button
                            type="button"
                            onClick={handleClear}
                            title="Clear coordinates"
                            className="h-7 px-2 rounded-lg border border-slate-200 bg-white hover:bg-rose-50 hover:border-rose-200 text-slate-500 hover:text-rose-600 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                            <X className="h-3 w-3" /> Clear
                        </button>
                    )}

                    <button
                        type="button"
                        disabled={disabled}
                        onClick={handlePasteClick}
                        className="h-7 px-3 rounded-lg bg-sky-600 hover:bg-sky-700 active:scale-95 text-white text-[11px] font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ClipboardPaste className="h-3.5 w-3.5" />
                        Paste Lat & Lng
                    </button>
                </div>
            </div>

            {/* Two Locked Inputs (Latitude & Longitude) */}
            <div className="grid grid-cols-2 gap-3">
                {/* Locked Latitude Input */}
                <div className="space-y-1">
                    <label
                        htmlFor={latId}
                        className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider"
                    >
                        <span>Latitude</span>
                        <Lock className="h-2.5 w-2.5 text-slate-400" />
                    </label>
                    <input
                        id={latId}
                        type="number"
                        step="any"
                        readOnly
                        tabIndex={0}
                        onPaste={handleManualPaste}
                        placeholder="Locked — click Paste"
                        {...register(latName)}
                        aria-invalid={!!latError}
                        className={`w-full h-10 px-3 rounded-xl border text-xs font-mono font-semibold select-all focus:outline-none transition-all ${latError
                                ? "border-rose-300 bg-rose-50/30 text-rose-900"
                                : hasValues
                                    ? "bg-white border-emerald-300 text-slate-900 shadow-xs"
                                    : "bg-slate-100/90 border-slate-200 text-slate-500 cursor-not-allowed"
                            }`}
                    />
                    {latError && <p className="text-[10px] text-rose-500">{latError}</p>}
                </div>

                {/* Locked Longitude Input */}
                <div className="space-y-1">
                    <label
                        htmlFor={lngId}
                        className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider"
                    >
                        <span>Longitude</span>
                        <Lock className="h-2.5 w-2.5 text-slate-400" />
                    </label>
                    <input
                        id={lngId}
                        type="number"
                        step="any"
                        readOnly
                        tabIndex={0}
                        onPaste={handleManualPaste}
                        placeholder="Locked — click Paste"
                        {...register(lngName)}
                        aria-invalid={!!lngError}
                        className={`w-full h-10 px-3 rounded-xl border text-xs font-mono font-semibold select-all focus:outline-none transition-all ${lngError
                                ? "border-rose-300 bg-rose-50/30 text-rose-900"
                                : hasValues
                                    ? "bg-white border-emerald-300 text-slate-900 shadow-xs"
                                    : "bg-slate-100/90 border-slate-200 text-slate-500 cursor-not-allowed"
                            }`}
                    />
                    {lngError && <p className="text-[10px] text-rose-500">{lngError}</p>}
                </div>
            </div>

            {/* Step-by-Step Helper Note */}
            <div className="flex items-center justify-between gap-2 pt-0.5 text-[10px] text-slate-500">
                <p className="leading-relaxed">
                    <span className="font-bold text-slate-700">How to copy:</span> Go to{" "}
                    <a
                        href="https://www.google.com/maps"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sky-600 hover:underline font-semibold inline-flex items-center gap-0.5"
                    >
                        Google Maps <ExternalLink className="h-2.5 w-2.5" />
                    </a>{" "}
                    &rarr; <b>Right-click</b> on pin location &rarr; Click the{" "}
                    <span className="font-mono bg-slate-200/70 text-slate-700 px-1 py-0.5 rounded">
                        lat, lng
                    </span>{" "}
                    numbers at the top of the menu &rarr; Click <b>Paste Lat &amp; Lng</b>.
                </p>
            </div>
        </div>
    );
}