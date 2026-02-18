"use client";

import { useMemo } from "react";
import type { PortfolioSummary } from "@/types";
import { formatCompact, formatKRW } from "@/lib/currency";
import BaseCard from "@/components/base/BaseCard";

interface PortfolioSummaryCardProps {
	summary: PortfolioSummary;
}

export default function PortfolioSummaryCard({
	summary,
}: PortfolioSummaryCardProps) {
	const underweight = useMemo(() => {
		const sorted = [...summary.allocations].sort(
			(a, b) => a.difference - b.difference,
		);
		return sorted.filter((a) => a.difference < -1).slice(0, 3);
	}, [summary.allocations]);

	const overweight = useMemo(() => {
		const sorted = [...summary.allocations].sort(
			(a, b) => b.difference - a.difference,
		);
		return sorted.filter((a) => a.difference > 1).slice(0, 3);
	}, [summary.allocations]);

	return (
		<BaseCard className="space-y-5">
			<div className="flex items-center justify-between">
				<h2 className="text-lg font-semibold text-secondary-900">
					투자 현황
				</h2>
			</div>

			{/* Total Investment */}
			<div className="text-center py-5 bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl">
				<p className="text-sm text-secondary-500 mb-1">총 투자금액</p>
				<p className="text-3xl font-bold text-secondary-900">
					{formatKRW(summary.totalInvestment)}
				</p>
			</div>

			{/* Category Breakdown */}
			<div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
				{summary.allocations.map((allocation) => (
					<div
						key={allocation.category.id}
						className="p-3.5 bg-surface-subtle rounded-xl"
					>
						<div className="flex items-center gap-2 mb-1.5">
							<div
								className="w-3 h-3 rounded-full flex-shrink-0"
								style={{
									backgroundColor:
										allocation.category.color,
								}}
								aria-hidden="true"
							/>
							<span className="text-sm text-secondary-600 truncate">
								{allocation.category.name}
							</span>
						</div>
						<div className="font-bold text-secondary-900">
							{formatCompact(allocation.currentAmount)}
						</div>
						<div className="text-xs text-secondary-400 mt-0.5">
							{allocation.currentPercent.toFixed(1)}%
						</div>
					</div>
				))}
			</div>

			{/* Rebalancing Suggestions */}
			{(underweight.length > 0 || overweight.length > 0) && (
				<div className="pt-5 border-t border-secondary-100">
					<h3 className="text-sm font-semibold text-secondary-800 mb-3">
						리밸런싱 제안
					</h3>

					<div className="space-y-2.5">
						{underweight.map((item) => (
							<div
								key={item.category.id}
								className="flex items-center justify-between text-sm"
							>
								<div className="flex items-center gap-2">
									<div
										className="w-2.5 h-2.5 rounded-full flex-shrink-0"
										style={{
											backgroundColor:
												item.category.color,
										}}
										aria-hidden="true"
									/>
									<span className="text-secondary-600">
										{item.category.name}
									</span>
								</div>
								<span className="text-error-600 bg-error-50 px-2 py-0.5 rounded-full text-xs font-medium">
									{item.difference.toFixed(1)}%p 부족
								</span>
							</div>
						))}

						{overweight.map((item) => (
							<div
								key={item.category.id}
								className="flex items-center justify-between text-sm"
							>
								<div className="flex items-center gap-2">
									<div
										className="w-2.5 h-2.5 rounded-full flex-shrink-0"
										style={{
											backgroundColor:
												item.category.color,
										}}
										aria-hidden="true"
									/>
									<span className="text-secondary-600">
										{item.category.name}
									</span>
								</div>
								<span className="text-success-600 bg-success-50 px-2 py-0.5 rounded-full text-xs font-medium">
									+{item.difference.toFixed(1)}%p 초과
								</span>
							</div>
						))}
					</div>
				</div>
			)}
		</BaseCard>
	);
}
