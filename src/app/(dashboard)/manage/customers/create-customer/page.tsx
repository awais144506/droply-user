"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "sonner";
import {
    ArrowLeft, Loader2,
    Plus, AlertCircle
} from "lucide-react";
import { useRole } from "@/hooks/use-role";
import { useZones } from "@/features/zones/api/use-zones";
import { Button, buttonVariants } from "@/components/ui/button";
import { createCustomerSchema, CreateCustomerFormData } from "@/features/customers/schema/create-customer.schema";
import { useProducts } from "@/features/products/api/use-products";
import { useCreateCustomer } from "@/features/customers/api/use-customers";
import FinancialsCard from "@/features/customers/components/create/FinancialsCard";
import AddressCard from "@/features/customers/components/create/AddressCard";
import IdentityCard from "@/features/customers/components/create/IdentityCard";
import { formatCustomerPayload } from "@/features/customers/utils/formatCustomerPayload";

export default function CreateCustomerPage() {
    const router = useRouter();
    const { branchId } = useRole();

    const { data: rawZones } = useZones(branchId);
    const { data: rawProducts } = useProducts(branchId);
    const { mutate: createNewCustomer, isPending, isError } = useCreateCustomer();

    const zoneOptions = rawZones?.zones.map(z => ({ value: z.id, label: z.name }));
    const productOptions = rawProducts
        ?.filter(p => p.trackingType === "RETURNABLE")
        ?.map(p => ({
            value: p.id,
            label: p.name
        })) || [];

    const { register, handleSubmit, control, formState: { errors, isValid } } = useForm<CreateCustomerFormData>({
        resolver: yupResolver(createCustomerSchema),
        mode: "onChange",
        defaultValues: {
            partyType: "CUSTOMER",
            customerCategory: "DOMESTIC",
            name: "",
            phone: "",
            zoneId: "",
            address: "",
            customerCredit: 0,
            customerAdvance: 0,
            securityDeposit: 0,
            openingReturnables: [],
        },
    });

    const onSubmit = (data: CreateCustomerFormData) => {
        if (!branchId) {
            toast.error("Authentication error: Branch context missing.");
            return;
        }
        const payload = formatCustomerPayload(data, branchId);
        createNewCustomer(payload, {
            onSuccess: () => {
                toast.success("Customer created successfully!");
                router.push("/manage/customers");
            },
            onError: (err: any) => {
                toast.error(err?.response?.data?.message || "Failed to create customer.");
            }
        });
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6 p-6">
            <div className="flex items-center gap-3 border-b pb-4">
                <Link href="/manage/customers" className={buttonVariants({ variant: "outline", size: "icon-sm" })}>
                    <ArrowLeft className="h-4 w-4" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Add New Customer</h1>
                </div>
            </div>

            {isError && (
                <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>Failed to save customer. Please check the inputs.</span>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Modularized Form Sections */}
                    <IdentityCard control={control} register={register} errors={errors} zoneOptions={zoneOptions} />

                    <div className="space-y-6">
                        <AddressCard register={register} errors={errors} />
                        <FinancialsCard control={control} productOptions={productOptions} register={register} errors={errors} />
                    </div>
                </div>

                <div className="flex items-center justify-end gap-3 border-t pt-4">
                    <Link href="/manage/customers" className={buttonVariants({ variant: "outline", size: "sm" })}>
                        Cancel
                    </Link>
                    <Button type="submit" disabled={isPending || !isValid} className="min-w-36 bg-emerald-600 hover:bg-emerald-700 rounded-xl h-10 text-white shadow-sm">
                        {isPending ? (
                            <><Loader2 className="h-4 w-4 animate-spin mr-1.5" /> Creating...</>
                        ) : (
                            <><Plus className="h-4 w-4 mr-1.5" /> Create Customer</>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}

// ============================================================================
// EXTRACTED FORM COMPONENTS
// ============================================================================




