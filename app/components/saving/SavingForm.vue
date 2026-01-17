<script setup lang="ts">
import type { Category, SavingInput } from "~/types";
import { getToday } from "~/utils/date";

interface Props {
	categories: readonly Category[];
	initialData?: Partial<SavingInput & { category_id?: number }>;
	loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	loading: false,
});

const emit = defineEmits<{
	submit: [data: SavingInput];
	cancel: [];
}>();

const form = reactive({
	category_id: props.initialData?.category_id || null as number | null,
	amount: props.initialData?.amount || 0,
	transaction_date: props.initialData?.transaction_date || getToday(),
	description: props.initialData?.description || "",
});

const errors = reactive({
	category_id: "",
	amount: "",
});

function validate(): boolean {
	let isValid = true;
	errors.category_id = "";
	errors.amount = "";

	if (!form.category_id) {
		errors.category_id = "카테고리를 선택해주세요";
		isValid = false;
	}

	if (!form.amount || form.amount <= 0) {
		errors.amount = "금액을 입력해주세요";
		isValid = false;
	}

	return isValid;
}

function handleSubmit() {
	if (!validate()) return;

	emit("submit", {
		category_id: form.category_id!,
		amount: form.amount,
		transaction_date: form.transaction_date,
		description: form.description || undefined,
	});
}

function handleCancel() {
	emit("cancel");
}
</script>

<template>
  <form class="space-y-4" @submit.prevent="handleSubmit">
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        카테고리 <span class="text-red-500">*</span>
      </label>
      <BaseSelect v-model="form.category_id" required>
        <option value="" disabled>카테고리 선택</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.id">
          {{ cat.name }}
        </option>
      </BaseSelect>
      <p v-if="errors.category_id" class="text-sm text-red-600 mt-1">
        {{ errors.category_id }}
      </p>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        금액 (원) <span class="text-red-500">*</span>
      </label>
      <BaseInput
        v-model.number="form.amount"
        type="number"
        placeholder="0"
        required
      />
      <p v-if="errors.amount" class="text-sm text-red-600 mt-1">
        {{ errors.amount }}
      </p>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        날짜
      </label>
      <BaseInput v-model="form.transaction_date" type="date" />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">
        메모
      </label>
      <BaseInput
        v-model="form.description"
        type="text"
        placeholder="예: 1월 월급"
      />
    </div>

    <div class="flex gap-3 pt-4">
      <BaseButton
        type="button"
        variant="secondary"
        class="flex-1"
        @click="handleCancel"
      >
        취소
      </BaseButton>
      <BaseButton
        type="submit"
        variant="primary"
        class="flex-1"
        :loading="loading"
      >
        저장
      </BaseButton>
    </div>
  </form>
</template>
