<script setup lang="ts">
import type { Saving } from "~/types";

interface Props {
	investments: Saving[];
	loading?: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
	edit: [saving: Saving];
	delete: [saving: Saving];
}>();
</script>

<template>
  <div>
    <!-- Loading state -->
    <div v-if="loading" class="py-8 text-center">
      <FeedbackLoading text="불러오는 중..." />
    </div>

    <!-- Empty state -->
    <FeedbackEmpty
      v-else-if="investments.length === 0"
      title="투자 내역이 없습니다"
      description="새로운 투자를 추가해보세요"
    />

    <!-- List -->
    <div v-else class="divide-y divide-gray-100">
      <InvestmentListItem
        v-for="investment in investments"
        :key="investment.id"
        :investment="investment"
        @edit="emit('edit', investment)"
        @delete="emit('delete', investment)"
      />
    </div>
  </div>
</template>
