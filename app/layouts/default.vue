<script setup lang="ts">
const { user, signOut, isAuthenticated } = useAuth();

async function handleSignOut() {
  await signOut();
  navigateTo("/login");
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <NuxtLink to="/" class="flex items-center gap-2">
            <div
              class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center"
            >
              <svg
                class="w-5 h-5 text-white"
                width="20"
                height="20"
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
            <span class="text-lg font-bold text-gray-900 hidden sm:block"
              >저축 관리</span
            >
          </NuxtLink>

          <!-- 단일 페이지 구조 - 네비게이션 불필요 -->

          <!-- User menu -->
          <div v-if="isAuthenticated" class="flex items-center gap-4">
            <span class="text-sm text-gray-600 hidden sm:block">{{
              user?.email
            }}</span>
            <button
              type="button"
              class="text-sm text-gray-500 hover:text-gray-700"
              @click="handleSignOut"
            >
              로그아웃
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main content -->
    <main class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <slot />
    </main>
  </div>
</template>
