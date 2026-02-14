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
		<BaseCard className="space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="text-lg font-semibold text-gray-900">
					이번 달 저축
				</h2>
				<span className="text-sm text-gray-500">
					{formatMonthKR(currentMonth)}
				</span>
			</div>

			<div className="text-3xl font-bold text-blue-600">
				{formatKRW(summary.total)}
			</div>

			<div className="space-y-2">
				{categoryAmounts.map((item) => (
					<div
						key={item.category.id}
						className="flex items-center justify-between"
					>
						<div className="flex items-center gap-2">
							<div
								className="w-2 h-2 rounded-full"
								style={{
									backgroundColor: item.category.color,
								}}
							/>
							<span className="text-sm text-gray-600">
								{item.category.name}
							</span>
						</div>
						<span className="text-sm font-medium text-gray-900">
							{formatCompact(item.amount)}
						</span>
					</div>
				))}
			</div>
		</BaseCard>
	);
}
