"use client";

import { useCallback, useMemo, useState } from "react";
import type { Category, CategoryInput, CategoryType } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { getSupabase } from "@/lib/supabase";
import { validateCategoryInput } from "@/lib/validation";

// 기본 카테고리 시드 데이터
const DEFAULT_CATEGORIES: Omit<CategoryInput, "sort_order">[] = [
	// 저축용
	{ name: "월급", type: "savings", color: "#4CAF50", target_percent: 0 },
	{ name: "적금", type: "savings", color: "#2196F3", target_percent: 0 },
	// 투자용
	{
		name: "Core",
		type: "investment",
		color: "#3B82F6",
		target_percent: 30,
	},
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
	{
		name: "안전자산",
		type: "investment",
		color: "#6B7280",
		target_percent: 6,
	},
	{
		name: "도전",
		type: "investment",
		color: "#EF4444",
		target_percent: 6,
	},
];

export function useCategories() {
	const supabase = getSupabase();
	const { user } = useAuth();

	const [categories, setCategories] = useState<Category[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);

	const fetchCategories = useCallback(async () => {
		if (!user) return;

		try {
			setLoading(true);
			setError(null);

			const { data, error: fetchError } = await supabase
				.from("categories")
				.select("*")
				.eq("user_id", user.id)
				.eq("is_active", true)
				.order("sort_order", { ascending: true });

			if (fetchError) throw fetchError;

			setCategories(data as Category[]);
		} catch (err) {
			setError(err as Error);
		} finally {
			setLoading(false);
		}
	}, [user, supabase]);

	const addCategory = useCallback(
		async (input: CategoryInput) => {
			if (!user)
				return {
					success: false,
					error: new Error("Not authenticated"),
				};

			const validation = validateCategoryInput(input);
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

				const maxSortOrder = Math.max(
					0,
					...categories.map((c) => c.sort_order),
				);

				const newCategory = {
					user_id: user.id,
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

				setCategories((prev) => [...prev, data as Category]);
				return { success: true, data };
			} catch (err) {
				setError(err as Error);
				return { success: false, error: err as Error };
			} finally {
				setLoading(false);
			}
		},
		[user, supabase, categories],
	);

	const updateCategory = useCallback(
		async (id: number, input: Partial<CategoryInput>) => {
			if (!user)
				return {
					success: false,
					error: new Error("Not authenticated"),
				};

			try {
				setLoading(true);
				setError(null);

				const { data, error: updateError } = await supabase
					.from("categories")
					.update(input)
					.eq("id", id)
					.eq("user_id", user.id)
					.select()
					.single();

				if (updateError) throw updateError;

				setCategories((prev) =>
					prev.map((c) =>
						c.id === id ? (data as Category) : c,
					),
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

	const deleteCategory = useCallback(
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
					.from("categories")
					.update({ is_active: false })
					.eq("id", id)
					.eq("user_id", user.id);

				if (deleteError) throw deleteError;

				setCategories((prev) => prev.filter((c) => c.id !== id));
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

	const initDefaultCategories = useCallback(async () => {
		if (!user)
			return { success: false, error: new Error("Not authenticated") };

		if (categories.length > 0) {
			return { success: true, skipped: true };
		}

		try {
			setLoading(true);
			setError(null);

			const categoriesToInsert = DEFAULT_CATEGORIES.map(
				(cat, index) => ({
					user_id: user.id,
					name: cat.name,
					type: cat.type,
					target_percent: cat.target_percent || 0,
					color: cat.color || "#6B7280",
					sort_order: index,
				}),
			);

			const { data, error: insertError } = await supabase
				.from("categories")
				.insert(categoriesToInsert)
				.select();

			if (insertError) throw insertError;

			setCategories(data as Category[]);
			return { success: true, data };
		} catch (err) {
			setError(err as Error);
			return { success: false, error: err as Error };
		} finally {
			setLoading(false);
		}
	}, [user, supabase, categories.length]);

	const investmentCategories = useMemo(
		() => categories.filter((c) => c.type === "investment"),
		[categories],
	);

	const savingsCategories = useMemo(
		() => categories.filter((c) => c.type === "savings"),
		[categories],
	);

	const getCategoryById = useCallback(
		(id: number): Category | undefined => {
			return categories.find((c) => c.id === id);
		},
		[categories],
	);

	const getCategoriesByType = useCallback(
		(type: CategoryType): Category[] => {
			return categories.filter((c) => c.type === type);
		},
		[categories],
	);

	return {
		categories,
		loading,
		error,
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
