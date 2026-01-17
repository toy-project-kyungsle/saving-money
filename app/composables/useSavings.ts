import type {
	Category,
	CategorySummary,
	MonthlySummary,
	Saving,
	SavingInput,
	SavingSummary,
} from "~/types";
import { getMonth, getToday } from "~/utils/date";
import { validateSavingInput } from "~/utils/validation";

export function useSavings() {
	const { supabase } = useSupabase();
	const { user } = useAuth();
	const { categories, investmentCategories, savingsCategories } =
		useCategories();

	const savings = useState<Saving[]>("savings-data", () => []);
	const loading = useState<boolean>("savings-loading", () => false);
	const error = useState<Error | null>("savings-error", () => null);

	// Fetch all savings for current user with category join
	async function fetchSavings() {
		if (!user.value) return;

		try {
			loading.value = true;
			error.value = null;

			const { data, error: fetchError } = await supabase
				.from("savings")
				.select("*, category:categories(*)")
				.eq("user_id", user.value.id)
				.order("transaction_date", { ascending: false });

			if (fetchError) throw fetchError;

			savings.value = data as Saving[];
		} catch (err) {
			error.value = err as Error;
		} finally {
			loading.value = false;
		}
	}

	// Add new saving
	async function addSaving(input: SavingInput) {
		if (!user.value)
			return { success: false, error: new Error("Not authenticated") };

		// 입력 검증
		const validation = validateSavingInput(input);
		if (!validation.valid) {
			const errorMessages = Object.values(validation.errors).join(", ");
			return { success: false, error: new Error(errorMessages), validationErrors: validation.errors };
		}

		try {
			loading.value = true;
			error.value = null;

			const newSaving = {
				user_id: user.value.id,
				category_id: input.category_id,
				amount: input.amount,
				transaction_date: input.transaction_date || getToday(),
				description: input.description || null,
			};

			const { data, error: insertError } = await supabase
				.from("savings")
				.insert(newSaving)
				.select("*, category:categories(*)")
				.single();

			if (insertError) throw insertError;

			savings.value = [data as Saving, ...savings.value];
			return { success: true, data };
		} catch (err) {
			error.value = err as Error;
			return { success: false, error: err as Error };
		} finally {
			loading.value = false;
		}
	}

	// Update existing saving
	async function updateSaving(id: number, input: Partial<SavingInput>) {
		if (!user.value)
			return { success: false, error: new Error("Not authenticated") };

		try {
			loading.value = true;
			error.value = null;

			const { data, error: updateError } = await supabase
				.from("savings")
				.update(input)
				.eq("id", id)
				.eq("user_id", user.value.id)
				.select("*, category:categories(*)")
				.single();

			if (updateError) throw updateError;

			const index = savings.value.findIndex((s) => s.id === id);
			if (index !== -1) {
				savings.value[index] = data as Saving;
			}

			return { success: true, data };
		} catch (err) {
			error.value = err as Error;
			return { success: false, error: err as Error };
		} finally {
			loading.value = false;
		}
	}

	// Delete saving
	async function deleteSaving(id: number) {
		if (!user.value)
			return { success: false, error: new Error("Not authenticated") };

		try {
			loading.value = true;
			error.value = null;

			const { error: deleteError } = await supabase
				.from("savings")
				.delete()
				.eq("id", id)
				.eq("user_id", user.value.id);

			if (deleteError) throw deleteError;

			savings.value = savings.value.filter((s) => s.id !== id);
			return { success: true };
		} catch (err) {
			error.value = err as Error;
			return { success: false, error: err as Error };
		} finally {
			loading.value = false;
		}
	}

	// Filter savings by category type
	function getSavingsByType(type: "savings" | "investment"): Saving[] {
		const categoryIds =
			type === "savings"
				? savingsCategories.value.map((c) => c.id)
				: investmentCategories.value.map((c) => c.id);
		return savings.value.filter((s) => categoryIds.includes(s.category_id));
	}

	// Computed: Savings type only (저축)
	const savingsTypeSavings = computed(() => getSavingsByType("savings"));

	// Computed: Investment type only (투자)
	const investmentTypeSavings = computed(() => getSavingsByType("investment"));

	// Build summary for given savings and categories
	function buildSummary(
		savingsList: Saving[],
		categoryList: Category[],
	): SavingSummary {
		const total = savingsList.reduce((sum, s) => sum + s.amount, 0);

		// Category summary
		const byCategory: CategorySummary[] = categoryList.map((category) => {
			const items = savingsList.filter((s) => s.category_id === category.id);
			return {
				category,
				total: items.reduce((sum, s) => sum + s.amount, 0),
				count: items.length,
			};
		});

		// Monthly summary
		const monthlyMap = new Map<
			string,
			{ total: number; byCategory: Map<number, number> }
		>();

		for (const saving of savingsList) {
			const month = getMonth(saving.transaction_date);
			if (!monthlyMap.has(month)) {
				monthlyMap.set(month, {
					total: 0,
					byCategory: new Map(),
				});
			}
			const entry = monthlyMap.get(month)!;
			entry.total += saving.amount;
			entry.byCategory.set(
				saving.category_id,
				(entry.byCategory.get(saving.category_id) || 0) + saving.amount,
			);
		}

		const byMonth: MonthlySummary[] = Array.from(monthlyMap.entries())
			.map(([month, data]) => ({ month, ...data }))
			.sort((a, b) => b.month.localeCompare(a.month));

		return { total, byCategory, byMonth };
	}

	// Computed: Total summary (all savings)
	const totalSummary = computed<SavingSummary>(() =>
		buildSummary(savings.value, [...categories.value]),
	);

	// Computed: Savings type summary only
	const savingsSummary = computed<SavingSummary>(() =>
		buildSummary(savingsTypeSavings.value, [...savingsCategories.value]),
	);

	// Computed: Investment type summary only
	const investmentSummary = computed<SavingSummary>(() =>
		buildSummary(investmentTypeSavings.value, [...investmentCategories.value]),
	);

	// Computed: Current month summary (savings type only)
	const currentMonthSummary = computed(() => {
		const currentMonth = getMonth(new Date());
		return (
			savingsSummary.value.byMonth.find((m) => m.month === currentMonth) || {
				month: currentMonth,
				total: 0,
				byCategory: new Map(),
			}
		);
	});

	// Computed: Category breakdown for charts (savings type only)
	const categoryBreakdown = computed(() => {
		return savingsSummary.value.byCategory.filter((c) => c.total > 0);
	});

	return {
		savings: readonly(savings),
		loading: readonly(loading),
		error: readonly(error),
		savingsTypeSavings,
		investmentTypeSavings,
		totalSummary,
		savingsSummary,
		investmentSummary,
		currentMonthSummary,
		categoryBreakdown,
		fetchSavings,
		addSaving,
		updateSaving,
		deleteSaving,
		getSavingsByType,
	};
}
