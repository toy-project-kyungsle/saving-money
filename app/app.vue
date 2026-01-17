<script setup lang="ts">
const { initAuth } = useAuth();
const authReady = ref(false);

// 클라이언트에서만 auth 초기화
onMounted(async () => {
  await initAuth();
  authReady.value = true;
});

// SSR에서는 바로 ready
if (import.meta.server) {
  authReady.value = true;
}
</script>

<template>
  <!-- Auth 초기화 전 로딩 화면 -->
  <div v-if="!authReady" class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="text-center">
      <div class="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
      <p class="mt-2 text-gray-600">로딩 중...</p>
    </div>
  </div>
  <NuxtLayout v-else>
    <NuxtPage />
  </NuxtLayout>
</template>
