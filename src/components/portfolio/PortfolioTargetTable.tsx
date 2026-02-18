"use client";

import { useMemo } from "react";
import type { Category, PortfolioAllocation } from "@/types";
import BaseCard from "@/components/base/BaseCard";

interface PortfolioTargetTableProps {
	allocations: PortfolioAllocation[];
	totalTargetPercent: number;
	onEditCategory: (category: Category) => void;
}

export default function PortfolioTargetTable({
	allocations,
	totalTargetPercent,
	onEditCategory,
}: PortfolioTargetTableProps) {
	const sortedAllocations = useMemo(
		() =>
			[...allocations].sort(
				(a, b) => b.targetPercent - a.targetPercent,
			),
		[allocations],
	);
	return (
		<BaseCard className="space-y-5">
			<div className="flex items-center justify-between">
				<h2 className="text-lg font-semibold text-secondary-900">
					이상적 포트폴리오
				</h2>
				<span className="text-sm text-secondary-400">
					목표 비중 합계: {totalTargetPercent}%
				</span>
			</div>

			<div className="overflow-x-auto">
				<table className="w-full text-sm">
					<thead>
						<tr className="border-b border-secondary-100">
							<th className="text-left py-2.5 px-2 text-xs uppercase tracking-wider font-semibold text-secondary-500">
								카테고리
							</th>
							<th className="text-right py-2.5 px-2 text-xs uppercase tracking-wider font-semibold text-secondary-500">
								목표 비중
							</th>
							<th className="text-right py-2.5 px-2 text-xs uppercase tracking-wider font-semibold text-secondary-500">
								현재 비중
							</th>
							<th className="text-right py-2.5 px-2 text-xs uppercase tracking-wider font-semibold text-secondary-500">
								차이
							</th>
							<th className="w-10">
								<span className="sr-only">수정</span>
							</th>
						</tr>
					</thead>
					<tbody>
						{sortedAllocations.map((allocation) => (
							<tr
								key={allocation.category.id}
								className="border-b border-secondary-100 hover:bg-surface-subtle transition-colors duration-200 cursor-pointer group"
								onClick={() =>
									onEditCategory(allocation.category)
								}
							>
								<td className="py-3.5 px-2">
									<div className="flex items-center gap-2.5">
										<div
											className="w-3 h-3 rounded-full flex-shrink-0"
											style={{
												backgroundColor:
													allocation.category.color,
											}}
											aria-hidden="true"
										/>
										<span className="font-medium text-secondary-900">
											{allocation.category.name}
										</span>
									</div>
								</td>
								<td className="py-3.5 px-2 text-right text-secondary-600">
									{allocation.targetPercent}%
								</td>
								<td className="py-3.5 px-2 text-right text-secondary-600">
									{allocation.currentPercent.toFixed(1)}%
								</td>
								<td className="py-3.5 px-2 text-right">
									{allocation.difference > 0 ? (
										<span className="inline-flex items-center text-success-600 bg-success-50 px-2 py-0.5 rounded-full text-xs font-medium">
											+{allocation.difference.toFixed(1)}%p
										</span>
									) : allocation.difference < 0 ? (
										<span className="inline-flex items-center text-error-600 bg-error-50 px-2 py-0.5 rounded-full text-xs font-medium">
											{allocation.difference.toFixed(1)}%p
										</span>
									) : (
										<span className="text-secondary-400 text-xs font-medium">
											0.0%p
										</span>
									)}
								</td>
								<td className="py-3.5 px-1">
									<svg
										className="w-4 h-4 text-secondary-300 group-hover:text-secondary-500 transition-colors"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										aria-hidden="true"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M9 5l7 7-7 7"
										/>
									</svg>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<p className="text-xs text-secondary-300">
				카테고리를 클릭하면 수정할 수 있어요
			</p>
		</BaseCard>
	);
}
