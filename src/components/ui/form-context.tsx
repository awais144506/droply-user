"use client";

import { ReactNode } from "react";
import { FormProvider, UseFormReturn, FieldValues, SubmitHandler } from "react-hook-form";

interface FormProps<T extends FieldValues> {
    form: UseFormReturn<T>;
    onSubmit: SubmitHandler<T>;
    children: ReactNode;
    className?: string;
}

export function Form<T extends FieldValues>({ form, onSubmit, children, className = "space-y-6" }: FormProps<T>) {
    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className={className}>
                {children}
            </form>
        </FormProvider>
    );
}