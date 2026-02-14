"use client";

import { useCallback, useMemo, useState } from "react";
import type {
	Category,
	CategorySummary,
	MonthlySummary,
	Saving,
	SavingInput,
	SavingSummary,
} from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { getSupabase } from "@/lib/supabase";
import { getMonth, getToday } from "@/lib/date";
import { validateSavingInput } from "@/lib/validation";

export function useSavings(
	categories: Category[],
	investmentCategories: Category[],
	savingsCategories: Category[],
) {
	const supabase = getSupabase();
	const { user } = useAuth();

	const [savings, setSavings] = useState<Saving[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const fetchSavings = useCallback(async () => {
		if (!user) return;

		try {
			setLoading(true);
			setError(null);

			const { data, error: fetchError } = await supabase
				.from("savings")
				.select("*, category:categories(*)")
				.eq("user_id", user.id)
				.order("transaction_date", { ascending: false });

			if (fetchError) throw fetchError;

			setSavings(data as Saving[]);
		} catch (err) {
			setError(err as Error);
		} finally {
			setLoading(false);
		}
	}, [user, supabase]);

	const addSaving = useCallback(
		async (input: SavingInput) => {
			if (!user)
				return {
					success: false,
					error: new Error("Not authenticated"),
				};

			const validation = validateSavingInput(input);
			if (!validation.valid) {
				const errorMessages = Object.values(validation.errors).join(
					", ",
				);
				return {
					success: false,
					error: new Error(errorMessages),
					validationErrors: validation.errors,
				};
			}

			try {
				setLoading(true);
				setError(null);

				const newSaving = {
					user_id: user.id,
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

				setSavings((prev) => [data as Saving, ...prev]);
				return { success: true, data };
			} catch (err) {
				setError(err as Error);
				return { success: false, error: err as Error };
			} finally {
				setLoading(false);
			}
		},
		[user, supabase],
	);

	const updateSaving = useCallback(
		async (id: number, input: Partial<SavingInput>) => {
			if (!user)
				return {
					success: false,
					error: new Error("Not authenticated"),
				};

			try {
				setLoading(true);
				setError(null);

				const { data, error: updateError } = await supabase
					.from("savings")
					.update(input)
					.eq("id", id)
					.eq("user_id", user.id)
					.select("*, category:categories(*)")
					.single();

				if (updateError) throw updateError;

				setSavings((prev) =>
					prev.map((s) => (s.id === id ? (data as Saving) : s)),
				);

				return { success: true, data };
			} catch (err) {
				setError(err as Error);
				return { success: false, error: err as Error };
			} finally {
				setLoading(false);
			}
		},
		[user, supabase],
	);

	const deleteSaving = useCallback(
		async (id: number) => {
			if (!user)
				return {
					success: false,
					error: new Error("Not authenticated"),
				};

			try {
				setLoading(true);
				setError(null);

				const { error: deleteError } = await supabase
					.from("savings")
					.delete()
					.eq("id", id)
					.eq("user_id", user.id);

				if (deleteError) throw deleteError;

				setSavings((prev) => prev.filter((s) => s.id !== id));
				return { success: true };
			} catch (err) {
				setError(err as Error);
				return { success: false, error: err as Error };
			} finally {
				setLoading(false);
			}
		},
		[user, supabase],
	);

	// Savings type only (저축)
	const savingsTypeSavings = useMemo(() => {
		const categoryIds = savingsCategories.map((c) => c.id);
		return savings.filter((s) => categoryIds.includes(s.category_id));
	}, [savings, savingsCategories]);

	// Investment type only (투자)
	const investmentTypeSavings = useMemo(() => {
		const categoryIds = investmentCategories.map((c) => c.id);
		return savings.filter((s) => categoryIds.includes(s.category_id));
	}, [savings, investmentCategories]);

	// Build summary for given savings and categories
	function buildSummary(
		savingsList: Saving[],
		categoryList: Category[],
	): SavingSummary {
		const total = savingsList.reduce((sum, s) => sum + s.amount, 0);

		const byCategory: CategorySummary[] = categoryList.map((category) => {
			const items = savingsList.filter(
				(s) => s.category_id === category.id,
			);
			return {
				category,
				total: items.reduce((sum, s) => sum + s.amount, 0),
				count: items.length,
			};
		});

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
				(entry.byCategory.get(saving.category_id) || 0) +
					saving.amount,
			);
		}

		const byMonth: MonthlySummary[] = Array.from(monthlyMap.entries())
			.map(([month, data]) => ({ month, ...data }))
			.sort((a, b) => b.month.localeCompare(a.month));

		return { total, byCategory, byMonth };
	}

	// Total summary (all savings)
	const totalSummary = useMemo<SavingSummary>(
		() => buildSummary(savings, [...categories]),
		[savings, categories],
	);

	// Savings type summary only
	const savingsSummary = useMemo<SavingSummary>(
		() => buildSummary(savingsTypeSavings, [...savingsCategories]),
		[savingsTypeSavings, savingsCategories],
	);

	// Investment type summary only
	const investmentSummary = useMemo<SavingSummary>(
		() => buildSummary(investmentTypeSavings, [...investmentCategories]),
		[investmentTypeSavings, investmentCategories],
	);

	return {
		savings,
		loading,
		error,
		savingsTypeSavings,
		investmentTypeSavings,
		totalSummary,
		savingsSummary,
		investmentSummary,
		fetchSavings,
		addSaving,
		updateSaving,
		deleteSaving,
	};
}
