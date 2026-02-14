"use client";

import { useMemo } from "react";
import type { Category, Saving, SavingInput } from "@/types";
import BaseModal from "@/components/base/BaseModal";
import SavingForm from "@/components/saving/SavingForm";

interface SavingEditModalProps {
	open: boolean;
	onClose: () => void;
	saving: Saving | null;
	categories: readonly Category[];
	loading?: boolean;
	onSubmit: (data: SavingInput) => void;
}

export default function SavingEditModal({
	open,
	onClose,
	saving,
	categories,
	loading = false,
	onSubmit,
}: SavingEditModalProps) {
	const initialData = useMemo(() => {
		if (!saving) return undefined;
		return {
			category_id: saving.category_id,
			amount: saving.amount,
			transaction_date: saving.transaction_date,
			description: saving.description,
		};
	}, [saving]);

	return (
		<BaseModal open={open} onClose={onClose} title="저축 수정">
			{saving && (
				<SavingForm
					key={saving.id}
					categories={categories}
					initialData={initialData}
					loading={loading}
					onSubmit={onSubmit}
					onCancel={onClose}
				/>
			)}
		</BaseModal>
	);
}
