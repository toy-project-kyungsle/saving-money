"use client";

import { useState } from "react";
import type { Category, SavingInput } from "@/types";
import { getToday } from "@/lib/date";
import BaseButton from "@/components/base/BaseButton";
import BaseInput from "@/components/base/BaseInput";
import BaseSelect from "@/components/base/BaseSelect";

interface SavingFormProps {
	categories: readonly Category[];
	initialData?: Partial<SavingInput & { category_id?: number }>;
	loading?: boolean;
	onSubmit: (data: SavingInput) => void;
	onCancel: () => void;
}

export default function SavingForm({
	categories,
	initialData,
	loading = false,
	onSubmit,
	onCancel,
}: SavingFormProps) {
	const [categoryId, setCategoryId] = useState<number | null>(
		initialData?.category_id || null,
	);
	const [amount, setAmount] = useState<number>(initialData?.amount || 0);
	const [transactionDate, setTransactionDate] = useState(
		initialData?.transaction_date || getToday(),
	);
	const [description, setDescription] = useState(
		initialData?.description || "",
	);
	const [errors, setErrors] = useState({ category_id: "", amount: "" });

	function validate(): boolean {
		let isValid = true;
		const newErrors = { category_id: "", amount: "" };

		if (!categoryId) {
			newErrors.category_id = "카테고리를 선택해주세요";
			isValid = false;
		}

		if (!amount || amount <= 0) {
			newErrors.amount = "금액을 입력해주세요";
			isValid = false;
		}

		setErrors(newErrors);
		return isValid;
	}

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!validate()) return;

		onSubmit({
			category_id: categoryId!,
			amount,
			transaction_date: transactionDate,
			description: description || undefined,
		});
	}

	return (
		<form className="space-y-4" onSubmit={handleSubmit}>
			<div>
				<label className="block text-sm font-medium text-gray-700 mb-1">
					카테고리 <span className="text-red-500">*</span>
				</label>
				<BaseSelect
					value={categoryId}
					onChange={(v) => setCategoryId(v as number | null)}
					required
				>
					<option value="" disabled>
						카테고리 선택
					</option>
					{categories.map((cat) => (
						<option key={cat.id} value={cat.id}>
							{cat.name}
						</option>
					))}
				</BaseSelect>
				{errors.category_id && (
					<p className="text-sm text-red-600 mt-1">
						{errors.category_id}
					</p>
				)}
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-700 mb-1">
					금액 (원) <span className="text-red-500">*</span>
				</label>
				<BaseInput
					value={amount}
					onChange={(v) => setAmount(Number(v))}
					type="number"
					placeholder="0"
					required
				/>
				{errors.amount && (
					<p className="text-sm text-red-600 mt-1">
						{errors.amount}
					</p>
				)}
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-700 mb-1">
					날짜
				</label>
				<BaseInput
					value={transactionDate}
					onChange={(v) => setTransactionDate(String(v))}
					type="date"
				/>
			</div>

			<div>
				<label className="block text-sm font-medium text-gray-700 mb-1">
					메모
				</label>
				<BaseInput
					value={description}
					onChange={(v) => setDescription(String(v))}
					type="text"
					placeholder="예: 1월 월급"
				/>
			</div>

			<div className="flex gap-3 pt-4">
				<BaseButton
					type="button"
					variant="secondary"
					className="flex-1"
					onClick={onCancel}
				>
					취소
				</BaseButton>
				<BaseButton
					type="submit"
					variant="primary"
					className="flex-1"
					loading={loading}
				>
					저장
				</BaseButton>
			</div>
		</form>
	);
}
