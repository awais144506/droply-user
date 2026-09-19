import { FormProvider, useForm, SubmitHandler } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"

import { SupplierFormData, supplierSchema } from "../../schema/create-supplier-schema"
import { FormInput } from "@/components/ui/form-input"
import FormCTAFooter from "@/lib/utils/components/FormCTAFooter"

type Props = {
    onSubmit: SubmitHandler<SupplierFormData>;
    isPending: boolean;
    initialData?: Partial<SupplierFormData>;
    isEditMode: boolean
}

const SupplierForm = ({ onSubmit, isPending, initialData, isEditMode }: Props) => {
    const form = useForm<SupplierFormData>({
        resolver: yupResolver(supplierSchema),
        mode: "onChange",
        values: {
            firmName: initialData?.firmName || "",
            supplierName: initialData?.supplierName || "",
            email: initialData?.email || "",
            phone: initialData?.phone || "",
            address: initialData?.address || "",
            city: initialData?.city || "",
        }
    });

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
            <FormProvider {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    {/* Input Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                        <FormInput label="Firm Name" name="firmName" placeholder="e.g. SES Group Packaging" required />
                        <FormInput label="Contact Person Name" name="supplierName" placeholder="Rasheed Anjum" required />
                        <FormInput label="Phone Number" name="phone" required placeholder="e.g. 03001234567" />
                        <FormInput label="Email Address" name="email" placeholder="Optional" />
                        <FormInput label="Address" name="address" required placeholder="e.g Factory Road" />
                        <FormInput label="City" name="city" required placeholder="e.g Lahore" />
                    </div>
                    <FormCTAFooter
                        href="/supply/suppliers"
                        isPending={isPending}
                        isDirty={form.formState.isDirty}
                        isValid={form.formState.isValid}
                        isEditMode={isEditMode}
                    />
                </form>
            </FormProvider>
        </div>
    )
}

export default SupplierForm