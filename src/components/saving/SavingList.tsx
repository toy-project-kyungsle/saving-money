"use client";

import { useMemo, useState } from "react";
import type { Category, Saving } from "@/types";
import FeedbackEmpty from "@/components/feedback/FeedbackEmpty";
import FeedbackLoading from "@/components/feedback/FeedbackLoading";
import SavingListItem from "@/components/saving/SavingListItem";

interface SavingListProps {
	savings: readonly Saving[];
	categories?: readonly Category[];
	loading?: boolean;
	onEdit: (saving: Saving) => void;
	onDelete: (saving: Saving) => void;
}

export default function SavingList({
	savings,
	categories = [],
	loading = false,
	onEdit,
	onDelete,
}: SavingListProps) {
	const [selectedCategoryId, setSelectedCategoryId] = useState<
		number | "all"
	>("all");

	const categoryFilterOptions = useMemo(
		() => [
			{ value: "all" as const, label: "전체" },
			...categories.map((cat) => ({
				value: cat.id,
				label: cat.name,
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

	return (
		<div className="space-y-4">
			{/* Filter */}
			{categories.length > 0 && (
				<div className="flex gap-2 overflow-x-auto pb-2">
					{categoryFilterOptions.map((option) => (
						<button
							key={option.value}
							type="button"
							className={`px-4 py-1.5 text-sm font-medium rounded-full whitespace-nowrap transition-colors ${
								selectedCategoryId === option.value
									? "bg-blue-600 text-white"
									: "bg-gray-100 text-gray-700 hover:bg-gray-200"
							}`}
							onClick={() =>
								setSelectedCategoryId(option.value)
							}
						>
							{option.label}
						</button>
					))}
				</div>
			)}

			{/* Loading */}
			{loading && (
				<div className="py-8 text-center text-gray-500">
					<FeedbackLoading />
				</div>
			)}

			{/* Empty state */}
			{!loading && filteredSavings.length === 0 && (
				<FeedbackEmpty
					title="저축 내역이 없습니다"
					description="새로운 저축을 추가해보세요"
				/>
			)}

			{/* List */}
			{!loading && filteredSavings.length > 0 && (
				<div className="space-y-2">
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
