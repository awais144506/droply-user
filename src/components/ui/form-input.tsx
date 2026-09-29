"use client";

import { ReactNode, useId } from "react";
import { useFormContext, Controller } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface FormInputProps {
    name: string;
    label?: string | ReactNode;
    type?: "text" | "number" | "date";
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    prefix?: string;
    suffix?: string;
    helperText?: ReactNode;
    min?: number;
    max?: number;
    className?: string;
    lableTextColor?: string;
    disablePastDates?: boolean;
    disableFutureDates?: boolean;
    labelIcon?: LucideIcon,
    iconColor?: string;
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
    className = "",
    lableTextColor = "text-slate-700",
    disablePastDates = false,
    disableFutureDates = false,
    labelIcon: Icon,
    iconColor = "text-sky-500",
}: FormInputProps) {
    const { register, control, formState: { errors } } = useFormContext();
    const error = errors[name]?.message as string;
    const inputId = useId();

    return (
        <div className="space-y-1.5 w-full">
            {label && (
                <label htmlFor={inputId} className={`flex items-center text-xs font-bold ${lableTextColor} uppercase tracking-wide cursor-pointer`}>
                    {Icon && <Icon className={`h-3.5 w-3.5 mr-1.5 ${iconColor}`} />}
                    {label}
                    {required && <span className="text-rose-500 ml-1">*</span>}
                </label>
            )}

            <div className="relative">
                {prefix && type !== "date" && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                        {prefix}
                    </span>
                )}

                {type === "date" ? (
                    <Controller
                        name={name}
                        control={control}
                        render={({ field }) => (
                            <Popover>
                                {/* Removed asChild to prevent button-in-button hydration errors */}
                                <PopoverTrigger>
                                    {/* Changed from <Button> to <div> so PopoverTrigger handles the button mechanics natively */}
                                    <div
                                        id={inputId}
                                        className={cn(
                                            "w-full flex items-center px-4 h-10 rounded-xl border text-sm font-normal justify-start shadow-sm transition-colors",
                                            !field.value && "text-slate-500",
                                            disabled ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed pointer-events-none" : "cursor-pointer",
                                            error ? "border-rose-300 bg-rose-50/20 text-rose-900" : "bg-slate-50 border-slate-200 hover:bg-white text-slate-900",
                                            className
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                                        {field.value ? format(new Date(field.value), "PPP") : <span>{placeholder || "Pick a date"}</span>}
                                    </div>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        captionLayout="dropdown"
                                        selected={field.value ? new Date(field.value) : undefined}
                                        onSelect={(date) => {
                                            field.onChange(date ? date.toISOString() : "");
                                        }}
                                        disabled={(date) => {
                                            if (disabled) return true;
                                            const today = new Date();
                                            today.setHours(0, 0, 0, 0);
                                            if (disablePastDates && date < today) return true;
                                            if (disableFutureDates && date > today) return true;

                                            return false;
                                        }}
                                    />
                                </PopoverContent>
                            </Popover>
                        )}
                    />
                ) : (
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
                            } ${className}`}
                    />
                )}

                {suffix && type !== "date" && (
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