/**
 * Format amount as Korean Won currency
 */
export function formatKRW(amount: number): string {
	return new Intl.NumberFormat("ko-KR", {
		style: "currency",
		currency: "KRW",
		maximumFractionDigits: 0,
	}).format(amount);
}

/**
 * Format amount with comma separators (without currency symbol)
 */
export function formatNumber(amount: number): string {
	return new Intl.NumberFormat("ko-KR").format(amount);
}

/**
 * Parse formatted number string to number
 */
export function parseFormattedNumber(value: string): number {
	const cleaned = value.replace(/[^\d-]/g, "");
	return Number.parseInt(cleaned, 10) || 0;
}

/**
 * Format amount in compact notation (e.g., 1.2억, 500만)
 */
export function formatCompact(amount: number): string {
	if (amount >= 100_000_000) {
		return `${(amount / 100_000_000).toFixed(1)}억`;
	}
	if (amount >= 10_000) {
		return `${(amount / 10_000).toFixed(0)}만`;
	}
	return formatNumber(amount);
}
