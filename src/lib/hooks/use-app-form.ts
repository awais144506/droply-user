import { useForm, UseFormProps } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
export const toDateInputString = (date?: string | Date | null) => {
    if (!date) return new Date().toISOString().split("T")[0];
    return new Date(date).toISOString().split("T")[0];
};
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