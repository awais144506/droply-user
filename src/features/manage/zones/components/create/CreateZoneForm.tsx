"use client";
import { createZoneSchema, ZoneFormValues } from "../../schema/create-zone-schema";
import { MapPin } from "lucide-react";
import { FormInput } from '@/components/ui/form-input';
import { FormProvider } from "react-hook-form";
import { useCreateZone } from "../../api/use-mutate-zone";
import { useRouter } from "next/navigation";
import { useAppForm } from "@/lib/hooks/use-app-form";
import FormCTAFooter from "@/lib/utils/components/FormCTAFooter";

const ZoneCreateForm = ({ branchId }: { branchId: string }) => {
  const router = useRouter();
  const { mutate: createZone, isPending } = useCreateZone();
  const form = useAppForm(createZoneSchema, {
    name: "",
  })
  const onSubmit = (data: ZoneFormValues) => {
    const payload = {
      ...data,
      branchId: branchId,
    }
    createZone(payload, {
      onSuccess: () => router.back()
    });
  };

  const { formState, handleSubmit } = form;
  const { isDirty, isValid } = formState;

  return (
    <FormProvider {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
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
        <FormCTAFooter
          ctaText="Create Zone"
          href="/manage/zones"
          isPending={isPending}
          isDirty={isDirty}
          isValid={isValid}
          icon={MapPin}
        />
      </form>
    </FormProvider>
  )
}

export default ZoneCreateForm