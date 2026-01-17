<script setup lang="ts">
import type { Category, SavingInput } from "~/types";
import { getToday } from "~/utils/date";

interface Props {
	categories: Category[];
	loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	loading: false,
});

const modelValue = defineModel<boolean>({ default: false });

const emit = defineEmits<{
	submit: [data: SavingInput];
}>();

// Form state
const categoryId = ref<number | null>(null);
const amount = ref<number>(0);
const transactionDate = ref(getToday());
const description = ref("");

// Reset form when modal opens
watch(modelValue, (isOpen) => {
	if (isOpen) {
		categoryId.value = props.categories[0]?.id || null;
		amount.value = 0;
		transactionDate.value = getToday();
		description.value = "";
	}
});

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
  <BaseModal v-model="modelValue" title="새 투자 추가">
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
          추가
        </BaseButton>
      </div>
    </form>
  </BaseModal>
</template>
