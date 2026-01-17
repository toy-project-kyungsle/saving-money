<script setup lang="ts">
import type { CategorySummary } from "~/types";
import { formatKRW } from "~/utils/currency";

interface Props {
	data: CategorySummary[];
	title?: string;
}

const props = withDefaults(defineProps<Props>(), {
	title: "카테고리별 비율",
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
		trigger: "item",
		formatter: (params: { name: string; value: number; percent: number }) => {
			return `${params.name}: ${formatKRW(params.value)} (${params.percent}%)`;
		},
	},
	legend: {
		orient: "horizontal",
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
			label: {
				show: false,
			},
			emphasis: {
				label: {
					show: true,
					fontSize: 14,
					fontWeight: "bold",
				},
			},
			labelLine: {
				show: false,
			},
			data: props.data.map((item) => ({
				value: item.total,
				name: item.category.name,
				itemStyle: {
					color: item.category.color,
				},
			})),
		},
	],
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
