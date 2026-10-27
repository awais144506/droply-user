import { useQuery } from "@tanstack/react-query";
import { dailySalesService } from "./daily.service";

export const dailySalesKeys = {
    all: ["daily-sales"] as const,
    date: (date?: string) => [...dailySalesKeys.all, { date }] as const,
};

export const useDailySales = (date?: string) => {
    return useQuery({
        queryKey: dailySalesKeys.date(date),
        queryFn: () => dailySalesService.getDailySales(date),
    });
};