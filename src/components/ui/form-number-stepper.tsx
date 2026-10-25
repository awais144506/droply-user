"use client";

import { useFormContext, Controller } from "react-hook-form";

interface FormNumberStepperProps {
    name: string;
    min?: number;
    max?: number;
    disabled?: boolean;
    theme?: "emerald" | "sky" | "indigo" | "rose" | "slate";
}

export function FormNumberStepper({
    name,
    min = 0,
    max,
    disabled = false,
    theme = "emerald"
}: FormNumberStepperProps) {
    const { control } = useFormContext();

    // Map themes for the plus button
    const themeClasses = {
        emerald: "bg-emerald-500 border-emerald-600 hover:bg-emerald-600",
        sky: "bg-sky-500 border-sky-600 hover:bg-sky-600",
        indigo: "bg-indigo-500 border-indigo-600 hover:bg-indigo-600",
        rose: "bg-rose-500 border-rose-600 hover:bg-rose-600",
        slate: "bg-slate-700 border-slate-800 hover:bg-slate-800",
    };

    const activeTheme = themeClasses[theme];

    return (
        <Controller
            control={control}
            name={name}
            render={({ field }) => {
                const currentValue = Number(field.value) || 0;

                const handleMinus = () => {
                    if (disabled) return;
                    field.onChange(Math.max(min, currentValue - 1));
                };

                const handlePlus = () => {
                    if (disabled) return;
                    if (max !== undefined) {
                        field.onChange(Math.min(max, currentValue + 1));
                    } else {
                        field.onChange(currentValue + 1);
                    }
                };

                const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                    if (disabled) return;
                    let val = parseInt(e.target.value) || 0;
                    
                    // Clamp between min and max
                    if (max !== undefined) val = Math.min(val, max);
                    val = Math.max(val, min);
                    
                    field.onChange(val);
                };

                return (
                    <div className={`flex items-center gap-2 shrink-0 ${disabled ? "opacity-50" : ""}`}>
                        <button
                            type="button"
                            onClick={handleMinus}
                            disabled={disabled || currentValue <= min}
                            className="h-7 w-7 rounded bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 font-bold cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                        >
                            -
                        </button>
                        
                        <input
                            type="number"
                            min={min}
                            max={max}
                            value={currentValue}
                            onChange={handleChange}
                            disabled={disabled}
                            className="w-10 text-center text-sm font-bold border-none bg-transparent outline-none p-0 focus:ring-0 disabled:cursor-not-allowed"
                        />
                        
                        <button
                            type="button"
                            onClick={handlePlus}
                            disabled={disabled || (max !== undefined && currentValue >= max)}
                            className={`h-7 w-7 rounded flex items-center justify-center text-white font-bold cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 transition-colors ${activeTheme}`}
                        >
                            +
                        </button>
                    </div>
                );
            }}
        />
    );
}