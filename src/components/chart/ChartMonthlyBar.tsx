"use client";

import { useMemo } from "react";
import type { Category, MonthlySummary } from "@/types";
import { formatCompact, formatKRW } from "@/lib/currency";
import { formatMonthKR } from "@/lib/date";
import BaseCard from "@/components/base/BaseCard";
import FeedbackEmpty from "@/components/feedback/FeedbackEmpty";
import dynamic from "next/dynamic";

const ReactECharts = dynamic(() => import("echarts-for-react"), {
	ssr: false,
});

interface ChartMonthlyBarProps {
	data: MonthlySummary[];
	categories: Category[];
	title?: string;
}

export default function ChartMonthlyBar({
	data,
	categories,
	title = "월별 저축 추이",
}: ChartMonthlyBarProps) {
	const sortedData = useMemo(() => {
		return [...data]
			.sort((a, b) => a.month.localeCompare(b.month))
			.slice(-6);
	}, [data]);

	const chartOption = useMemo(
		() => ({
			title: {
				text: title,
				left: "center",
				textStyle: { fontSize: 16, fontWeight: 600 },
			},
			tooltip: {
				trigger: "axis",
				axisPointer: { type: "shadow" },
				formatter: (
					params: Array<{
						seriesName: string;
						value: number;
						marker: string;
						axisValue: string;
					}>,
				) => {
					const titleText = params[0]?.axisValue || "";
					let content = `<div class="font-medium">${titleText}</div>`;
					for (const param of params) {
						if (param.value > 0) {
							content += `<div>${param.marker} ${param.seriesName}: ${formatKRW(param.value)}</div>`;
						}
					}
					return content;
				},
			},
			legend: { bottom: 0 },
			grid: {
				left: "3%",
				right: "4%",
				bottom: "15%",
				top: "15%",
				containLabel: true,
			},
			xAxis: {
				type: "category",
				data: sortedData.map((d) => formatMonthKR(d.month)),
			},
			yAxis: {
				type: "value",
				axisLabel: {
					formatter: (value: number) => formatCompact(value),
				},
			},
			series: categories.map((category) => ({
				name: category.name,
				type: "bar",
				stack: "total",
				emphasis: { focus: "series" },
				itemStyle: { color: category.color },
				data: sortedData.map(
					(d) => d.byCategory.get(category.id) || 0,
				),
			})),
		}),
		[sortedData, categories, title],
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
					title="아직 데이터가 없어요"
					description="저축을 추가하면 차트가 표시돼요"
				/>
			)}
		</BaseCard>
	);
}
