import { useMemo } from "react";
import type { CategorySummary, MonthlySummary } from "@/types";
import { formatCompact, formatKRW } from "@/lib/currency";

interface SummaryTotalProps {
	total: number;
	byCategory: CategorySummary[];
	byMonth: MonthlySummary[];
}

export default function SummaryTotal({
	total,
	byCategory,
	byMonth,
}: SummaryTotalProps) {
	const activeCategories = useMemo(
		() => byCategory.filter((c) => c.total > 0),
		[byCategory],
	);

	const { delta, hasDelta } = useMemo(() => {
		const sorted = [...byMonth].sort((a, b) =>
			b.month.localeCompare(a.month),
		);
		if (sorted.length < 2) return { delta: 0, hasDelta: false };
		return {
			delta: sorted[0]!.total - sorted[1]!.total,
			hasDelta: true,
		};
	}, [byMonth]);

	return (
		<div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary to-primary-800 text-white p-6 sm:p-8 shadow-lg">
			{/* Background decoration */}
			<div
				className="absolute top-0 right-0 w-64 h-64 opacity-10"
				aria-hidden="true"
			>
				<svg viewBox="0 0 200 200" fill="none">
					<circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="0.5" />
					<circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="0.5" />
					<circle cx="100" cy="100" r="40" stroke="currentColor" strokeWidth="0.5" />
				</svg>
			</div>
			<div
				className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full"
				aria-hidden="true"
			/>

			<div className="relative space-y-5">
				{/* Label */}
				<div className="flex items-center gap-2">
					<div className="w-2 h-2 rounded-full bg-white/60" aria-hidden="true" />
					<span className="text-sm font-medium text-white/80">
						총 저축액
					</span>
				</div>

				{/* Hero amount */}
				<div className="space-y-2">
					<div className="text-4xl sm:text-5xl font-extrabold tracking-tight">
						{formatKRW(total)}
					</div>

					{hasDelta && (
						<div className="flex items-center gap-2">
							{delta >= 0 ? (
								<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-sm font-semibold bg-white/20 text-white">
									<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 15l7-7 7 7" />
									</svg>
									{formatCompact(Math.abs(delta))}
								</span>
							) : (
								<span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-sm font-semibold bg-white/20 text-red-200">
									<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
									</svg>
									{formatCompact(Math.abs(delta))}
								</span>
							)}
							<span className="text-sm text-white/60">전월 대비</span>
						</div>
					)}
				</div>

				{/* Category breakdown */}
				{activeCategories.length > 0 && (
					<div className="pt-4 border-t border-white/15 grid grid-cols-2 gap-3">
						{activeCategories.map((catSummary, index) => (
							<div
								key={catSummary.category.id}
								className={`flex items-center justify-between gap-2 animate-fadeInUp stagger-${Math.min(index + 1, 5)}`}
							>
								<div className="flex items-center gap-2 min-w-0">
									<div
										className="w-2.5 h-2.5 rounded-full shrink-0 ring-2 ring-white/20"
										style={{ backgroundColor: catSummary.category.color }}
										aria-hidden="true"
									/>
									<span className="text-sm text-white/70 truncate">
										{catSummary.category.name}
									</span>
								</div>
								<span className="text-sm font-bold text-white tabular-nums shrink-0">
									{formatCompact(catSummary.total)}
								</span>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
