"use client";

import { useEffect, useState } from "react";
import type { Category, SavingInput } from "@/types";
import { getToday } from "@/lib/date";
import BaseModal from "@/components/base/BaseModal";
import BaseButton from "@/components/base/BaseButton";
import BaseInput from "@/components/base/BaseInput";
import BaseSelect from "@/components/base/BaseSelect";

interface InvestmentAddModalProps {
	open: boolean;
	onClose: () => void;
	categories: Category[];
	loading?: boolean;
	error?: string;
	onSubmit: (data: SavingInput) => void;
}

export default function InvestmentAddModal({
	open,
	onClose,
	categories,
	loading = false,
	error,
	onSubmit,
}: InvestmentAddModalProps) {
	const [categoryId, setCategoryId] = useState<number | null>(null);
	const [amount, setAmount] = useState("");
	const [transactionDate, setTransactionDate] = useState(getToday());
	const [description, setDescription] = useState("");

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => {
		if (open) {
			setCategoryId(categories[0]?.id || null);
			setAmount("");
			setTransactionDate(getToday());
			setDescription("");
		}
	}, [open]);

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		const numAmount = Number(amount);
		if (!categoryId || numAmount <= 0) return;

		onSubmit({
			category_id: categoryId,
			amount: numAmount,
			transaction_date: transactionDate,
			description: description || undefined,
		});
	}

	return (
		<BaseModal open={open} onClose={onClose} title="새 투자 추가">
			<form className="space-y-4" onSubmit={handleSubmit}>
				<BaseSelect
					label="카테고리"
					value={categoryId}
					onChange={(v) => setCategoryId(v as number | null)}
					required
				>
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
					min="1"
					step="1000"
					placeholder="0"
					required
				/>

				<BaseInput
					label="거래일"
					value={transactionDate}
					onChange={(v) => setTransactionDate(String(v))}
					type="date"
					required
				/>

				<BaseInput
					label="메모 (선택)"
					value={description}
					onChange={(v) => setDescription(String(v))}
					placeholder="예: KODEX S&P500 매수"
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

				<div className="flex justify-end gap-2 pt-4">
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
						disabled={!categoryId || !amount || Number(amount) <= 0}
					>
						추가
					</BaseButton>
				</div>
			</form>
		</BaseModal>
	);
}
