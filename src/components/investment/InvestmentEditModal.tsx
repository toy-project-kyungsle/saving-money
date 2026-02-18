"use client";

import { useEffect, useState } from "react";
import type { Category, Saving, SavingInput } from "@/types";
import BaseModal from "@/components/base/BaseModal";
import BaseButton from "@/components/base/BaseButton";
import BaseInput from "@/components/base/BaseInput";
import BaseSelect from "@/components/base/BaseSelect";

interface InvestmentEditModalProps {
	open: boolean;
	onClose: () => void;
	saving: Saving | null;
	categories: Category[];
	loading?: boolean;
	onSubmit: (data: SavingInput) => void;
}

export default function InvestmentEditModal({
	open,
	onClose,
	saving,
	categories,
	loading = false,
	onSubmit,
}: InvestmentEditModalProps) {
	const [categoryId, setCategoryId] = useState<number | null>(null);
	const [amount, setAmount] = useState(0);
	const [transactionDate, setTransactionDate] = useState("");
	const [description, setDescription] = useState("");

	useEffect(() => {
		if (open && saving) {
			setCategoryId(saving.category_id);
			setAmount(saving.amount);
			setTransactionDate(saving.transaction_date);
			setDescription(saving.description || "");
		}
	}, [open, saving]);

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!categoryId || amount <= 0) return;

		onSubmit({
			category_id: categoryId,
			amount,
			transaction_date: transactionDate,
			description: description || undefined,
		});
	}

	return (
		<BaseModal open={open} onClose={onClose} title="투자 수정">
			<form className="space-y-4" onSubmit={handleSubmit}>
				<div>
					<label className="block text-sm font-medium text-secondary-700 mb-1">
						카테고리
					</label>
					<BaseSelect
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
				</div>

				<div>
					<label className="block text-sm font-medium text-secondary-700 mb-1">
						금액 (원)
					</label>
					<BaseInput
						value={amount}
						onChange={(v) => setAmount(Number(v))}
						type="number"
						min="0"
						step="1000"
						placeholder="0"
						required
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-secondary-700 mb-1">
						거래일
					</label>
					<BaseInput
						value={transactionDate}
						onChange={(v) => setTransactionDate(String(v))}
						type="date"
						required
					/>
				</div>

				<div>
					<label className="block text-sm font-medium text-secondary-700 mb-1">
						메모 (선택)
					</label>
					<BaseInput
						value={description}
						onChange={(v) => setDescription(String(v))}
						placeholder="예: KODEX S&P500 매수"
					/>
				</div>

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
						disabled={!categoryId || amount <= 0}
					>
						수정
					</BaseButton>
				</div>
			</form>
		</BaseModal>
	);
}
