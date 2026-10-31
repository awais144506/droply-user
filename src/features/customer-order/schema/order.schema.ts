import * as yup from "yup";

export const customerOrderSchema = yup.object().shape({
    scheduleDate: yup.string().required("Schedule date is required"),
    notes: yup.string().optional(),
    items: yup.array()
        .of(
            yup.object().shape({
                productId: yup.string().required("Product ID is required"),
                quantity: yup.number().min(1, "Quantity must be at least 1").required(),
            })
        )
        .min(1, "You must select at least one item to order.")
        .required("Items are required"),
});

// Extract the type from the schema
export type CustomerOrderFormValues = yup.InferType<typeof customerOrderSchema>;