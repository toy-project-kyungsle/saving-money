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
		<BaseCard className="space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="text-lg font-semibold text-gray-900">
					총 저축액
				</h2>
				<span className="text-sm text-gray-500">전체 기간</span>
			</div>

			<div className="text-3xl font-bold text-gray-900">
				{formatKRW(total)}
			</div>

			{activeCategories.length > 0 && (
				<div className="grid grid-cols-2 gap-3">
					{activeCategories.map((catSummary) => (
						<div
							key={catSummary.category.id}
							className="p-3 bg-gray-50 rounded-lg"
						>
							<div className="flex items-center gap-2 mb-1">
								<div
									className="w-2.5 h-2.5 rounded-full"
									style={{
										backgroundColor:
											catSummary.category.color,
									}}
								/>
								<span className="text-sm text-gray-600">
									{catSummary.category.name}
								</span>
							</div>
							<div className="font-semibold text-gray-900">
								{formatCompact(catSummary.total)}
							</div>
							<div className="text-xs text-gray-500">
								{catSummary.count}건
							</div>
						</div>
					))}
				</div>
			)}
		</BaseCard>
	);
}
