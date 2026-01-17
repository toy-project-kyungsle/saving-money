<script setup lang="ts">
interface Props {
  modelValue: string | number
  type?: 'text' | 'number' | 'email' | 'password' | 'date'
  label?: string
  placeholder?: string
  error?: string
  disabled?: boolean
  required?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  required: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

const inputId = `input-${Math.random().toString(36).substring(2, 9)}`

function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  const value = props.type === 'number' ? Number(target.value) : target.value
  emit('update:modelValue', value)
}
</script>

<template>
  <div class="w-full">
    <label
      v-if="label"
      :for="inputId"
      class="block text-sm font-medium text-gray-700 mb-1"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>
    <input
      :id="inputId"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      class="w-full px-4 py-2 border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
      :class="[
        error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300',
      ]"
      @input="handleInput"
    >
    <p v-if="error" class="mt-1 text-sm text-red-500">
      {{ error }}
    </p>
  </div>
</template>
