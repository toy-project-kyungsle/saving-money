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
	const categoryName = saving.category?.name || "알 수 없음";
	const categoryColor = saving.category?.color || "#6B7280";

	return (
		<div
			className="group flex items-center justify-between p-4 bg-surface-raised border border-secondary-100 rounded-xl hover:shadow-card hover:border-primary-200 transition-all duration-200 cursor-pointer"
			onClick={() => onEdit(saving)}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					onEdit(saving);
				}
			}}
			tabIndex={0}
			role="button"
			aria-label={`${categoryName} ${formatKRW(saving.amount)} 수정`}
		>
			{/* Left: category icon + info */}
			<div className="flex items-center gap-3 min-w-0 flex-1">
				<div
					className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105"
					style={{ backgroundColor: `${categoryColor}18` }}
				>
					<div
						className="w-3.5 h-3.5 rounded-full"
						style={{ backgroundColor: categoryColor }}
						aria-hidden="true"
					/>
				</div>
				<div className="min-w-0 flex-1">
					<div className="flex items-center gap-2">
						<span className="font-medium text-secondary-900">
							{categoryName}
						</span>
						{saving.description && (
							<span className="text-sm text-secondary-400 truncate hidden sm:inline">
								{saving.description}
							</span>
						)}
					</div>
					{saving.description && (
						<div className="text-sm text-secondary-400 truncate sm:hidden">
							{saving.description}
						</div>
					)}
				</div>
			</div>

			{/* Right: amount + delete + chevron */}
			<div className="flex items-center gap-3 shrink-0">
				<div className="text-right">
					<div className="font-bold text-secondary-900 tabular-nums text-base">
						{formatKRW(saving.amount)}
					</div>
					<div className="text-xs text-secondary-400">
						{formatDateKR(saving.transaction_date)}
					</div>
				</div>

				{/* Delete button - appears on hover/focus */}
				<button
					type="button"
					className="p-2 text-secondary-300 hover:text-error-500 hover:bg-error-50 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-error-400 focus:ring-offset-1"
					aria-label="삭제"
					onClick={(e) => {
						e.stopPropagation();
						onDelete(saving);
					}}
					onKeyDown={(e) => {
						if (e.key === "Enter" || e.key === " ") {
							e.stopPropagation();
						}
					}}
					tabIndex={0}
				>
					<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
					</svg>
				</button>

				<svg
					className="w-4 h-4 text-secondary-300 group-hover:text-primary transition-colors shrink-0"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
					aria-hidden="true"
				>
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
				</svg>
			</div>
		</div>
	);
}
