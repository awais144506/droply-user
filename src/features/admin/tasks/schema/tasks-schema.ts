import * as yup from "yup";

export const createTaskSchema = yup.object().shape({
  branchId: yup.string().required("Branch ID is missing"),
  description: yup
    .string()
    .required("Task description is required")
    .min(5, "Description must be at least 5 characters"),
  assignedToId: yup.string().required("Please select who to assign this task to"),
});

export type CreateTaskFormValues = yup.InferType<typeof createTaskSchema>;