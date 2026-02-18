"use client";

import type { Category, SavingInput } from "@/types";
import BaseModal from "@/components/base/BaseModal";
import SavingForm from "@/components/saving/SavingForm";

interface SavingAddModalProps {
	open: boolean;
	onClose: () => void;
	categories: readonly Category[];
	loading?: boolean;
	error?: string;
	onSubmit: (data: SavingInput) => void;
}

export default function SavingAddModal({
	open,
	onClose,
	categories,
	loading = false,
	error,
	onSubmit,
}: SavingAddModalProps) {
	return (
		<BaseModal open={open} onClose={onClose} title="새 저축 추가">
			<SavingForm
				categories={categories}
				loading={loading}
				error={error}
				onSubmit={onSubmit}
				onCancel={onClose}
			/>
		</BaseModal>
	);
}
