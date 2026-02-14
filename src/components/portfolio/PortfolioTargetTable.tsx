"use client";

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
	return (
		<BaseCard className="space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="text-lg font-semibold text-gray-900">
					이상적 포트폴리오
				</h2>
				<span className="text-sm text-gray-500">
					목표 비중 합계: {totalTargetPercent}%
				</span>
			</div>

			<div className="overflow-x-auto">
				<table className="w-full text-sm">
					<thead>
						<tr className="border-b border-gray-200">
							<th className="text-left py-2 px-1 font-medium text-gray-600">
								카테고리
							</th>
							<th className="text-right py-2 px-1 font-medium text-gray-600">
								목표 비중
							</th>
							<th className="text-right py-2 px-1 font-medium text-gray-600">
								현재 비중
							</th>
							<th className="text-right py-2 px-1 font-medium text-gray-600">
								차이
							</th>
						</tr>
					</thead>
					<tbody>
						{allocations.map((allocation) => (
							<tr
								key={allocation.category.id}
								className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
								onClick={() =>
									onEditCategory(allocation.category)
								}
							>
								<td className="py-3 px-1">
									<div className="flex items-center gap-2">
										<div
											className="w-3 h-3 rounded-full"
											style={{
												backgroundColor:
													allocation.category.color,
											}}
										/>
										<span className="font-medium text-gray-900">
											{allocation.category.name}
										</span>
									</div>
								</td>
								<td className="py-3 px-1 text-right text-gray-600">
									{allocation.targetPercent}%
								</td>
								<td className="py-3 px-1 text-right text-gray-900 font-medium">
									{allocation.currentPercent.toFixed(1)}%
								</td>
								<td className="py-3 px-1 text-right">
									<span
										className={`font-medium ${
											allocation.difference > 0
												? "text-green-600"
												: allocation.difference < 0
													? "text-red-600"
													: "text-gray-500"
										}`}
									>
										{allocation.difference > 0 ? "+" : ""}
										{allocation.difference.toFixed(1)}%p
									</span>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<p className="text-xs text-gray-400">
				카테고리를 클릭하여 수정할 수 있습니다
			</p>
		</BaseCard>
	);
}
