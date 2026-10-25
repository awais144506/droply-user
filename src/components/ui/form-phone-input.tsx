"use client";

import { useId, useState, ReactNode } from "react";
import { useFormContext, Controller } from "react-hook-form";
import {
    getCountries,
    getCountryCallingCode,
    parsePhoneNumber,
    Country,
} from "react-phone-number-input";
import en from "react-phone-number-input/locale/en.json";
import flags from "react-phone-number-input/flags";
import "react-phone-number-input/style.css";

interface FormPhoneInputProps {
    name: string;
    label?: string | ReactNode;
    required?: boolean;
    placeholder?: string;
    helperText?: ReactNode;
    defaultCountry?: Country;
}

export function FormPhoneInput({
    name,
    label,
    required = false,
    placeholder = "300 1234567",
    helperText,
    defaultCountry = "PK",
}: FormPhoneInputProps) {
    const {
        control,
         getValues,
        formState: { errors },
    } = useFormContext();
    const error = errors[name]?.message as string;
    const inputId = useId();

    // Initialize country ONCE from initial form value (for Edit Mode) or fallback to defaultCountry
    const [selectedCountry, setSelectedCountry] = useState<Country>(() => {
        const initialVal = getValues(name);
        if (initialVal) {
            const parsed = parsePhoneNumber(initialVal);
            if (parsed?.country) return parsed.country;
        }
        return defaultCountry;
    });

    const FlagComponent = flags[selectedCountry];
    const callingCode = getCountryCallingCode(selectedCountry);
    const prefix = `+${callingCode}`;

    return (
        <div className="space-y-1.5 w-full">
            {label && (
                <label
                    htmlFor={inputId}
                    className="flex items-center text-xs font-bold text-slate-700 uppercase tracking-wide cursor-pointer"
                >
                    {label}
                    {required && <span className="text-rose-500 ml-1">*</span>}
                </label>
            )}

            <Controller
                name={name}
                control={control}
                render={({ field: { onChange, value } }) => {
                    // Extract ONLY the local digits after the locked +callingCode to show in the input
                    const fullValue = typeof value === "string" ? value : "";
                    const nationalDigits = fullValue.startsWith(prefix)
                        ? fullValue.slice(prefix.length)
                        : fullValue.replace(/^\+\d+/, "");

                    return (
                        <div
                            className={`flex items-center h-10 rounded-xl border text-sm transition-all shadow-sm px-3 
                            ${
                                error
                                    ? "border-rose-300 bg-rose-50/20 text-rose-900 focus-within:ring-2 focus-within:ring-rose-500"
                                    : "bg-slate-50 border-slate-200 focus-within:ring-2 focus-within:ring-sky-500/20 focus-within:border-sky-500 focus-within:bg-white text-slate-900"
                            }`}
                        >
                            {/* 1. Country Dropdown Selector */}
                            <div className="relative flex items-center pr-2 border-r border-slate-200">
                                <span className="flex h-4 w-6 overflow-hidden rounded-xs shrink-0">
                                    {FlagComponent && <FlagComponent title={en[selectedCountry]} />}
                                </span>
                                <select
                                    aria-label="Select country"
                                    value={selectedCountry}
                                    onChange={(e) => {
                                        const newCountry = e.target.value as Country;
                                        setSelectedCountry(newCountry);
                                        const newCallingCode = getCountryCallingCode(newCountry);
                                        // Keep existing national digits with the new country prefix, or empty if none
                                        onChange(nationalDigits ? `+${newCallingCode}${nationalDigits}` : "");
                                    }}
                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                >
                                    {getCountries().map((c) => (
                                        <option key={c} value={c}>
                                            {en[c]} +{getCountryCallingCode(c)}
                                        </option>
                                    ))}
                                </select>
                                <span className="ml-1 text-[10px] text-slate-400">▼</span>
                            </div>

                            {/* 2. Physically Locked Country Code Prefix */}
                            <span className="pl-2.5 pr-1.5 font-bold text-slate-600 select-none shrink-0">
                                {prefix}
                            </span>

                            {/* 3. Pure Controlled Input (Zero internal useEffects, impossible to loop) */}
                            <input
                                id={inputId}
                                type="tel"
                                inputMode="numeric"
                                value={nationalDigits}
                                onChange={(e) => {
                                    // Allow only numbers, strip leading 0 (e.g. 0300 -> 300), max 12 national digits
                                    const rawDigits = e.target.value.replace(/\D/g, "").replace(/^0+/, "").slice(0, 12);
                                    onChange(rawDigits ? `${prefix}${rawDigits}` : "");
                                }}
                                placeholder={placeholder}
                                className="w-full bg-transparent outline-none text-sm text-slate-900 placeholder:text-slate-400"
                            />
                        </div>
                    );
                }}
            />

            {error && <p className="text-[10px] text-rose-500 mt-1">{error}</p>}
            {!error && helperText && (
                <div className="mt-1 text-[10px] text-slate-500">{helperText}</div>
            )}
        </div>
    );
}