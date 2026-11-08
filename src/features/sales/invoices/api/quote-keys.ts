export const quoteKeys = {
    all: ["quotations"] as const,
    lists: () => [...quoteKeys.all, "list"] as const,
    list: (filters: string) => [...quoteKeys.lists(), { filters }] as const,
    details: () => [...quoteKeys.all, "detail"] as const,
    detail: (id: string) => [...quoteKeys.details(), id] as const,
    // Add this alias or update it to match what use-quote.ts calls:
    quotation: (id: string) => [...quoteKeys.all, id] as const,
};