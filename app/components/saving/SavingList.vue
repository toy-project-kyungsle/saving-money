<script setup lang="ts">
import type { Category, Saving } from "~/types";

interface Props {
	savings: readonly Saving[];
	categories?: readonly Category[];
	loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	loading: false,
	categories: () => [],
});

const emit = defineEmits<{
	edit: [saving: Saving];
	delete: [saving: Saving];
}>();

const selectedCategoryId = ref<number | "all">("all");

const categoryFilterOptions = computed(() => [
	{ value: "all" as const, label: "전체" },
	...props.categories.map((cat) => ({
		value: cat.id,
		label: cat.name,
	})),
]);

const filteredSavings = computed(() => {
	if (selectedCategoryId.value === "all") {
		return props.savings;
	}
	return props.savings.filter((s) => s.category_id === selectedCategoryId.value);
});
</script>

<template>
  <div class="space-y-4">
    <!-- Filter -->
    <div v-if="categories.length > 0" class="flex gap-2 overflow-x-auto pb-2">
      <button
        v-for="option in categoryFilterOptions"
        :key="option.value"
        type="button"
        class="px-4 py-1.5 text-sm font-medium rounded-full whitespace-nowrap transition-colors"
        :class="[
          selectedCategoryId === option.value
            ? 'bg-blue-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200',
        ]"
        @click="selectedCategoryId = option.value"
      >
        {{ option.label }}
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="py-8 text-center text-gray-500">
      <FeedbackLoading />
    </div>

    <!-- Empty state -->
    <FeedbackEmpty
      v-else-if="filteredSavings.length === 0"
      title="저축 내역이 없습니다"
      description="새로운 저축을 추가해보세요"
    />

    <!-- List -->
    <div v-else class="space-y-2">
      <SavingListItem
        v-for="saving in filteredSavings"
        :key="saving.id"
        :saving="saving"
        @edit="emit('edit', $event)"
        @delete="emit('delete', $event)"
      />
    </div>
  </div>
</template>
