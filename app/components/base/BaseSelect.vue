<script setup lang="ts">
interface Props {
  label?: string
  placeholder?: string
  error?: string
  disabled?: boolean
  required?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  required: false,
})

const model = defineModel<string | number | null>()

const selectId = `select-${Math.random().toString(36).substring(2, 9)}`

function handleChange(event: Event) {
  const target = event.target as HTMLSelectElement
  const value = target.value
  // Try to convert to number if it looks like a number
  const numValue = Number(value)
  if (value !== '' && !Number.isNaN(numValue)) {
    model.value = numValue
  } else {
    model.value = value === '' ? null : value
  }
}
</script>

<template>
  <div class="w-full">
    <label
      v-if="label"
      :for="selectId"
      class="block text-sm font-medium text-gray-700 mb-1"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <select
      :id="selectId"
      :value="model"
      :disabled="disabled"
      :required="required"
      class="w-full px-4 py-2 border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none bg-white"
      :class="[
        error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300',
      ]"
      @change="handleChange"
    >
      <slot />
    </select>
    <p v-if="error" class="mt-1 text-sm text-red-500">
      {{ error }}
    </p>
  </div>
</template>

<style scoped>
select {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}
</style>
