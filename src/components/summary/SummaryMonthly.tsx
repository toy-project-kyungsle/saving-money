import type { Category, MonthlySummary } from "@/types";
import { formatCompact, formatKRW } from "@/lib/currency";
import { formatMonthKR, getCurrentMonth } from "@/lib/date";
import BaseCard from "@/components/base/BaseCard";

interface SummaryMonthlyProps {
	summary: MonthlySummary;
	categories: Category[];
}

export default function SummaryMonthly({
	summary,
	categories,
}: SummaryMonthlyProps) {
	const currentMonth = getCurrentMonth();

	function getCategory(id: number): Category | undefined {
		return categories.find((c) => c.id === id);
	}

	const categoryAmounts: { category: Category; amount: number }[] = [];
	summary.byCategory.forEach((amount, categoryId) => {
		const category = getCategory(categoryId);
		if (category && amount > 0) {
			categoryAmounts.push({ category, amount });
		}
	});

	return (
		<BaseCard className="space-y-5">
			{/* Header */}
			<div className="flex items-center justify-between">
				<h2 className="text-lg font-semibold text-secondary-900">
					이번 달 저축
				</h2>
				<span className="text-sm text-secondary-400">
					{formatMonthKR(currentMonth)}
				</span>
			</div>

			{/* Monthly total in brand color */}
			<div className="text-3xl font-bold text-primary tracking-tight">
				{formatKRW(summary.total)}
			</div>

			{/* Category breakdown list */}
			{categoryAmounts.length > 0 && (
				<div className="space-y-3">
					{categoryAmounts.map((item) => (
						<div
							key={item.category.id}
							className="flex items-center justify-between py-1"
						>
							<div className="flex items-center gap-2.5">
								<div
									className="w-2.5 h-2.5 rounded-full shrink-0"
									style={{
										backgroundColor: item.category.color,
									}}
									aria-hidden="true"
								/>
								<span className="text-sm text-secondary-600">
									{item.category.name}
								</span>
							</div>
							<span className="text-sm font-bold text-secondary-900">
								{formatCompact(item.amount)}
							</span>
						</div>
					))}
				</div>
			)}
		</BaseCard>
	);
}
