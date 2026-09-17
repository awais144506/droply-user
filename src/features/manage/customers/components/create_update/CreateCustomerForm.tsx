/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect } from 'react';
import { FormProvider } from 'react-hook-form'
import Link from "next/link";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Loader2, Plus, Save } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { createCustomerSchema, CreateCustomerFormData } from "@/features/manage/customers/schema/create-customer.schema";
import FinancialsCard from "@/features/manage/customers/components/create_update/financial-card";
import AddressCard from "@/features/manage/customers/components/create_update/address-card";
import IdentityCard from "@/features/manage/customers/components/create_update/identity-card";
import { formatCustomerPayload } from "@/features/manage/customers/utils/formatCustomerPayload";
import { useCreateCustomer, useUpdateCustomer } from "@/features/manage/customers/api/use-mutate-customer";
import { useRouter } from 'next/navigation';

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

                <div className="flex items-center justify-end gap-3 border-t pt-4">
                    <Link href="/manage/customers" className={buttonVariants({ variant: "outline", size: "sm" })}>
                        Cancel
                    </Link>
                    <Button type="submit" disabled={isPending || !form.formState.isValid || !form.formState.isDirty} className="min-w-36 bg-emerald-600 hover:bg-emerald-700 rounded-xl h-10 text-white shadow-sm">
                        {isPending ? (
                            <><Loader2 className="h-4 w-4 animate-spin mr-1.5" /> {isEditMode ? 'Saving...' : 'Creating...'}</>
                        ) : (
                            <>{isEditMode ? <Save className="h-4 w-4 mr-1.5" /> : <Plus className="h-4 w-4 mr-1.5" />}
                                {isEditMode ? 'Save Changes' : 'Create Customer'}
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </FormProvider>
    )
}

export default CustomerForm