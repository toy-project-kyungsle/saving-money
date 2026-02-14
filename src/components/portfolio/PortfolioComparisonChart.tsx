"use client";

import { useMemo } from "react";
import type { PortfolioAllocation } from "@/types";
import BaseCard from "@/components/base/BaseCard";
import dynamic from "next/dynamic";

const ReactECharts = dynamic(() => import("echarts-for-react"), {
	ssr: false,
});

interface PortfolioComparisonChartProps {
	allocations: PortfolioAllocation[];
}

export default function PortfolioComparisonChart({
	allocations,
}: PortfolioComparisonChartProps) {
	const hasData = allocations.some((a) => a.currentAmount > 0);

	const chartOption = useMemo(
		() => ({
			tooltip: {
				trigger: "item",
				formatter: (params: {
					name: string;
					value: number;
					percent: number;
				}) => {
					return `${params.name}: ${params.value.toFixed(1)}% (목표 대비)`;
				},
			},
			legend: {
				orient: "vertical" as const,
				right: "5%",
				top: "center",
				textStyle: { fontSize: 12 },
			},
			series: [
				{
					name: "현재 비중",
					type: "pie",
					radius: ["40%", "70%"],
					center: ["35%", "50%"],
					avoidLabelOverlap: false,
					itemStyle: {
						borderRadius: 4,
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
					data: allocations.map((a) => ({
						value: a.currentPercent,
						name: a.category.name,
						itemStyle: { color: a.category.color },
					})),
				},
			],
		}),
		[allocations],
	);

	return (
		<BaseCard className="space-y-4">
			<h2 className="text-lg font-semibold text-gray-900">현재 비중</h2>

			{hasData ? (
				<ReactECharts
					option={chartOption}
					style={{ height: "256px" }}
					opts={{ renderer: "canvas" }}
				/>
			) : (
				<div className="h-64 flex items-center justify-center">
					<p className="text-gray-400 text-sm">
						투자 데이터가 없습니다
					</p>
				</div>
			)}
		</BaseCard>
	);
}
