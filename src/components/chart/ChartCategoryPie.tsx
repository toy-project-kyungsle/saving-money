"use client";

import { useMemo } from "react";
import type { CategorySummary } from "@/types";
import { formatKRW } from "@/lib/currency";
import BaseCard from "@/components/base/BaseCard";
import BaseButton from "@/components/base/BaseButton";
import FeedbackEmpty from "@/components/feedback/FeedbackEmpty";
import dynamic from "next/dynamic";

const ReactECharts = dynamic(() => import("echarts-for-react"), {
	ssr: false,
});

interface ChartCategoryPieProps {
	data: CategorySummary[];
	title?: string;
	onAdd?: () => void;
}

export default function ChartCategoryPie({
	data,
	title = "카테고리별 비율",
	onAdd,
}: ChartCategoryPieProps) {
	const activeData = useMemo(
		() => data.filter((item) => item.total > 0),
		[data],
	);

	const grandTotal = useMemo(
		() => activeData.reduce((sum, item) => sum + item.total, 0),
		[activeData],
	);

	const chartOption = useMemo(
		() => ({
			tooltip: {
				trigger: "item",
				backgroundColor: "rgba(255, 255, 255, 0.96)",
				borderColor: "#E2E8F0",
				borderWidth: 1,
				textStyle: {
					color: "#0F172A",
					fontSize: 13,
				},
				padding: [10, 14],
				formatter: (params: {
					name: string;
					value: number;
					percent: number;
				}) => {
					return `<span style="font-weight:600">${params.name}</span><br/>${formatKRW(params.value)} <span style="color:#94A3B8">(${params.percent}%)</span>`;
				},
				extraCssText: "border-radius: 10px; box-shadow: 0 4px 12px -2px rgba(0,0,0,0.08);",
			},
			series: [
				{
					type: "pie",
					radius: ["45%", "72%"],
					center: ["50%", "50%"],
					avoidLabelOverlap: false,
					itemStyle: {
						borderRadius: 6,
						borderColor: "#fff",
						borderWidth: 3,
					},
					label: { show: false },
					emphasis: {
						scale: true,
						scaleSize: 6,
						label: { show: false },
					},
					labelLine: { show: false },
					data: activeData.map((item) => ({
						value: item.total,
						name: item.category.name,
						itemStyle: { color: item.category.color },
					})),
				},
			],
			animation: true,
			animationType: "scale",
			animationEasing: "cubicOut",
			animationDuration: 600,
		}),
		[activeData],
	);

	if (activeData.length === 0) {
		return (
			<BaseCard padding="lg">
				<FeedbackEmpty
					title="아직 데이터가 없어요"
					description="저축을 추가하면 차트가 표시돼요"
					action={
						onAdd ? (
							<BaseButton size="sm" onClick={onAdd}>
								+ 새 저축 추가
							</BaseButton>
						) : undefined
					}
				/>
			</BaseCard>
		);
	}

	return (
		<BaseCard padding="lg" className="space-y-5">
			{/* Section heading */}
			<h2 className="text-lg font-semibold text-secondary-900">
				{title}
			</h2>

			{/* Donut chart */}
			<ReactECharts
				option={chartOption}
				style={{ height: "280px" }}
				opts={{ renderer: "canvas" }}
			/>

			{/* Custom legend */}
			<div
				className="grid grid-cols-2 gap-x-4 gap-y-3 pt-1"
				role="list"
				aria-label="카테고리별 금액"
			>
				{activeData.map((item) => {
					const percent =
						grandTotal > 0
							? ((item.total / grandTotal) * 100).toFixed(1)
							: "0";

					return (
						<div
							key={item.category.id}
							className="flex items-center gap-2.5"
							role="listitem"
						>
							<div
								className="w-2.5 h-2.5 rounded-full shrink-0"
								style={{
									backgroundColor: item.category.color,
								}}
								aria-hidden="true"
							/>
							<span className="text-sm text-secondary-600 truncate">
								{item.category.name}
							</span>
							<span className="text-sm font-bold text-secondary-900 ml-auto tabular-nums">
								{percent}%
							</span>
						</div>
					);
				})}
			</div>
		</BaseCard>
	);
}
