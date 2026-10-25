"use client";

import { CalendarClock, MapPin } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { FormInput } from "@/components/ui/form-input";
import { FormSelect } from "@/components/ui/form-select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DayOfWeek } from "../../schema/create-customer.schema";

const SCHEDULE_OPTIONS = [
    { label: "On-Demand (Order by Call)", value: "ON_DEMAND" },
    { label: "Everyday (All 7 Days)", value: "EVERYDAY" },
    { label: "Selected Days (Custom)", value: "CUSTOM_DAYS" },
];

const WEEK_DAYS: { label: string; short: string; value: DayOfWeek }[] = [
    { label: "Monday", short: "Mon", value: "MONDAY" },
    { label: "Tuesday", short: "Tue", value: "TUESDAY" },
    { label: "Wednesday", short: "Wed", value: "WEDNESDAY" },
    { label: "Thursday", short: "Thu", value: "THURSDAY" },
    { label: "Friday", short: "Fri", value: "FRIDAY" },
    { label: "Saturday", short: "Sat", value: "SATURDAY" },
    { label: "Sunday", short: "Sun", value: "SUNDAY" },
];

export default function AddressCard() {
    const {
        watch,
        setValue,
        formState: { errors },
    } = useFormContext();

    const scheduleType = watch("deliveryScheduleType");
    const selectedDays: DayOfWeek[] = watch("deliveryDays") || [];
    const daysError = errors.deliveryDays?.message as string | undefined;

    const toggleDay = (day: DayOfWeek) => {
        const exists = selectedDays.includes(day);
        const updated = exists
            ? selectedDays.filter((d) => d !== day)
            : [...selectedDays, day];

        setValue("deliveryDays", updated, {
            shouldDirty: true,
            shouldValidate: true,
        });
    };

    return (
        <Card>
            <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-emerald-600" />
                    Address, Coordinates & Delivery Schedule
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
                <div className="space-y-1.5">
                    <FormInput
                        label="STREET ADDRESS"
                        placeholder="House / Shop No, Street, Area"
                        name="address"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                        <FormInput
                            label="Latitude"
                            placeholder="31.5189"
                            type="number"
                            name="latitude"
                            required
                        />
                    </div>
                    <div className="space-y-1.5">
                        <FormInput
                            label="Longitude"
                            placeholder="74.3680"
                            type="number"
                            name="longitude"
                            required
                        />
                    </div>
                </div>

                {/* Delivery Schedule Section */}
                <div className="pt-2 border-t border-slate-100 space-y-3">
                    <FormSelect
                        label="Delivery Schedule"
                        name="deliveryScheduleType"
                        options={SCHEDULE_OPTIONS}
                        labelIcon={CalendarClock}
                        iconColor="text-emerald-600"
                        isSearchable={false}
                        required
                        onValueChange={(option) => {
                            if (option?.value === "EVERYDAY") {
                                setValue(
                                    "deliveryDays",
                                    WEEK_DAYS.map((d) => d.value),
                                    { shouldDirty: true, shouldValidate: true },
                                );
                            } else if (option?.value === "ON_DEMAND") {
                                setValue("deliveryDays", [], {
                                    shouldDirty: true,
                                    shouldValidate: true,
                                });
                            }
                        }}
                    />

                    {scheduleType === "CUSTOM_DAYS" && (
                        <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-150">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                                    Select Delivery Days <span className="text-rose-500">*</span>
                                </label>
                                <span className="text-[11px] font-medium text-slate-500">
                                    {selectedDays.length} selected
                                </span>
                            </div>

                            <div className="grid grid-cols-7 gap-1.5">
                                {WEEK_DAYS.map((day) => {
                                    const isSelected = selectedDays.includes(day.value);
                                    return (
                                        <button
                                            key={day.value}
                                            type="button"
                                            onClick={() => toggleDay(day.value)}
                                            title={day.label}
                                            className={`py-2 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer border text-center ${
                                                isSelected
                                                    ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                                                    : "bg-slate-50 text-slate-600 border-slate-200 hover:border-emerald-400 hover:bg-white"
                                            }`}
                                        >
                                            {day.short}
                                        </button>
                                    );
                                })}
                            </div>

                            {daysError && (
                                <p className="text-[10px] text-rose-500 mt-1">{daysError}</p>
                            )}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}