import { useForm, UseFormProps } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

/**
 * Safely formats any date string or Date object into 'YYYY-MM-DD' for HTML date inputs.
 * If no date is provided, it defaults to today.
 */
export const toDateInputString = (date?: string | Date | null) => {
    if (!date) return new Date().toISOString().split("T")[0];
    return new Date(date).toISOString().split("T")[0];
};

/**
 * A DRY wrapper around react-hook-form.
 * It automatically applies the Yup resolver AND infers the TypeScript types 
 * straight from your schema, so you don't have to pass `<FormValues>` manually!
 */
export function useAppForm<TSchema extends yup.AnyObjectSchema>(
    schema: TSchema,
    defaultValues?: UseFormProps<yup.InferType<TSchema>>["defaultValues"]
) {
    return useForm<yup.InferType<TSchema>>({
        resolver: yupResolver(schema),
        mode:"onChange",
        defaultValues,
    });
}