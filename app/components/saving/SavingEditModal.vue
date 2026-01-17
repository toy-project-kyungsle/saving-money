<script setup lang="ts">
import type { Category, Saving, SavingInput } from "~/types";

interface Props {
	modelValue: boolean;
	saving: Saving | null;
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

const initialData = computed(() => {
	if (!props.saving) return undefined;
	return {
		category_id: props.saving.category_id,
		amount: props.saving.amount,
		transaction_date: props.saving.transaction_date,
		description: props.saving.description,
	};
});

function handleSubmit(data: SavingInput) {
	emit("submit", data);
}

function handleCancel() {
	isOpen.value = false;
}
</script>

<template>
  <BaseModal v-model="isOpen" title="저축 수정">
    <SavingForm
      :categories="categories"
      :initial-data="initialData"
      :loading="loading"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
  </BaseModal>
</template>
