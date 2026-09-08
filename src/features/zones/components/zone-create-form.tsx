"use client";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { createZoneSchema, ZoneFormValues } from '../schema/create-zone-schema';
import { Plus, Loader2 } from "lucide-react";
import { FormInput } from '@/components/ui/form-input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';

interface ZoneCreateFormProps {
  onSubmit: (data: ZoneFormValues) => void;
  isPending: boolean;
  submitText?: string;
}

const ZoneCreateForm = ({ onSubmit, isPending, submitText = "Create Zone" }: ZoneCreateFormProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<ZoneFormValues>({
    resolver: yupResolver(createZoneSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">

      <div className="space-y-5">
        <FormInput
          label="Zone Name"
          required
          placeholder='e.g. Johar Town Lahore'
          register={register("name")}
          error={errors.name?.message}
        />

        {/* Coordinates (Side by Side) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput
            label="Latitude"
            type="number"
            placeholder='e.g. 31.5152'
            register={register("latitude")}
            error={errors.latitude?.message}
          />
          <FormInput
            label="Longitude"
            type="number"
            placeholder='e.g. 74.2882'
            register={register("longitude")}
            error={errors.longitude?.message}
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="mt-8 pt-5 border-t border-slate-100 flex justify-end">
        <Link
          href="/manage/zones"
          className={`${buttonVariants({ variant: "outline", size: "sm" })} ${isPending ? "pointer-events-none opacity-50" : ""}`}
          tabIndex={isPending ? -1 : undefined}
        >
          Cancel
        </Link>
        <Button
          type="submit"
          disabled={isPending}
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
              {submitText}
            </>
          )}
        </Button>
      </div>
    </form>
  )
}

export default ZoneCreateForm