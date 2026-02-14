"use client";

import type { Saving } from "@/types";
import { formatKRW } from "@/lib/currency";
import { formatDateKR } from "@/lib/date";

interface SavingListItemProps {
	saving: Saving;
	onEdit: (saving: Saving) => void;
	onDelete: (saving: Saving) => void;
}

export default function SavingListItem({
	saving,
	onEdit,
	onDelete,
}: SavingListItemProps) {
	const categoryName = saving.category?.name || "Unknown";
	const categoryColor = saving.category?.color || "#6B7280";

	return (
		<div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
			<div className="flex items-center gap-4">
				<div
					className="w-3 h-3 rounded-full"
					style={{ backgroundColor: categoryColor }}
				/>
				<div>
					<div className="flex items-center gap-2">
						<span className="font-medium text-gray-900">
							{categoryName}
						</span>
						{saving.description && (
							<span className="text-sm text-gray-500">
								- {saving.description}
							</span>
						)}
					</div>
					<div className="text-sm text-gray-500">
						{formatDateKR(saving.transaction_date)}
					</div>
				</div>
			</div>

			<div className="flex items-center gap-4">
				<span className="font-semibold text-gray-900">
					{formatKRW(saving.amount)}
				</span>

				<div className="flex gap-1">
					<button
						type="button"
						className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors"
						aria-label="수정"
						onClick={() => onEdit(saving)}
					>
						<svg
							className="w-4 h-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
							/>
						</svg>
					</button>
					<button
						type="button"
						className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
						aria-label="삭제"
						onClick={() => onDelete(saving)}
					>
						<svg
							className="w-4 h-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
							/>
						</svg>
					</button>
				</div>
			</div>
		</div>
	);
}
