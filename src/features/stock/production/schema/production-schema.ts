import * as yup from "yup";

export const productionSchema = yup.object().shape({
  productId: yup.string().required("Please select a finished product"),
  expectedYield: yup
    .number()
    .typeError("Expected yield must be a number")
    .min(1, "Expected yield must be at least 1")
    .required("Expected yield is required"),
  supervisorName: yup.string().required("Supervisor name is required"),
  productionDate: yup.string().optional(),
});

export type ProductionFormValues = yup.InferType<typeof productionSchema>;