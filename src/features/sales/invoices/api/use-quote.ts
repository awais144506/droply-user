/* eslint-disable @typescript-eslint/no-explicit-any */
import { quoteService } from "./quote.service";
import { quoteKeys } from "./quote-keys";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BillingDocument } from "../types/quotation";

export const useQuotaions = (branchId: string, searchFilter?: string, typeFilter?: string,) => {
    return useQuery({
        queryKey: quoteKeys.all,
        queryFn: () => quoteService.getAllQuotations(branchId),
        select: (data) => {
            const allQuotations = data.quotations;
            // 1. Filter by Type if provided (QUOTATION or INVOICE)
            let filtered = allQuotations.filter((doc) => {
                if (typeFilter && typeFilter.trim() !== "") {
                    return doc.type === typeFilter;
                }
                return true;
            });

            // 2. Filter by search query (strictly checking partyName and documentNumber)
            if (searchFilter && searchFilter.trim() !== "") {
                const query = searchFilter.toLowerCase().trim();
                filtered = filtered.filter((doc) => {
                    const matchDocNum = doc.documentNumber?.toLowerCase().includes(query);
                    const matchPartyName = doc.partyName?.toLowerCase().includes(query);
                    return matchDocNum || matchPartyName;
                });
            }

            return {
                quotations: filtered,
            };
        },
        enabled: !!branchId,
    })
}

export const useQuotation = (branchId: string, id: string) => {
    const queryClient = useQueryClient();
    const cachedData: any = queryClient.getQueryData(quoteKeys.all);
    const allDocs: BillingDocument[] = cachedData?.quotations || [];
    const cachedQuotation = allDocs.find((doc) => doc.id === id);

    return useQuery({
        queryKey: quoteKeys.quotation(id),
        queryFn: () => quoteService.getQuotationById(id),
        initialData: cachedQuotation,
        enabled: !!id && !cachedQuotation, 
    });
};