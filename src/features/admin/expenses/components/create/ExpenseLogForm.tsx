"use client";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { createExpenseSchema, CreateExpenseFormData } from "../../schema/create-expense.schema";
import { FormSelect } from "@/components/ui/form-select";
import { FormInput } from "@/components/ui/form-input";
import FormCTAFooter from "@/lib/utils/components/FormCTAFooter";
import { ExpenseType, ExpensePaymentType } from "../../types/expenses";

type ExpenseLogFormProps = {
  onSubmit: (data: CreateExpenseFormData) => void;
  isPending: boolean;
};

// Map enums to dropdown options
const expenseTypeOptions = [
  { label: "Refreshments", value: ExpenseType.REFRESHMENT },
  { label: "Utilities", value: ExpenseType.UTILITY },
  { label: "Maintenance", value: ExpenseType.MAINTENANCE },
  { label: "Logistics & Tolls", value: ExpenseType.LOGISTIC },
  { label: "Branch Supplies", value: ExpenseType.BRANCH },
];

const paymentTypeOptions = [
  { label: "Cash", value: ExpensePaymentType.CASH },
  { label: "Bank Transfer / Online", value: ExpensePaymentType.ONLINE },
];

export default function ExpenseLogForm({ onSubmit, isPending }: ExpenseLogFormProps) {
  const form = useForm<CreateExpenseFormData>({
    resolver: yupResolver(createExpenseSchema),
    mode: "onChange",
    defaultValues: {
      description: "",
      type: ExpenseType.REFRESHMENT,
      paymentType: ExpensePaymentType.CASH,
      amount: 0,
    },
  });

  const { handleSubmit, formState } = form;
  const { isDirty, isValid } = formState;

  return (
    <FormProvider {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mt-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="md:col-span-2">
            <FormInput
              name="description"
              label="Expense Description"
              placeholder="e.g. Tea and snacks for supplier meeting"
              required
            />
          </div>

          <FormSelect
            name="type"
            label="Category"
            options={expenseTypeOptions}
            placeholder="Select category..."
            required
          />

          <FormSelect
            name="paymentType"
            label="Payment Method"
            options={paymentTypeOptions}
            placeholder="Select method..."
            required
          />

          <FormInput
            name="amount"
            label="Amount (Rs)"
            type="number"
            min={0}
            required
          />
        </div>

        <FormCTAFooter
          ctaText="Log Expense"
          href="/admin/expenses"
          isPending={isPending}
          isDirty={isDirty}
          isValid={isValid}
        />
      </form>
    </FormProvider>
  );
}