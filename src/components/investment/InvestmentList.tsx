"use client";

import type { Saving } from "@/types";
import BaseButton from "@/components/base/BaseButton";
import FeedbackEmpty from "@/components/feedback/FeedbackEmpty";
import FeedbackLoading from "@/components/feedback/FeedbackLoading";
import InvestmentListItem from "@/components/investment/InvestmentListItem";

interface InvestmentListProps {
	investments: Saving[];
	loading?: boolean;
	onEdit: (saving: Saving) => void;
	onDelete: (saving: Saving) => void;
	onAdd?: () => void;
}

export default function InvestmentList({
	investments,
	loading = false,
	onEdit,
	onDelete,
	onAdd,
}: InvestmentListProps) {
	if (loading) {
		return (
			<div className="py-8 text-center" aria-busy="true">
				<FeedbackLoading text="불러오는 중..." />
			</div>
		);
	}

	if (investments.length === 0) {
		return (
			<FeedbackEmpty
				title="아직 투자 내역이 없어요"
				description="새로운 투자를 추가해보세요"
				action={
					onAdd ? (
						<BaseButton size="sm" onClick={onAdd}>
							+ 새 투자 추가
						</BaseButton>
					) : undefined
				}
			/>
		);
	}

	return (
		<div className="divide-y divide-secondary-100">
			{investments.map((investment) => (
				<InvestmentListItem
					key={investment.id}
					investment={investment}
					onEdit={() => onEdit(investment)}
					onDelete={() => onDelete(investment)}
				/>
			))}
		</div>
	);
}
