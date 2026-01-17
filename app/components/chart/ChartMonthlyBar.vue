<script setup lang="ts">
import type { Category, MonthlySummary } from "~/types";
import { formatCompact, formatKRW } from "~/utils/currency";
import { formatMonthKR } from "~/utils/date";

interface Props {
	data: MonthlySummary[];
	categories: Category[];
	title?: string;
}

const props = withDefaults(defineProps<Props>(), {
	title: "월별 저축 추이",
});

// Sort by month and take last 6 months
const sortedData = computed(() => {
	return [...props.data]
		.sort((a, b) => a.month.localeCompare(b.month))
		.slice(-6);
});

const chartOption = computed(() => ({
	title: {
		text: props.title,
		left: "center",
		textStyle: {
			fontSize: 16,
			fontWeight: 600,
		},
	},
	tooltip: {
		trigger: "axis",
		axisPointer: {
			type: "shadow",
		},
		formatter: (
			params: Array<{
				seriesName: string;
				value: number;
				marker: string;
				axisValue: string;
			}>,
		) => {
			const title = params[0]?.axisValue || "";
			let content = `<div class="font-medium">${title}</div>`;
			for (const param of params) {
				if (param.value > 0) {
					content += `<div>${param.marker} ${param.seriesName}: ${formatKRW(param.value)}</div>`;
				}
			}
			return content;
		},
	},
	legend: {
		bottom: 0,
	},
	grid: {
		left: "3%",
		right: "4%",
		bottom: "15%",
		top: "15%",
		containLabel: true,
	},
	xAxis: {
		type: "category",
		data: sortedData.value.map((d) => formatMonthKR(d.month)),
	},
	yAxis: {
		type: "value",
		axisLabel: {
			formatter: (value: number) => formatCompact(value),
		},
	},
	series: props.categories.map((category) => ({
		name: category.name,
		type: "bar",
		stack: "total",
		emphasis: {
			focus: "series",
		},
		itemStyle: {
			color: category.color,
		},
		data: sortedData.value.map((d) => d.byCategory.get(category.id) || 0),
	})),
}));
</script>

<template>
  <BaseCard padding="lg">
    <ClientOnly>
      <VChart
        v-if="data.length > 0"
        class="h-80"
        :option="chartOption"
        autoresize
      />
      <FeedbackEmpty
        v-else
        title="데이터가 없습니다"
        description="저축을 추가하면 차트가 표시됩니다"
      />
    </ClientOnly>
  </BaseCard>
</template>
