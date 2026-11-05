
export const formatCurrency = (amount: number | string | null | undefined) => {
    const numericAmount = Number(amount || 0);
    if (isNaN(numericAmount) || numericAmount === 0) return "0";
    return `${numericAmount.toLocaleString("en-PK", { maximumFractionDigits: 0 })}`;
};
export const formatLastVisit = (dateString: string | null) => {
    if (!dateString) return null;

    const date = new Date(dateString);
    const now = new Date();

    // Strip time components to compare strict calendar days
    const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const diffTime = currentDate.getTime() - targetDate.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    let daysAgo = "";
    if (diffDays === 0) daysAgo = "Today";
    else if (diffDays === 1) daysAgo = "Yesterday";
    else if (diffDays > 1) daysAgo = `${diffDays} days ago`;
    else daysAgo = "Today"; // Fallback for minor future/timezone drifts

    // Format exact date (e.g., "04 Nov 2026")
    const formattedDate = date.toLocaleDateString("en-PK", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });

    return { daysAgo, formattedDate };
};

export const formatDate = (dateString?: string) => dateString
    ? new Date(dateString).toLocaleDateString('en-PK', { year: 'numeric', month: 'short', day: 'numeric' })
    : "—";