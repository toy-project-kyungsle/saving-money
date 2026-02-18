"use client";

import type { Saving } from "@/types";
import { formatKRW } from "@/lib/currency";
import BaseModal from "@/components/base/BaseModal";
import BaseButton from "@/components/base/BaseButton";

interface SavingDeleteConfirmProps {
	open: boolean;
	onClose: () => void;
	saving: Saving | null;
	loading?: boolean;
	onConfirm: () => void;
}

export default function SavingDeleteConfirm({
	open,
	onClose,
	saving,
	loading = false,
	onConfirm,
}: SavingDeleteConfirmProps) {
	return (
		<BaseModal
			open={open}
			onClose={onClose}
			title="삭제 확인"
			size="sm"
			footer={
				<div className="flex gap-3">
					<BaseButton
						variant="secondary"
						className="flex-1"
						onClick={onClose}
					>
						취소
					</BaseButton>
					<BaseButton
						variant="danger"
						className="flex-1"
						loading={loading}
						onClick={onConfirm}
					>
						삭제
					</BaseButton>
				</div>
			}
		>
			<div className="text-center">
				<div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-error-50 mb-4">
					<svg
						className="h-6 w-6 text-error-600"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						aria-hidden="true"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth="2"
							d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
						/>
					</svg>
				</div>

				<p className="text-secondary-600 mb-2">
					이 저축 내역을 삭제할까요?
				</p>

				{saving && (
					<div className="bg-surface-subtle rounded-xl p-3 mb-4">
						<p className="text-secondary-900 font-medium">
							{saving.category?.name || "알 수 없음"}
						</p>
						<p className="text-secondary-900 text-lg font-bold">
							{formatKRW(saving.amount)}
						</p>
					</div>
				)}

				<p className="text-secondary-400 text-sm">
					삭제하면 되돌릴 수 없어요
				</p>
			</div>
		</BaseModal>
	);
}
