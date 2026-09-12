/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ReactNode, useId } from "react";
import { useFormContext, Controller } from "react-hook-form";
import Select from "react-select";
import { Loader } from "lucide-react";

export interface SelectOption {
    label: string;
    value: string | number;
}

interface FormSelectProps {
    name: string;
    label: string | ReactNode;
    options: SelectOption[];
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    isMulti?: boolean;
    isSearchable?: boolean;
    helperText?: ReactNode;
    isLoading?: boolean;
}

export function FormSelect({
    name,
    label,
    options,
    placeholder = "Select...",
    disabled = false,
    required = false,
    isMulti = false,
    isSearchable = false,
    helperText,
    isLoading
}: FormSelectProps) {
    const { control, formState: { errors } } = useFormContext();
    const error = errors[name]?.message as string;
    const inputId = useId();

    return (
        <div className="space-y-1.5">
            <label htmlFor={inputId} className="flex items-center text-xs font-bold text-slate-700 uppercase tracking-wide cursor-pointer">
                {label}
                {required && <span className="text-rose-500 ml-1">*</span>}
            </label>

            {/* 🔥 Controller is the bridge between RHF and react-select */}
            <Controller
                control={control}
                name={name}
                render={({ field: { onChange, onBlur, value, ref } }) => {
                    const selectedValue = isMulti
                        ? options?.filter((c) => (value as Array<string | number>)?.includes(c.value))
                        : options?.find((c) => c.value === value) || null;

                    return (
                        <Select
                            ref={ref}
                            inputId={inputId}
                            options={options}
                            value={selectedValue}
                            isDisabled={disabled}
                            isMulti={isMulti}
                            isSearchable={isSearchable}
                            placeholder={isLoading ? <Loader className="animate-spin" /> : placeholder}
                            onBlur={onBlur}
                            onChange={(selectedOption: any) => {
                                if (isMulti) {
                                    onChange(selectedOption ? selectedOption.map((opt: SelectOption) => opt.value) : []);
                                } else {
                                    onChange(selectedOption ? selectedOption.value : null);
                                }
                            }}
                            menuPortalTarget={typeof window !== "undefined" ? document.body : null}
                            menuPosition="fixed"
                            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                            unstyled
                            classNames={{
                                control: (state) => ` min-h-[40px] rounded-xl border text-sm transition-all px-3 ${error
                                    ? "border-rose-300 bg-rose-50/20"
                                    : state.isFocused
                                        ? "border-sky-500 ring-1 ring-sky-500 bg-white"
                                        : "bg-slate-50 border-slate-200"
                                    } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`,
                                placeholder: () => "text-slate-400",
                                singleValue: () => "text-slate-900",
                                multiValue: () => "bg-sky-100 text-sky-700 rounded-md px-2 py-0.5 mr-1 mt-1 text-xs font-semibold flex items-center",
                                multiValueRemove: () => "ml-1 hover:text-sky-900 hover:bg-sky-200 rounded px-0.5",
                                menu: () => "mt-1.5 rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden text-sm z-50",
                                option: (state) => `px-3 py-2 cursor-pointer transition-colors ${state.isSelected
                                    ? "bg-sky-600 text-white font-medium"
                                    : state.isFocused
                                        ? "bg-slate-100 text-slate-900"
                                        : "text-slate-700 hover:bg-slate-50"
                                    }`,
                                noOptionsMessage: () => "p-3 text-slate-500 text-sm",
                                valueContainer: () => "gap-1 py-1",
                            }}
                        />
                    );
                }}
            />
            {error && <p className="text-[10px] text-rose-500 mt-1">{error}</p>}
            {!error && helperText && <div className="mt-1 text-[10px] text-slate-500">{helperText}</div>}
        </div>
    );
}