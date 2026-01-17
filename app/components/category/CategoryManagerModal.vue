<script setup lang="ts">
import type { Category, CategoryInput } from "~/types";

interface Props {
	category?: Category | null;
	loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	category: null,
	loading: false,
});

const modelValue = defineModel<boolean>({ default: false });

const emit = defineEmits<{
	save: [data: CategoryInput];
	delete: [id: number];
}>();

const isEditing = computed(() => !!props.category);
const title = computed(() =>
	isEditing.value ? "카테고리 수정" : "새 카테고리",
);

// Form state
const name = ref("");
const targetPercent = ref(0);
const color = ref("#6B7280");

// Preset colors
const presetColors = [
	"#3B82F6", // blue
	"#10B981", // green
	"#8B5CF6", // purple
	"#F59E0B", // amber
	"#EF4444", // red
	"#6B7280", // gray
	"#EC4899", // pink
	"#14B8A6", // teal
];

// Reset form when modal opens or category changes
watch(
	[modelValue, () => props.category],
	([isOpen, cat]) => {
		if (isOpen) {
			if (cat) {
				name.value = cat.name;
				targetPercent.value = cat.target_percent;
				color.value = cat.color;
			} else {
				name.value = "";
				targetPercent.value = 0;
				color.value = "#6B7280";
			}
		}
	},
	{ immediate: true },
);

function handleSubmit() {
	if (!name.value.trim()) return;

	emit("save", {
		name: name.value.trim(),
		type: "investment",
		target_percent: targetPercent.value,
		color: color.value,
	});
}

function handleDelete() {
	if (props.category) {
		emit("delete", props.category.id);
	}
}
</script>

<template>
  <BaseModal v-model="modelValue" :title="title">
    <form class="space-y-4" @submit.prevent="handleSubmit">
      <!-- Name -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          카테고리 이름
        </label>
        <BaseInput
          v-model="name"
          placeholder="예: Core, AI 전력 인프라"
          required
        />
      </div>

      <!-- Target Percent -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          목표 비중 (%)
        </label>
        <BaseInput
          v-model.number="targetPercent"
          type="number"
          min="0"
          max="100"
          step="0.1"
          placeholder="0"
        />
        <p class="text-xs text-gray-500 mt-1">
          포트폴리오에서 이 카테고리가 차지해야 할 비중
        </p>
      </div>

      <!-- Color -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          색상
        </label>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="presetColor in presetColors"
            :key="presetColor"
            type="button"
            class="w-8 h-8 rounded-full border-2 transition-transform hover:scale-110"
            :class="
              color === presetColor ? 'border-gray-900' : 'border-transparent'
            "
            :style="{ backgroundColor: presetColor }"
            @click="color = presetColor"
          />
          <input
            type="color"
            v-model="color"
            class="w-8 h-8 rounded-full cursor-pointer border-0"
          />
        </div>
      </div>

      <!-- Actions -->
      <div class="flex gap-2 pt-4">
        <BaseButton
          v-if="isEditing"
          type="button"
          variant="danger"
          :disabled="loading"
          @click="handleDelete"
        >
          삭제
        </BaseButton>
        <div class="flex-1" />
        <BaseButton
          type="button"
          variant="secondary"
          :disabled="loading"
          @click="modelValue = false"
        >
          취소
        </BaseButton>
        <BaseButton type="submit" :loading="loading" :disabled="!name.trim()">
          {{ isEditing ? "수정" : "추가" }}
        </BaseButton>
      </div>
    </form>
  </BaseModal>
</template>
