<script setup lang="ts">
import type { Category, Saving, SavingInput } from "~/types";

interface Props {
	saving: Saving | null;
	categories: Category[];
	loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	saving: null,
	loading: false,
});

const modelValue = defineModel<boolean>({ default: false });

const emit = defineEmits<{
	submit: [data: SavingInput];
}>();

// Form state
const categoryId = ref<number | null>(null);
const amount = ref<number>(0);
const transactionDate = ref("");
const description = ref("");

// Reset form when modal opens or saving changes
watch(
	[modelValue, () => props.saving],
	([isOpen, saving]) => {
		if (isOpen && saving) {
			categoryId.value = saving.category_id;
			amount.value = saving.amount;
			transactionDate.value = saving.transaction_date;
			description.value = saving.description || "";
		}
	},
	{ immediate: true },
);

function handleSubmit() {
	if (!categoryId.value || amount.value <= 0) return;

	emit("submit", {
		category_id: categoryId.value,
		amount: amount.value,
		transaction_date: transactionDate.value,
		description: description.value || undefined,
	});
}
</script>

<template>
  <BaseModal v-model="modelValue" title="투자 수정">
    <form class="space-y-4" @submit.prevent="handleSubmit">
      <!-- Category -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          카테고리
        </label>
        <BaseSelect v-model="categoryId" required>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </BaseSelect>
      </div>

      <!-- Amount -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          금액 (원)
        </label>
        <BaseInput
          v-model.number="amount"
          type="number"
          min="0"
          step="1000"
          placeholder="0"
          required
        />
      </div>

      <!-- Date -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          거래일
        </label>
        <BaseInput v-model="transactionDate" type="date" required />
      </div>

      <!-- Description -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          메모 (선택)
        </label>
        <BaseInput v-model="description" placeholder="예: KODEX S&P500 매수" />
      </div>

      <!-- Actions -->
      <div class="flex justify-end gap-2 pt-4">
        <BaseButton
          type="button"
          variant="secondary"
          :disabled="loading"
          @click="modelValue = false"
        >
          취소
        </BaseButton>
        <BaseButton
          type="submit"
          :loading="loading"
          :disabled="!categoryId || amount <= 0"
        >
          수정
        </BaseButton>
      </div>
    </form>
  </BaseModal>
</template>
