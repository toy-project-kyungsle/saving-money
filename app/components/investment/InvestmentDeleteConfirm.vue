<script setup lang="ts">
import type { Saving } from "~/types";
import { formatKRW } from "~/utils/currency";

interface Props {
	saving: Saving | null;
	loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	saving: null,
	loading: false,
});

const modelValue = defineModel<boolean>({ default: false });

const emit = defineEmits<{
	confirm: [];
}>();

const categoryName = computed(
	() => props.saving?.category?.name || "Unknown",
);
</script>

<template>
  <BaseModal v-model="modelValue" title="투자 삭제">
    <div class="space-y-4">
      <p class="text-gray-600">정말로 이 투자 내역을 삭제하시겠습니까?</p>

      <div v-if="saving" class="p-4 bg-gray-50 rounded-lg">
        <div class="flex items-center justify-between">
          <span class="font-medium text-gray-900">{{ categoryName }}</span>
          <span class="font-semibold text-gray-900">{{
            formatKRW(saving.amount)
          }}</span>
        </div>
        <p v-if="saving.description" class="text-sm text-gray-500 mt-1">
          {{ saving.description }}
        </p>
      </div>

      <p class="text-sm text-red-600">이 작업은 되돌릴 수 없습니다.</p>

      <div class="flex justify-end gap-2 pt-4">
        <BaseButton
          type="button"
          variant="secondary"
          :disabled="loading"
          @click="modelValue = false"
        >
          취소
        </BaseButton>
        <BaseButton variant="danger" :loading="loading" @click="emit('confirm')">
          삭제
        </BaseButton>
      </div>
    </div>
  </BaseModal>
</template>
