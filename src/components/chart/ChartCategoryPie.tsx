"use client";

import { useMemo } from "react";
import type { CategorySummary } from "@/types";
import { formatKRW } from "@/lib/currency";
import BaseCard from "@/components/base/BaseCard";
import FeedbackEmpty from "@/components/feedback/FeedbackEmpty";
import dynamic from "next/dynamic";

const ReactECharts = dynamic(() => import("echarts-for-react"), {
	ssr: false,
});

interface ChartCategoryPieProps {
	data: CategorySummary[];
	title?: string;
}

export default function ChartCategoryPie({
	data,
	title = "카테고리별 비율",
}: ChartCategoryPieProps) {
	const chartOption = useMemo(
		() => ({
			title: {
				text: title,
				left: "center",
				textStyle: { fontSize: 16, fontWeight: 600 },
			},
			tooltip: {
				trigger: "item",
				formatter: (params: {
					name: string;
					value: number;
					percent: number;
				}) => {
					return `${params.name}: ${formatKRW(params.value)} (${params.percent}%)`;
				},
			},
			legend: {
				orient: "horizontal" as const,
				bottom: 0,
			},
			series: [
				{
					type: "pie",
					radius: ["40%", "70%"],
					avoidLabelOverlap: false,
					itemStyle: {
						borderRadius: 8,
						borderColor: "#fff",
						borderWidth: 2,
					},
					label: { show: false },
					emphasis: {
						label: {
							show: true,
							fontSize: 14,
							fontWeight: "bold",
						},
					},
					labelLine: { show: false },
					data: data.map((item) => ({
						value: item.total,
						name: item.category.name,
						itemStyle: { color: item.category.color },
					})),
				},
			],
		}),
		[data, title],
	);

	return (
		<BaseCard padding="lg">
			{data.length > 0 ? (
				<ReactECharts
					option={chartOption}
					style={{ height: "320px" }}
					opts={{ renderer: "canvas" }}
				/>
			) : (
				<FeedbackEmpty
					title="데이터가 없습니다"
					description="저축을 추가하면 차트가 표시됩니다"
				/>
			)}
		</BaseCard>
	);
}
