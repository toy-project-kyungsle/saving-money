<script setup lang="ts">
import type { CategorySummary } from "~/types";
import { formatCompact, formatKRW } from "~/utils/currency";

interface Props {
	total: number;
	byCategory: CategorySummary[];
}

defineProps<Props>();
</script>

<template>
  <BaseCard class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold text-gray-900">총 저축액</h2>
      <span class="text-sm text-gray-500">전체 기간</span>
    </div>

    <div class="text-3xl font-bold text-gray-900">
      {{ formatKRW(total) }}
    </div>

    <div class="grid grid-cols-2 gap-3">
      <div
        v-for="catSummary in byCategory"
        :key="catSummary.category.id"
        class="p-3 bg-gray-50 rounded-lg"
      >
        <div class="flex items-center gap-2 mb-1">
          <div
            class="w-2.5 h-2.5 rounded-full"
            :style="{ backgroundColor: catSummary.category.color }"
          />
          <span class="text-sm text-gray-600">{{
            catSummary.category.name
          }}</span>
        </div>
        <div class="font-semibold text-gray-900">
          {{ formatCompact(catSummary.total) }}
        </div>
        <div class="text-xs text-gray-500">{{ catSummary.count }}건</div>
      </div>
    </div>
  </BaseCard>
</template>
