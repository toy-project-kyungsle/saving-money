<script setup lang="ts">
import type { Saving } from "~/types";
import { formatKRW } from "~/utils/currency";

interface Props {
  modelValue: boolean
  saving: Saving | null
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: []
}>()

const isOpen = computed({
  get: () => props.modelValue,
  set: value => emit('update:modelValue', value),
})

function handleConfirm() {
  emit('confirm')
}

function handleCancel() {
  isOpen.value = false
}
</script>

<template>
  <BaseModal v-model="isOpen" title="삭제 확인" size="sm">
    <div class="text-center">
      <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
        <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>

      <p class="text-gray-600 mb-2">
        다음 저축 내역을 삭제하시겠습니까?
      </p>

      <div v-if="saving" class="bg-gray-50 rounded-lg p-3 mb-4">
        <p class="font-medium text-gray-900">
          {{ saving.category?.name || '알 수 없음' }}
        </p>
        <p class="text-lg font-bold text-gray-900">
          {{ formatKRW(saving.amount) }}
        </p>
      </div>

      <p class="text-sm text-gray-500">
        이 작업은 되돌릴 수 없습니다.
      </p>
    </div>

    <template #footer>
      <div class="flex gap-3">
        <BaseButton
          variant="secondary"
          class="flex-1"
          @click="handleCancel"
        >
          취소
        </BaseButton>
        <BaseButton
          variant="danger"
          class="flex-1"
          :loading="loading"
          @click="handleConfirm"
        >
          삭제
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>
