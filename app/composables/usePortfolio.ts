import type { PortfolioAllocation, PortfolioSummary } from "~/types";

export function usePortfolio() {
	const { investmentCategories } = useCategories();
	const { investmentTypeSavings } = useSavings();

	// Computed: Total investment assets (투자 타입만, 저축 제외)
	const totalAssets = computed(() =>
		investmentTypeSavings.value.reduce((sum, s) => sum + s.amount, 0),
	);

	// Computed: Portfolio allocations with current vs target comparison (투자 카테고리만)
	const allocations = computed<PortfolioAllocation[]>(() => {
		const total = totalAssets.value;

		return investmentCategories.value.map((category) => {
			const categoryAmount = investmentTypeSavings.value
				.filter((s) => s.category_id === category.id)
				.reduce((sum, s) => sum + s.amount, 0);

			const currentPercent = total > 0 ? (categoryAmount / total) * 100 : 0;
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
	});

	// Computed: Portfolio summary
	const portfolioSummary = computed<PortfolioSummary>(() => ({
		totalInvestment: totalAssets.value,
		allocations: allocations.value,
	}));

	// Computed: Target percent total (should be 100%)
	const totalTargetPercent = computed(() =>
		investmentCategories.value.reduce((sum, c) => sum + c.target_percent, 0),
	);

	// Computed: Allocations sorted by difference (most underweight first)
	const allocationsByDifference = computed(() =>
		[...allocations.value].sort((a, b) => a.difference - b.difference),
	);

	// Computed: Categories that need more investment (underweight)
	const underweightCategories = computed(() =>
		allocations.value.filter((a) => a.difference < -1),
	);

	// Computed: Categories that are over target (overweight)
	const overweightCategories = computed(() =>
		allocations.value.filter((a) => a.difference > 1),
	);

	// Calculate how much to invest in each category to reach target
	function calculateRebalanceAmounts(
		additionalInvestment: number,
	): { categoryId: number; name: string; amount: number }[] {
		const newTotal = totalAssets.value + additionalInvestment;

		return investmentCategories.value.map((category) => {
			const currentAmount =
				allocations.value.find((a) => a.category.id === category.id)
					?.currentAmount || 0;
			const targetAmount = (category.target_percent / 100) * newTotal;
			const amountNeeded = Math.max(0, targetAmount - currentAmount);

			return {
				categoryId: category.id,
				name: category.name,
				amount: Math.round(amountNeeded),
			};
		});
	}

	return {
		totalAssets,
		allocations,
		portfolioSummary,
		totalTargetPercent,
		allocationsByDifference,
		underweightCategories,
		overweightCategories,
		calculateRebalanceAmounts,
	};
}
