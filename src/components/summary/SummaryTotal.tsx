import { useMemo } from "react";
import type { CategorySummary } from "@/types";
import { formatCompact, formatKRW } from "@/lib/currency";
import BaseCard from "@/components/base/BaseCard";

interface SummaryTotalProps {
	total: number;
	byCategory: CategorySummary[];
}

export default function SummaryTotal({
	total,
	byCategory,
}: SummaryTotalProps) {
	const activeCategories = useMemo(
		() => byCategory.filter((c) => c.total > 0),
		[byCategory],
	);

	return (
		<BaseCard className="space-y-5">
			{/* Header */}
			<div className="flex items-center justify-between">
				<h2 className="text-lg font-semibold text-secondary-900">
					총 저축액
				</h2>
				<span className="text-sm text-secondary-400">전체 기간</span>
			</div>

			{/* Total amount with accent indicator */}
			<div className="space-y-2">
				<div
					className="w-8 h-1 rounded-full bg-primary"
					aria-hidden="true"
				/>
				<div className="text-3xl font-bold text-secondary-900 tracking-tight">
					{formatKRW(total)}
				</div>
			</div>

			{/* Category breakdown grid */}
			{activeCategories.length > 0 && (
				<div className="grid grid-cols-2 gap-3">
					{activeCategories.map((catSummary, index) => (
						<div
							key={catSummary.category.id}
							className={`p-3.5 bg-surface-subtle rounded-xl transition-shadow duration-200 hover:shadow-sm animate-fadeInUp stagger-${Math.min(index + 1, 5)}`}
						>
							<div className="flex items-center gap-2 mb-1.5">
								<div
									className="w-3 h-3 rounded-full shrink-0"
									style={{
										backgroundColor:
											catSummary.category.color,
									}}
									aria-hidden="true"
								/>
								<span className="text-sm text-secondary-600">
									{catSummary.category.name}
								</span>
							</div>
							<div className="font-bold text-secondary-900">
								{formatCompact(catSummary.total)}
							</div>
							<div className="text-xs text-secondary-400 mt-0.5">
								{catSummary.count}건
							</div>
						</div>
					))}
				</div>
			)}
		</BaseCard>
	);
}
