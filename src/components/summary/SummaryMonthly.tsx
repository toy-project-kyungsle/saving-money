import type { Category, MonthlySummary } from "@/types";
import { formatCompact, formatKRW } from "@/lib/currency";
import { formatMonthKR, getCurrentMonth } from "@/lib/date";
import BaseCard from "@/components/base/BaseCard";

interface SummaryMonthlyProps {
	summary: MonthlySummary;
	prevSummary?: MonthlySummary | null;
	categories: Category[];
}

export default function SummaryMonthly({
	summary,
	prevSummary,
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
	categoryAmounts.sort((a, b) => b.amount - a.amount);

	const delta = prevSummary ? summary.total - prevSummary.total : null;
	const hasDelta = delta !== null && prevSummary && prevSummary.total > 0;
	const totalAmount = summary.total || 1;

	return (
		<BaseCard className="space-y-5 h-full flex flex-col">
			{/* Header */}
			<div className="flex items-center justify-between">
				<h2 className="text-lg font-semibold text-secondary-900">
					이번 달
				</h2>
				<span className="text-sm text-secondary-400">
					{formatMonthKR(currentMonth)}
				</span>
			</div>

			{/* Monthly total + delta */}
			<div className="space-y-1.5">
				<div className="text-3xl font-bold text-secondary-900 tracking-tight">
					{formatKRW(summary.total)}
				</div>
				{hasDelta && (
					<div className="flex items-center gap-1.5">
						{delta > 0 ? (
							<span className="inline-flex items-center gap-0.5 text-sm font-medium text-success-600">
								<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 15l7-7 7 7" />
								</svg>
								{formatCompact(Math.abs(delta))}
							</span>
						) : delta < 0 ? (
							<span className="inline-flex items-center gap-0.5 text-sm font-medium text-error-600">
								<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
								</svg>
								{formatCompact(Math.abs(delta))}
							</span>
						) : (
							<span className="text-sm font-medium text-secondary-400">변동 없음</span>
						)}
						<span className="text-xs text-secondary-400">지난달 대비</span>
					</div>
				)}
			</div>

			{/* Category breakdown with progress bars */}
			{categoryAmounts.length > 0 && (
				<div className="space-y-3 flex-1">
					{categoryAmounts.map((item) => {
						const percent = (item.amount / totalAmount) * 100;
						return (
							<div key={item.category.id} className="space-y-1.5">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<div
											className="w-2.5 h-2.5 rounded-full shrink-0"
											style={{ backgroundColor: item.category.color }}
											aria-hidden="true"
										/>
										<span className="text-sm text-secondary-600">
											{item.category.name}
										</span>
									</div>
									<span className="text-sm font-bold text-secondary-900 tabular-nums">
										{formatCompact(item.amount)}
									</span>
								</div>
								<div className="h-1.5 bg-secondary-100 rounded-full overflow-hidden">
									<div
										className="h-full rounded-full transition-all duration-500 ease-out"
										style={{
											width: `${Math.min(percent, 100)}%`,
											backgroundColor: item.category.color,
										}}
									/>
								</div>
							</div>
						);
					})}
				</div>
			)}
		</BaseCard>
	);
}
