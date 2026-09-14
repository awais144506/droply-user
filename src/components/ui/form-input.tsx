"use client";

import { ReactNode, useId } from "react";
import { useFormContext } from "react-hook-form";

interface FormInputProps {
    name: string;
    label?: string | ReactNode; // 🔥 Made optional for data grids
    type?: "text" | "number" | "date";
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    prefix?: string;
    suffix?: string;
    helperText?: ReactNode;
    min?: number;
    max?: number;
    className?: string; // 🔥 Added to allow custom styling (like text-center)
}

export function FormInput({
    name,
    label,
    type = "text",
    placeholder,
    disabled = false,
    required = false,
    prefix,
    suffix,
    helperText,
    min,
    max,
    className = "" // Default to empty string
}: FormInputProps) {

    const { register, formState: { errors } } = useFormContext();
    const error = errors[name]?.message as string;
    const inputId = useId();

    return (
        <div className="space-y-1.5 w-full">
            {/* Conditionally render the label only if it exists */}
            {label && (
                <label htmlFor={inputId} className="flex items-center text-xs font-bold text-slate-700 uppercase tracking-wide cursor-pointer">
                    {label}
                    {required && <span className="text-rose-500 ml-1">*</span>}
                </label>
            )}

            <div className="relative">
                {prefix && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                        {prefix}
                    </span>
                )}
                <input
                    id={inputId}
                    type={type}
                    step={type === "number" ? "any" : undefined}
                    placeholder={placeholder}
                    disabled={disabled}
                    min={min}
                    max={max}
                    {...register(name)}
                    aria-invalid={!!error}
                    className={`w-full h-10 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all shadow-sm
                        ${prefix ? "pl-8" : "px-3"} 
                        ${suffix ? "pr-8" : "px-3"} 
                        ${disabled
                            ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
                            : error
                                ? "border-rose-300 focus:ring-rose-500 bg-rose-50/20 text-rose-900"
                                : "bg-slate-50 border-slate-200 focus:ring-sky-500/20 focus:border-sky-500 focus:bg-white text-slate-900"
                        } ${className}`} // 🔥 Merge custom classes here
                />
                {suffix && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 uppercase">
                        {suffix}
                    </span>
                )}
            </div>
            {error && <p className="text-[10px] text-rose-500 mt-1">{error}</p>}
            {!error && helperText && <div className="mt-1 text-[10px] text-slate-500">{helperText}</div>}
        </div>
    );
}