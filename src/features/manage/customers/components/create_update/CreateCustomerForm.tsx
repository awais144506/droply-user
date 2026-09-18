/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect } from 'react';
import { FormProvider } from 'react-hook-form'
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { createCustomerSchema, CreateCustomerFormData } from "@/features/manage/customers/schema/create-customer.schema";
import FinancialsCard from "@/features/manage/customers/components/create_update/financial-card";
import AddressCard from "@/features/manage/customers/components/create_update/address-card";
import IdentityCard from "@/features/manage/customers/components/create_update/identity-card";
import { formatCustomerPayload } from "@/features/manage/customers/utils/formatCustomerPayload";
import { useCreateCustomer, useUpdateCustomer } from "@/features/manage/customers/api/use-mutate-customer";
import { useRouter } from 'next/navigation';
import FormCTAFooter from '@/lib/utils/components/FormCTAFooter';

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

    const router = useRouter();
    const isEditMode = !!customerId;

    const { mutate: createNewCustomer, isPending: isCreating } = useCreateCustomer();
    const { mutate: updateCustomer, isPending: isUpdating } = useUpdateCustomer();
    const isPending = isCreating || isUpdating;

    const form = useForm<CreateCustomerFormData>({
        resolver: yupResolver(createCustomerSchema),
        mode: "onChange",
        defaultValues: {
            partyType: "CUSTOMER",
            customerCategory: "DOMESTIC",
            name: "",
            phone: "",
            zoneId: "",
            address: "",
            latitude: 31.5411,
            longitude: 74.3591,
            customerCredit: 0,
            customerAdvance: 0,
            securityDeposit: 0,
            openingReturnables: [],
            ...initialData,
        },
    });

    useEffect(() => {
        if (initialData) {
            form.reset({ ...form.getValues(), ...initialData });
        }
    }, [initialData, form]);

    const onSubmit = (data: CreateCustomerFormData) => {
        const payload = formatCustomerPayload(data, branchId);
        if (isEditMode) {
            const { branchId: _b, ...safeUpdatePayload } = payload;
            updateCustomer({ id: customerId!, data: safeUpdatePayload }, {
                onSuccess: () => router.back(),
            });
        } else {
            createNewCustomer(payload, {
                onSuccess: () => router.back(),
            });
        }
    };

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                    isPending={isPending}
                    isValid={form.formState.isValid}
                    isDirty={form.formState.isDirty}
                    isEditMode={isEditMode}
                    href='/manage/customers'
                />
            </form>
        </FormProvider>
    )
}

export default CustomerForm