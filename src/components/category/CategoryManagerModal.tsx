"use client";

import { useEffect, useState } from "react";
import type { Category, CategoryInput, CategoryType } from "@/types";
import { validateCategoryName } from "@/lib/validation";
import BaseModal from "@/components/base/BaseModal";
import BaseButton from "@/components/base/BaseButton";
import BaseInput from "@/components/base/BaseInput";

interface CategoryManagerModalProps {
	open: boolean;
	onClose: () => void;
	categories: Category[];
	category?: Category | null;
	loading?: boolean;
	error?: string;
	onSave: (data: CategoryInput) => void;
	onDelete: (id: number) => void;
}

const presetColors = [
	"#3B82F6",
	"#10B981",
	"#8B5CF6",
	"#F59E0B",
	"#EF4444",
	"#6B7280",
	"#EC4899",
	"#14B8A6",
];

const colorNames: Record<string, string> = {
	"#3B82F6": "파란색",
	"#10B981": "초록색",
	"#8B5CF6": "보라색",
	"#F59E0B": "노란색",
	"#EF4444": "빨간색",
	"#6B7280": "회색",
	"#EC4899": "분홍색",
	"#14B8A6": "청록색",
};

type ModalView = "list" | "form";

export default function CategoryManagerModal({
	open,
	onClose,
	categories,
	category = null,
	loading = false,
	error,
	onSave,
	onDelete,
}: CategoryManagerModalProps) {
	const [view, setView] = useState<ModalView>("list");
	const [editingCategory, setEditingCategory] = useState<Category | null>(null);

	const [name, setName] = useState("");
	const [nameError, setNameError] = useState("");
	const [type, setType] = useState<CategoryType>("investment");
	const [targetPercent, setTargetPercent] = useState(0);
	const [color, setColor] = useState("#6B7280");
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

	useEffect(() => {
		if (open) {
			if (category) {
				setEditingCategory(category);
				populateForm(category);
				setView("form");
			} else {
				setEditingCategory(null);
				setView("list");
			}
			setNameError("");
			setShowDeleteConfirm(false);
		}
	}, [open, category]);

	function populateForm(cat: Category | null) {
		if (cat) {
			setName(cat.name);
			setType(cat.type);
			setTargetPercent(cat.target_percent);
			setColor(cat.color);
		} else {
			setName("");
			setType("investment");
			setTargetPercent(0);
			setColor("#6B7280");
		}
		setNameError("");
		setShowDeleteConfirm(false);
	}

	function handleOpenForm(cat?: Category) {
		setEditingCategory(cat || null);
		populateForm(cat || null);
		setView("form");
	}

	function handleBackToList() {
		setView("list");
		setEditingCategory(null);
		setShowDeleteConfirm(false);
	}

	function validateName(): boolean {
		const result = validateCategoryName(name);
		if (!result.valid) {
			setNameError(result.error!);
			return false;
		}
		setNameError("");
		return true;
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!validateName()) return;
		onSave({
			name: name.trim(),
			type,
			target_percent: type === "investment" ? targetPercent : 0,
			color,
		});
	}

	function handleDelete() {
		if (!showDeleteConfirm) {
			setShowDeleteConfirm(true);
			return;
		}
		if (editingCategory) {
			onDelete(editingCategory.id);
		}
	}

	const isEditing = !!editingCategory;
	const investmentCats = categories.filter((c) => c.type === "investment");
	const savingsCats = categories.filter((c) => c.type === "savings");

	function renderCategoryRow(cat: Category) {
		return (
			<button
				key={cat.id}
				type="button"
				className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-secondary-50 transition-colors text-left group"
				onClick={() => handleOpenForm(cat)}
			>
				<div
					className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
					style={{ backgroundColor: `${cat.color}18` }}
				>
					<div
						className="w-3 h-3 rounded-full"
						style={{ backgroundColor: cat.color }}
						aria-hidden="true"
					/>
				</div>
				<div className="flex-1 min-w-0">
					<div className="font-medium text-secondary-900">{cat.name}</div>
					{cat.target_percent > 0 && (
						<div className="text-xs text-secondary-400">목표 {cat.target_percent}%</div>
					)}
				</div>
				<svg className="w-4 h-4 text-secondary-300 group-hover:text-secondary-500 transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
				</svg>
			</button>
		);
	}

	return (
		<BaseModal
			open={open}
			onClose={onClose}
			title={view === "list" ? "카테고리 관리" : isEditing ? "카테고리 수정" : "새 카테고리"}
			size={view === "list" ? "lg" : "md"}
		>
			{view === "list" ? (
				<div className="space-y-5">
					{investmentCats.length > 0 && (
						<div>
							<h3 className="text-xs font-semibold text-secondary-400 uppercase tracking-wider mb-2">투자</h3>
							<div className="space-y-1">{investmentCats.map(renderCategoryRow)}</div>
						</div>
					)}

					{savingsCats.length > 0 && (
						<div>
							<h3 className="text-xs font-semibold text-secondary-400 uppercase tracking-wider mb-2">저축</h3>
							<div className="space-y-1">{savingsCats.map(renderCategoryRow)}</div>
						</div>
					)}

					{categories.length === 0 && (
						<div className="text-center py-8 text-secondary-400">
							<p>아직 카테고리가 없어요</p>
						</div>
					)}

					<div className="pt-2 border-t border-secondary-100">
						<BaseButton className="w-full" onClick={() => handleOpenForm()}>
							+ 새 카테고리 추가
						</BaseButton>
					</div>
				</div>
			) : (
				<form className="space-y-5" onSubmit={handleSubmit}>
					{!category && (
						<button
							type="button"
							className="flex items-center gap-1.5 text-sm text-secondary-500 hover:text-secondary-700 transition-colors -mt-1"
							onClick={handleBackToList}
						>
							<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
							</svg>
							목록으로
						</button>
					)}

					<BaseInput
						label="카테고리 이름"
						value={name}
						onChange={(v) => {
							setName(String(v));
							if (nameError) setNameError("");
						}}
						placeholder="예: Core, AI 전력 인프라"
						required
						error={nameError}
						maxLength={50}
					/>

					<fieldset>
						<legend className="block text-sm font-medium text-secondary-700 mb-1.5">유형</legend>
						<div className="flex gap-2" role="radiogroup" aria-label="카테고리 유형">
							<button
								type="button"
								role="radio"
								aria-checked={type === "investment"}
								className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium border transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-1 ${
									type === "investment"
										? "bg-primary-50 border-primary-200 text-primary-700"
										: "bg-surface-raised border-secondary-200 text-secondary-500 hover:bg-surface-subtle"
								}`}
								onClick={() => setType("investment")}
							>
								투자
							</button>
							<button
								type="button"
								role="radio"
								aria-checked={type === "savings"}
								className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-medium border transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-1 ${
									type === "savings"
										? "bg-success-50 border-success-200 text-success-700"
										: "bg-surface-raised border-secondary-200 text-secondary-500 hover:bg-surface-subtle"
								}`}
								onClick={() => setType("savings")}
							>
								저축
							</button>
						</div>
					</fieldset>

					{type === "investment" && (
						<div>
							<BaseInput
								label="목표 비중 (%)"
								value={targetPercent}
								onChange={(v) => setTargetPercent(Number(v))}
								type="number"
								min="0"
								max="100"
								step="0.1"
								placeholder="0"
							/>
							<p className="text-xs text-secondary-400 mt-1.5">
								포트폴리오에서 이 카테고리가 차지해야 할 비중
							</p>
						</div>
					)}

					<fieldset>
						<legend className="block text-sm font-medium text-secondary-700 mb-2">색상</legend>
						<div className="flex flex-wrap gap-2">
							{presetColors.map((presetColor) => (
								<button
									key={presetColor}
									type="button"
									className={`w-9 h-9 rounded-full border-2 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-400 ${
										color === presetColor
											? "border-secondary-900 ring-2 ring-secondary-900/20"
											: "border-transparent"
									}`}
									style={{ backgroundColor: presetColor }}
									onClick={() => setColor(presetColor)}
									aria-label={colorNames[presetColor] || presetColor}
								/>
							))}
							<input
								type="color"
								value={color}
								onChange={(e) => setColor(e.target.value)}
								className="w-9 h-9 rounded-full cursor-pointer border-0"
								aria-label="직접 색상 선택"
							/>
						</div>
					</fieldset>

					{error && (
						<div className="bg-error-50 border border-error-200 text-error-700 rounded-xl p-3 text-sm" role="alert">
							{error}
						</div>
					)}

					<div className="flex gap-2 pt-6">
						{isEditing && (
							<div className="flex flex-col gap-1">
								<BaseButton type="button" variant="danger" disabled={loading} onClick={handleDelete}>
									{showDeleteConfirm ? "정말 삭제" : "삭제"}
								</BaseButton>
								{showDeleteConfirm && (
									<p className="text-xs text-error-500">삭제하면 되돌릴 수 없어요</p>
								)}
							</div>
						)}
						<div className="flex-1" />
						<BaseButton
							type="button"
							variant="secondary"
							disabled={loading}
							onClick={category ? onClose : handleBackToList}
						>
							취소
						</BaseButton>
						<BaseButton type="submit" loading={loading} disabled={!name.trim()}>
							{isEditing ? "수정 완료" : "추가"}
						</BaseButton>
					</div>
				</form>
			)}
		</BaseModal>
	);
}
