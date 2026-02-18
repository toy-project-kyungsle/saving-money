"use client";

import type { Saving } from "@/types";
import { formatKRW } from "@/lib/currency";
import BaseModal from "@/components/base/BaseModal";
import BaseButton from "@/components/base/BaseButton";

interface InvestmentDeleteConfirmProps {
	open: boolean;
	onClose: () => void;
	saving: Saving | null;
	loading?: boolean;
	onConfirm: () => void;
}

export default function InvestmentDeleteConfirm({
	open,
	onClose,
	saving,
	loading = false,
	onConfirm,
}: InvestmentDeleteConfirmProps) {
	const categoryName = saving?.category?.name || "Unknown";

	return (
		<BaseModal open={open} onClose={onClose} title="투자 삭제">
			<div className="space-y-4">
				<p className="text-secondary-600">
					정말로 이 투자 내역을 삭제하시겠습니까?
				</p>

				{saving && (
					<div className="p-4 bg-surface-subtle rounded-xl">
						<div className="flex items-center justify-between">
							<span className="font-medium text-secondary-900">
								{categoryName}
							</span>
							<span className="font-bold text-secondary-900">
								{formatKRW(saving.amount)}
							</span>
						</div>
						{saving.description && (
							<p className="text-sm text-secondary-400 mt-1">
								{saving.description}
							</p>
						)}
					</div>
				)}

				<p className="text-sm text-error-600">
					이 작업은 되돌릴 수 없습니다.
				</p>

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
						variant="danger"
						loading={loading}
						onClick={onConfirm}
					>
						삭제
					</BaseButton>
				</div>
			</div>
		</BaseModal>
	);
}
