"use client";

import { useMemo, useState } from "react";
import type { Category, Saving } from "@/types";
import BaseButton from "@/components/base/BaseButton";
import FeedbackEmpty from "@/components/feedback/FeedbackEmpty";
import FeedbackLoading from "@/components/feedback/FeedbackLoading";
import SavingListItem from "@/components/saving/SavingListItem";

interface SavingListProps {
	savings: readonly Saving[];
	categories?: readonly Category[];
	loading?: boolean;
	onEdit: (saving: Saving) => void;
	onDelete: (saving: Saving) => void;
	onAdd?: () => void;
}

export default function SavingList({
	savings,
	categories = [],
	loading = false,
	onEdit,
	onDelete,
	onAdd,
}: SavingListProps) {
	const [selectedCategoryId, setSelectedCategoryId] = useState<
		number | "all"
	>("all");

	const categoryFilterOptions = useMemo(
		() => [
			{ value: "all" as const, label: "전체", color: undefined },
			...categories.map((cat) => ({
				value: cat.id,
				label: cat.name,
				color: cat.color,
			})),
		],
		[categories],
	);

	const filteredSavings = useMemo(() => {
		if (selectedCategoryId === "all") {
			return savings;
		}
		return savings.filter(
			(s) => s.category_id === selectedCategoryId,
		);
	}, [savings, selectedCategoryId]);

	const selectedCategoryName = useMemo(() => {
		if (selectedCategoryId === "all") return null;
		return categories.find((c) => c.id === selectedCategoryId)?.name || "";
	}, [selectedCategoryId, categories]);

	return (
		<div className="space-y-4">
			{/* Filter */}
			{categories.length > 0 && (
				<div
					className="flex gap-2 overflow-x-auto pb-2 scrollbar-hidden"
					role="tablist"
					aria-label="카테고리 필터"
				>
					{categoryFilterOptions.map((option) => (
						<button
							key={option.value}
							type="button"
							role="tab"
							aria-selected={selectedCategoryId === option.value}
							className={`inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-full whitespace-nowrap transition-colors duration-200 min-h-[44px] ${
								selectedCategoryId === option.value
									? "bg-primary text-white shadow-sm"
									: "bg-secondary-50 text-secondary-700 hover:bg-secondary-100"
							}`}
							onClick={() =>
								setSelectedCategoryId(option.value)
							}
						>
							{option.color && (
								<div
									className="w-2 h-2 rounded-full shrink-0"
									style={{ backgroundColor: option.color }}
									aria-hidden="true"
								/>
							)}
							{option.label}
						</button>
					))}
				</div>
			)}

			{/* Loading */}
			{loading && (
				<div className="py-8 text-center" aria-busy="true">
					<FeedbackLoading />
				</div>
			)}

			{/* Empty state */}
			{!loading && filteredSavings.length === 0 && (
				<FeedbackEmpty
					title={
						selectedCategoryName
							? `${selectedCategoryName} 내역이 없어요`
							: "아직 저축 내역이 없어요"
					}
					description={
						selectedCategoryName
							? "다른 카테고리를 선택하거나 새로 추가해보세요"
							: "첫 번째 저축을 추가해보세요"
					}
					action={
						onAdd ? (
							<BaseButton size="sm" onClick={onAdd}>
								+ 새 저축 추가
							</BaseButton>
						) : undefined
					}
				/>
			)}

			{/* List */}
			{!loading && filteredSavings.length > 0 && (
				<div className="space-y-2.5">
					{filteredSavings.map((saving) => (
						<SavingListItem
							key={saving.id}
							saving={saving}
							onEdit={onEdit}
							onDelete={onDelete}
						/>
					))}
				</div>
			)}
		</div>
	);
}
