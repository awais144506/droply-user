/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

"use client";
import { useEffect } from "react";
import { FormProvider } from "react-hook-form";
import { FileText } from "lucide-react";
import { useProducts } from "@/features/manage/products/api/use-products";
import { useCustomers } from "@/features/manage/customers/api/use-customer";
import { useRole } from "@/lib/hooks/use-role";
import { billingDocumentSchema, BillingDocumentFormValues, defaultBillingDocumentValues } from "../../schema/quotation-schema";
import { QuotationCustomerSection } from "./components/QuotationCustomerSection";
import { QuotationItemsSection } from "./components/QuotationItemsSection";
import { QuotationSummarySection } from "./components/QuotationSummarySection";
import FormCTAFooter from "@/lib/utils/components/FormCTAFooter";
import { useAppForm } from "@/lib/hooks/use-app-form";
import { useCreateQuotation, useUpdateQuotation } from "../../api/use-mutate-quote";

type Props = {
  initialData?: Partial<BillingDocumentFormValues>;
  documentId?: string;
};

const QuotationForm = ({ initialData, documentId }: Props) => {
  const { branchId } = useRole();
  const isEditMode = Boolean(documentId);

  // 1. Fetch Catalog Products & Active Customers
  const { data: productList, isLoading: isLoadingProducts } = useProducts(branchId);
  const productOptions = productList?.productOptionsQuotation || [];
  const { data: customerList, isLoading: isLoadingCustomers } = useCustomers(branchId);
  const customerOptions = customerList?.customerOptionsQuotaion || [];

  // 2. Initialize mutation hook
  const { mutate: createQuotation, isPending: isCreating } = useCreateQuotation();
  const { mutate: updateQuotation, isPending: isUpdating } = useUpdateQuotation();
  const isPending = isCreating || isUpdating;

  const methods = useAppForm(billingDocumentSchema, initialData ? initialData : defaultBillingDocumentValues);

  useEffect(() => {
    if (initialData) {
      methods.reset({
        ...defaultBillingDocumentValues,
        ...initialData,
        issueDate: initialData.issueDate
          ? new Date(initialData.issueDate).toISOString().split("T")[0]
          : defaultBillingDocumentValues.issueDate,
      });
    }
  }, [initialData, methods]);

  // 3. Submit Handler
  const onSubmit = async (values: BillingDocumentFormValues) => {
    const {
      id,
      documentNumber,
      createdAt,
      updatedAt,
      customer,
      items,
      ...restValues
    } = values as any;

    const cleanedItems = (items || []).map(({ id: _, billingDocumentId: __, ...itemRest }: any) => itemRest);

    const payload = {
      ...restValues,
      branchId,
      issueDate: values.issueDate ? new Date(values.issueDate).toISOString() : undefined,
      items: cleanedItems,
    };

    if (isEditMode) {
      if (!documentId) return;
      updateQuotation({ id: documentId, payload });
    } else {
      createQuotation(payload);
    }
  };

  const { formState, handleSubmit } = methods;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-12">
        <QuotationCustomerSection
          customerOptions={customerOptions}
          isLoadingCustomers={isLoadingCustomers}
          isEditMode={isEditMode}
        />

        <QuotationItemsSection
          productOptions={productOptions}
          isLoadingProducts={isLoadingProducts}
        />

        <QuotationSummarySection />

        <FormCTAFooter
          ctaText="Generate Quotation"
          icon={FileText}
          href="/app/sales/invoices"
          isPending={isPending}
          isDirty={formState.isDirty}
          isValid={formState.isValid}
          isEditMode={isEditMode}
        />
      </form>
    </FormProvider>
  );
};

export default QuotationForm;