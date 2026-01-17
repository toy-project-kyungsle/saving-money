<script setup lang="ts">
import type { Saving } from "~/types";
import { formatKRW } from "~/utils/currency";
import { formatDateKR } from "~/utils/date";

interface Props {
	investment: Saving;
}

const props = defineProps<Props>();

const emit = defineEmits<{
	edit: [];
	delete: [];
}>();

const categoryName = computed(
	() => props.investment.category?.name || "Unknown",
);
const categoryColor = computed(
	() => props.investment.category?.color || "#6B7280",
);
</script>

<template>
  <div
    class="flex items-center justify-between py-3 hover:bg-gray-50 -mx-2 px-2 rounded-lg group"
  >
    <div class="flex items-center gap-3 min-w-0">
      <!-- Category color indicator -->
      <div
        class="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
        :style="{ backgroundColor: categoryColor + '20' }"
      >
        <div
          class="w-3 h-3 rounded-full"
          :style="{ backgroundColor: categoryColor }"
        />
      </div>

      <!-- Details -->
      <div class="min-w-0">
        <div class="flex items-center gap-2">
          <span class="font-medium text-gray-900">{{ categoryName }}</span>
          <span class="text-sm text-gray-500">{{
            formatDateKR(investment.transaction_date)
          }}</span>
        </div>
        <p v-if="investment.description" class="text-sm text-gray-500 truncate">
          {{ investment.description }}
        </p>
      </div>
    </div>

    <div class="flex items-center gap-3">
      <!-- Amount -->
      <span class="font-semibold text-gray-900 whitespace-nowrap">
        {{ formatKRW(investment.amount) }}
      </span>

      <!-- Actions -->
      <div
        class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <button
          type="button"
          class="p-1.5 text-gray-400 hover:text-gray-600 rounded"
          @click="emit('edit')"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
            />
          </svg>
        </button>
        <button
          type="button"
          class="p-1.5 text-gray-400 hover:text-red-600 rounded"
          @click="emit('delete')"
        >
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>
