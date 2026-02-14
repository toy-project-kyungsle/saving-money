"use client";

import { useMemo } from "react";
import type {
	Category,
	PortfolioAllocation,
	PortfolioSummary,
	Saving,
} from "@/types";

export function usePortfolio(
	investmentCategories: Category[],
	investmentTypeSavings: Saving[],
) {
	// Total investment assets (투자 타입만, 저축 제외)
	const totalAssets = useMemo(
		() => investmentTypeSavings.reduce((sum, s) => sum + s.amount, 0),
		[investmentTypeSavings],
	);

	// Portfolio allocations with current vs target comparison (투자 카테고리만)
	const allocations = useMemo<PortfolioAllocation[]>(() => {
		const total = totalAssets;

		return investmentCategories.map((category) => {
			const categoryAmount = investmentTypeSavings
				.filter((s) => s.category_id === category.id)
				.reduce((sum, s) => sum + s.amount, 0);

			const currentPercent =
				total > 0 ? (categoryAmount / total) * 100 : 0;
			const targetPercent = category.target_percent;
			const difference = currentPercent - targetPercent;

			return {
				category,
				currentAmount: categoryAmount,
				currentPercent: Math.round(currentPercent * 100) / 100,
				targetPercent,
				difference: Math.round(difference * 100) / 100,
			};
		});
	}, [investmentCategories, investmentTypeSavings, totalAssets]);

	// Portfolio summary
	const portfolioSummary = useMemo<PortfolioSummary>(
		() => ({
			totalInvestment: totalAssets,
			allocations,
		}),
		[totalAssets, allocations],
	);

	// Target percent total (should be 100%)
	const totalTargetPercent = useMemo(
		() =>
			investmentCategories.reduce(
				(sum, c) => sum + c.target_percent,
				0,
			),
		[investmentCategories],
	);

	return {
		totalAssets,
		allocations,
		portfolioSummary,
		totalTargetPercent,
	};
}
