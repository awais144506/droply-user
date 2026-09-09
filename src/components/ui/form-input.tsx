import { ReactNode } from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface FormInputProps {
    label: string | ReactNode;
    type?: "text" | "number" | "date";
    placeholder?: string;
    register: UseFormRegisterReturn;
    error?: string;
    disabled?: boolean;
    required?: boolean;
    prefix?: string;
    suffix?: string;
    helperText?: ReactNode;
}

export function FormInput({
    label,
    type = "text",
    placeholder,
    register,
    error,
    disabled = false,
    required = false,
    prefix,
    suffix,
    helperText
}: FormInputProps) {
    return (
        <div className="space-y-1.5">
            <label className="flex items-center text-xs font-bold text-slate-700 uppercase tracking-wide">
                {label}
                {required && <span className="text-rose-500 ml-1">*</span>}
            </label>
            <div className="relative">
                {prefix && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                        {prefix}
                    </span>
                )}
                <input
                    type={type}
                    step={type === "number" ? "any" : undefined}
                    placeholder={placeholder}
                    disabled={disabled}
                    {...register}
                    className={`w-full h-10 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${prefix ? "pl-8" : "px-3"
                        } ${suffix ? "pr-8" : "px-3"
                        } ${disabled
                            ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
                            : error
                                ? "border-rose-300 focus:ring-rose-500 bg-rose-50/20"
                                : "bg-slate-50 border-slate-200 focus:ring-sky-500/20 focus:border-sky-500 focus:bg-white text-slate-900"
                        }`}
                />
                {suffix && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 uppercase">
                        {suffix}
                    </span>
                )}
            </div>
            {error && <p className="text-[10px] text-rose-500 mt-1">{error}</p>}
            {!error && helperText && <div className="mt-1">{helperText}</div>}
        </div>
    );
}