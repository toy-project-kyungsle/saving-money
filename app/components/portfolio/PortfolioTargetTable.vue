<script setup lang="ts">
import type { PortfolioAllocation } from "~/types";

interface Props {
	allocations: PortfolioAllocation[];
	totalTargetPercent: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
	editCategory: [category: PortfolioAllocation["category"]];
}>();
</script>

<template>
  <BaseCard class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-lg font-semibold text-gray-900">이상적 포트폴리오</h2>
      <span class="text-sm text-gray-500"
        >목표 비중 합계: {{ totalTargetPercent }}%</span
      >
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-gray-200">
            <th class="text-left py-2 px-1 font-medium text-gray-600">
              카테고리
            </th>
            <th class="text-right py-2 px-1 font-medium text-gray-600">
              목표 비중
            </th>
            <th class="text-right py-2 px-1 font-medium text-gray-600">
              현재 비중
            </th>
            <th class="text-right py-2 px-1 font-medium text-gray-600">차이</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="allocation in allocations"
            :key="allocation.category.id"
            class="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
            @click="emit('editCategory', allocation.category)"
          >
            <td class="py-3 px-1">
              <div class="flex items-center gap-2">
                <div
                  class="w-3 h-3 rounded-full"
                  :style="{ backgroundColor: allocation.category.color }"
                />
                <span class="font-medium text-gray-900">{{
                  allocation.category.name
                }}</span>
              </div>
            </td>
            <td class="py-3 px-1 text-right text-gray-600">
              {{ allocation.targetPercent }}%
            </td>
            <td class="py-3 px-1 text-right text-gray-900 font-medium">
              {{ allocation.currentPercent.toFixed(1) }}%
            </td>
            <td class="py-3 px-1 text-right">
              <span
                :class="[
                  'font-medium',
                  allocation.difference > 0
                    ? 'text-green-600'
                    : allocation.difference < 0
                      ? 'text-red-600'
                      : 'text-gray-500',
                ]"
              >
                {{ allocation.difference > 0 ? "+" : ""
                }}{{ allocation.difference.toFixed(1) }}%p
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <p class="text-xs text-gray-400">카테고리를 클릭하여 수정할 수 있습니다</p>
  </BaseCard>
</template>
