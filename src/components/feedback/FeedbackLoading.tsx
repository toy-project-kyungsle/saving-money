interface FeedbackLoadingProps {
	size?: "sm" | "md" | "lg";
	text?: string;
}

const sizeClasses = {
	sm: "w-4 h-4",
	md: "w-8 h-8",
	lg: "w-12 h-12",
};

export default function FeedbackLoading({
	size = "md",
	text,
}: FeedbackLoadingProps) {
	return (
		<div
			className="flex flex-col items-center justify-center gap-3 py-4"
			role="status"
			aria-busy="true"
		>
			<svg
				className={`animate-spin text-primary ${sizeClasses[size]}`}
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				aria-hidden="true"
			>
				<circle
					className="opacity-20"
					cx="12"
					cy="12"
					r="10"
					stroke="currentColor"
					strokeWidth="4"
				/>
				<path
					className="opacity-80"
					fill="currentColor"
					d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
				/>
			</svg>
			{text && <span className="text-sm text-secondary-400">{text}</span>}
		</div>
	);
}
