import * as yup from "yup";

export const productionSchema = yup.object().shape({
  productId: yup.string().required("Please select a finished product"),
  yieldQuantity: yup
    .number()
    .typeError("Yield quantity must be a number")
    .min(1, "Yield must be at least 1")
    .required("Yield quantity is required"),
  supervisorName: yup.string().required("Supervisor name is required"),
  productionDate: yup.string().optional(),
  consumedItems: yup
    .array()
    .of(
      yup.object().shape({
        rawMaterialId: yup.string().required("Raw material is required"),
        quantityUsed: yup
          .number()
          .typeError("Quantity must be a number")
          .min(1, "Quantity must be at least 1")
          .required("Quantity is required"),
      })
    )
    .min(1, "At least one raw material must be consumed")
    .required(),
});

export type ProductionFormValues = yup.InferType<typeof productionSchema>;