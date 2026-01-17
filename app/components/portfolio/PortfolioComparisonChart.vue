<script setup lang="ts">
import type { PortfolioAllocation } from "~/types";

interface Props {
	allocations: PortfolioAllocation[];
}

const props = defineProps<Props>();

const chartOption = computed(() => ({
	tooltip: {
		trigger: "item",
		formatter: (params: { name: string; value: number; percent: number }) => {
			return `${params.name}: ${params.value.toFixed(1)}% (목표 대비)`;
		},
	},
	legend: {
		orient: "vertical",
		right: "5%",
		top: "center",
		textStyle: {
			fontSize: 12,
		},
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
			data: props.allocations.map((a) => ({
				value: a.currentPercent,
				name: a.category.name,
				itemStyle: {
					color: a.category.color,
				},
			})),
		},
	],
}));

const hasData = computed(() =>
	props.allocations.some((a) => a.currentAmount > 0),
);
</script>

<template>
  <BaseCard class="space-y-4">
    <h2 class="text-lg font-semibold text-gray-900">현재 비중</h2>

    <template v-if="hasData">
      <VChart class="h-64" :option="chartOption" autoresize />
    </template>

    <template v-else>
      <div class="h-64 flex items-center justify-center">
        <p class="text-gray-400 text-sm">투자 데이터가 없습니다</p>
      </div>
    </template>
  </BaseCard>
</template>
