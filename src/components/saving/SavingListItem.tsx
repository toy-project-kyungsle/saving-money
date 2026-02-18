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
		<div className="group flex items-center justify-between p-4 bg-surface-raised border border-secondary-100 rounded-xl hover:shadow-card transition-all duration-200">
			<div className="flex items-center gap-3">
				<div
					className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
					style={{ backgroundColor: `${categoryColor}26` }}
				>
					<div
						className="w-3 h-3 rounded-full"
						style={{ backgroundColor: categoryColor }}
						aria-hidden="true"
					/>
				</div>
				<div className="min-w-0">
					<div className="flex items-center gap-2">
						<span className="font-medium text-secondary-900">
							{categoryName}
						</span>
						{saving.description && (
							<span className="text-sm text-secondary-400 truncate">
								{saving.description}
							</span>
						)}
					</div>
					<div className="text-xs text-secondary-400">
						{formatDateKR(saving.transaction_date)}
					</div>
				</div>
			</div>

			<div className="flex items-center gap-3">
				<span className="font-bold text-secondary-900 tabular-nums">
					{formatKRW(saving.amount)}
				</span>

				<div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
					<button
						type="button"
						className="p-1.5 text-secondary-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors duration-200"
						aria-label="수정"
						onClick={() => onEdit(saving)}
					>
						<svg
							className="w-4 h-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
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
						className="p-1.5 text-secondary-400 hover:text-error-600 hover:bg-error-50 rounded-lg transition-colors duration-200"
						aria-label="삭제"
						onClick={() => onDelete(saving)}
					>
						<svg
							className="w-4 h-4"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
							aria-hidden="true"
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
