<script setup lang="ts">
import type { NuxtError } from '#app'

interface Props {
  error: NuxtError
}

defineProps<Props>()

function handleError() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
    <div class="text-center">
      <div class="flex items-center justify-center w-16 h-16 mb-6 bg-red-100 rounded-full mx-auto">
        <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>

      <h1 class="text-4xl font-bold text-gray-900 mb-2">
        {{ error.statusCode }}
      </h1>

      <p class="text-lg text-gray-600 mb-8">
        {{ error.message || '페이지를 찾을 수 없습니다' }}
      </p>

      <button
        class="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        @click="handleError"
      >
        홈으로 돌아가기
      </button>
    </div>
  </div>
</template>
