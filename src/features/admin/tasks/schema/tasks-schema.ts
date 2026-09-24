import * as yup from "yup";

export const createTaskSchema = yup.object().shape({
  description: yup
    .string()
    .required("Task description is required")
    .min(5, "Description must be at least 5 characters"),
  assignedToId: yup.string().required("Please select who to assign this task to"),
  assignedToName: yup.string().required(),
  assignedToRole: yup
    .mixed<"MANAGER" | "RIDER">()
    .oneOf(["MANAGER", "RIDER"])
    .required(),
});

export type CreateTaskFormValues = yup.InferType<typeof createTaskSchema>;