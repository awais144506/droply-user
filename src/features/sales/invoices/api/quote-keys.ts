export const quoteKeys = {
    all: ["all-quotations"] as const,
    quotation: (id: string) => [...quoteKeys.all, id] as const,
}