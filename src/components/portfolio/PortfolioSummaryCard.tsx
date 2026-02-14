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
		<BaseCard className="space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="text-lg font-semibold text-gray-900">
					투자 현황
				</h2>
			</div>

			{/* Total Investment */}
			<div className="text-center py-4 bg-gray-50 rounded-lg">
				<p className="text-sm text-gray-500 mb-1">총 투자금액</p>
				<p className="text-3xl font-bold text-gray-900">
					{formatKRW(summary.totalInvestment)}
				</p>
			</div>

			{/* Category Breakdown */}
			<div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
				{summary.allocations.map((allocation) => (
					<div
						key={allocation.category.id}
						className="p-3 bg-gray-50 rounded-lg"
					>
						<div className="flex items-center gap-2 mb-1">
							<div
								className="w-2.5 h-2.5 rounded-full"
								style={{
									backgroundColor:
										allocation.category.color,
								}}
							/>
							<span className="text-sm text-gray-600 truncate">
								{allocation.category.name}
							</span>
						</div>
						<div className="font-semibold text-gray-900">
							{formatCompact(allocation.currentAmount)}
						</div>
						<div className="text-xs text-gray-500">
							{allocation.currentPercent.toFixed(1)}%
						</div>
					</div>
				))}
			</div>

			{/* Rebalancing Suggestions */}
			{(underweight.length > 0 || overweight.length > 0) && (
				<div className="pt-4 border-t border-gray-200">
					<h3 className="text-sm font-medium text-gray-700 mb-3">
						리밸런싱 제안
					</h3>

					<div className="space-y-2">
						{underweight.map((item) => (
							<div
								key={item.category.id}
								className="flex items-center justify-between text-sm"
							>
								<div className="flex items-center gap-2">
									<div
										className="w-2 h-2 rounded-full"
										style={{
											backgroundColor:
												item.category.color,
										}}
									/>
									<span className="text-gray-600">
										{item.category.name}
									</span>
								</div>
								<span className="text-red-600 font-medium">
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
										className="w-2 h-2 rounded-full"
										style={{
											backgroundColor:
												item.category.color,
										}}
									/>
									<span className="text-gray-600">
										{item.category.name}
									</span>
								</div>
								<span className="text-green-600 font-medium">
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
