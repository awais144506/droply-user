"use client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { createZoneSchema, ZoneFormValues } from "../../schema/create-zone-schema";
import { Plus, Loader2 } from "lucide-react";
import { FormInput } from '@/components/ui/form-input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { FormProvider } from "react-hook-form";
import { useCreateZone } from "../../api/use-mutate-zone";
import { useRouter } from "next/navigation";

const ZoneCreateForm = ({ branchId }: { branchId: string }) => {
  const router = useRouter();
  const { mutate: createZone, isPending } = useCreateZone();
  const form = useForm<ZoneFormValues>({
    resolver: yupResolver(createZoneSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
    }
  });

  const onSubmit = (data: ZoneFormValues) => {
    const payload = {
      ...data,
      branchId: branchId,
    }
    createZone(payload, {
      onSuccess: () => router.back()
    });
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="space-y-5">
          <FormInput
            label="Zone Name"
            required
            placeholder='e.g. Johar Town Lahore'
            name="name"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Latitude"
              type="number"
              placeholder='e.g. 31.5152'
              name="latitude"
            />
            <FormInput
              label="Longitude"
              type="number"
              placeholder='e.g. 74.2882'
              name="longitude"
            />
          </div>
        </div>
        <div className="mt-8 pt-5 gap-2 border-t border-slate-100 flex justify-end">
          <Link
            href="/manage/zones"
            className={`${buttonVariants({ variant: "outline", size: "sm" })} ${isPending ? "pointer-events-none opacity-50" : ""}`}
            tabIndex={isPending ? -1 : undefined}
          >
            Cancel
          </Link>
          <Button
            type="submit"
            disabled={isPending || !form.formState.isValid}
            variant="create"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Create Zone
              </>
            )}
          </Button>
          {/* {Object.keys(form.formState.errors).length > 0 && (
            <div className="bg-rose-50 p-4 rounded-lg w-full mb-4 font-mono text-xs text-rose-600">
              <p className="font-bold mb-2">Why is the button disabled?</p>
              <pre>{JSON.stringify(form.formState.errors, null, 2)}</pre>
            </div>
          )} */}
        </div>
      </form>
    </FormProvider>
  )
}

export default ZoneCreateForm