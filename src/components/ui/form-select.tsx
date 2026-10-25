/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ReactNode, useId } from "react";
import { useFormContext, Controller, get } from "react-hook-form";
import Select, { components, MenuListProps } from "react-select";
import { Loader, LucideIcon, Plus, Truck } from "lucide-react";
import { useRouter } from "next/navigation";

export interface SelectOption {
    label: string;
    value: string | number;
    [key: string]: any;
}

interface FormSelectProps {
    name: string;
    label?: string | ReactNode;
    options: SelectOption[];
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    isMulti?: boolean;
    isSearchable?: boolean;
    isClearable?: boolean;
    helperText?: ReactNode;
    isLoading?: boolean;
    formatOptionLabel?: (data: any) => ReactNode;
    onValueChange?: (selectedOption: any) => void;
    lableTextColor?: string;
    labelIcon?: LucideIcon;
    iconColor?: string;
    
    // Primary Add Button (e.g., Create Customer link)
    showAddButton?: boolean;
    addButtonLabel?: string;
    onAddButtonClick?: () => void;
    addButtonHref?: string; 
    
    // 🔥 Secondary Action Button (e.g., Use 3rd Party Driver toggle)
    showSecondaryAction?: boolean;
    secondaryActionLabel?: string;
    onSecondaryActionClick?: () => void;
    secondaryActionIcon?: LucideIcon;
}

export function FormSelect({
    name,
    label,
    options,
    placeholder = "Select...",
    disabled = false,
    required = false,
    isMulti = false,
    isSearchable = true,
    isClearable = false,
    helperText,
    isLoading,
    formatOptionLabel,
    onValueChange,
    lableTextColor = "text-slate-700",
    labelIcon: Icon,
    iconColor = "text-sky-500",
    showAddButton = false,
    addButtonLabel = "Add New",
    onAddButtonClick,
    addButtonHref,
    showSecondaryAction = false,
    secondaryActionLabel = "Alternative Action",
    onSecondaryActionClick,
    secondaryActionIcon: SecondaryIcon = Truck,
}: FormSelectProps) {
    const { control, formState: { errors } } = useFormContext();
    const error = get(errors, name)?.message as string;
    const inputId = useId();
    const router = useRouter();

    return (
        <div className="space-y-1.5 w-full">
            {label && (
                <label htmlFor={inputId} className={`flex items-center text-xs font-bold ${lableTextColor} uppercase tracking-wide cursor-pointer`}>
                    {Icon && <Icon className={`h-3.5 w-3.5 mr-1.5 ${iconColor}`} />}
                    {label}
                    {required && <span className="text-rose-500 ml-1">*</span>}
                </label>
            )}

            <Controller
                control={control}
                name={name}
                render={({ field: { onChange, onBlur, value, ref } }) => {
                    const selectedValue = isMulti
                        ? options?.filter((c) => (value as Array<string | number>)?.includes(c.value))
                        : options?.find((c) => c.value === value) || null;

                    return (
                        <Select
                            formatOptionLabel={formatOptionLabel}
                            ref={ref}
                            inputId={inputId}
                            options={options}
                            value={selectedValue}
                            isDisabled={disabled}
                            isMulti={isMulti}
                            isSearchable={isSearchable}
                            isClearable={isClearable}
                            placeholder={isLoading ? <Loader className="animate-spin h-4 w-4" /> : placeholder}
                            onBlur={onBlur}
                            onChange={(selectedOption: any) => {
                                if (isMulti) {
                                    onChange(selectedOption ? selectedOption.map((opt: SelectOption) => opt.value) : []);
                                } else {
                                    onChange(selectedOption ? selectedOption.value : null);
                                }
                                if (onValueChange) {
                                    onValueChange(selectedOption);
                                }
                            }}
                            menuPortalTarget={typeof window !== "undefined" ? document.body : null}
                            menuPosition="fixed"
                            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                            components={{
                                MenuList: (props: MenuListProps<any>) => (
                                    <components.MenuList {...props}>
                                        {props.children}
                                        {(showAddButton || showSecondaryAction) && (
                                            <div className="sticky bottom-0 bg-white border-t border-slate-100 p-2 z-10 mt-1 flex flex-col gap-1.5 shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.05)]">
                                                {showAddButton && (
                                                    <button
                                                        type="button"
                                                        onMouseDown={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            if (addButtonHref) {
                                                                router.push(addButtonHref);
                                                            } else if (onAddButtonClick) {
                                                                onAddButtonClick();
                                                            }
                                                        }}
                                                        className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-sky-50 text-sky-700 hover:bg-sky-100 hover:text-sky-800 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                        {addButtonLabel}
                                                    </button>
                                                )}

                                                {showSecondaryAction && (
                                                    <button
                                                        type="button"
                                                        onMouseDown={(e) => {
                                                            e.preventDefault();
                                                            e.stopPropagation();
                                                            onSecondaryActionClick?.();
                                                        }}
                                                        className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 rounded-lg text-xs font-bold transition-colors cursor-pointer border border-slate-200"
                                                    >
                                                        <SecondaryIcon className="h-4 w-4" />
                                                        {secondaryActionLabel}
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </components.MenuList>
                                )
                            }}
                            unstyled
                            classNames={{
                                // 🔥 Forced cursor-pointer heavily here
                                control: (state) => `min-h-[40px] rounded-xl border text-sm transition-all px-3 cursor-pointer hover:border-sky-400 ${
                                    error
                                        ? "border-rose-300 bg-rose-50/20"
                                        : state.isFocused
                                            ? "border-sky-500 ring-1 ring-sky-500 bg-white"
                                            : "bg-slate-50 border-slate-200"
                                } ${disabled ? "opacity-50 !cursor-not-allowed" : ""}`,
                                placeholder: () => "text-slate-400 cursor-pointer",
                                singleValue: () => "text-slate-900 cursor-pointer",
                                multiValue: () => "bg-sky-100 text-sky-700 rounded-md px-2 py-0.5 mr-1 mt-1 text-xs font-semibold flex items-center cursor-default",
                                multiValueRemove: () => "ml-1 hover:text-sky-900 hover:bg-sky-200 rounded px-0.5 cursor-pointer",
                                menu: () => "mt-1.5 rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden text-sm z-50",
                                // 🔥 Forced cursor-pointer on options
                                option: (state) => `px-3 py-2 cursor-pointer transition-colors ${
                                    state.isSelected
                                        ? "bg-sky-600 text-white font-medium"
                                        : state.isFocused
                                            ? "bg-slate-100 text-slate-900"
                                            : "text-slate-700 hover:bg-slate-50"
                                }`,
                                noOptionsMessage: () => "p-3 text-slate-500 text-sm",
                                valueContainer: () => "gap-1 py-1 cursor-pointer",
                                input: () => "cursor-text", // Keep text cursor for the actual typing area
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