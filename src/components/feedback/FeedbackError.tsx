"use client";

import BaseButton from "@/components/base/BaseButton";

interface FeedbackErrorProps {
	title?: string;
	message?: string;
	retryable?: boolean;
	onRetry?: () => void;
}

export default function FeedbackError({
	title = "오류가 발생했습니다",
	message,
	retryable = true,
	onRetry,
}: FeedbackErrorProps) {
	return (
		<div
			className="flex flex-col items-center justify-center py-10 text-center"
			role="alert"
		>
			<div className="flex items-center justify-center w-14 h-14 mb-4 bg-error-50 rounded-full">
				<svg
					className="w-7 h-7 text-error-600"
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
			<h3 className="text-lg font-semibold text-secondary-900 mb-1">{title}</h3>
			{message && (
				<p className="text-sm text-secondary-400 mb-4">{message}</p>
			)}
			{retryable && onRetry && (
				<BaseButton variant="secondary" size="sm" onClick={onRetry}>
					다시 시도
				</BaseButton>
			)}
		</div>
	);
}
