import { useEffect } from 'react';
import { FormProvider } from 'react-hook-form'
import { createCustomerSchema, CreateCustomerFormData } from "@/features/manage/customers/schema/create-customer.schema";
import FinancialsCard from "@/features/manage/customers/components/create_update/financial-card";
import AddressCard from "@/features/manage/customers/components/create_update/address-card";
import IdentityCard from "@/features/manage/customers/components/create_update/identity-card";
import { useCreateCustomer, useUpdateCustomer } from "@/features/manage/customers/api/use-mutate-customer";
import FormCTAFooter from '@/lib/utils/components/FormCTAFooter';
import { useAppForm } from '@/lib/hooks/use-app-form';
import { UserPlus } from 'lucide-react';

export const CustomerForm = ({
    branchId,
    isLoadingZones,
    isLoadingProducts,
    zoneOptions,
    productOptions,
    initialData,
    customerId
}: {
    branchId: string
    isLoadingZones: boolean
    isLoadingProducts: boolean
    zoneOptions?: { value: string, label: string }[]
    productOptions?: { value: string, label: string }[]
    initialData?: Partial<CreateCustomerFormData>
    customerId?: string
}) => {
    const isEditMode = !!customerId;
    const { mutate: createNewCustomer, isPending: isCreating } = useCreateCustomer(branchId);
    const { mutate: updateCustomer, isPending: isUpdating } = useUpdateCustomer();
    const isPending = isCreating || isUpdating;

    const form = useAppForm(createCustomerSchema, {
        partyType: "CUSTOMER",
        category: "DOMESTIC",
        name: "",
        phone: "",
        zoneId: "",
        address: "",
        email: "",
        latitude: 31.5411,
        longitude: 74.3591,
        customerCredit: 0,
        customerAdvance: 0,
        securityDeposit: 0,
        returnables: [],
        ...initialData,
    })

    useEffect(() => {
        if (initialData) {
            form.reset({ ...form.getValues(), ...initialData });
        }
    }, [initialData, form]);

    const onSubmit = (data: CreateCustomerFormData) => {
        const payload = {
            ...data,
            branchId
        } as Parameters<typeof createNewCustomer>[0];

        if (isEditMode) {
            updateCustomer({ id: customerId!, data: payload });
        } else {
            createNewCustomer(payload);
        }
    };

    const { formState, handleSubmit } = form;
    const { isDirty, isValid } = formState;

    return (
        <FormProvider {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <IdentityCard
                        zoneOptions={zoneOptions}
                        isLoading={isLoadingZones}
                    />

                    <div className="space-y-6">
                        <AddressCard />
                        <FinancialsCard
                            productOptions={productOptions}
                            isLoading={isLoadingProducts}
                        />
                    </div>
                </div>
                <FormCTAFooter
                    ctaText="Create Customer"
                    href="/manage/customers"
                    isPending={isPending}
                    isDirty={isDirty}
                    isValid={isValid}
                    isEditMode={isEditMode}
                    icon={UserPlus}
                />
            </form>
        </FormProvider>
    )
}

export default CustomerForm