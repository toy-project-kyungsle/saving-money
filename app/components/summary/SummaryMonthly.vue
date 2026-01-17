<script setup lang="ts">
import type { Category, MonthlySummary } from "~/types";
import { formatCompact, formatKRW } from "~/utils/currency";
import { formatMonthKR, getCurrentMonth } from "~/utils/date";

interface Props {
	summary: MonthlySummary;
	categories: Category[];
}

const props = defineProps<Props>();

const currentMonth = getCurrentMonth();

// Get category by id
function getCategory(id: number): Category | undefined {
	return props.categories.find((c) => c.id === id);
}

// Convert Map to array for iteration
const categoryAmounts = computed(() => {
	const result: { category: Category; amount: number }[] = [];
	props.summary.byCategory.forEach((amount, categoryId) => {
		const category = getCategory(categoryId);
		if (category && amount > 0) {
			result.push({ category, amount });
		}
	});
	return result;
});
</script>

<template>
  <BaseCard class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold text-gray-900">이번 달 저축</h2>
      <span class="text-sm text-gray-500">{{ formatMonthKR(currentMonth) }}</span>
    </div>

    <div class="text-3xl font-bold text-blue-600">
      {{ formatKRW(summary.total) }}
    </div>

    <div class="space-y-2">
      <div
        v-for="item in categoryAmounts"
        :key="item.category.id"
        class="flex items-center justify-between"
      >
        <div class="flex items-center gap-2">
          <div
            class="w-2 h-2 rounded-full"
            :style="{ backgroundColor: item.category.color }"
          />
          <span class="text-sm text-gray-600">{{ item.category.name }}</span>
        </div>
        <span class="text-sm font-medium text-gray-900">
          {{ formatCompact(item.amount) }}
        </span>
      </div>
    </div>
  </BaseCard>
</template>
