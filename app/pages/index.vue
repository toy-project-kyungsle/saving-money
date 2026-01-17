<script setup lang="ts">
import type { Saving, SavingInput, Category, CategoryInput } from "~/types";

definePageMeta({
	middleware: "auth",
});

const {
	categories,
	loading: categoriesLoading,
	fetchCategories,
	initDefaultCategories,
	addCategory,
	updateCategory,
	deleteCategory,
} = useCategories();

const {
	savings,
	loading: savingsLoading,
	error,
	totalSummary,
	fetchSavings,
	addSaving,
	updateSaving,
	deleteSaving,
} = useSavings();

const { portfolioSummary, totalTargetPercent } = usePortfolio();

const { onAuthStateChange } = useAuth();

// Modal states
const showAddModal = ref(false);
const showEditModal = ref(false);
const showDeleteConfirm = ref(false);
const showCategoryModal = ref(false);
const selectedSaving = ref<Saving | null>(null);
const selectedCategory = ref<Category | null>(null);
const isSubmitting = ref(false);

// Fetch data on mount
onMounted(async () => {
	onAuthStateChange();
	await fetchCategories();
	// Initialize default categories if none exist
	if (categories.value.length === 0) {
		await initDefaultCategories();
	}
	await fetchSavings();
});

// Add saving
async function handleAddSaving(data: SavingInput) {
	isSubmitting.value = true;
	const result = await addSaving(data);
	isSubmitting.value = false;

	if (result.success) {
		showAddModal.value = false;
	}
}

// Edit saving
function openEditModal(saving: Saving) {
	selectedSaving.value = saving;
	showEditModal.value = true;
}

async function handleEditSaving(data: SavingInput) {
	if (!selectedSaving.value) return;

	isSubmitting.value = true;
	const result = await updateSaving(selectedSaving.value.id, data);
	isSubmitting.value = false;

	if (result.success) {
		showEditModal.value = false;
		selectedSaving.value = null;
	}
}

// Delete saving
function openDeleteConfirm(saving: Saving) {
	selectedSaving.value = saving;
	showDeleteConfirm.value = true;
}

async function handleDeleteSaving() {
	if (!selectedSaving.value) return;

	isSubmitting.value = true;
	const result = await deleteSaving(selectedSaving.value.id);
	isSubmitting.value = false;

	if (result.success) {
		showDeleteConfirm.value = false;
		selectedSaving.value = null;
	}
}

// Category management
function openCategoryModal(category?: Category) {
	selectedCategory.value = category || null;
	showCategoryModal.value = true;
}

async function handleSaveCategory(data: CategoryInput) {
	isSubmitting.value = true;

	if (selectedCategory.value) {
		await updateCategory(selectedCategory.value.id, data);
	} else {
		await addCategory(data);
	}

	isSubmitting.value = false;
	showCategoryModal.value = false;
	selectedCategory.value = null;
}

async function handleDeleteCategory(id: number) {
	isSubmitting.value = true;
	await deleteCategory(id);
	isSubmitting.value = false;
	showCategoryModal.value = false;
	selectedCategory.value = null;
}

const loading = computed(
	() => categoriesLoading.value || savingsLoading.value,
);

// 전체 카테고리 breakdown (파이 차트용)
const categoryBreakdown = computed(() =>
	totalSummary.value.byCategory.filter((c) => c.total > 0),
);
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-gray-900">저축현황</h1>
      <div class="flex gap-2">
        <BaseButton variant="secondary" @click="openCategoryModal()">
          카테고리 관리
        </BaseButton>
        <BaseButton @click="showAddModal = true"> + 새 저축 </BaseButton>
      </div>
    </div>

    <!-- Error state -->
    <FeedbackError
      v-if="error"
      :message="error.message"
      @retry="fetchSavings"
    />

    <!-- Loading state -->
    <div v-else-if="loading && savings.length === 0" class="py-12">
      <FeedbackLoading text="데이터를 불러오는 중..." />
    </div>

    <!-- Main content -->
    <template v-else>
      <!-- Summary cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SummaryTotal
          :total="totalSummary.total"
          :by-category="totalSummary.byCategory"
        />
        <ChartCategoryPie :data="categoryBreakdown" />
      </div>

      <!-- Portfolio Target Table -->
      <PortfolioTargetTable
        :allocations="portfolioSummary.allocations"
        :total-target-percent="totalTargetPercent"
        @edit-category="openCategoryModal"
      />

      <!-- Portfolio Summary Card (리밸런싱 제안) -->
      <PortfolioSummaryCard :summary="portfolioSummary" />

      <!-- Savings list -->
      <BaseCard>
        <h2 class="text-lg font-semibold text-gray-900 mb-4">전체 내역</h2>
        <SavingList
          :savings="savings"
          :categories="categories"
          :loading="loading"
          @edit="openEditModal"
          @delete="openDeleteConfirm"
        />
      </BaseCard>
    </template>

    <!-- Modals -->
    <SavingAddModal
      v-model="showAddModal"
      :categories="categories"
      :loading="isSubmitting"
      @submit="handleAddSaving"
    />

    <SavingEditModal
      v-model="showEditModal"
      :saving="selectedSaving"
      :categories="categories"
      :loading="isSubmitting"
      @submit="handleEditSaving"
    />

    <SavingDeleteConfirm
      v-model="showDeleteConfirm"
      :saving="selectedSaving"
      :loading="isSubmitting"
      @confirm="handleDeleteSaving"
    />

    <CategoryManagerModal
      v-model="showCategoryModal"
      :category="selectedCategory"
      :loading="isSubmitting"
      @save="handleSaveCategory"
      @delete="handleDeleteCategory"
    />
  </div>
</template>
