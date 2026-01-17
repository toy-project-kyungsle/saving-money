<script setup lang="ts">
import type { Category, SavingInput } from "~/types";

interface Props {
	modelValue: boolean;
	categories: readonly Category[];
	loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	loading: false,
});

const emit = defineEmits<{
	"update:modelValue": [value: boolean];
	submit: [data: SavingInput];
}>();

const isOpen = computed({
	get: () => props.modelValue,
	set: (value) => emit("update:modelValue", value),
});

function handleSubmit(data: SavingInput) {
	emit("submit", data);
}

function handleCancel() {
	isOpen.value = false;
}
</script>

<template>
  <BaseModal v-model="isOpen" title="새 저축 추가">
    <SavingForm
      :categories="categories"
      :loading="loading"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
  </BaseModal>
</template>
