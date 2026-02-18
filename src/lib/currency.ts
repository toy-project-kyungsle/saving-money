/**
 * Format amount as Korean Won currency (e.g., "1,234,567원")
 */
export function formatKRW(amount: number): string {
	return `${new Intl.NumberFormat("ko-KR").format(amount)}원`;
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
 * Format amount in compact notation (e.g., "1.2억원", "500만원")
 */
export function formatCompact(amount: number): string {
	if (amount >= 100_000_000) {
		return `${(amount / 100_000_000).toFixed(1)}억원`;
	}
	if (amount >= 10_000) {
		return `${(amount / 10_000).toFixed(0)}만원`;
	}
	return `${formatNumber(amount)}원`;
}
