// Category types (DB 기반)
export type CategoryType = "savings" | "investment";

export interface Category {
	id: number;
	user_id: string;
	name: string;
	type: CategoryType;
	target_percent: number;
	color: string;
	sort_order: number;
	is_active: boolean;
	created_at: string;
}

export interface CategoryInput {
	name: string;
	type: CategoryType;
	target_percent?: number;
	color?: string;
	sort_order?: number;
}

// Saving types
export interface Saving {
	id: number;
	user_id: string;
	category_id: number;
	category?: Category;
	amount: number;
	transaction_date: string;
	description?: string;
	created_at: string;
}

export interface SavingInput {
	category_id: number;
	amount: number;
	transaction_date?: string;
	description?: string;
}

// Summary types
export interface CategorySummary {
	category: Category;
	total: number;
	count: number;
}

export interface MonthlySummary {
	month: string; // YYYY-MM format
	total: number;
	byCategory: Map<number, number>; // category_id -> amount
}

export interface SavingSummary {
	total: number;
	byCategory: CategorySummary[];
	byMonth: MonthlySummary[];
}

// Portfolio types
export interface PortfolioAllocation {
	category: Category;
	currentAmount: number;
	currentPercent: number;
	targetPercent: number;
	difference: number; // currentPercent - targetPercent
}

export interface PortfolioSummary {
	totalInvestment: number;
	allocations: PortfolioAllocation[];
}

// Auth types
export interface User {
	id: string;
	email: string;
	created_at: string;
}
