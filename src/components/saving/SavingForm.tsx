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
	submitLabel?: string;
	error?: string;
	onSubmit: (data: SavingInput) => void;
	onCancel: () => void;
}

export default function SavingForm({
	categories,
	initialData,
	loading = false,
	submitLabel = "저장",
	error,
	onSubmit,
	onCancel,
}: SavingFormProps) {
	const [categoryId, setCategoryId] = useState<number | null>(
		initialData?.category_id || categories[0]?.id || null,
	);
	const [amount, setAmount] = useState<string>(
		initialData?.amount ? String(initialData.amount) : "",
	);
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

		const numAmount = Number(amount);
		if (!amount || numAmount <= 0) {
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
			amount: Number(amount),
			transaction_date: transactionDate,
			description: description || undefined,
		});
	}

	return (
		<form className="space-y-5" onSubmit={handleSubmit}>
			<BaseSelect
				label="카테고리"
				value={categoryId}
				onChange={(v) => setCategoryId(v as number | null)}
				required
				error={errors.category_id}
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

			<BaseInput
				label="금액 (원)"
				value={amount}
				onChange={(v) => setAmount(String(v))}
				type="number"
				placeholder="0"
				required
				min={1}
				error={errors.amount}
			/>

			<BaseInput
				label="날짜"
				value={transactionDate}
				onChange={(v) => setTransactionDate(String(v))}
				type="date"
			/>

			<BaseInput
				label="메모"
				value={description}
				onChange={(v) => setDescription(String(v))}
				type="text"
				placeholder="예: 1월 월급"
				maxLength={200}
			/>

			{error && (
				<div
					className="bg-error-50 border border-error-200 text-error-700 rounded-xl p-3 text-sm"
					role="alert"
				>
					{error}
				</div>
			)}

			<div className="flex gap-3 pt-6">
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
					{submitLabel}
				</BaseButton>
			</div>
		</form>
	);
}
