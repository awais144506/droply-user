export const formatCurrency = (amount: number | string | null | undefined) => {
    const numericAmount = Number(amount || 0);
    if (isNaN(numericAmount) || numericAmount === 0) return "0";
    return `${numericAmount.toLocaleString("en-PK", { maximumFractionDigits: 0 })}`;
};
export const formatLastVisit = (dateString: string | null) => {
    if (!dateString) return null;

    const date = new Date(dateString);
    const now = new Date();

    // Calculate difference in days
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    let daysAgo = "";
    if (diffDays === 0) daysAgo = "Today";
    else if (diffDays === 1) daysAgo = "Yesterday";
    else daysAgo = `${diffDays} days ago`;

    // Format exact date (e.g., "12 Sep 2026")
    const formattedDate = date.toLocaleDateString("en-PK", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });

    return { daysAgo, formattedDate };
};

export const formatPakistaniPhone = (phone: string) => {
    if (!phone) return phone;
    const cleaned = phone.replace(/[\s-]/g, '');
    if (cleaned.startsWith('03') && cleaned.length === 11) {
        return '+92' + cleaned.slice(1);
    }
    return cleaned;
};

export const displayPakistaniPhone = (phone?: string) => {
    if (!phone) return phone;
    if (phone.startsWith('+923') && phone.length === 13) {
        return '0' + phone.slice(3);
    }
    return phone;
};

export const formatDate = (dateString?: string) => dateString
    ? new Date(dateString).toLocaleDateString('en-PK', { year: 'numeric', month: 'short', day: 'numeric' })
    : "—";