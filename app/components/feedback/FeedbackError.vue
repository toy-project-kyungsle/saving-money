<script setup lang="ts">
interface Props {
  title?: string
  message?: string
  retryable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '오류가 발생했습니다',
  retryable: true,
})

const emit = defineEmits<{
  retry: []
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center py-8 text-center">
    <div class="flex items-center justify-center w-12 h-12 mb-4 bg-red-100 rounded-full">
      <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    </div>

    <h3 class="text-lg font-medium text-gray-900 mb-1">
      {{ title }}
    </h3>

    <p v-if="message" class="text-sm text-gray-500 mb-4">
      {{ message }}
    </p>

    <BaseButton
      v-if="retryable"
      variant="secondary"
      size="sm"
      @click="emit('retry')"
    >
      다시 시도
    </BaseButton>
  </div>
</template>
