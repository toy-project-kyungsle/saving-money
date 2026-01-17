<script setup lang="ts">
interface Props {
  title?: string
  description?: string
  icon?: 'inbox' | 'search' | 'document'
}

const props = withDefaults(defineProps<Props>(), {
  title: '데이터가 없습니다',
  icon: 'inbox',
})

const icons = {
  inbox: 'M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4',
  search: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
  document: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
}
</script>

<template>
  <div class="flex flex-col items-center justify-center py-8 text-center">
    <div class="flex items-center justify-center w-12 h-12 mb-4 bg-gray-100 rounded-full">
      <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="icons[icon]" />
      </svg>
    </div>

    <h3 class="text-lg font-medium text-gray-900 mb-1">
      {{ title }}
    </h3>

    <p v-if="description" class="text-sm text-gray-500">
      {{ description }}
    </p>

    <div v-if="$slots.action" class="mt-4">
      <slot name="action" />
    </div>
  </div>
</template>
