<script setup lang="ts"></script>

<template>
  <div
    class="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4"
  >
    <!-- Logo -->
    <div class="mb-8 text-center">
      <div
        class="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4"
      >
        <svg
          class="w-10 h-10 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h1 class="text-2xl font-bold text-gray-900">저축 관리</h1>
      <p class="text-gray-500 mt-1">나의 자산을 한눈에</p>
    </div>

    <!-- Content -->
    <div class="w-full max-w-md">
      <slot />
    </div>
  </div>
</template>
