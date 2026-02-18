"use client";

import type { Saving } from "@/types";
import FeedbackEmpty from "@/components/feedback/FeedbackEmpty";
import FeedbackLoading from "@/components/feedback/FeedbackLoading";
import InvestmentListItem from "@/components/investment/InvestmentListItem";

interface InvestmentListProps {
	investments: Saving[];
	loading?: boolean;
	onEdit: (saving: Saving) => void;
	onDelete: (saving: Saving) => void;
}

export default function InvestmentList({
	investments,
	loading = false,
	onEdit,
	onDelete,
}: InvestmentListProps) {
	if (loading) {
		return (
			<div className="py-8 text-center">
				<FeedbackLoading text="불러오는 중..." />
			</div>
		);
	}

	if (investments.length === 0) {
		return (
			<FeedbackEmpty
				title="투자 내역이 없습니다"
				description="새로운 투자를 추가해보세요"
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
