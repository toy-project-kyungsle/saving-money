"use client";

import { useEffect, useState } from "react";
import type { Category, CategoryInput } from "@/types";
import BaseModal from "@/components/base/BaseModal";
import BaseButton from "@/components/base/BaseButton";
import BaseInput from "@/components/base/BaseInput";

interface CategoryManagerModalProps {
	open: boolean;
	onClose: () => void;
	category?: Category | null;
	loading?: boolean;
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

export default function CategoryManagerModal({
	open,
	onClose,
	category = null,
	loading = false,
	onSave,
	onDelete,
}: CategoryManagerModalProps) {
	const isEditing = !!category;
	const title = isEditing ? "카테고리 수정" : "새 카테고리";

	const [name, setName] = useState("");
	const [targetPercent, setTargetPercent] = useState(0);
	const [color, setColor] = useState("#6B7280");

	useEffect(() => {
		if (open) {
			if (category) {
				setName(category.name);
				setTargetPercent(category.target_percent);
				setColor(category.color);
			} else {
				setName("");
				setTargetPercent(0);
				setColor("#6B7280");
			}
		}
	}, [open, category]);

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!name.trim()) return;

		onSave({
			name: name.trim(),
			type: "investment",
			target_percent: targetPercent,
			color,
		});
	}

	function handleDelete() {
		if (category) {
			onDelete(category.id);
		}
	}

	return (
		<BaseModal open={open} onClose={onClose} title={title}>
			<form className="space-y-4" onSubmit={handleSubmit}>
				{/* Name */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						카테고리 이름
					</label>
					<BaseInput
						value={name}
						onChange={(v) => setName(String(v))}
						placeholder="예: Core, AI 전력 인프라"
						required
					/>
				</div>

				{/* Target Percent */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-1">
						목표 비중 (%)
					</label>
					<BaseInput
						value={targetPercent}
						onChange={(v) => setTargetPercent(Number(v))}
						type="number"
						min="0"
						max="100"
						step="0.1"
						placeholder="0"
					/>
					<p className="text-xs text-gray-500 mt-1">
						포트폴리오에서 이 카테고리가 차지해야 할 비중
					</p>
				</div>

				{/* Color */}
				<div>
					<label className="block text-sm font-medium text-gray-700 mb-2">
						색상
					</label>
					<div className="flex flex-wrap gap-2">
						{presetColors.map((presetColor) => (
							<button
								key={presetColor}
								type="button"
								className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
									color === presetColor
										? "border-gray-900"
										: "border-transparent"
								}`}
								style={{
									backgroundColor: presetColor,
								}}
								onClick={() => setColor(presetColor)}
							/>
						))}
						<input
							type="color"
							value={color}
							onChange={(e) => setColor(e.target.value)}
							className="w-8 h-8 rounded-full cursor-pointer border-0"
						/>
					</div>
				</div>

				{/* Actions */}
				<div className="flex gap-2 pt-4">
					{isEditing && (
						<BaseButton
							type="button"
							variant="danger"
							disabled={loading}
							onClick={handleDelete}
						>
							삭제
						</BaseButton>
					)}
					<div className="flex-1" />
					<BaseButton
						type="button"
						variant="secondary"
						disabled={loading}
						onClick={onClose}
					>
						취소
					</BaseButton>
					<BaseButton
						type="submit"
						loading={loading}
						disabled={!name.trim()}
					>
						{isEditing ? "수정" : "추가"}
					</BaseButton>
				</div>
			</form>
		</BaseModal>
	);
}
