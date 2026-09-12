import React from 'react'
import { FormProvider } from 'react-hook-form'
import Link from "next/link";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Loader2, Plus } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { createCustomerSchema, CreateCustomerFormData } from "@/features/customers/schema/create-customer.schema";
import FinancialsCard from "@/features/customers/components/create/FinancialsCard";
import AddressCard from "@/features/customers/components/create/AddressCard";
import IdentityCard from "@/features/customers/components/create/IdentityCard";
import { formatCustomerPayload } from "@/features/customers/utils/formatCustomerPayload";
import { useCreateCustomer } from "@/features/customers/api/use-mutate-customer";
import { useRouter } from 'next/navigation';

const CreateCustomerForm = ({ branchId, isLoadingZones, isLoadingProducts, zoneOptions, productOptions }: {
    branchId: string
    isLoadingZones: boolean
    isLoadingProducts: boolean
    zoneOptions?: { value: string, label: string }[]
    productOptions?: { value: string, label: string }[]
}) => {

    const { mutate: createNewCustomer, isPending } = useCreateCustomer();
    const router = useRouter();
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
        },
    });

    const onSubmit = (data: CreateCustomerFormData) => {
        const payload = formatCustomerPayload(data, branchId);
        createNewCustomer(payload, {
            onSuccess: () => router.back(),
        });
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
                    <Button type="submit" disabled={isPending || !form.formState.isValid} className="min-w-36 bg-emerald-600 hover:bg-emerald-700 rounded-xl h-10 text-white shadow-sm">
                        {isPending ? (
                            <><Loader2 className="h-4 w-4 animate-spin mr-1.5" /> Creating...</>
                        ) : (
                            <><Plus className="h-4 w-4 mr-1.5" /> Create Customer</>
                        )}
                    </Button>
                </div>
            </form>
        </FormProvider>
    )
}

export default CreateCustomerForm