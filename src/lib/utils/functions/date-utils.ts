// src/lib/utils/date-utils.ts

/**
 * Returns today's date in YYYY-MM-DD format, adjusted for local timezone.
 * Use this for HTML date inputs (<input type="date">) and default UI states.
 */
export const getLocalTodayString = (): string => {
    const now = new Date();
    return new Date(now.getTime() - now.getTimezoneOffset() * 60000)
        .toISOString()
        .split("T")[0];
};

/**
 * Formats a UTC database date into a readable local time (e.g., "02:45 PM").
 */
export const formatLocalTime = (dateInput: Date | string): string => {
    const date = new Date(dateInput);
    return date.toLocaleTimeString("en-PK", {
        hour: "2-digit",
        minute: "2-digit",
    });
};

/**
 * Formats a UTC database date into a readable local date (e.g., "15 Sept 2026").
 */
export const formatLocalDate = (dateInput: Date | string): string => {
    const date = new Date(dateInput);
    return date.toLocaleDateString("en-PK", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

/**
 * Use this when you need to send a start-of-day UTC timestamp to Prisma 
 * to filter "today's" orders.
 */
export const getStartOfLocalDayUTC = (dateString: string): Date => {
    const localDate = new Date(dateString);
    localDate.setHours(0, 0, 0, 0);
    return localDate;
};

// Helper function to calculate days ago
export const getDaysAgoText = (dateString?: string | null) => {
  if (!dateString) return "Never";
  const diffTime = new Date().getTime() - new Date(dateString).getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return `${diffDays} days ago`;
};