export const formatCurrency = (amount: number | string | null | undefined) => {
    const numericAmount = Number(amount || 0);
    if (isNaN(numericAmount) || numericAmount === 0) return "-";
    return `${numericAmount.toLocaleString("en-PK", { maximumFractionDigits: 0 })}`;
};