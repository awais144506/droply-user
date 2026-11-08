import * as yup from "yup";

export const returnItemSchema = yup.object().shape({
    branchProductId: yup.string().required("Product is required"),
    supplierItemName: yup.string().required("Item name is required"),
    unitCost: yup.number()
        .typeError("Unit cost must be a number")
        .min(0, "Unit cost cannot be negative")
        .required("Unit cost is required"),
    quantityReturned: yup.number()
        .typeError("Quantity must be a number")
        .positive("Quantity must be greater than 0")
        .required("Quantity is required"),
});

export const createReturnSchema = yup.object().shape({
    supplierId: yup.string().required("Please select a supplier"),
    poId: yup.string().nullable().optional(), // Optional, as some returns might be unlinked
    notes: yup.string().max(500, "Notes cannot exceed 500 characters").nullable().optional(),
    
    items: yup.array()
        .of(returnItemSchema)
        .min(1, "You must add at least one item to return")
        .required("Items are required"),
});

export type CreateReturnFormValues = yup.InferType<typeof createReturnSchema>;