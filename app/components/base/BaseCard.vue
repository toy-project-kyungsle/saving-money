<script setup lang="ts">
interface Props {
  padding?: 'none' | 'sm' | 'md' | 'lg'
  shadow?: boolean
  hover?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  padding: 'md',
  shadow: true,
  hover: false,
})

const paddingClasses = {
  none: '',
  sm: 'p-3',
  md: 'p-4 sm:p-6',
  lg: 'p-6 sm:p-8',
}
</script>

<template>
  <div
    class="bg-white rounded-xl border border-gray-200"
    :class="[
      paddingClasses[padding],
      shadow ? 'shadow-sm' : '',
      hover ? 'transition-shadow hover:shadow-md cursor-pointer' : '',
    ]"
  >
    <slot />
  </div>
</template>
