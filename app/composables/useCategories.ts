import type { Category, CategoryInput, CategoryType } from "~/types";
import { validateCategoryInput } from "~/utils/validation";

// 기본 카테고리 시드 데이터
const DEFAULT_CATEGORIES: Omit<CategoryInput, "sort_order">[] = [
	// 저축용
	{ name: "월급", type: "savings", color: "#4CAF50", target_percent: 0 },
	{ name: "적금", type: "savings", color: "#2196F3", target_percent: 0 },
	// 투자용
	{ name: "Core", type: "investment", color: "#3B82F6", target_percent: 30 },
	{
		name: "AI 전력 인프라",
		type: "investment",
		color: "#10B981",
		target_percent: 6,
	},
	{
		name: "AI 소프트웨어",
		type: "investment",
		color: "#8B5CF6",
		target_percent: 6,
	},
	{
		name: "구조적 분산",
		type: "investment",
		color: "#F59E0B",
		target_percent: 6,
	},
	{ name: "안전자산", type: "investment", color: "#6B7280", target_percent: 6 },
	{ name: "도전", type: "investment", color: "#EF4444", target_percent: 6 },
];

export function useCategories() {
	const { supabase } = useSupabase();
	const { user } = useAuth();

	const categories = useState<Category[]>("categories-data", () => []);
	const loading = useState<boolean>("categories-loading", () => false);
	const error = useState<Error | null>("categories-error", () => null);

	// Fetch all categories for current user
	async function fetchCategories() {
		if (!user.value) return;

		try {
			loading.value = true;
			error.value = null;

			const { data, error: fetchError } = await supabase
				.from("categories")
				.select("*")
				.eq("user_id", user.value.id)
				.eq("is_active", true)
				.order("sort_order", { ascending: true });

			if (fetchError) throw fetchError;

			categories.value = data as Category[];
		} catch (err) {
			error.value = err as Error;
		} finally {
			loading.value = false;
		}
	}

	// Add new category
	async function addCategory(input: CategoryInput) {
		if (!user.value)
			return { success: false, error: new Error("Not authenticated") };

		// 입력 검증
		const validation = validateCategoryInput(input);
		if (!validation.valid) {
			const errorMessages = Object.values(validation.errors).join(", ");
			return { success: false, error: new Error(errorMessages), validationErrors: validation.errors };
		}

		try {
			loading.value = true;
			error.value = null;

			const maxSortOrder = Math.max(
				0,
				...categories.value.map((c) => c.sort_order),
			);

			const newCategory = {
				user_id: user.value.id,
				name: input.name,
				type: input.type,
				target_percent: input.target_percent || 0,
				color: input.color || "#6B7280",
				sort_order: input.sort_order ?? maxSortOrder + 1,
			};

			const { data, error: insertError } = await supabase
				.from("categories")
				.insert(newCategory)
				.select()
				.single();

			if (insertError) throw insertError;

			categories.value = [...categories.value, data as Category];
			return { success: true, data };
		} catch (err) {
			error.value = err as Error;
			return { success: false, error: err as Error };
		} finally {
			loading.value = false;
		}
	}

	// Update existing category
	async function updateCategory(id: number, input: Partial<CategoryInput>) {
		if (!user.value)
			return { success: false, error: new Error("Not authenticated") };

		try {
			loading.value = true;
			error.value = null;

			const { data, error: updateError } = await supabase
				.from("categories")
				.update(input)
				.eq("id", id)
				.eq("user_id", user.value.id)
				.select()
				.single();

			if (updateError) throw updateError;

			const index = categories.value.findIndex((c) => c.id === id);
			if (index !== -1) {
				categories.value[index] = data as Category;
			}

			return { success: true, data };
		} catch (err) {
			error.value = err as Error;
			return { success: false, error: err as Error };
		} finally {
			loading.value = false;
		}
	}

	// Soft delete category
	async function deleteCategory(id: number) {
		if (!user.value)
			return { success: false, error: new Error("Not authenticated") };

		try {
			loading.value = true;
			error.value = null;

			const { error: deleteError } = await supabase
				.from("categories")
				.update({ is_active: false })
				.eq("id", id)
				.eq("user_id", user.value.id);

			if (deleteError) throw deleteError;

			categories.value = categories.value.filter((c) => c.id !== id);
			return { success: true };
		} catch (err) {
			error.value = err as Error;
			return { success: false, error: err as Error };
		} finally {
			loading.value = false;
		}
	}

	// Initialize default categories for new users
	async function initDefaultCategories() {
		if (!user.value)
			return { success: false, error: new Error("Not authenticated") };

		// 이미 카테고리가 있으면 스킵
		if (categories.value.length > 0) {
			return { success: true, skipped: true };
		}

		try {
			loading.value = true;
			error.value = null;

			const categoriesToInsert = DEFAULT_CATEGORIES.map((cat, index) => ({
				user_id: user.value!.id,
				name: cat.name,
				type: cat.type,
				target_percent: cat.target_percent || 0,
				color: cat.color || "#6B7280",
				sort_order: index,
			}));

			const { data, error: insertError } = await supabase
				.from("categories")
				.insert(categoriesToInsert)
				.select();

			if (insertError) throw insertError;

			categories.value = data as Category[];
			return { success: true, data };
		} catch (err) {
			error.value = err as Error;
			return { success: false, error: err as Error };
		} finally {
			loading.value = false;
		}
	}

	// Computed: Investment categories only
	const investmentCategories = computed(() =>
		categories.value.filter((c) => c.type === "investment"),
	);

	// Computed: Savings categories only
	const savingsCategories = computed(() =>
		categories.value.filter((c) => c.type === "savings"),
	);

	// Get category by ID
	function getCategoryById(id: number): Category | undefined {
		return categories.value.find((c) => c.id === id);
	}

	// Get categories by type
	function getCategoriesByType(type: CategoryType): Category[] {
		return categories.value.filter((c) => c.type === type);
	}

	return {
		categories: readonly(categories),
		loading: readonly(loading),
		error: readonly(error),
		investmentCategories,
		savingsCategories,
		fetchCategories,
		addCategory,
		updateCategory,
		deleteCategory,
		initDefaultCategories,
		getCategoryById,
		getCategoriesByType,
	};
}
