<script setup lang="ts">
import type { PortfolioSummary } from "~/types";
import { formatKRW, formatCompact } from "~/utils/currency";

interface Props {
	summary: PortfolioSummary;
}

const props = defineProps<Props>();

// Find most underweight and overweight categories
const underweight = computed(() => {
	const sorted = [...props.summary.allocations].sort(
		(a, b) => a.difference - b.difference,
	);
	return sorted.filter((a) => a.difference < -1).slice(0, 3);
});

const overweight = computed(() => {
	const sorted = [...props.summary.allocations].sort(
		(a, b) => b.difference - a.difference,
	);
	return sorted.filter((a) => a.difference > 1).slice(0, 3);
});
</script>

<template>
  <BaseCard class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold text-gray-900">투자 현황</h2>
    </div>

    <!-- Total Investment -->
    <div class="text-center py-4 bg-gray-50 rounded-lg">
      <p class="text-sm text-gray-500 mb-1">총 투자금액</p>
      <p class="text-3xl font-bold text-gray-900">
        {{ formatKRW(summary.totalInvestment) }}
      </p>
    </div>

    <!-- Category Breakdown -->
    <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
      <div
        v-for="allocation in summary.allocations"
        :key="allocation.category.id"
        class="p-3 bg-gray-50 rounded-lg"
      >
        <div class="flex items-center gap-2 mb-1">
          <div
            class="w-2.5 h-2.5 rounded-full"
            :style="{ backgroundColor: allocation.category.color }"
          />
          <span class="text-sm text-gray-600 truncate">{{
            allocation.category.name
          }}</span>
        </div>
        <div class="font-semibold text-gray-900">
          {{ formatCompact(allocation.currentAmount) }}
        </div>
        <div class="text-xs text-gray-500">
          {{ allocation.currentPercent.toFixed(1) }}%
        </div>
      </div>
    </div>

    <!-- Rebalancing Suggestions -->
    <div v-if="underweight.length > 0 || overweight.length > 0" class="pt-4 border-t border-gray-200">
      <h3 class="text-sm font-medium text-gray-700 mb-3">리밸런싱 제안</h3>

      <div class="space-y-2">
        <div
          v-for="item in underweight"
          :key="item.category.id"
          class="flex items-center justify-between text-sm"
        >
          <div class="flex items-center gap-2">
            <div
              class="w-2 h-2 rounded-full"
              :style="{ backgroundColor: item.category.color }"
            />
            <span class="text-gray-600">{{ item.category.name }}</span>
          </div>
          <span class="text-red-600 font-medium"
            >{{ item.difference.toFixed(1) }}%p 부족</span
          >
        </div>

        <div
          v-for="item in overweight"
          :key="item.category.id"
          class="flex items-center justify-between text-sm"
        >
          <div class="flex items-center gap-2">
            <div
              class="w-2 h-2 rounded-full"
              :style="{ backgroundColor: item.category.color }"
            />
            <span class="text-gray-600">{{ item.category.name }}</span>
          </div>
          <span class="text-green-600 font-medium"
            >+{{ item.difference.toFixed(1) }}%p 초과</span
          >
        </div>
      </div>
    </div>
  </BaseCard>
</template>
