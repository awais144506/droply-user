"use client";

import { useId, ReactNode } from "react";
import { useFormContext, Controller } from "react-hook-form";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css"; // Required for flags

interface FormPhoneInputProps {
    name: string;
    label?: string | ReactNode;
    required?: boolean;
    placeholder?: string;
    helperText?: ReactNode;
}

export function FormPhoneInput({
    name,
    label,
    required = false,
    placeholder = "e.g. 0300 1234567",
    helperText
}: FormPhoneInputProps) {
    const { control, formState: { errors } } = useFormContext();
    const error = errors[name]?.message as string;
    const inputId = useId();

    return (
        <div className="space-y-1.5 w-full">
            {label && (
                <label htmlFor={inputId} className="flex items-center text-xs font-bold text-slate-700 uppercase tracking-wide cursor-pointer">
                    {label}
                    {required && <span className="text-rose-500 ml-1">*</span>}
                </label>
            )}

            <Controller
                name={name}
                control={control}
                render={({ field: { onChange, value } }) => (
                    <div className={`flex items-center h-10 rounded-xl border text-sm transition-all shadow-sm px-3 
                        ${error
                            ? "border-rose-300 bg-rose-50/20 text-rose-900 focus-within:ring-2 focus-within:ring-rose-500"
                            : "bg-slate-50 border-slate-200 focus-within:ring-2 focus-within:ring-sky-500/20 focus-within:border-sky-500 focus-within:bg-white text-slate-900"
                        }`}
                    >
                        <PhoneInput
                            id={inputId}
                            international
                            defaultCountry="PK"
                            value={value}
                            onChange={onChange}
                            placeholder={placeholder}
                            countryCallingCodeEditable={false}
                            className="w-full outline-none [&>input]:bg-transparent [&>input]:outline-none [&>input]:w-full [&>input]:ml-3 [&>input]:text-sm"
                        />
                    </div>
                )}
            />

            {error && <p className="text-[10px] text-rose-500 mt-1">{error}</p>}
            {!error && helperText && <div className="mt-1 text-[10px] text-slate-500">{helperText}</div>}
        </div>
    );
}