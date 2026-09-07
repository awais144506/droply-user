/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { ITEMS_PER_PAGE } from "@/constants/constants";

export function usePagination<T>(data: T[], itemsPerPage = ITEMS_PER_PAGE) {
    const [currentPage, setCurrentPage] = useState(1);

    // Reset to page 1 if the dataset shrinks (e.g., when a user types in the search bar)
    useEffect(() => {
        setCurrentPage(1);
    }, [data.length]);

    const totalItems = data.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    
    // Slices the array for the current page
    const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

    return {
        currentPage,
        setCurrentPage,
        paginatedData,
        totalPages,
        totalItems,
        itemsPerPage,
    };
}