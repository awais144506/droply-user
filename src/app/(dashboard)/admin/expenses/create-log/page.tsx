"use client";
import { useRouter } from "next/navigation";
import ExpenseLogForm from "@/features/admin/expenses/components/create/ExpenseLogForm";
import CreateFormHeader from "@/lib/utils/components/FormHeaderNavigation";
import { useCreateExpense } from "@/features/admin/expenses/api/use-mutate-expenses";
import { CreateExpenseFormData } from "@/features/admin/expenses/schema/create-expense.schema";
import { useRole } from "@/lib/hooks/use-role";

const CreateNewLog = () => {
    const router = useRouter();
    const { branchId } = useRole();
    const { mutate: createExpense, isPending } = useCreateExpense();

    const handleSubmit = (data: CreateExpenseFormData) => {
        const payload = {
            ...data,
            branchId
        }
        createExpense(payload, {
            onSuccess: () => {
                router.push("/admin/expenses");
            },
        });
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            <CreateFormHeader
                breadcrumbs={[
                    { label: "Expenses", href: "/admin/expenses" },
                    { label: "Log Expense" }
                ]}
                title="Log Petty Expense"
            />
            <ExpenseLogForm
                onSubmit={handleSubmit}
                isPending={isPending}
            />
        </div>
    );
};

export default CreateNewLog;